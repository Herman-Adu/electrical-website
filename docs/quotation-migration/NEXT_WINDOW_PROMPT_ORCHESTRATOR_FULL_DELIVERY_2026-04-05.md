# Next Window Prompt — Orchestrator Full Delivery (2026-04-05)

```md
You are GitHub Copilot (GPT-5.3-Codex) operating in FULL ORCHESTRATOR mode for Herman-Adu/electrical-website.

Mission:
Close the active quotation migration branch safely end-to-end: validate all pending changes, run local gates, commit, push, verify CI green, merge to main, sync memory, and return repo to clean main.

Scope discipline:

- Work only on the active migration delta.
- Do not introduce unrelated refactors.
- Respect compose-first runtime and existing repo conventions.

Runtime mode protocol (user preference, mandatory):

- Docker dev runtime may own port `3000` during app validation.
- VS Code/local runtime may replace Docker runtime when user switches modes.
- On port conflict, do not ask repetitive confirmation; detect mode, stop conflicting runtime, continue execution, and report what switched.
- Always include runtime mode in each checkpoint (`docker` or `local`) and any port/process action taken.

## A) Mandatory startup preflight (in order)

1. Workspace and branch state

- git rev-parse --abbrev-ref HEAD
- git status --short
- (git status --short | Measure-Object -Line).Lines
- Treat live count as truth (if not 41, continue using actual count).

2. Quotation migration preflight

- pnpm migration:quotation:ready
- pnpm docker:mcp:playwright:bootstrap
- pnpm migration:quotation:hydrate:strict

3. Canonical docs to load

- docs/quotation-migration/quotation-page-lift-and-shift.md
- docs/quotation-migration/QUOTATION_MIGRATION_SYNC_RUNBOOK_2026-04-05.md
- docs/quotation-migration/FULL_MEMORY_SYNC_SNAPSHOT_QUOTATION_CLOSURE_2026-04-05.md

4. Memory nodes to open + summarize

- agent:v1:project:electrical-website
- agent:v1:heuristic_snapshots:2026-04-05-contact-to-quotation-learnings
- agent:v1:heuristic_snapshots:2026-04-05-quotation-migration-readiness
- agent:v1:reasoning:2026-04-05-quotation-migration-execution-plan
- agent:v1:reasoning:2026-04-05-quotation-executor-playwright-validation
- agent:v1:handoff:quotation-migration-new-window-2026-04-05
- agent:v1:handoff:quotation-closure-orchestrator-2026-04-05
- agent:v1:reasoning:2026-04-05-quotation-closure-full-delivery-plan

## B) Tool allocation + token optimization protocol

- Use quick file discovery tools first (`file_search`, `grep_search`) before full reads.
- Read only targeted ranges with `read_file`; avoid whole-file dumps unless required.
- Use `manage_todo_list` to keep a single in-progress step and reduce context churn.
- Use compose MCP browser tools for smoke/workflow checks only.
- Use local Playwright runner for full interactive lifecycle evidence.
- Summarize after each gate in compact checkpoints: findings, evidence, pass/fail, risks, next step.

## C) Delivery workflow

1. Stabilize and complete pending implementation

- Resolve any remaining migration TODOs in quotation feature and shared step dependencies.
- Ensure no anti-patterns remain (`networkidle` readiness for app assertions, arbitrary sleeps, brittle selectors).

2. Local quality gates (must pass)

- npx tsc --noEmit
- pnpm test
- pnpm build

3. Deterministic evidence gate

- Run interactive quotation lifecycle proof using Playwright against compose-hosted app.
- Verify: step progression, submit success state, QR reference pattern, and re-entry stability.
- Save evidence artifact under test-results with timestamp.

4. Commit and push

- Stage only intended files.
- Use clear commit message focused on quotation migration closure.
- Push branch and capture remote branch URL.

5. CI verification and merge

- Verify required checks are green.
- If any check fails, triage once, fix root cause, rerun local gate, repush.
- Merge to main only after green checks.

6. Post-merge hygiene

- Checkout main and pull --ff-only.
- Delete merged feature branch (local + remote if policy allows).
- Confirm clean working tree.

7. Memory closure sync

- Add/update observations for:
  - agent:v1:handoff:quotation-closure-orchestrator-2026-04-05
  - agent:v1:reasoning:2026-04-05-quotation-closure-full-delivery-plan
- Include final commit SHA, CI result, merge PR reference, and closure status.

## D) Non-negotiable constraints

- Never expose secret values from .env\* or logs.
- Never skip preflight/hydration.
- Never merge with failing local gates.
- Never broaden scope beyond quotation migration closure.
- Always honor runtime mode switching without repetitive prompts when port `3000` contention is detected.

## E) Output contract at each checkpoint

Return concise structured updates:

- findings
- evidence
- pass/fail
- risks
- next recommendation

Start now with section A and report branch, live changed-file count, and hydration summary before any code edits.
```
