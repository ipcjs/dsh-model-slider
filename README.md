# dsh-model-slider

[![License](https://img.shields.io/badge/license-MIT-blue.svg)](LICENSE)

DeepSeek Harness (DSH) Web UI 模型选择器增强插件：**低/中/高三档快切滑块** + 高级选择器 + 多模态图标 + 供应商用量/余额显示。

A DSH Web UI model-seat plugin: **3-level quick-switch slider** (low/medium/high), an advanced model/effort picker, modality icons, and per-provider usage/balance display.

---

## 功能特性 / Features

- 🎚️ **三档快切滑块**：点击模型名弹出面板，顶部是低/中/高三档滑块。每档的模型和推理等级在配置文件中预置，单击即直接切换（面板保持打开，可立即看到新模型与用量）。
  **3-level quick slider**: the popup opens with a low/medium/high slider; each level's model + reasoning effort is preconfigured, one click switches directly (popup stays open).
- ⚙️ **高级选择**：滑块下方保留原「模型」「推理等级」入口，可像原生选择器一样浏览全部模型。
  **Advanced picker**: the original model list and reasoning-effort panes remain available below the slider.
- 🖼️ **多模态图标**：模型名后直接显示图片/视频/语音支持图标（纯文本模型不显示）。
  **Modality icons**: image/video/audio icons shown right after the model name (text-only models show none).
- 📊 **供应商用量**：当前供应商的用量/余额显示在面板底部——会员制（如 kimi-coding）显示剩余百分比（悬停显示每周额度与 5 小时窗口明细），预付费（如 deepseek）显示余额。
  **Provider usage**: membership providers show remaining percent (hover for weekly quota + 5-hour window details), prepaid providers show balance.
- 📁 **用户级配置**：配置文件在 `~/.dsh/.model-slider.json`（所有工作区共享）。
  **User-level config** at `~/.dsh/.model-slider.json` (shared across workspaces).

---

## 安装 / Install

### 从 DSH 插件市场（推荐）

在 [DSH-Plugins-Marketplace](https://github.com/bradeGithub/DSH-Plugins-Marketplace) 搜索 `dsh-model-slider` 一键安装；或直接：

```bash
dsh plugin --profile web install ipcjs/dsh-model-slider
```

安装后**重启 DSH** 生效。

### 手动安装

把 `lib/` 目录放入 `~/.dsh/profiles/web/node_modules/dsh-model-slider/`，然后在 `~/.dsh/profiles/web/cordis.patch.yml` 追加：

```yaml
- insert:
    - id: msld
      name: 'dsh-model-slider'
```

重启 DSH 生效。

---

## 配置 / Configuration

配置文件：`~/.dsh/.model-slider.json`（不存在时使用内置默认值，无需创建）。

```jsonc
{
  "levels": [
    {
      "id": "low",
      "label": "低",
      "provider": "deepseek-official",
      "model": "deepseek-v4-flash",
      "reasoningEffort": "off"
    },
    {
      "id": "medium",
      "label": "中",
      "provider": "deepseek-official",
      "model": "deepseek-v4-flash",
      "reasoningEffort": "max"
    },
    {
      "id": "high",
      "label": "高",
      "provider": "kimi-coding",
      "model": "k3",
      "reasoningEffort": "max"
    }
  ],
  "usage": {
    "deepseek-official": {
      "kind": "prepaid",
      "endpoint": "https://api.deepseek.com/user/balance"
    },
    "kimi-coding": {
      "kind": "membership",
      "endpoint": "https://api.kimi.com/coding/v1/usages"
    },
    "google": {
      "kind": "prepaid",
      "endpoint": ""
    }
  }
}
```

- `levels`：滑块档位。`provider`/`model` 必须是 DSH 中已配置的供应商与模型；`reasoningEffort` 可省略（用模型默认档）。档位配置了不可用的模型/推理等级时，该档点击会提示（`level.invalid`）。
- `usage`：用量查询配置。`kind` 为 `membership`（会员额度：解析 `usage.{limit,remaining,resetTime}` + `limits[]` 窗口）或 `prepaid`（预付费余额：解析 `balance_infos[0].{total_balance,currency}`）。`endpoint` 为空串表示不查询（显示「不可用」）。
- API Key 从 DSH 的 credentials 服务读取（`settings.yaml` 中配置的 `apiKeyEnv`），不会硬编码或写入本文件。

---

## 兼容性 / Compatibility

- DSH Web GUI（`dsh web`）
- 服务端为静态插件（随 DSH 启动自动加载，无需动态插件审批）
- 依赖 DSH 自带的 `conversation.input.model` 槽位与 `modelDirectories` 服务

---

## 目录结构 / Structure

```
dsh-model-slider/
├── package.json        # dsh.plugin + dsh.bundle + dsh.client 声明
├── cordis.patch.yml    # 组合包 patch 层
├── lib/
│   ├── index.js        # 服务端：/msld/rpc 路由（config/save/catalog/usage）
│   └── client.js       # 浏览器端：槽位 UI（滑块 + 高级选择 + 用量）
└── README.md
```

## 许可 / License

[MIT](LICENSE)
