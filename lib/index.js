// Static Host half of the Model Slider plugin (deployment-level).
// Serves the four RPC methods as one JSON route on the web server; the
// browser half calls them with fetch.
export function apply(ctx) {
  // Wait for services instead of reading them synchronously: on a cold boot
  // this plugin may load before fs/sessions/webServer are registered, and a
  // bare ctx.get() would silently skip route registration (the RPC then hits
  // the static fallback and answers 405).
  ctx.inject(['fs', 'sessions', 'webServer'], (scope) => {
  const fs = scope.fs
  const sessions = scope.sessions
  const webServer = scope.webServer

  const DEFAULT_USAGE = {
    'deepseek-official': { kind: 'prepaid', endpoint: 'https://api.deepseek.com/user/balance' },
    'kimi-coding': { kind: 'membership', endpoint: 'https://api.kimi.com/coding/v1/usages' },
    'google': { kind: 'prepaid', endpoint: '' }
  }

  const DEFAULTS = {
    levels: [
      { id: 'low', label: '低', provider: 'deepseek-official', model: 'deepseek-v4-flash', reasoningEffort: 'off' },
      { id: 'medium', label: '中', provider: 'deepseek-official', model: 'deepseek-v4-flash', reasoningEffort: 'max' },
      { id: 'high', label: '高', provider: 'deepseek-official', model: 'deepseek-v4-pro', reasoningEffort: 'max' }
    ],
    usage: DEFAULT_USAGE
  }

  const sanitize = (raw) => {
    const levels = (Array.isArray(raw && raw.levels) ? raw.levels : []).map((level, i) => ({
      id: String(level && level.id !== undefined && level.id !== null && String(level.id).length > 0 ? level.id : 'level' + (i + 1)),
      label: String(level && level.label !== undefined && level.label !== null && String(level.label).length > 0 ? level.label : '档位' + (i + 1)),
      provider: String(level && level.provider !== undefined ? level.provider : ''),
      model: String(level && level.model !== undefined ? level.model : ''),
      ...(level && level.reasoningEffort !== undefined && level.reasoningEffort !== null ? { reasoningEffort: String(level.reasoningEffort) } : {})
    }))
    const usage = {}
    const rawUsage = raw && raw.usage && typeof raw.usage === 'object' && !Array.isArray(raw.usage) ? raw.usage : {}
    for (const [key, def] of Object.entries(DEFAULT_USAGE)) {
      const spec = rawUsage[key]
      usage[key] = {
        kind: spec && (spec.kind === 'membership' || spec.kind === 'prepaid') ? spec.kind : def.kind,
        endpoint: spec && typeof spec.endpoint === 'string' && spec.endpoint.length > 0 ? spec.endpoint : def.endpoint
      }
    }
    return { levels, usage }
  }

  const sessionOf = (args) => (args && typeof args.sessionId === 'string' ? sessions.get(args.sessionId) : undefined)

  // User-level config lives under $DSH_HOME (default ~/.dsh). Resolve it
  // without relying on any particular session's cwd.
  const userConfigDir = async () => {
    try {
      if (typeof process !== 'undefined' && process.env && typeof process.env.DSH_HOME === 'string' && process.env.DSH_HOME.length > 0) {
        return process.env.DSH_HOME
      }
    } catch (error) { /* fall through */ }
    try {
      const settings = ctx.get('settings')
      if (settings !== undefined && typeof settings.prepareDocument === 'function') {
        const doc = await settings.prepareDocument()
        if (typeof doc === 'string' && doc.length > 0) {
          return doc.replace(/[\\/][^\\/]*$/, '')
        }
      }
    } catch (error) { /* fall through */ }
    return undefined
  }

  const userConfigTarget = async () => {
    const dir = await userConfigDir()
    if (dir === undefined) return undefined
    return await fs.resolve('.model-slider.json', { cwd: dir })
  }

  const readConfig = async () => {
    const userTarget = await userConfigTarget()
    if (userTarget === undefined) {
      console.log('modelslider: user config dir unavailable, using defaults')
      return sanitize(DEFAULTS)
    }
    let text
    try {
      text = await fs.readText(userTarget)
    } catch (error) {
      console.log('modelslider: config unavailable, using defaults: ' + String(error && error.message ? error.message : error))
      return sanitize(DEFAULTS)
    }
    try {
      return sanitize(JSON.parse(text))
    } catch (error) {
      console.log('modelslider: config invalid, using defaults: ' + String(error && error.message ? error.message : error))
      return sanitize(DEFAULTS)
    }
  }

  const apiKeyEnvOf = (provider) => {
    try {
      const settings = ctx.get('settings')
      if (settings === undefined) return undefined
      if (provider === 'deepseek-official') {
        const section = settings.get('llm-deepseek')
        const env = section && typeof section.apiKeyEnv === 'string' && section.apiKeyEnv.length > 0 ? section.apiKeyEnv : 'DEEPSEEK_API_KEY'
        return env
      }
      const pi = settings.get('llm-pi-ai')
      const profile = pi && pi.providers ? pi.providers[provider] : undefined
      return profile && typeof profile.apiKeyEnv === 'string' && profile.apiKeyEnv.length > 0 ? profile.apiKeyEnv : undefined
    } catch (error) {
      return undefined
    }
  }

  const handle = async (method, args) => {
    switch (method) {
      case 'config': {
        const session = sessionOf(args)
        if (session === undefined) return { ok: false, error: 'session not found' }
        try {
          const config = await readConfig()
          const target = await userConfigTarget()
          return { ok: true, config, path: target === undefined ? undefined : fs.processPath(target) }
        } catch (error) {
          return { ok: false, error: String(error && error.message ? error.message : error) }
        }
      }
      case 'save': {
        const session = sessionOf(args)
        if (session === undefined) return { ok: false, error: 'session not found' }
        const raw = args && args.config
        if (!raw || !Array.isArray(raw.levels) || raw.levels.length === 0) {
          return { ok: false, error: 'config must contain a non-empty levels array' }
        }
        try {
          const config = sanitize(raw)
          const target = await userConfigTarget()
          if (target === undefined) return { ok: false, error: 'user config dir unavailable' }
          const sandboxPolicy = ctx.get('sandboxPolicy')
          const policy = sandboxPolicy === undefined ? undefined : sandboxPolicy.resolve({ session })
          await fs.writeText(target, JSON.stringify(config, null, 2), undefined, undefined, policy)
          return { ok: true, path: fs.processPath(target) }
        } catch (error) {
          return { ok: false, error: String(error && error.message ? error.message : error) }
        }
      }
      case 'catalog': {
        const session = sessionOf(args)
        if (session === undefined) return { ok: false, error: 'session not found' }
        const llm = ctx.get('llm')
        if (llm === undefined) return { ok: false, error: 'llm service unavailable' }
        try {
          const entries = []
          for (const provider of llm.listProviders()) {
            let models = []
            try { models = await llm.listModels(provider.id) } catch (error) { continue }
            for (const model of models) {
              try {
                const resolved = await llm.resolveModelInfo(provider.id, model.id)
                entries.push({
                  provider: provider.id,
                  model: model.id,
                  ...(resolved.inputModalities === undefined ? {} : { inputModalities: resolved.inputModalities })
                })
              } catch (error) { /* skip unresolved models */ }
            }
          }
          return { ok: true, entries }
        } catch (error) {
          return { ok: false, error: String(error && error.message ? error.message : error) }
        }
      }
      case 'usage': {
        const session = sessionOf(args)
        if (session === undefined) return { ok: false, error: 'session not found' }
        const config = await readConfig()
        const credentials = ctx.get('credentials')
        const subprocess = ctx.get('subprocess')
        const providerNames = {}
        const llm = ctx.get('llm')
        if (llm !== undefined) {
          try { for (const p of llm.listProviders()) providerNames[p.id] = p.name || p.id } catch (error) {}
        }
        const provider = args && typeof args.provider === 'string' && args.provider.length > 0 ? args.provider : undefined
        if (provider === undefined) return { ok: false, error: 'provider not specified' }
        const spec = config.usage && config.usage[provider]
        const base = { provider, kind: spec ? spec.kind : 'prepaid', name: providerNames[provider] || provider, ok: false }
        if (!spec || !spec.endpoint) {
          return { ok: true, entries: [{ ...base, error: 'no endpoint configured' }] }
        }
        if (credentials === undefined || subprocess === undefined) {
          return { ok: true, entries: [{ ...base, error: 'service unavailable' }] }
        }
        const ref = apiKeyEnvOf(provider)
        if (ref === undefined) {
          return { ok: true, entries: [{ ...base, error: 'no apiKeyEnv configured' }] }
        }
        let key
        try {
          const hit = await credentials.resolve(ref)
          key = hit && typeof hit.value === 'string' && hit.value.length > 0 ? hit.value : undefined
        } catch (error) {
          key = undefined
        }
        if (key === undefined) {
          return { ok: true, entries: [{ ...base, error: 'api key missing' }] }
        }
        const cwd = session.header && typeof session.header.cwd === 'string' ? session.header.cwd : undefined
        try {
          const handle2 = subprocess.spawn({
            argv: [process.platform === 'win32' ? 'curl.exe' : 'curl', '-s', '-m', '15', '-H', 'Authorization: Bearer ' + key, spec.endpoint],
            cwd: cwd || (process.platform === 'win32' ? 'C:\\' : (process.env.HOME || '/')),
            stdio: { stdin: 'ignore', stdout: { maxBytes: 262144 }, stderr: { maxBytes: 65536 } },
            graceMs: 5000
          })
          const outcome = await handle2.done
          if (outcome.exitCode !== 0) {
            return { ok: true, entries: [{ ...base, error: 'curl exit ' + String(outcome.exitCode) }] }
          }
          const reader = handle2.collected && handle2.collected.stdout
          const text = reader ? reader.readFrom(0).text : ''
          let json
          try { json = JSON.parse(text) } catch (error) {
            return { ok: true, entries: [{ ...base, error: 'invalid json response' }] }
          }
          if (spec.kind === 'membership') {
            const usage = json && json.usage
            if (!usage || usage.limit === undefined || usage.remaining === undefined) {
              return { ok: true, entries: [{ ...base, error: 'response missing usage' }] }
            }
            const limit = Number(usage.limit)
            const remaining = Number(usage.remaining)
            const windows = []
            if (Array.isArray(json.limits)) {
              for (const item of json.limits) {
                const detail = item && item.detail
                if (!detail || detail.limit === undefined || detail.remaining === undefined) continue
                const wLimit = Number(detail.limit)
                const wRemaining = Number(detail.remaining)
                windows.push({
                  durationMin: item.window && item.window.timeUnit === 'TIME_UNIT_MINUTE' && Number.isFinite(Number(item.window.duration)) ? Number(item.window.duration) : undefined,
                  limit: wLimit,
                  remaining: wRemaining,
                  percent: Number.isFinite(wLimit) && wLimit > 0 ? Math.round(wRemaining / wLimit * 100) : null,
                  ...(typeof detail.resetTime === 'string' ? { resetTime: detail.resetTime } : {})
                })
              }
            }
            return {
              ok: true,
              entries: [{
                ...base,
                ok: true,
                limit,
                remaining,
                percent: Number.isFinite(limit) && limit > 0 ? Math.round(remaining / limit * 100) : null,
                ...(typeof usage.resetTime === 'string' ? { resetTime: usage.resetTime } : {}),
                windows
              }]
            }
          }
          const info = json && Array.isArray(json.balance_infos) ? json.balance_infos[0] : undefined
          if (!info) {
            return { ok: true, entries: [{ ...base, error: 'response missing balance_infos' }] }
          }
          return {
            ok: true,
            entries: [{
              ...base,
              ok: true,
              balance: String(info.total_balance !== undefined ? info.total_balance : ''),
              currency: String(info.currency !== undefined ? info.currency : ''),
              ...(typeof json.is_available === 'boolean' ? { available: json.is_available } : {})
            }]
          }
        } catch (error) {
          return { ok: true, entries: [{ ...base, error: String(error && error.message ? error.message : error) }] }
        }
      }
      default:
        return { ok: false, error: 'unknown method: ' + String(method) }
    }
  }

  const route = webServer.register({
    kind: 'exact',
    path: '/msld/rpc',
    handler: async (req, res) => {
      let body = ''
      for await (const chunk of req) body += chunk
      let payload
      try {
        payload = JSON.parse(body || '{}')
      } catch (error) {
        res.writeHead(400, { 'Content-Type': 'application/json' })
        res.end(JSON.stringify({ ok: false, error: 'invalid json body' }))
        return
      }
      try {
        const result = await handle(payload && payload.method, payload && payload.args)
        res.writeHead(200, { 'Content-Type': 'application/json' })
        res.end(JSON.stringify(result))
      } catch (error) {
        res.writeHead(500, { 'Content-Type': 'application/json' })
        res.end(JSON.stringify({ ok: false, error: String(error && error.message ? error.message : error) }))
      }
    }
  })
  scope.effect(() => route, 'dsh-model-slider: rpc route')
  })
}
