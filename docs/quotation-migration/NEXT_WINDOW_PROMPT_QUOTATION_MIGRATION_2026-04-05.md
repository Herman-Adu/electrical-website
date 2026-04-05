# New Window Prompt — Quotation Migration (Memory-First, Orchestrated)

Use this exact prompt in a new chat window:

Canonical companion full-sync prompt:

- docs/FULL_MEMORY_SYNC_PROMPT_QUOTATION_PAGE_MIGRATION_2026-04-05.md

```md
Start in orchestrator mode for Herman-Adu/electrical-website (Next.js 16, strict TypeScript, Docker MCP gateway).

Mandatory startup order:

1. Create and switch to a dedicated feature branch before migration work:
   - `git checkout main && git pull --ff-only`
   - `git checkout -b feat/quotation-lift-shift-2026-04-05`
2. Run Next.js docs status preflight first:
   - `pnpm run status:next-docs`
3. Run Docker health + MCP readiness preflight and report result:
   - `docker ps --format "table {{.Names}}\t{{.Status}}"`
   - pnpm migration:quotation:ready
4. Resolve runtime ownership of port 3000 without repetitive prompts:
   - if docker runtime target: stop local conflicting process and continue
   - if local runtime target: stop docker app runtime and continue
   - always report runtime mode + action taken
5. Hydrate and verify quotation memory entities:
   - pnpm migration:quotation:hydrate:strict
6. Read canonical migration source:
   - docs/quotation-migration/quotation-page-lift-and-shift.md
7. Read quotation runbook:
   - docs/quotation-migration/QUOTATION_MIGRATION_SYNC_RUNBOOK_2026-04-05.md
   - docs/quotation-migration/FULL_MEMORY_SYNC_SNAPSHOT_QUOTATION_CLOSURE_2026-04-05.md

Hydrate Docker memory nodes (read and summarize):

- agent:v1:heuristic_snapshots:2026-04-05-quotation-migration-readiness
- agent:v1:reasoning:2026-04-05-quotation-migration-execution-plan
- agent:v1:reasoning:2026-04-05-quotation-executor-playwright-validation
- agent:v1:handoff:quotation-migration-new-window-2026-04-05
- agent:v1:heuristic_snapshots:2026-04-05-contact-to-quotation-learnings
- agent:v1:reasoning:2026-04-05-multistep-form-migration-blueprint

Operating contract (strict):

- Docker memory graph is single source of truth for continuity and migration state.
- Do not use local ledger files as continuity fallback.
- No broad repo refactors.
- No secret leakage (`.env*` values never printed).
- During file-copy phase: assistant does not invent replacements; user copies exact files from guide.
- Release one dependency-safe batch only.
- Verify each batch before unlocking next.
- Do not advance if current batch has unresolved errors.

Completed architecture baseline (carry forward unless memory explicitly contradicts):

- B1 complete: sanitize/security/forms + action type foundations
- B2 complete: quotation email/service + marketing/types + mock contracts
- B3 complete: providers/ui button/atoms/molecules/shared-organisms baseline

Memory write fallback policy:

- If MCP graph tool path errors on write, use direct Docker memory-reference write path (`scripts/mcp-memory-call.mjs` with `create_entities` / `add_observations`).
- Verify write immediately with `open_nodes` for targeted keys and `search_nodes` for expected tags.
- Never mark checkpoint complete until memory verification is green.

Delegation policy:

- Remain in orchestrator mode by default.
- Delegate focused SME sub-agents where useful (architecture, runtime validation, implementation verification).
- Require SME output fields: findings, evidence, pass/fail, risks, next recommendation.
- After each SME report, return one-line orchestrator decision.

Verification rules per batch:

- Validate file presence and paths.
- Validate import graph with targeted search.
- Run get_errors on touched files.
- Run milestone checks only at defined gates.

Definition of done:

- /quotation route fully functional
- 7-step form progression + review + success path validated
- server action path secured and validated
- local typecheck/build pass
- executor-playwright step-sequence validation pass
- memory snapshot updated for next session continuity
- PR merged into main with all checks green
- migration feature branch deleted locally and remotely

At each checkpoint report:

- findings
- evidence
- pass/fail
- risks
- next recommendation

Start by summarizing hydrated memory state and proposing Batch 1 only.
```
