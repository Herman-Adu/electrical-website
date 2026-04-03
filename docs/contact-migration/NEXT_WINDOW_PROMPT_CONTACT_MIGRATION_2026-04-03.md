# New Window Prompt — Contact Migration (Memory-First, Orchestrated)

Use this exact prompt in a new chat window:

```md
Start in orchestrator mode for Herman-Adu/electrical-website (Next.js 16, strict TypeScript, Docker MCP gateway).

Mandatory startup order:

1. Run MCP health preflight (`pnpm docker:mcp:ready`) and report result.
2. Read memory entities:
   - agent:v1:heuristic_snapshots:2026-04-03-session-end
   - agent:v1:reasoning:contact-migration-lift-shift-2026-04-03
   - agent:v1:drift_lane:memory-backend-fix-2026-04-03
3. Read canonical migration source:
   - docs/contact-migration/contact-page-lift-and-shift.md

Operating contract (strict):

- No coding by assistant during migration copy phase.
- User manually copies files.
- Assistant only releases next batch, verifies copied files, reports blockers, and unlocks next batch.
- Do not advance until current batch is green.

Verification rules per batch:

- Validate file presence and paths.
- Validate import/dependency integrity with targeted code search.
- Run get_errors on touched files.
- Run broader checks only at milestone boundaries.

Definition of done:

- /contact renders complete layout (hero, trust, FAQ teaser, form, sidebar cards)
- 5-step form flow works with validation + persisted state
- submit path returns reference id + success state
- env wiring complete
- typecheck/build pass
- visual + scripted checks pass

At every checkpoint include:

- findings
- evidence
- pass/fail
- risks
- next recommendation

Start by summarizing hydrated memory state and proposing Batch 1 only.
```
