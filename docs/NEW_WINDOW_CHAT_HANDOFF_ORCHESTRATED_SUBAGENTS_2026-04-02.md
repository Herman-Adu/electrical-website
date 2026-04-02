# New Window Chat Handoff — Orchestrated Sub-Agents (2026-04-02)

Use this prompt verbatim in a brand-new chat window to enforce orchestrator-first execution with memory hydration and structured SME checkpoints.

---

Continue in `electrical-website` on Windows.

Operate in **Orchestrator mode** with focused SME sub-agents. Do not begin with broad repo scans.

## Mandatory startup hydration order

Hydrate Docker memory entities in this exact order:

1. `agent:v1:heuristic_snapshots:2026-04-02-project-detail-scroll-clean-base`
2. `agent:v1:reasoning:next-chat-feature-start-memory-first-2026-04-02`
3. `agent:v1:project:electrical-website`

Then hydrate the policy source-of-truth keys:

- `agent:v1:orchestrator:policy:current`
- `agent:v1:orchestrator:routing-matrix:current`
- `agent:v1:orchestrator:sme-report-template:current`

Treat hydrated memory as canonical session context.

## Required startup output

Immediately print a compact hydration summary containing:

- branch
- HEAD
- protection model
- relevant merged PRs
- workspace clean/dirty state
- proposed SME sequence

## Required operating contract

- Delegate work to focused SME sub-agents.
- Each SME report must include: findings, evidence, pass/fail, risks, next recommendation.
- After every SME report, add one line: `Orchestrator decision: <single-line decision>`.
- Keep progress updates concise and checkpoint-oriented.

## Mandatory tool routing order

1. Memory MCP
2. Sequential thinking (for ambiguity/trade-offs)
3. Docs lookup / library docs
4. Next.js docs resolution (`pnpm run status:next-docs` first)
5. Next.js runtime/devtools
6. Playwright/browser runtime inspection
7. Targeted code reads/search

## Selector and runtime policy

For Playwright/runtime checks:

- Prefer route-owned accessible selectors over shell-wide selectors.
- Locator order: `getByRole(name)` → `getByLabel`/`getByPlaceholder` → `getByText` → `getByTestId`.
- Scope to route-owned containers first (`main`, named region, dialog, form section).
- Prefer chaining/filtering (`filter({ has, hasText })`) over positional selectors.
- Use `first()`/`last()`/`nth()` only as last resort with justification.
- Prefer `waitUntil: "domcontentloaded"` + explicit assertions.
- Use `networkidle` only when explicitly required by observed behavior.

## Validation discipline

After each change batch:

1. targeted validation first
2. broader validation second

## Protected-main workflow

If changes are required, use:

1. feature branch
2. PR to `main`
3. required checks green (`E2E Tests`, `lighthouse-ci`)
4. label `ready-to-merge`
5. merge and sync local `main`

## Session-close write-back

Persist both:

- a dated heuristic snapshot key for this run
- a reasoning handoff key for the next chat

If no code/doc changes are needed, explicitly state why and stop after validation.

---

End of handoff prompt.
