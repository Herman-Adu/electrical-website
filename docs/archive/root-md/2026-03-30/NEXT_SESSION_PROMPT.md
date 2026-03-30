# NEXT SESSION PROMPT — electrical-website
**Date written:** 2026-03-29  
**Repo:** `Herman-Adu/electrical-website`  
**Git HEAD:** `7b0f050` (main) — `fix(e2e): stabilize smoke, boundaries and captcha specs (#10)`  
**CI status:** ![E2E](https://github.com/Herman-Adu/electrical-website/actions/workflows/e2e.yml/badge.svg?branch=main)

---

## YOU ARE THE ORCHESTRATOR

You manage context, delegate work, and synthesise results.  
**Never do heavy multi-step work directly in the primary context window.**  
Delegate to sub-agents for any task with >3 sequential steps.

### Mandatory operating pattern

```
1. Read this prompt fully (you are doing that now).
2. Check git state + run status:next-docs to anchor to local docs.
3. Spawn sub-agent(s) for each bounded task (see delegation rules below).
4. Sub-agents report back → you commit, PR, merge, clean.
5. Update this file + memory MCP at end of session.
```

---

## Current Codebase State (2026-03-29)

| Area | Status |
|---|---|
| **Build** | ✅ `pnpm build` — exit 0 |
| **TypeScript** | ✅ `pnpm tsc --noEmit` — 0 errors |
| **Lint** | ✅ 0 errors (446 no-console warnings in test/agent files — expected) |
| **E2E (local prod server)** | ✅ 58/58 passing `PLAYWRIGHT_BASE_URL=http://127.0.0.1:3000 --workers=2` |
| **CI E2E** | ❌ 57/58 — `navigation-flows.spec.ts:101` timeout on `waitForLoadState("networkidle")` |
| **Unstaged** | `e2e/navigation-flows.spec.ts` — networkidle → domcontentloaded fix applied, not yet committed |

### Immediate task for next session

**Fix is already applied** — `e2e/navigation-flows.spec.ts` has all 7 `waitForLoadState("networkidle")` calls replaced with `waitForLoadState("domcontentloaded")`.

All that remains:
1. Commit + push to feature branch
2. PR → merge to main
3. Verify CI passes (58/58)
4. Delete feature branch
5. Update memory

---

## Stack & Configuration

```
Framework:    Next.js 16 App Router (TypeScript strict)
CSS:          Tailwind CSS v4 + shadcn/ui
Validation:   Zod + t3-env
Package mgr:  pnpm
Deployment:   Vercel (prod) | Docker Desktop (local dev)
Node:         24 (GitHub Actions) | 20+ local
MCP gateway:  Docker Desktop MCP gateway (16 servers enabled)
Test runner:  Playwright (E2E) + Vitest (unit)
Prod server:  node .next/standalone/server.js (port 3000)
```

---

## Docker MCP Gateway — Enabled Servers

Use these **first** before any web search. The Docker MCP gateway runs in Docker Desktop.

| Server | Key tools | Use for |
|---|---|---|
| `github-official` | `create_pull_request`, `merge_pull_request`, `list_branches`, `create_branch` | All GitHub operations |
| `playwright-mcp-server` | `playwright_navigate`, `playwright_screenshot` | Browser automation (needs gateway restart if EOF) |
| `microsoft-playwright` (fervent_nightingale) | `browser_*` tools | Alternative browser automation |
| `sequentialthinking` | `mcp_mcp_docker_sequentialthinking` | Complex reasoning / planning |
| `memory` | `create_entities`, `add_observations`, `search_nodes` | Session persistence at `agent:v1:*` namespace |
| `resend` | `send-email` | Email notifications (dry-run first) |
| `ast-grep` | code search | Symbol/pattern search across codebase |
| `context7` | library docs | Next.js/React docs lookup before coding |
| `fetch` | `mcp_mcp_docker_fetch` | Web fetching |

> **If a tool returns EOF:** The MCP gateway session is disconnected. Restart Docker Desktop MCP gateway or reload VS Code MCP host. Do NOT fallback to browser automation as a workaround — fix the gateway first.

---

## Sub-Agent Delegation Rules (ENFORCED)

### When to spawn a sub-agent

- Any task with more than 3 sequential steps
- Any E2E run (delegates full Playwright execution context)
- Any GitHub workflow (PR, merge, branch cleanup)
- Reasoning tasks (architecture decisions, trade-off analysis)
- Codebase search (code-search skill)

### Agent pool assignments

| Task type | Agent pool | Primary tools |
|---|---|---|
| Code search / pattern analysis | `code-intelligence-agent` | ast-grep, github-official |
| Browser testing | `browser-agent` | playwright-mcp-server |
| PR / merge / branch cleanup | `code-intelligence-agent` | github-official |
| Architecture decisions | `reasoning-agent` | sequentialthinking, memory |
| Email notifications | `notification-agent` | resend |
| Health check pre-flight | `orchestrator` | (meta) |

### Sub-agent prompt template

```
You are a [AGENT_POOL] sub-agent for the electrical-website repo.
Repo: Herman-Adu/electrical-website — Next.js 16, pnpm, Playwright E2E
Your task: [SPECIFIC BOUNDED TASK]
Available tools: [LIST FROM POOL]
Rules:
- Use Docker MCP tools first (github-official, playwright-mcp-server, memory)
- Do not expand scope beyond [SPECIFIC BOUNDED TASK]
- Return: { outcome, files_changed, test_results, next_action }
```

---

## Git Workflow (Always Follow This Order)

```bash
# 1. Create feature branch
git checkout -b feat/<short-descriptor>

# 2. Make changes, verify
pnpm tsc --noEmit && pnpm lint && pnpm build
pnpm exec playwright test --workers=2 --reporter=list

# 3. Commit
git add -A && git commit -m "type(scope): description"

# 4. Push
git push -u origin feat/<short-descriptor>

# 5. PR via GitHub MCP (mcp_mcp_docker_create_pull_request)
# 6. Wait for CI — check with mcp_mcp_docker_pull_request_read (method: get_check_runs)
# 7. Merge via GitHub MCP (mcp_mcp_docker_merge_pull_request, merge_method: squash)
# 8. Pull main locally: git checkout main && git pull origin main
# 9. Delete feature branch: git branch -d feat/... && git push origin --delete feat/...
# 10. Update memory: mcp_mcp_docker_create_entities (agent:v1:heuristic_snapshots:<date>)
```

---

## Secret Handling (Non-Negotiable)

- **Never** print, echo, quote, or summarise real secret values from `.env*`, terminal, logs, or screenshots.
- Mask all secrets in output: `re_***`, `sk-***`, `gQAA***` etc.
- Reference only variable names: `RESEND_API_KEY`, `NEXT_PUBLIC_TURNSTILE_SITE_KEY`, `SENTRY_DSN`.
- If credentials appear in context, treat as compromised — recommend rotation immediately.

---

## E2E Test Infrastructure

```bash
# Start prod server (standalone)
$env:HOSTNAME="127.0.0.1"; $env:PORT="3000"
node .next/standalone/server.js

# Run full suite
$env:PLAYWRIGHT_BASE_URL="http://127.0.0.1:3000"
pnpm exec playwright test --workers=2 --reporter=list

# Run single spec
pnpm exec playwright test e2e/<spec>.spec.ts --reporter=verbose

# CI runs against build output — always build before running E2E in CI-like mode
pnpm build && node .next/standalone/server.js
```

### Known CI gotcha — CRITICAL

`waitForLoadState("networkidle")` **always times out in CI** on pages that load
Cloudflare Turnstile or Vercel Analytics scripts (they keep the network active indefinitely).

**Rule: Always use `waitForLoadState("domcontentloaded")` in all E2E specs.**

---

## Environment Variables Required

| Variable | Purpose |
|---|---|
| `NEXT_PUBLIC_TURNSTILE_SITE_KEY` | Cloudflare Turnstile widget |
| `TURNSTILE_SECRET_KEY` | Server-side CAPTCHA verification |
| `RESEND_API_KEY` | Email via Resend |
| `OG_ROUTE_ALLOWED_ORIGINS` | Comma-separated allowlist for `/api/og` |
| `RATE_LIMIT_MAX` | Contact form rate limit (default: 5) |

Copy `.env.example` to `.env.local` and fill in real values for local dev.

---

## Active Workflows (GitHub Actions)

| File | Trigger | Purpose |
|---|---|---|
| `.github/workflows/e2e.yml` | push to main/feat/* | Playwright E2E (58 tests) |
| `.github/workflows/skill-sync-check.yml` | skill file changes | skill/SKILL.md parity |
| `.github/workflows/agent-audit.yml` | daily 06:00 UTC | Agent skill audit + typecheck |

---

## Agent Skill System

Skills live in `agent/skills/*.skill.ts`. Always use typed constants — never raw strings.

| Skill ID | Cost | Dry-run | Use for |
|---|---|---|---|
| `code-search` | cheap | No | AST patterns, symbol search |
| `browser-testing` | expensive | No | Playwright UI tests |
| `github-actions` | medium | Yes | CI, PRs, deployments |
| `send-notification` | cheap | Yes | Email via Resend (dry-run first) |
| `reasoning-chain` | expensive | Yes | Architecture decisions |
| `health-check` | cheap | No | MCP server pre-flight |
| `skill-builder` | medium | Yes | Scaffold/audit/optimise skills |

---

## Memory Namespace

All memory MCP entities use prefix `agent:v1:`. Never write outside this namespace.

```
agent:v1:heuristic_snapshots:<YYYY-MM-DD>   session state snapshot
agent:v1:audit_events:<uuid>                 audit trail
agent:v1:reasoning:<intentId>                reasoning conclusions
agent:v1:health_status:<serverId>            health monitor state
```

---

## Immediate Next Action

```
1. Run E2E locally to confirm fix works:
   $env:PLAYWRIGHT_BASE_URL="http://127.0.0.1:3000"
   pnpm exec playwright test --workers=2 --reporter=list
   Expected: 58/58

2. Commit the navigation-flows fix:
   git checkout -b feat/fix-e2e-ci-networkidle
   git add e2e/navigation-flows.spec.ts
   git commit -m "fix(e2e): replace networkidle with domcontentloaded to prevent CI timeout"
   git push -u origin feat/fix-e2e-ci-networkidle

3. Create PR via github-official MCP, merge, verify CI is green (58/58).

4. Delete feature branch. Update memory snapshot.
```

---

*Updated: 2026-03-29. Update this file at every session close.*
