window.__ModuleLoader__.load({
  id: 'dsh-model-slider',
  factory: (require) => {
    var module = { exports: {} };
    var exports = module.exports;
    Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
    const React = require('react');

    const injectCss = (css) => {
      const tag = document.createElement('style');
      tag.dataset.plugin = 'dsh-model-slider';
      tag.dataset.pluginCss = 'dsh-model-slider:styles';
      tag.textContent = css;
      document.head.appendChild(tag);
    };

    const rpc = async (method, args) => {
      const res = await fetch('/msld/rpc', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ method, args })
      });
      if (!res.ok) throw new Error('msld rpc failed: ' + res.status);
      return res.json();
    };

    function apply(ctx) {

    const NS = 'modelslider'
    ctx.effect(() => ctx.locale.register(NS, {
      zh: {
        'trigger.fallback': '选择模型',
        'trigger.aria': '选择模型，当前 {model}',
        'trigger.ariaEffort': '选择模型，当前 {model}，推理等级 {effort}',
        'menu.aria': '快速切换与模型设置',
        'slider.aria': '低中高三档快速切换',
        'slider.hint': '档位 {label}：{model}',
        'slider.hintEffort': '档位 {label}：{model}，推理等级 {effort}',
        'menu.model': '模型',
        'menu.effort': '推理等级',
        'effort.providerDefault': 'Default',
        'status.loading': '正在刷新模型列表…',
        'error.action': '模型操作失败：{message}',
        'action.reload': '重新加载',
        'warning.groupLoad': '{name} 加载失败：{message}',
        'empty.models': '没有可用的模型。',
        'empty.efforts': '当前模型未提供推理等级。',
        'level.invalid': '档位「{label}」配置的模型或推理等级不可用，请调整 ~/.dsh/.model-slider.json',
        'config.error': '档位配置读取失败，已使用内置默认值',
        'modality.text': '文本',
        'modality.image': '图片',
        'modality.video': '视频',
        'modality.audio': '语音',
        'usage.title': '供应商用量',
        'usage.loading': '查询用量…',
        'usage.unavailable': '不可用',
        'usage.membership': '剩余 {percent}%',
        'usage.prepaid': '余额 {amount} {currency}',
        'usage.error': '用量查询失败',
        'usage.tipWeekly': '每周额度 {remaining}/{limit} · {reset} 重置',
        'usage.tipWindow': '每 {hours} 小时额度 {remaining}/{limit} · {reset} 重置'
      },
      en: {
        'trigger.fallback': 'Select model',
        'trigger.aria': 'Select model, current {model}',
        'trigger.ariaEffort': 'Select model, current {model}, reasoning effort {effort}',
        'menu.aria': 'Quick switch and model settings',
        'slider.aria': 'Quick switch across low / medium / high',
        'slider.hint': 'Level {label}: {model}',
        'slider.hintEffort': 'Level {label}: {model}, reasoning effort {effort}',
        'menu.model': 'Model',
        'menu.effort': 'Effort',
        'effort.providerDefault': 'Default',
        'status.loading': 'Refreshing model list…',
        'error.action': 'Model operation failed: {message}',
        'action.reload': 'Reload',
        'warning.groupLoad': '{name} failed to load: {message}',
        'empty.models': 'No models available.',
        'empty.efforts': 'This model provides no reasoning effort levels.',
        'level.invalid': 'Level "{label}" maps to an unavailable model or effort — adjust ~/.dsh/.model-slider.json',
        'config.error': 'Level config failed to load; using built-in defaults',
        'modality.text': 'Text',
        'modality.image': 'Image',
        'modality.video': 'Video',
        'modality.audio': 'Audio',
        'usage.title': 'Provider usage',
        'usage.loading': 'Loading usage…',
        'usage.unavailable': 'Unavailable',
        'usage.membership': '{percent}% left',
        'usage.prepaid': 'Balance {amount} {currency}',
        'usage.error': 'Usage query failed',
        'usage.tipWeekly': 'Weekly quota {remaining}/{limit} · resets {reset}',
        'usage.tipWindow': 'Every {hours} hours: {remaining}/{limit} · resets {reset}'
      }
    }), 'modelslider: dictionaries')

    ctx.inject(['slots', 'modelDirectories'], (scope) => {
      const slots = scope.slots
      const sessions = scope.sessions
      const dirs = scope.modelDirectories
      if (slots === undefined || sessions === undefined || dirs === undefined) return

    injectCss(['.msld-root{position:relative;display:inline-flex;min-width:0}.msld-trigger{min-width:0;max-width:220px;height:28px;display:inline-flex;align-items:center;gap:4px;padding:0 4px 0 8px;border:none;border-radius:24px;background:none;color:var(--dsw-alias-label-secondary);font-size:13px;font-weight:500;line-height:20px;cursor:pointer;text-align:left;justify-content:flex-start}.msld-trigger:hover:not(:disabled){background:var(--dsw-alias-interactive-bg-hover)}.msld-trigger:focus-visible{box-shadow:0 0 0 2px var(--dsw-alias-border-l3)}.msld-trigger:disabled{color:var(--dsw-alias-label-dimmed);cursor:default}.msld-triggerLabel{min-width:0;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;text-align:left}.msld-triggerEffort{flex:none;color:var(--dsw-alias-label-caption)}.msld-chevron{flex:none;color:var(--dsw-alias-label-caption);transition:transform .12s}.msld-chevron.open{transform:rotate(180deg)}.msld-menu{z-index:20;position:absolute;bottom:calc(100% + 8px);right:0;display:flex;flex-direction:column;width:min(240px,100vw - 32px);max-height:min(400px,100vh - 96px);padding:4px;border:1px solid var(--dsw-alias-border-inverted);border-radius:12px;background:var(--dsw-specific-menu);box-shadow:var(--dsw-shadow-lv3);color:var(--dsw-alias-label-primary);overflow:hidden;--dsh-scrollbar-thumb:var(--dsw-alias-scrollbar-bg-l2);--dsh-scrollbar-thumb-hover:var(--dsw-alias-scrollbar-hover',
      '-l2)}.msld-sliderRow{position:relative;display:flex;align-items:stretch;height:34px;margin:4px 4px 6px;padding:2px;border-radius:10px;background:var(--dsw-alias-interactive-bg-hover)}.msld-thumb{position:absolute;top:2px;bottom:2px;left:2px;border-radius:8px;background:var(--dsw-alias-bg-overlay);box-shadow:0 0 0 1px var(--dsw-alias-border-l2);transition:transform .18s ease}.msld-level{position:relative;z-index:1;flex:1 1 0;min-width:40px;padding:0 8px;border:none;border-radius:8px;background:none;color:var(--dsw-alias-label-secondary);font-size:13px;font-weight:500;line-height:24px;cursor:pointer}.msld-level:hover:not(:disabled):not(.active){color:var(--dsw-alias-label-primary)}.msld-level.active{color:var(--dsw-alias-label-primary);font-weight:600}.msld-level.invalid{color:var(--dsw-alias-state-warn-primary)}.msld-level:disabled{opacity:.55;cursor:default}.msld-divider{height:1px;margin:0 4px 4px;background:var(--dsw-alias-border-l1)}.msld-status,.msld-empty{padding:10px;font-size:13px;line-height:20px;color:var(--dsw-alias-label-tertiary)}.msld-error,.msld-warning{display:flex;justify-content:space-between;align-items:flex-start;gap:8px;margin-bottom:4px;padding:7px 8px;border-radius:8px;background:var(--dsw-alias-interactive-bg-hover-danger);color:var(--dsw-alias-state-error-primary);font-size:12px;line-height:18px}.msld-warning{background:var(--dsw-alias-bg-module-platform',
      ');color:var(--dsw-alias-state-warn-label)}.msld-retry{flex:none;padding:0;border:none;background:none;color:inherit;font:inherit;cursor:pointer;font-weight:600}.msld-cell{display:flex;align-items:center;gap:8px;width:100%;padding:8px;border:none;border-radius:8px;background:none;color:var(--dsw-alias-label-primary);font-size:13px;line-height:20px;cursor:pointer;text-align:left;justify-content:flex-start}.msld-cell:hover{background:var(--dsw-alias-interactive-bg-hover)}.msld-cellLabel{flex:1 1 auto;text-align:left}.msld-cellValue{flex:0 1 auto;min-width:0;max-width:140px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;color:var(--dsw-alias-label-caption);font-size:12px;text-align:left}.msld-cellChevron{flex:none;color:var(--dsw-alias-label-caption)}.msld-groups{min-height:0;overflow-y:auto}.msld-group{display:flex;flex-direction:column}.msld-group+.msld-group{margin-top:4px}.msld-groupTitle{z-index:1;background:var(--dsw-specific-menu);color:var(--dsw-alias-label-tertiary);padding:5px 8px 3px;font-size:12px;font-weight:500;line-height:18px;position:sticky;top:0}.msld-option{width:100%;min-height:38px;color:inherit;text-align:left;cursor:pointer;background:0 0;border:none;border-radius:10px;outline:none;align-items:center;gap:8px;padding:6px 8px;display:flex}.msld-option:hover:not(:disabled),.msld-option:focus-visible{background:var(--dsw-alias-interactive-bg-hover)}.ms',
      'ld-option:disabled{color:var(--dsw-alias-label-dimmed);cursor:default}.msld-optionCopy{flex-direction:column;flex:1;min-width:0;display:flex}.msld-nameRow{display:flex;align-items:center;gap:6px;min-width:0}.msld-modelName{color:inherit;text-overflow:ellipsis;white-space:nowrap;font-size:14px;font-weight:500;line-height:20px;overflow:hidden}.msld-mode{flex:none;display:inline-flex;align-items:center;justify-content:center;width:18px;height:18px;border-radius:999px;background:var(--dsw-alias-interactive-bg-hover);background:color-mix(in srgb,var(--dsw-alias-brand-primary) 14%,transparent);color:var(--dsw-alias-brand-primary)}.msld-description{color:var(--dsw-alias-label-tertiary);text-overflow:ellipsis;white-space:nowrap;font-size:12px;line-height:18px;overflow:hidden}.msld-check{color:var(--dsw-alias-label-primary);flex:0 0 18px;place-items:center;display:grid}.msld-notice{position:absolute;top:calc(100% + 6px);right:0;z-index:20;max-width:280px;padding:7px 10px;border-radius:8px;background:var(--dsw-alias-bg-overlay);box-shadow:var(--dsw-shadow-lv3);color:var(--dsw-alias-label-primary);font-size:12px;line-height:18px}.msld-notice.error{color:var(--dsw-alias-state-error-primary)}.msld-notice.warn{color:var(--dsw-alias-state-warn-label)}.msld-menu{overflow-y:auto;overflow-x:hidden}.msld-usage{border-top:1px solid var(--dsw-alias-border-l1);margin:4px 4px 0;padding:6px 4px 2px;di',
      'splay:flex;flex-direction:column;gap:2px}.msld-usageTitle{display:flex;align-items:center;justify-content:space-between;gap:8px;color:var(--dsw-alias-label-tertiary);font-size:11px;line-height:16px;padding:0 4px 2px}.msld-usageStatus{flex:none;color:var(--dsw-alias-label-tertiary);font-size:11px;line-height:16px}.msld-usageItem{display:flex;align-items:center;justify-content:space-between;gap:8px;padding:2px 4px;font-size:12px;line-height:18px;color:var(--dsw-alias-label-secondary)}.msld-usageName{min-width:0;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;color:var(--dsw-alias-label-caption)}.msld-usageValue{flex:none;color:var(--dsw-alias-label-primary);text-align:right}.msld-tip{position:fixed;z-index:50;max-width:280px;padding:8px 10px;border-radius:8px;border:1px solid var(--dsw-alias-border-inverted);background:var(--dsw-alias-bg-overlay);box-shadow:var(--dsw-shadow-lv3);color:var(--dsw-alias-label-primary);font-size:12px;line-height:18px;pointer-events:none;display:flex;flex-direction:column;gap:2px}.msld-tipRow{white-space:nowrap}'].join(''))

    const ICONS = {
      chevronDown: (className) => React.createElement('svg', { width: 14, height: 14, viewBox: '0 0 14 14', fill: 'none', className }, React.createElement('path', { d: 'M3.5 5.5 7 9l3.5-3.5', stroke: 'currentColor', strokeWidth: 1.5, strokeLinecap: 'round', strokeLinejoin: 'round' })),
      chevronRight: (className) => React.createElement('svg', { width: 14, height: 14, viewBox: '0 0 14 14', fill: 'none', className }, React.createElement('path', { d: 'M5.5 3.5 9 7l-3.5 3.5', stroke: 'currentColor', strokeWidth: 1.5, strokeLinecap: 'round', strokeLinejoin: 'round' })),
      check: (className) => React.createElement('svg', { width: 16, height: 16, viewBox: '0 0 16 16', fill: 'none', className }, React.createElement('path', { d: 'M3.5 8.5 6.5 11.5 12.5 5', stroke: 'currentColor', strokeWidth: 1.8, strokeLinecap: 'round', strokeLinejoin: 'round' }))
    }

    const MODALITY_ICONS = {
      image: (className) => React.createElement('svg', { width: 12, height: 12, viewBox: '0 0 16 16', fill: 'none', className }, React.createElement('rect', { x: 2, y: 3, width: 12, height: 10, rx: 2, stroke: 'currentColor', strokeWidth: 1.4 }), React.createElement('circle', { cx: 6, cy: 6.8, r: 1.3, stroke: 'currentColor', strokeWidth: 1.4 }), React.createElement('path', { d: 'M3 12l3.2-3.2 2 2L10.5 8.5 13 11', stroke: 'currentColor', strokeWidth: 1.4, strokeLinecap: 'round', strokeLinejoin: 'round' })),
      video: (className) => React.createElement('svg', { width: 12, height: 12, viewBox: '0 0 16 16', fill: 'none', className }, React.createElement('rect', { x: 2, y: 3.2, width: 12, height: 9.6, rx: 2, stroke: 'currentColor', strokeWidth: 1.4 }), React.createElement('path', { d: 'M6.6 6.2v3.6l3-1.8z', fill: 'currentColor' })),
      audio: (className) => React.createElement('svg', { width: 12, height: 12, viewBox: '0 0 16 16', fill: 'none', className }, React.createElement('path', { d: 'M2.8 6v4h2.6l3.4 2.6V3.4L5.4 6H2.8z', stroke: 'currentColor', strokeWidth: 1.4, strokeLinejoin: 'round' }), React.createElement('path', { d: 'M11 5.8c.9.9 1.3 1.9 1.3 3s-.4 2.1-1.3 3', stroke: 'currentColor', strokeWidth: 1.4, strokeLinecap: 'round' })),
      unknown: (className) => React.createElement('svg', { width: 12, height: 12, viewBox: '0 0 16 16', fill: 'none', className }, React.createElement('path', { d: 'M8 2.5l1.2 2.8L12 6.5l-2.8 1.2L8 10.5 6.8 7.7 4 6.5l2.8-1.2z', fill: 'currentColor' }))
    }

    const cx = (...parts) => parts.filter((part) => part).join(' ')

    const formatReset = (iso) => {
      const d = new Date(iso)
      if (Number.isNaN(d.getTime())) return ''
      const p = (n) => String(n).padStart(2, '0')
      return p(d.getMonth() + 1) + '-' + p(d.getDate()) + ' ' + p(d.getHours()) + ':' + p(d.getMinutes())
    }

    const usageText = (entry, t) => {
      if (!entry.ok) return t('usage.unavailable')
      if (entry.kind === 'membership') {
        const percent = entry.percent !== null && entry.percent !== undefined ? String(entry.percent) : '?'
        const reset = entry.resetTime ? formatReset(entry.resetTime) : ''
        return t('usage.membership', { percent, reset })
      }
      return t('usage.prepaid', { amount: String(entry.balance !== undefined && entry.balance !== null ? entry.balance : '0'), currency: String(entry.currency !== undefined ? entry.currency : '') })
    }

    const tipRows = (entry, t) => {
      const rows = []
      if (!entry.ok) {
        rows.push(React.createElement('div', { key: 'e', className: 'msld-tipRow', children: t('usage.unavailable') }))
        return rows
      }
      if (entry.kind === 'membership') {
        rows.push(React.createElement('div', {
          key: 'main',
          className: 'msld-tipRow',
          children: t('usage.tipWeekly', {
            remaining: String(entry.remaining !== undefined ? entry.remaining : '?'),
            limit: String(entry.limit !== undefined ? entry.limit : '?'),
            reset: entry.resetTime ? formatReset(entry.resetTime) : ''
          })
        }))
        if (Array.isArray(entry.windows)) {
          for (const w of entry.windows) {
            const hours = w.durationMin !== undefined ? Math.round(w.durationMin / 60) : undefined
            rows.push(React.createElement('div', {
              key: 'w' + (w.durationMin !== undefined ? w.durationMin : 'x'),
              className: 'msld-tipRow',
              children: hours !== undefined ? t('usage.tipWindow', {
                hours: String(hours),
                remaining: String(w.remaining !== undefined ? w.remaining : '?'),
                limit: String(w.limit !== undefined ? w.limit : '?'),
                reset: w.resetTime ? formatReset(w.resetTime) : ''
              }) : (String(w.remaining !== undefined ? w.remaining : '?') + '/' + String(w.limit !== undefined ? w.limit : '?') + (w.resetTime ? ' · ' + formatReset(w.resetTime) + ' 重置' : ''))
            }))
          }
        }
        return rows
      }
      rows.push(React.createElement('div', {
        key: 'p',
        className: 'msld-tipRow',
        children: t('usage.prepaid', {
          amount: String(entry.balance !== undefined && entry.balance !== null ? entry.balance : '0'),
          currency: String(entry.currency !== undefined ? entry.currency : '')
        })
      }))
      return rows
    }

    function ModelSeat({ locked, available, directory, load, select, t, sessionId }) {
      const state = React.useSyncExternalStore((fn) => directory.subscribe(fn), () => directory.getSnapshot())
      const [config, setConfig] = React.useState(null)
      const [configFailed, setConfigFailed] = React.useState(false)
      const [modality, setModality] = React.useState(null)
      const [notice, setNotice] = React.useState(null)
      const noticeSeq = React.useRef(0)
      const [usage, setUsage] = React.useState(null)
      const usageSeq = React.useRef(0)
      const usageCacheRef = React.useRef({})
      const [tip, setTip] = React.useState(null)
      const [open, setOpen] = React.useState(false)
      const [pane, setPane] = React.useState('root')
      const lastActionRef = React.useRef('load')
      const rootRef = React.useRef(null)
      const triggerRef = React.useRef(null)
      const itemRefs = React.useRef([])
      const id = React.useId()

      React.useEffect(() => {
        let alive = true
        rpc('config', { sessionId }).then((res) => {
          if (!alive) return
          if (res && res.ok && res.config) setConfig(res.config)
          else { setConfigFailed(true); console.log('[model-slider] config failed:', (res && res.error) || 'config failed') }
        }, (error) => {
          if (alive) { setConfigFailed(true); console.log('[model-slider] config failed:', String(error && error.message ? error.message : error)) }
        })
        rpc('catalog', { sessionId }).then((res) => {
          if (!alive) return
          if (res && res.ok && Array.isArray(res.entries)) setModality(res.entries)
          else console.log('[model-slider] catalog failed:', (res && res.error) || 'catalog failed')
        }, (error) => {
          if (alive) console.log('[model-slider] catalog failed:', String(error && error.message ? error.message : error))
        })
        return () => { alive = false }
      }, [sessionId])

      React.useEffect(() => {
        if (available) { lastActionRef.current = 'load'; load() }
      }, [available, load])

      React.useEffect(() => {
        if (!open) return
        const seq = usageSeq.current + 1
        usageSeq.current = seq
        const currentProvider = state.current === null ? undefined : state.current.provider
        if (currentProvider === undefined) {
          setUsage(null)
        } else {
          const cached = usageCacheRef.current[currentProvider]
          setUsage(cached !== undefined ? cached : null)
          rpc('usage', { sessionId, provider: currentProvider }).then((res) => {
            if (usageSeq.current !== seq) return
            const next = (!res || !res.ok || !Array.isArray(res.entries)) ? { ok: false, entries: [] } : { ok: true, entries: res.entries }
            if (!next.ok) console.log('[model-slider] usage failed:', (res && res.error) || 'usage failed')
            usageCacheRef.current[currentProvider] = next
            setUsage(next)
          }, (error) => {
            if (usageSeq.current === seq) {
              const next = { ok: false, entries: [] }
              console.log('[model-slider] usage failed:', String(error && error.message ? error.message : error))
              usageCacheRef.current[currentProvider] = next
              setUsage(next)
            }
          })
        }
        const closeOutside = (event) => { if (!rootRef.current || !rootRef.current.contains(event.target)) setOpen(false) }
        document.addEventListener('mousedown', closeOutside)
        return () => { document.removeEventListener('mousedown', closeOutside) }
      }, [open, sessionId, state.current === null ? undefined : state.current.provider])

      React.useEffect(() => {
        if (notice === null) return
        const stop = ctx.timeout(() => setNotice(null), 4000)
        return stop
      }, [notice === null ? 0 : notice.seq])

      const levels = React.useMemo(() => {
        if (config === null || !Array.isArray(config.levels)) return []
        return config.levels.map((level) => {
          const group = state.groups.find((g) => g.id === level.provider)
          const model = group ? group.models.find((m) => m.id === level.model) : undefined
          let invalid = false
          if (!group || !model) invalid = true
          else if (level.reasoningEffort !== undefined && (!model.reasoning || !model.reasoning.efforts.some((e) => e.id === level.reasoningEffort))) invalid = true
          return {
            id: level.id,
            label: level.label,
            modelName: model ? model.name : null,
            invalid,
            selection: { provider: level.provider, model: level.model, ...(level.reasoningEffort === undefined ? {} : { reasoningEffort: level.reasoningEffort }) }
          }
        })
      }, [config, state.groups])

      const activeIndex = levels.findIndex((level) => state.current !== null && !level.invalid &&
        state.current.provider === level.selection.provider &&
        state.current.model === level.selection.model &&
        (state.current.reasoningEffort === undefined ? undefined : state.current.reasoningEffort) === (level.selection.reasoningEffort === undefined ? undefined : level.selection.reasoningEffort))

      const choices = React.useMemo(() => state.groups.flatMap((group) => group.models.map((model) => ({
        group,
        model,
        selection: { provider: group.id, model: model.id, ...(model.reasoning && model.reasoning.defaultEffort !== undefined ? { reasoningEffort: model.reasoning.defaultEffort } : {}) }
      }))), [state.groups])

      const currentChoice = state.current === null ? undefined : choices.find((c) => c.selection.provider === state.current.provider && c.selection.model === state.current.model)
      const reasoning = currentChoice ? currentChoice.model.reasoning : undefined
      const effectiveEffort = state.current ? (state.current.reasoningEffort !== undefined ? state.current.reasoningEffort : (reasoning ? reasoning.defaultEffort : undefined)) : undefined
      const effortLabel = reasoning === undefined ? undefined : effectiveEffort === undefined ? t('effort.providerDefault') : (reasoning.efforts.find((e) => e.id === effectiveEffort) || {}).name ?? effectiveEffort
      const effortChoices = React.useMemo(() => reasoning === undefined ? [] : [
        ...(reasoning.defaultEffort === undefined ? [{ key: 'provider-default', effort: undefined, label: t('effort.providerDefault') }] : []),
        ...reasoning.efforts.map((effort) => ({ key: 'effort:' + effort.id, effort: effort.id, label: effort.name, ...(effort.description === undefined ? {} : { description: effort.description }) }))
      ], [reasoning, t])

      const modalityOf = (provider, model) => {
        if (modality === null) return undefined
        const entry = modality.find((e) => e.provider === provider && e.model === model)
        return entry && Array.isArray(entry.inputModalities) ? entry.inputModalities : undefined
      }
      const modalityName = (id) => ({ text: t('modality.text'), image: t('modality.image'), video: t('modality.video'), audio: t('modality.audio') })[id] ?? id
      const modalityIcon = (id) => MODALITY_ICONS[id] || MODALITY_ICONS.unknown
      const currentModes = currentChoice === undefined ? undefined : modalityOf(currentChoice.selection.provider, currentChoice.selection.model)
      const currentMM = currentModes === undefined ? [] : currentModes.filter((m) => m !== 'text')
      const currentProviderName = state.current === null ? undefined : ((state.groups.find((g) => g.id === state.current.provider) || {}).name || state.current.provider)

      const modelLabel = currentChoice ? currentChoice.model.name : t('trigger.fallback')
      const triggerLabel = effortLabel === undefined ? modelLabel : modelLabel + ' · ' + effortLabel
      const triggerAria = currentChoice === undefined ? t('trigger.selectAria') : (effortLabel === undefined ? t('trigger.aria', { model: modelLabel }) : t('trigger.ariaEffort', { model: modelLabel, effort: effortLabel }))

      const busy = state.status === 'selecting'
      const ready = state.status === 'ready'

      const reload = () => { lastActionRef.current = 'load'; load() }
      const showNotice = (text, tone) => { noticeSeq.current += 1; setNotice({ seq: noticeSeq.current, text, tone }) }
      const close = (restoreFocus) => {
        setOpen(false)
        setPane('root')
        if (restoreFocus) queueMicrotask(() => { if (triggerRef.current) triggerRef.current.focus() })
      }
      const show = () => { setPane('root'); setOpen(true); reload() }

      const pickLevel = (level, i) => {
        if (busy) return
        if (!ready) { load(); return }
        if (level.invalid) { showNotice(t('level.invalid', { label: level.label }), 'warn'); return }
        if (activeIndex === i) { close(true); return }
        lastActionRef.current = 'select'
        select(level.selection).then((ok) => {
          if (!ok) {
            const snapshot = directory.getSnapshot()
            showNotice(t('error.action', { message: snapshot.error !== null ? snapshot.error : 'select failed' }), 'error')
          }
        })
      }

      const choose = (selection) => {
        if (state.current !== null && state.current.provider === selection.provider && state.current.model === selection.model) { close(true); return }
        lastActionRef.current = 'select'
        select(selection).then((ok) => {
          if (ok) close(true)
          else {
            const snapshot = directory.getSnapshot()
            showNotice(t('error.action', { message: snapshot.error !== null ? snapshot.error : 'select failed' }), 'error')
          }
        })
      }

      const chooseEffort = (effort) => {
        if (state.current === null) return
        if (effectiveEffort === effort) { close(true); return }
        const selection = { provider: state.current.provider, model: state.current.model, ...(effort === undefined ? {} : { reasoningEffort: effort }) }
        lastActionRef.current = 'select'
        select(selection).then((ok) => {
          if (ok) close(true)
          else {
            const snapshot = directory.getSnapshot()
            showNotice(t('error.action', { message: snapshot.error !== null ? snapshot.error : 'select failed' }), 'error')
          }
        })
      }

      itemRefs.current = []
      let itemIndex = 0
      const itemRef = () => { const at = itemIndex++; return (node) => { itemRefs.current[at] = node } }
      const moveFocus = (offset) => {
        const items = itemRefs.current.filter((item) => item !== null)
        if (items.length === 0) return
        const active = items.findIndex((item) => item === document.activeElement)
        items[(Math.max(active, 0) + offset + items.length) % items.length].focus()
      }
      const onRootKeyDown = (event) => {
        if (event.key === 'Escape' && open) {
          event.preventDefault()
          if (pane !== 'root') setPane('root')
          else close(true)
          return
        }
        if (!open) return
        if (event.key === 'ArrowDown' || event.key === 'ArrowUp') {
          event.preventDefault()
          moveFocus(event.key === 'ArrowDown' ? 1 : -1)
        }
      }
      const onBlur = (event) => {
        if (event.relatedTarget instanceof Node && rootRef.current && rootRef.current.contains(event.relatedTarget)) return
        close()
      }

      if (!available) return null

      const thumbStyle = levels.length > 0 && activeIndex >= 0 ? { width: 'calc((100% - 4px) / ' + levels.length + ')', transform: 'translateX(calc(100% * ' + activeIndex + '))' } : undefined

      return React.createElement('div', {
        ref: rootRef,
        className: 'msld-root',
        onKeyDown: onRootKeyDown,
        onBlur,
        children: [
          React.createElement('button', {
            key: 'trigger',
            ref: triggerRef,
            type: 'button',
            className: 'msld-trigger',
            'aria-label': triggerAria,
            'aria-haspopup': 'menu',
            'aria-expanded': open,
            'aria-controls': open ? id + '-menu' : undefined,
            title: triggerLabel,
            disabled: locked,
            onClick: () => { if (open) close(); else show() },
            children: [
              React.createElement('span', { key: 'l', className: 'msld-triggerLabel', children: modelLabel }),
              effortLabel !== undefined && React.createElement('span', { key: 'e', className: 'msld-triggerEffort', children: effortLabel }),
              ICONS.chevronDown(cx('msld-chevron', open && 'open'))
            ]
          }),
          open && React.createElement('div', {
            key: 'menu',
            id: id + '-menu',
            className: 'msld-menu',
            role: 'menu',
            'aria-label': t('menu.aria'),
            'aria-busy': state.status === 'loading' || busy,
            children: [
              pane === 'root' && React.createElement(React.Fragment, { key: 'root-pane', children: [
                config !== null && !configFailed && levels.length > 0 && React.createElement('div', {
                  key: 'slider',
                  className: 'msld-sliderRow',
                  role: 'group',
                  'aria-label': t('slider.aria'),
                  children: [
                    activeIndex >= 0 && React.createElement('div', { key: 'thumb', className: 'msld-thumb', style: thumbStyle, 'aria-hidden': true }),
                    levels.map((level, i) => React.createElement('button', {
                      key: level.id,
                      ref: itemRef(),
                      type: 'button',
                      role: 'radio',
                      'aria-checked': activeIndex === i,
                      className: cx('msld-level', activeIndex === i && 'active', level.invalid && 'invalid'),
                      disabled: busy,
                      title: level.invalid ? t('level.invalid', { label: level.label }) : (level.selection.reasoningEffort === undefined ? t('slider.hint', { label: level.label, model: level.modelName || level.selection.model }) : t('slider.hintEffort', { label: level.label, model: level.modelName || level.selection.model, effort: level.selection.reasoningEffort })),
                      onClick: () => pickLevel(level, i),
                      children: level.label
                    }))
                  ]
                }),
                React.createElement('div', { key: 'divider', className: 'msld-divider' }),
                React.createElement('button', {
                  ref: itemRef(),
                  type: 'button',
                  role: 'menuitem',
                  className: 'msld-cell',
                  onClick: () => setPane('model'),
                  children: [
                    React.createElement('span', { key: 'l', className: 'msld-cellLabel', children: t('menu.model') }),
                    React.createElement('span', { key: 'v', className: 'msld-cellValue', children: modelLabel }),
                    currentMM.map((m) => React.createElement('span', { key: m, className: 'msld-mode', title: modalityName(m), children: modalityIcon(m)() })),
                    ICONS.chevronRight('msld-cellChevron')
                  ]
                }),
                reasoning !== undefined && React.createElement('button', {
                  ref: itemRef(),
                  type: 'button',
                  role: 'menuitem',
                  className: 'msld-cell',
                  onClick: () => setPane('effort'),
                  children: [
                    React.createElement('span', { key: 'l', className: 'msld-cellLabel', children: t('menu.effort') }),
                    React.createElement('span', { key: 'v', className: 'msld-cellValue', children: effortLabel }),
                    ICONS.chevronRight('msld-cellChevron')
                  ]
                }),
                React.createElement(React.Fragment, { key: 'usageFrag', children: [
                  React.createElement('div', { key: 'usageDiv', className: 'msld-divider' }),
                  React.createElement('div', { key: 'usage', className: 'msld-usage', children: [
                    React.createElement('div', { key: 't', className: 'msld-usageTitle', children: t('usage.title') }),
                    usage !== null && usage.ok && usage.entries.length > 0
                      ? usage.entries.map((entry) => React.createElement('div', {
                          key: entry.provider,
                          className: 'msld-usageItem',
                          onMouseEnter: (event) => setTip({ entry, x: event.clientX, y: event.clientY }),
                          onMouseMove: (event) => setTip((prev) => prev && prev.entry === entry ? { ...prev, x: event.clientX, y: event.clientY } : prev),
                          onMouseLeave: () => setTip(null),
                          children: [
                            React.createElement('span', { key: 'n', className: 'msld-usageName', children: entry.name || entry.provider }),
                            React.createElement('span', { key: 'v', className: 'msld-usageValue', children: usageText(entry, t) })
                          ]
                        }))
                      : React.createElement('div', {
                          key: 'pending',
                          className: 'msld-usageItem',
                          children: [
                            React.createElement('span', { key: 'n', className: 'msld-usageName', children: currentProviderName || '' }),
                            React.createElement('span', { key: 'v', className: 'msld-usageValue', children: usage === null ? t('usage.loading') : t('usage.unavailable') })
                          ]
                        })
                  ]})
                ]})
              ]}),
              pane === 'model' && React.createElement(React.Fragment, { key: 'model-pane', children: [
                state.status === 'loading' && React.createElement('div', { key: 'loading', className: 'msld-status', children: t('status.loading') }),
                state.error !== null && lastActionRef.current === 'load' && React.createElement('div', { key: 'error', className: 'msld-error', children: [
                  React.createElement('span', { key: 't', children: t('error.action', { message: state.error }) }),
                  React.createElement('button', { key: 'r', type: 'button', className: 'msld-retry', onClick: reload, children: t('action.reload') })
                ]}),
                state.failures.map((failure) => React.createElement('div', { key: failure.id, className: 'msld-warning', children: [
                  React.createElement('span', { key: 't', children: t('warning.groupLoad', { name: failure.name, message: failure.message }) }),
                  React.createElement('button', { key: 'r', type: 'button', className: 'msld-retry', onClick: reload, children: t('action.reload') })
                ]})),
                React.createElement('div', { key: 'groups', className: cx('msld-groups', 'scrollable'), children: state.groups.map((group) => {
                  const headingId = id + '-' + group.id
                  return React.createElement('section', {
                    key: group.id,
                    role: 'group',
                    'aria-labelledby': headingId,
                    className: 'msld-group',
                    children: [
                      React.createElement('div', { key: 'h', className: 'msld-groupTitle', id: headingId, children: group.name }),
                      group.models.map((model) => {
                        const selected = state.current !== null && state.current.provider === group.id && state.current.model === model.id
                        const modes = modalityOf(group.id, model.id)
                        const mmModes = modes === undefined ? [] : modes.filter((m) => m !== 'text')
                        return React.createElement('button', {
                          key: model.id,
                          ref: itemRef(),
                          type: 'button',
                          role: 'menuitemradio',
                          'aria-checked': selected,
                          className: cx('msld-option', selected && 'selected'),
                          title: model.name,
                          disabled: busy,
                          onClick: () => choose({ provider: group.id, model: model.id }),
                          children: [
                            React.createElement('span', { key: 'c', className: 'msld-optionCopy', children: [
                              React.createElement('span', { key: 'r', className: 'msld-nameRow', children: [
                                React.createElement('span', { key: 'n', className: 'msld-modelName', children: model.name }),
                                mmModes.map((m) => React.createElement('span', { key: m, className: 'msld-mode', title: modalityName(m), children: modalityIcon(m)() }))
                              ]}),
                              model.description !== undefined && React.createElement('span', { key: 'd', className: 'msld-description', children: model.description })
                            ]}),
                            React.createElement('span', { key: 'k', className: 'msld-check', children: selected ? ICONS.check() : null })
                          ]
                        })
                      })
                    ]
                  })
                })}),
                state.status === 'ready' && choices.length === 0 && React.createElement('div', { key: 'empty', className: 'msld-empty', children: t('empty.models') })
              ]}),
              pane === 'effort' && React.createElement(React.Fragment, { key: 'effort-pane', children: [
                state.error !== null && lastActionRef.current === 'load' && React.createElement('div', { key: 'error', className: 'msld-error', children: [
                  React.createElement('span', { key: 't', children: t('error.action', { message: state.error }) }),
                  React.createElement('button', { key: 'r', type: 'button', className: 'msld-retry', onClick: reload, children: t('action.reload') })
                ]}),
                effortChoices.length === 0 ? React.createElement('div', { key: 'empty', className: 'msld-empty', children: t('empty.efforts') }) : effortChoices.map((level) => React.createElement('button', {
                  key: level.key,
                  ref: itemRef(),
                  type: 'button',
                  role: 'menuitemradio',
                  'aria-checked': effectiveEffort === level.effort,
                  className: cx('msld-option', effectiveEffort === level.effort && 'selected'),
                  disabled: busy,
                  onClick: () => chooseEffort(level.effort),
                  children: [
                    React.createElement('span', { key: 'c', className: 'msld-optionCopy', children: [
                      React.createElement('span', { key: 'n', className: 'msld-modelName', children: level.label }),
                      level.description !== undefined && React.createElement('span', { key: 'd', className: 'msld-description', children: level.description })
                    ]}),
                    React.createElement('span', { key: 'k', className: 'msld-check', children: effectiveEffort === level.effort ? ICONS.check() : null })
                  ]
                }))
              ]})
            ]
          }),
          notice !== null && React.createElement('div', {
            key: 'notice',
            className: cx('msld-notice', notice.tone),
            children: notice.text
          }),
          tip !== null && React.createElement('div', {
            key: 'tip',
            className: 'msld-tip',
            style: { left: tip.x + 14, top: tip.y + 16 },
            children: tipRows(tip.entry, t)
          })
        ]
      })
    }

    slots.inject('conversation.input.model', () => slots.register(
      {
        name: 'conversation.input.model',
        priority: -1,
        locale: NS,
        inject: (sessionId) => {
          const directory = dirs.directoryFor(sessionId)
          const available = typeof sessions.subagentAddress !== 'function' || sessions.subagentAddress(sessionId) === void 0
          return {
            available,
            directory: directory.store,
            load: () => { if (available) directory.load().catch(() => {}) },
            select: (selection) => available ? directory.select(selection).then(() => true, () => false) : Promise.resolve(false)
          }
        }
      },
      ModelSeat
    ))
    })

    }

    exports.apply = apply;
    exports.inject = ['slots', 'sessions', 'locale', 'timer'];
    return module.exports;
  }
});
