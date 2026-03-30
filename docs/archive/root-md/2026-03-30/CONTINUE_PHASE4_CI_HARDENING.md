# Continuation Prompt — Phase 4 CI MCP Hardening

> **How to use:** Copy everything from the horizontal rule below and paste it into a new chat window.

---

I am working in `C:\Users\herma\source\repository\electrical-website` on Windows (VS Code).
Stack: Next.js 16 App Router, TypeScript, Tailwind, pnpm, Docker Desktop.

## Repo rules (mandatory)

Follow `.github/copilot-instructions.md`, `AGENTS.md`, and `CLAUDE.md`.
Before any Next.js changes run `pnpm run status:next-docs` (resolves to `node_modules/next/README.md` only — dist/docs not present).

## Current confirmed state

- **HEAD:** `51b40c7` on `main` (same as `origin/main`)
- **pnpm build:** passing
- **Tier-2:** NOT part of this runtime. `compose.tier2.yml` and `scripts/start-tier2.sh` do not exist. `docker/TIER2-USAGE.md` is retained as an optional blueprint only — already patched with status banner.
- **16 modified unstaged files** — all agent/ and workflow changes from prior sessions, not yet committed.
- **Key new untracked file:** `agent/constants/mcp-canonical.ts` — typed mapping of every `MCP.*` constant to its docker service name, gateway route, and smoke tool. Exports `MCP_CANONICAL_MAP`, `MCP_CANONICAL_ENTRIES`, `MCP_CANONICAL_PRIORITY_SERVERS` (7 services), `validateMcpCanonicalMapping()`, `assertMcpCanonicalMapping()`.

## Objective: Phase 4 CI MCP compatibility hardening

Apply MCP runtime checks to two workflow files:

### 1. `.github/workflows/agent-audit.yml`

Add a new job `mcp-compat` (runs after `health-and-audit`):

- Derive priority service list from `agent/constants/mcp-canonical.ts` at job start (no hardcoded service names in YAML)
- Start an ephemeral Docker MCP stack with only priority services
- Wait for container health (`docker inspect --format='{{.State.Health.Status}}'`)
- For each service: send MCP `initialize` → `tools/list` via HTTP to the Caddy gateway
- For each service: execute one dry-run-safe smoke call using the `smokeTool` from the canonical map
- `github-official` smoke requires `GITHUB_TOKEN` (available as `${{ secrets.GITHUB_TOKEN }}`)
- Always collect container logs and teardown on exit (`if: always()`)

### 2. `.github/workflows/skill-sync-check.yml`

Add a new job `mcp-compat-smoke` with `needs: sync-check`:

- Same Docker stack sequence as above but shorter timeout
- **Strict** (fail on error) when triggered by `push` to `main` or `schedule`
- **Non-strict / warn-only** when triggered by `pull_request` or `workflow_dispatch` from forks (to avoid blocking contributor PRs)
- Always collect logs + teardown

## Priority MCP services (from `MCP_CANONICAL_PRIORITY_SERVERS`)

```
github-official, memory-reference, nextjs-devtools, openapi-schema,
sequential-thinking, playwright, executor-playwright
```

## Execution sequence for this session

1. **Preflight** — run and report: `pnpm run status:next-docs` and `git status --short`
2. **Discovery** — read current content of both workflow files in full
3. **Implementation** — apply minimal targeted YAML patches to both workflow files
4. **Validation** — run: `pnpm install --frozen-lockfile && pnpm build && pnpm lint`
5. **Commit** (only if validation passes) — staged commit of all modified files
6. **Memory sync** — only after successful commit

## Validation gate

Do NOT memory-sync or commit if `pnpm build` exits non-zero.
Lint warnings are acceptable; lint errors that are pre-existing (not introduced by workflow changes) are acceptable — do not block on those.

## Files to read first (before making changes)

- `.github/workflows/agent-audit.yml` (full)
- `.github/workflows/skill-sync-check.yml` (full)
- `agent/constants/mcp-canonical.ts` lines 1–120 (service entries and priority list)

Start with the preflight commands, then proceed.
