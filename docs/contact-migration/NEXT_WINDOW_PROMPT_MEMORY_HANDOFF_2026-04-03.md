# New Window Prompt — Contact Migration Full Handoff (2026-04-03)

Use this exact prompt in a new chat window:

```md
Start in orchestrator mode for Herman-Adu/electrical-website (Next.js 16, strict TypeScript, Docker MCP gateway).

Mandatory startup order:

1. Run MCP readiness preflight and report result:
   - `pnpm migration:contact:ready`
2. Hydrate Docker memory entities (read these exact keys):
   - `agent:v1:heuristic_snapshots:2026-04-03-context-max-handoff`
   - `agent:v1:reasoning:contact-migration-session-handoff-2026-04-03`
   - `agent:v1:handoff:contact-migration-new-window-2026-04-03`
3. Read canonical migration source:
   - `docs/contact-migration/contact-page-lift-and-shift.md`
4. Read process runbook:
   - `docs/contact-migration/CONTACT_MIGRATION_SYNC_RUNBOOK_2026-04-03.md`

Operating contract:

- Memory is source-of-truth for session continuity.
- Do not output secrets or `.env*` contents.
- Use key-name-only masked reporting for env checks (`present` / `missing`).
- Keep execution scoped to contact migration and orchestrator guardrails unless explicitly redirected.

Required hydration summary before implementation:

- current branch
- HEAD commit
- workspace clean/dirty status + high-level changed areas
- recovered priorities from memory
- first verification/implementation sequence

Then continue from hydrated state without broad unrelated repo refactors.
```
