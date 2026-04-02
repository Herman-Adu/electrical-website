# Orchestrator Memory-First Playbook

Purpose: make every new chat start consistently, stay evidence-driven, and finish cleanly.

## 1) Session startup (always)

Run this in order before broad repo reads:

1. Hydrate memory entity `agent:v1:heuristic_snapshots:2026-04-02-project-detail-scroll-clean-base`
2. Hydrate memory entity `agent:v1:reasoning:next-chat-feature-start-memory-first-2026-04-02`
3. Hydrate memory entity `agent:v1:project:electrical-website`

Then hydrate current policy contract:

- `agent:v1:orchestrator:policy:current`
- `agent:v1:orchestrator:routing-matrix:current`
- `agent:v1:orchestrator:sme-report-template:current`

Immediately publish a short hydration summary:

- branch
- HEAD
- protection model
- relevant prior merged PRs
- workspace clean/dirty (+ dirty files if any)
- proposed SME sequence

## 2) Tool routing order (default)

Use this order unless there is a strong reason not to:

1. Memory MCP (continuity/state)
2. Sequential thinking (trade-offs, multi-step decisions)
3. Docs lookup / library docs
4. Next.js docs resolution (`pnpm run status:next-docs` first)
5. Next.js runtime/devtools inspection
6. Playwright/browser runtime inspection
7. Targeted code reads/search

Rule: do not start with broad repo scans.

## 3) What each SME report must contain

Every SME output must include exactly:

- findings
- evidence
- pass/fail
- risks
- next recommendation

After each SME report, Orchestrator adds one line:

- `Orchestrator decision: <single-line decision>`

## 4) Validation discipline

After each implementation batch:

1. targeted validation first (closest tests/checks to the change)
2. broader validation second

For Next.js behavior changes:

- run `pnpm run status:next-docs` before implementation
- use local docs source order:
  1. `node_modules/next/dist/docs/`
  2. `node_modules/next/docs/`
  3. `node_modules/next/README.md`

For UI/runtime/flaky tests:

- inspect runtime first (Next.js runtime + Playwright/browser)
- avoid patching waits/selectors blindly
- prefer `waitUntil: "domcontentloaded"` + explicit assertions
- avoid defaulting to `networkidle` unless proven necessary

Selector hierarchy and guardrails:

- prefer `getByRole(name)` for interactive elements (`button`, `link`, `tab`, etc.)
- use `getByLabel` / `getByPlaceholder` for form controls
- use `getByText` for non-interactive content assertions
- use `getByTestId` for explicit contracts when semantics/text are unstable or repeated
- scope to route-owned containers first (`main`, named region, dialog, section), then chain descendants
- prefer `filter({ has, hasText })` over positional APIs for disambiguation
- treat `first()` / `last()` / `nth()` as last resort only
- avoid brittle CSS/XPath chains and shell-wide selectors unless testing shared shell behavior intentionally

## 5) Protected-main delivery flow

Always use:

1. feature branch
2. PR to `main`
3. required checks green (`E2E Tests`, `lighthouse-ci`)
4. label `ready-to-merge`
5. merge (auto-merge allowed)
6. delete branch
7. sync local `main` and verify clean tree

## 6) Session-close memory write-back

Before ending a meaningful rollout/change session:

1. persist a dated heuristic snapshot key with completion state
2. persist/update a reasoning handoff key for the next chat
3. attach final evidence (PR number, merge state, HEAD, clean/dirty)

## 7) Expectations (how we work together)

Assistant expectations:

- memory-first startup every session
- compact checkpoint updates
- evidence before claims
- minimal, surgical edits
- no unrelated refactors

User expectations:

- provide objective + constraints
- confirm whether to execute PR flow end-to-end or stop at PR creation
- call out priority: speed vs confidence (light vs full validation)

Shared expectation:

- prefer repeatable process over ad-hoc fixes
- preserve repo cleanliness and protected-main standards

## 8) Copy/paste kickoff prompt for future chats

Primary handoff file for new window chats:

- `docs/NEW_WINDOW_CHAT_HANDOFF_ORCHESTRATED_SUBAGENTS_2026-04-02.md`

Use this at the top of new sessions:

"Start in orchestrator mode. Hydrate memory first using:

1. `agent:v1:heuristic_snapshots:2026-04-02-project-detail-scroll-clean-base`
2. `agent:v1:reasoning:next-chat-feature-start-memory-first-2026-04-02`
3. `agent:v1:project:electrical-website`
   Then hydrate:

- `agent:v1:orchestrator:policy:current`
- `agent:v1:orchestrator:routing-matrix:current`
- `agent:v1:orchestrator:sme-report-template:current`
  Do not do broad scans first. Output hydration summary (branch, HEAD, protection model, recent PRs, clean/dirty, SME sequence), then proceed memory-first with SME checkpoints and one-line Orchestrator decisions."

## 9) Done definition (per task)

A task is complete when:

- requested change is implemented
- targeted + broader validation status is reported
- protected-main flow is respected (if code/docs changed)
- memory handoff is updated when session-level policy/process changed
- local `main` is clean after merge (or explicitly documented if not)

## 10) E2E selector refactor checklist

Use this checklist whenever touching Playwright selectors:

1. Scope first

- Anchor to route-owned containers (`main`, named `navigation`, dialog, form section).
- Avoid page-wide selectors unless shell behavior is the explicit test goal.

2. Pick the strongest accessible locator

- Interactive: `getByRole(role, { name })`
- Form controls: `getByLabel()` first, then `getByPlaceholder()` if no label
- Static copy/assertions: `getByText()`
- Explicit contract fallback: `getByTestId()`

3. Disambiguate semantically

- Prefer chaining/filtering (`filter({ has, hasText })`) over index-based targeting.
- Use `first()`/`last()`/`nth()` only if no stable semantic contract exists.

4. Replace brittle patterns

- Replace CSS/XPath chains, `[role='...']` string selectors, and broad `a[href*='/']` patterns where possible.
- Keep selectors aligned with user-visible behavior and assistive-tech semantics.

5. Validate in two gates

- Gate 1 (targeted): run only changed specs first.
- Gate 2 (broader): run project build and/or broader suite relevant to risk.

6. Document rationale

- If a positional selector remains, add a short reason in test comments.
- Capture findings/evidence/pass-fail/risks/next recommendation in SME format.
