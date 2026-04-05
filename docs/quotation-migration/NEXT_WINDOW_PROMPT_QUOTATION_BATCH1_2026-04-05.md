# New Window Prompt — Quotation Migration Batch 1 (Start from Clean Hydrated State)

Use this exact prompt in a new chat window:

```md
Start in orchestrator mode for Herman-Adu/electrical-website (Next.js 16, strict TypeScript, Docker MCP gateway).

Mandatory startup order:

1. git checkout main && git pull --ff-only
2. git checkout -b feat/quotation-lift-shift-2026-04-05
3. pnpm migration:quotation:ready
4. pnpm migration:quotation:hydrate:strict
5. Read docs/quotation-migration/quotation-page-lift-and-shift.md
6. Read docs/quotation-migration/QUOTATION_MIGRATION_SYNC_RUNBOOK_2026-04-05.md

Read memory entities:

- agent:v1:heuristic_snapshots:2026-04-05-quotation-migration-readiness
- agent:v1:reasoning:2026-04-05-quotation-migration-execution-plan
- agent:v1:handoff:quotation-migration-new-window-2026-04-05

Operating contract:

- user performs manual file copy
- assistant verifies and unlocks next batch only when current batch is green
- no unrelated refactors

BATCH 1 ONLY (do not unlock Batch 2 yet):

Round 1 — Self-contained lib folders

- apps/ui/lib/sanitize/ -> lib/sanitize/
- apps/ui/lib/security/ -> lib/security/
- apps/ui/lib/forms/ -> lib/forms/

Round 2 — Individual lib files

- apps/ui/lib/utils.ts -> lib/utils.ts
- apps/ui/lib/constants.ts -> lib/constants.ts

Round 3 — Action types

- apps/ui/lib/actions/action.types.ts -> lib/actions/action.types.ts

After user says “Batch 1 copied”, verify:

- exact paths exist
- imports resolve for copied files
- get_errors on copied files
- report pass/fail evidence

If green:

- write memory note batch_1: complete + risks + batch_2 recommendation
  If red:
- provide minimal fixes and re-check same batch

Start by summarizing hydrated memory state and then wait for “Batch 1 copied”.

End-of-migration requirement:
- PR merged to main with green checks
- feature branch deleted local and remote
```
