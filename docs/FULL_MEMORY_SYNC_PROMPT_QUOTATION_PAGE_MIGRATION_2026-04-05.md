# Full Memory Sync Prompt — Quotation Page Migration (2026-04-05)

Use this complete prompt at the start of a new chat to rehydrate full quotation migration context without re-scanning the entire repo.

```md
You are in orchestrator mode for Herman-Adu/electrical-website.
Scope is strictly quotation page lift-and-shift migration with memory-first continuity.

Project baseline:

- Framework: Next.js 16 App Router, TypeScript strict
- Package manager: pnpm
- Styling: Tailwind + shadcn/ui
- Forms: react-hook-form + zod + Zustand
- MCP runtime: Docker gateway with playwright + executor-playwright + memory-reference available

Startup sequence (mandatory):

1. Create fresh feature branch from up-to-date main

- git checkout main && git pull --ff-only
- git checkout -b feat/quotation-lift-shift-2026-04-05

2. Preflight and runtime readiness

- pnpm migration:quotation:ready
- pnpm docker:mcp:playwright:bootstrap

3. Memory hydration (strict)

- pnpm migration:quotation:hydrate:strict

4. Read canonical migration docs only

- docs/quotation-migration/quotation-page-lift-and-shift.md
- docs/quotation-migration/QUOTATION_MIGRATION_SYNC_RUNBOOK_2026-04-05.md

5. Read and summarize these memory entities:

- agent:v1:project:electrical-website
- agent:v1:heuristic_snapshots:2026-04-05-contact-form-migration-complete
- agent:v1:reasoning:2026-04-05-multistep-form-migration-blueprint
- agent:v1:heuristic_snapshots:2026-04-05-contact-to-quotation-learnings
- agent:v1:heuristic_snapshots:2026-04-05-quotation-migration-readiness
- agent:v1:reasoning:2026-04-05-quotation-migration-execution-plan
- agent:v1:reasoning:2026-04-05-quotation-executor-playwright-validation
- agent:v1:handoff:quotation-migration-new-window-2026-04-05

Non-negotiable operating contract:

- Memory is source of truth for continuity.
- Never reveal secrets from .env\* or terminal logs.
- During migration-copy phase, user copies files and assistant verifies only.
- Release exactly one dependency-safe batch at a time.
- Do not advance until current batch is green.

Quotation migration execution model:

- Use the 10 rounds in quotation-page-lift-and-shift.md as canonical.
- Treat shared steps (contact-info-step and address-info-step under components/organisms/shared-steps/) as mandatory dependencies.
- Keep quotation email config compatible with current repo constraints; if Strapi dependency appears, use env-backed config fallback in doc.

Validation milestones:

- Midpoint: npx tsc --noEmit
- Feature gate: npx tsc --noEmit after features/quotation copy
- Final gate: pnpm build

Automation validation (required):

- Run executor-playwright workflow to validate full 7-step sequence on /quotation:
  1. open /quotation
  2. complete steps 0..5 with valid data
  3. verify review step content
  4. submit form
  5. verify success state and QR- reference pattern
- Capture evidence summary (pass/fail, blockers, recommendations)

Completion requirements:

- /quotation renders all sections
- 7-step UX works end-to-end
- submission path validated
- local typecheck/build pass
- memory snapshot updated for next session
- PR merged to main after green checks
- feature branch deleted local + remote; final workspace back on clean main

At every checkpoint output:

- findings
- evidence
- pass/fail
- risks
- next recommendation

Start by reporting:

- branch + git status
- hydrated memory summary
- Batch 1 proposal only
```
