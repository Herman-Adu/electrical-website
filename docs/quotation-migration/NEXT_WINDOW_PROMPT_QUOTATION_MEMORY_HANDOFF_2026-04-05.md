# New Window Prompt — Quotation Migration Full Memory Handoff (2026-04-05)

Use this exact prompt in a new chat window:

```md
Start in orchestrator mode for Herman-Adu/electrical-website (Next.js 16, strict TypeScript, Docker MCP gateway).

Mandatory startup order:

1. Create/switch to quotation feature branch from clean main:
   - git checkout main && git pull --ff-only
   - git checkout -b feat/quotation-lift-shift-2026-04-05
2. Run MCP readiness preflight:
   - pnpm migration:quotation:ready
3. Hydrate quotation memory strictly:
   - pnpm migration:quotation:hydrate:strict
4. Read canonical migration source:
   - docs/quotation-migration/quotation-page-lift-and-shift.md
5. Read migration process runbook:
   - docs/quotation-migration/QUOTATION_MIGRATION_SYNC_RUNBOOK_2026-04-05.md

Then read these memory entities exactly:

- agent:v1:project:electrical-website
- agent:v1:heuristic_snapshots:2026-04-05-contact-form-migration-complete
- agent:v1:reasoning:2026-04-05-multistep-form-migration-blueprint
- agent:v1:heuristic_snapshots:2026-04-05-quotation-migration-readiness
- agent:v1:reasoning:2026-04-05-quotation-migration-execution-plan
- agent:v1:reasoning:2026-04-05-quotation-executor-playwright-validation
- agent:v1:handoff:quotation-migration-new-window-2026-04-05
- agent:v1:heuristic_snapshots:2026-04-05-contact-to-quotation-learnings

Operating constraints:

- Memory is source-of-truth for continuity.
- Never output secret values; use key-name-only present/missing checks.
- Keep work strictly scoped to quotation migration unless explicitly redirected.

Required summary before any implementation:

- current branch + HEAD commit
- clean/dirty workspace state
- hydrated memory priority list
- current migration batch status
- immediate next safe batch to execute

Then continue from hydrated state without re-reading unrelated repo files.

Finish condition:

- merge quotation feature PR into main after all checks are green
- delete feature branch locally and remotely
- return to clean `main`
```
