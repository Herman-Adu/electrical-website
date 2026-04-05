# New Window Prompt — Quotation Migration (Memory-First, Orchestrated)

Use this exact prompt in a new chat window:

```md
Start in orchestrator mode for Herman-Adu/electrical-website (Next.js 16, strict TypeScript, Docker MCP gateway).

Mandatory startup order:

1. Create and switch to a dedicated feature branch before migration work:
   - `git checkout main && git pull --ff-only`
   - `git checkout -b feat/quotation-lift-shift-2026-04-05`
2. Run MCP readiness preflight and report result:
   - pnpm migration:quotation:ready
3. Hydrate and verify quotation memory entities:
   - pnpm migration:quotation:hydrate:strict
4. Read canonical migration source:
   - docs/quotation-migration/quotation-page-lift-and-shift.md
5. Read quotation runbook:
   - docs/quotation-migration/QUOTATION_MIGRATION_SYNC_RUNBOOK_2026-04-05.md

Hydrate Docker memory nodes (read and summarize):

- agent:v1:heuristic_snapshots:2026-04-05-quotation-migration-readiness
- agent:v1:reasoning:2026-04-05-quotation-migration-execution-plan
- agent:v1:reasoning:2026-04-05-quotation-executor-playwright-validation
- agent:v1:handoff:quotation-migration-new-window-2026-04-05
- agent:v1:heuristic_snapshots:2026-04-05-contact-to-quotation-learnings
- agent:v1:reasoning:2026-04-05-multistep-form-migration-blueprint

Operating contract (strict):

- No broad repo refactors.
- No secret leakage (`.env*` values never printed).
- During file-copy phase: assistant does not invent replacements; user copies exact files from guide.
- Release one dependency-safe batch only.
- Verify each batch before unlocking next.
- Do not advance if current batch has unresolved errors.

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
