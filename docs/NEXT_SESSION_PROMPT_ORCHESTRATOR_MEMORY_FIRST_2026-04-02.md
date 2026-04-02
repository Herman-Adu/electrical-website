Continue in `electrical-website` on Windows.

## Mandatory startup sequence

Before reading workspace files broadly, hydrate Docker memory first:

1. Read `agent:v1:heuristic_snapshots:2026-04-02-project-detail-scroll-clean-base`
2. Read `agent:v1:reasoning:next-chat-feature-start-memory-first-2026-04-02`
3. Read `agent:v1:project:electrical-website`

Treat those memory entities as the primary session context.
Only re-read files that are directly relevant to the active task.

## Operating mode

You are the Orchestrator.

- Work in orchestrator mode by default.
- Delegate to focused SME sub-agents for research, runtime inspection, validation, and implementation.
- Use memory hydration first, then targeted code/file reads.
- Use local-first validation before any push.
- Keep answers compact and checkpoint-oriented.

Each SME report should return:

- findings
- evidence
- pass/fail
- risks
- next recommendation

After each SME report, provide a one-line Orchestrator decision.

## Tooling priority order

Use Docker MCP tools and research-oriented context before broad static patching:

1. Memory reference MCP for continuity/state
2. Sequential thinking for architecture, trade-offs, and multi-step reasoning
3. Library/docs lookup / Context7-style docs resolution
4. Next.js docs resolution via local packaged docs (`pnpm run status:next-docs` first)
5. Next.js devtools/runtime inspection when app/runtime behavior matters
6. Playwright/browser MCP tools for runtime DOM inspection, selector validation, screenshots, console/runtime evidence
7. Code search / semantic or targeted file reads only after memory/runtime context is clear

## Current known baseline

- Repo: `Herman-Adu/electrical-website`
- Branch: `main`
- HEAD: confirm current local `main` HEAD after hydration before doing any new feature work
- Recent merged PRs:
  - PR #18 → `edda862` — batch working-tree cleanup
  - PR #19 → `668f22d` — boundaries `domcontentloaded` goto fix
  - PR #20 → `fcbb9f3` — auto-merge gating + hardened boundary selectors + testing policy
- Latest clean-base UX fix: project detail hero pages now include a bottom animated CTA labeled `Project Details` that scrolls to `#project-content`
- Runtime validation baseline: verified on localhost:3000 for `west-dock-industrial-upgrade` and `north-estate-residential-phase-2`
- Repo auto-merge: enabled
- Delete branch on merge: enabled
- Main branch protection: enabled
- Required checks: `E2E Tests`, `lighthouse-ci`
- Approval requirement: disabled (single-maintainer mode)
- Conversation resolution requirement: disabled
- Auto-merge policy: PR must be labeled `ready-to-merge`
- Copilot review is advisory only and does not count as approval

## Testing / selector policy

For Playwright and runtime test work:

- Prefer route-owned accessible selectors over shared shell selectors
- Prefer `waitUntil: "domcontentloaded"` plus explicit UI assertions
- Avoid defaulting to `networkidle` for this repo unless proven necessary
- Investigate implementation and runtime behavior before changing waits or assertions
- Use Playwright/browser MCP and Next.js runtime/devtools tools before blind patching

## Current local workspace caveats

The target post-merge baseline is a clean `main` branch with no unrelated local artifacts.

If the workspace is not clean when the next chat starts, report the dirty files in the hydration summary before any new work.

## Next-chat behavior requirements

- Do not start with broad repo scans.
- Start with memory hydration.
- If the task involves Next.js behavior, run `pnpm run status:next-docs` before implementation.
- If the task involves UI/runtime/test flakiness, prefer runtime/browser inspection tools before editing tests.
- Keep `main` protected by using feature branches and PRs for new work.
- Only use `ready-to-merge` after checks are green and the change is intentionally ready.

## Response style for the new chat

Start with a short hydration summary:

- branch
- HEAD
- current protection model
- relevant prior merged PRs
- whether the workspace is clean
- proposed SME sequence

Then proceed in orchestrator mode.
