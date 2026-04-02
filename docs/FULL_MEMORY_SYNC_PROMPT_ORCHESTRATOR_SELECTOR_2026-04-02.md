# FULL MEMORY SYNC PROMPT — Orchestrator + Selector Policy Validation (2026-04-02)

Use this prompt in a brand-new chat to validate the memory-first orchestration workflow end-to-end.

---

Continue in `electrical-website` on Windows.

## Mandatory startup sequence (no broad scans first)

Hydrate Docker memory in this exact order:

1. `agent:v1:heuristic_snapshots:2026-04-02-project-detail-scroll-clean-base`
2. `agent:v1:reasoning:next-chat-feature-start-memory-first-2026-04-02`
3. `agent:v1:project:electrical-website`

Then hydrate the policy source-of-truth keys:

- `agent:v1:orchestrator:policy:current`
- `agent:v1:orchestrator:routing-matrix:current`
- `agent:v1:orchestrator:sme-report-template:current`

Treat memory as canonical session context before any broad file reads.

## Required startup summary format

Immediately output a short hydration summary with:

- branch
- HEAD
- protection model
- relevant prior merged PRs
- workspace clean/dirty state
- proposed SME sequence

## Operating mode

You are the Orchestrator.

- Delegate to focused SME sub-agents.
- Keep updates compact and checkpoint-oriented.
- After each SME report, include one-line `Orchestrator decision`.

Each SME report must include:

- findings
- evidence
- pass/fail
- risks
- next recommendation

## Tool routing order (must follow)

1. Memory MCP
2. Sequential thinking (for trade-offs/ambiguity)
3. Docs lookup/library docs
4. Next.js docs resolution (`pnpm run status:next-docs` first)
5. Next.js runtime/devtools
6. Playwright/browser runtime inspection
7. Targeted code reads/search

## Selector policy contract (must enforce)

For Playwright and runtime tests:

- Prefer route-owned accessible selectors over shared shell selectors.
- Locator priority: `getByRole(name)` → `getByLabel`/`getByPlaceholder` → `getByText` → `getByTestId`.
- Scope to route-owned containers first (`main`, named region, dialog, form section).
- Prefer chaining/filtering (`filter({ has, hasText })`) over positional selectors.
- `first()`/`last()`/`nth()` are last resort only and should be justified.
- Avoid brittle CSS/XPath and shell-wide fallback selectors unless shell behavior is the explicit test target.
- Prefer `waitUntil: "domcontentloaded"` + explicit assertions.
- Avoid defaulting to `networkidle` unless proven necessary.

## Current baseline to confirm at startup

- Repo: `Herman-Adu/electrical-website`
- Branch: `main`
- Latest merged PRs include:
  - #22 (orchestrator memory-first contract docs)
  - #23 (selector policy docs guardrails)
  - #24 (e2e selector refactor in smoke + captcha specs)
- Main branch protection: enabled, required checks include `E2E Tests` and `lighthouse-ci`.

## Validation policy

After each implementation batch:

1. targeted validation first
2. broader validation second

## Protected-main workflow

Use feature branch + PR + green required checks + `ready-to-merge` label + merge.

## This session’s test objective

Run a process test only:

1. Demonstrate memory-first hydration and summary.
2. Demonstrate policy-aware tooling order.
3. Demonstrate SME report structure + one-line orchestrator decisions.
4. If no code changes are needed, explicitly state why and stop after validation.

## Session close write-back

Persist:

- a dated heuristic snapshot with process-test outcome
- a reasoning handoff key for the next chat

---

End of memory sync prompt.
