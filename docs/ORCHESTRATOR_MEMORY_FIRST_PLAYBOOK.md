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

## 2.1) MCP quick start (default runtime path)

Use Docker MCP scripts as the standard entrypoint to avoid install/revert drift:

1. Start MCP gateway + services

- `pnpm docker:mcp:up`

2. Confirm container health/status

- `pnpm docker:mcp:ps`

3. Verify MCP endpoints/tools via gateway smoke test

- `pnpm docker:mcp:smoke`

4. One-command readiness flow

- `pnpm docker:mcp:ready`

5. Stop MCP services when finished

- `pnpm docker:mcp:down`

## 2.2) MCP browser startup contract (Windows + Docker)

Use this rule to prevent browser-start token waste:

1. Do not treat `mcp_mcp_docker_browser_eval start` failure as a project runtime failure on Windows.

- Known host-level failure mode: `spawn /bin/sh ENOENT`.
- This indicates the top-level browser-eval bootstrap path attempted a POSIX shell on the Windows host.

2. Browser validation for this repository must run through Docker MCP routes first.

- Primary routes: `/playwright/tools/call` and `/executor/tools/call` via Caddy `http://127.0.0.1:3100`.
- Verify contracts with `pnpm docker:mcp:smoke`.

3. Always run `pnpm docker:mcp:playwright:bootstrap` after `docker:mcp:up` and before browser workflows.

- This ensures Chromium availability in `playwright` and `executor-playwright` containers.

4. If browser calls still fail after bootstrap:

- Recreate Playwright containers: `docker compose up -d --force-recreate --pull always playwright executor-playwright`
- Re-run `pnpm docker:mcp:playwright:bootstrap`
- Re-run `pnpm docker:mcp:smoke`

5. Escalation policy:

- If Docker MCP browser contracts pass, continue using Docker MCP browser routes.
- Do not switch to ad-hoc host browser automation unless explicitly requested for non-MCP testing.

## 2.3) Preflight + hydration optimization policy

Goal: run preflight once per session, not repeatedly per hydration lane.

Session policy:

1. Run one shared preflight at session start:

- `pnpm docker:mcp:ready`

2. Run strict hydrations without re-running full preflight when services are already healthy:

- `pnpm migration:contact:hydrate:strict`
- `pnpm migration:quotation:hydrate:strict`
- `pnpm migration:service-request:hydrate:strict`

3. If strict hydration fails due service health:

- run `pnpm docker:mcp:smoke` once
- recover only failing services
- retry only the failed hydration lane

Implementation note:

- Current migration hydrate scripts call `migration:*:ready` internally, which duplicates preflight work when running all three lanes.
- Next implementation phase should add a session-scoped skip flag (for example `MCP_PREFLIGHT_DONE=1`) so strict hydrations can bypass repeated ready checks after a validated session preflight.

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

## 11) Related docs

- Docker MCP runtime + quick start: [`docker/README.md`](../docker/README.md)
- Local test pre-flight + MCP startup checklist: [`docs/LOCAL_TESTING_SETUP.md`](LOCAL_TESTING_SETUP.md)
