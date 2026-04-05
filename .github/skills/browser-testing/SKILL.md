---
name: browser-testing
description: "Execute browser automation using the Docker MCP Playwright runtime. Two modes: inspect (default) — single-page navigate/screenshot/extract-text via the playwright server; workflow — multi-step goto/wait sequences via the executor-playwright server. Use when asked to run browser tests, verify UI behaviour, take screenshots, test navigation flows, smoke-test after deploy, or run ordered page sequences on the electrical-website or any URL."
---

# Browser Testing Skill (v2.0.0)

Routes automatically between two Docker MCP Playwright servers based on task type.

## Server Capability Matrix

| Capability             | playwright (inspect) | executor-playwright (workflow) |
| ---------------------- | :------------------: | :----------------------------: |
| Navigate → title + URL |    ✅ `navigate`     |        via `goto` step         |
| Capture PNG screenshot |   ✅ `screenshot`    |               ✗                |
| Extract DOM text       |  ✅ `extract-text`   |               ✗                |
| Multi-step sequences   |          ✗           |       ✅ `run-workflow`        |
| click / type / fill    |          ✗           |  ✗ (not supported by runtime)  |
| Caddy gateway path     |   `/playwright/*`    |         `/executor/*`          |
| Engine                 |     chromium-cli     |          chromium-cli          |

## When to use

- "Take a screenshot of the homepage" → **inspect / screenshot**
- "What is the page title of http://localhost:3000?" → **inspect / navigate**
- "Extract the text content from the contact page" → **inspect / extract-text**
- "Run a smoke test on http://localhost:3000" → **inspect / navigate**
- "Visit the home, about, and contact pages in sequence" → **workflow**
- "Run an ordered page-flow suite: home → services → contact" → **workflow**

## Routing Logic (automatic)

The orchestrator resolves the mode from the input — no manual selection needed:

```
steps present in input  →  mode="workflow"  →  executor-playwright / run-workflow
url present, no steps   →  mode="inspect"   →  playwright / navigate|screenshot|extract-text
mode explicitly set     →  honour it
```

## Inspect Mode — Input Fields

| Field        | Type                                               |   Default    | Required |
| ------------ | -------------------------------------------------- | :----------: | :------: |
| `url`        | string (URL)                                       |      —       |    ✅    |
| `tool`       | `"navigate"` \| `"screenshot"` \| `"extract-text"` | `"navigate"` |    no    |
| `fullPage`   | boolean                                            |   `false`    |    no    |
| `outputPath` | string (file path)                                 |     auto     |    no    |
| `selector`   | CSS selector (extract-text only)                   |    `body`    |    no    |
| `timeoutMs`  | number                                             |   `30000`    |    no    |

### Inspect examples

```json
// Navigate — get page title + final URL
{ "url": "http://localhost:3000/contact" }

// Screenshot — capture full-page PNG
{ "url": "http://localhost:3000", "tool": "screenshot", "fullPage": true }

// Extract text — dump visible DOM text
{ "url": "http://localhost:3000/about", "tool": "extract-text" }
```

## Workflow Mode — Input Fields

| Field       | Type                     | Required |
| ----------- | ------------------------ | :------: |
| `steps`     | array of `goto` / `wait` |    ✅    |
| `timeoutMs` | number                   |    no    |

### Supported step actions

- `goto` — navigate to a URL, pause until DOM loads
- `wait` — sleep for `ms` milliseconds (default 500)

**Not supported** (runtime restriction): `click`, `type`, `fill`, `evaluate`, `waitForSelector`, `screenshot`

### Workflow example

```json
{
  "steps": [
    { "action": "goto", "url": "http://localhost:3000" },
    { "action": "wait", "ms": 800 },
    { "action": "goto", "url": "http://localhost:3000/contact" }
  ]
}
```

## Steps (orchestrator procedure)

1. Analyse the intent — does the task need a single-page operation or an ordered multi-page sequence?
2. If single-page → compose inspect input (`url` + `tool`).
3. If multi-step sequence → compose workflow input (`steps` array).
4. Execute via the `browser-testing` skill — routing is automatic.
5. Report: title, url, text, screenshotPath, stepsExecuted, or error.

## Guidelines

- **Never call** `click`, `fill`, `evaluate`, or `console_messages` — these tools do not exist in the chromium-cli runtime and will throw `Unknown tool`.
- `extract-text` returns raw DOM text with HTML tags stripped — validate before trusting.
- Screenshots are written to `/tmp` inside the container; `screenshotPath` is the container path.
- This skill is **not** dry-run capable — it interacts with live pages.
- Chromium spawns take 8–25 s; the skill uses `timeoutMs: 30 000` by default — do not reduce below 30 000.
- Break large flows (>10 pages) into batches of workflow invocations.

## Secret Safety (Non-Negotiable)

- Never print, echo, summarize, or quote secret values from `.env*`, terminal output, logs, screenshots, or tool results.
- Always mask sensitive tokens in all outputs (for example: `re_***`, `gQAA***`).
- Use secret variable names only (for example: `RESEND_API_KEY`) when discussing configuration.
- If credentials are exposed during a session, recommend immediate credential rotation before continuing.
