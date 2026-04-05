# Full Memory Sync Prompt — Quotation Page Migration (2026-04-05)

Use this complete prompt at the start of a new chat to rehydrate full quotation migration context without re-scanning the entire repo.

Canonical companion prompt for new-chat startup:

- docs/quotation-migration/NEXT_WINDOW_PROMPT_QUOTATION_MIGRATION_2026-04-05.md

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

2. Next.js docs resolution preflight (required before behavior changes)

- pnpm run status:next-docs

3. Docker health + runtime readiness

- docker ps --format "table {{.Names}}\t{{.Status}}"
- pnpm migration:quotation:ready
- pnpm docker:mcp:playwright:bootstrap

4. Port 3000 conflict handling (do not ask repetitive confirmations)

- detect active owner of port 3000
- if runtime target is docker: stop local/dev server process and continue
- if runtime target is local: stop docker app runtime and continue
- report final runtime mode and action taken at checkpoint

5. Memory hydration (strict)

- pnpm migration:quotation:hydrate:strict

6. Read canonical migration docs only

- docs/quotation-migration/quotation-page-lift-and-shift.md
- docs/quotation-migration/QUOTATION_MIGRATION_SYNC_RUNBOOK_2026-04-05.md
- docs/quotation-migration/FULL_MEMORY_SYNC_SNAPSHOT_QUOTATION_CLOSURE_2026-04-05.md

7. Read and summarize these memory entities:

- agent:v1:project:electrical-website
- agent:v1:heuristic_snapshots:2026-04-05-contact-form-migration-complete
- agent:v1:reasoning:2026-04-05-multistep-form-migration-blueprint
- agent:v1:heuristic_snapshots:2026-04-05-contact-to-quotation-learnings
- agent:v1:heuristic_snapshots:2026-04-05-quotation-migration-readiness
- agent:v1:reasoning:2026-04-05-quotation-migration-execution-plan
- agent:v1:reasoning:2026-04-05-quotation-executor-playwright-validation
- agent:v1:handoff:quotation-migration-new-window-2026-04-05

Completed architecture baseline (carry forward as already complete unless memory conflicts):

- B1 complete: sanitize/security/forms foundations + quotation action typing established
- B2 complete: quotation email config/service + marketing/types + mock data contracts established
- B3 complete: provider/ui/atoms/molecules/shared-organisms architecture baseline established

Non-negotiable operating contract:

- Docker memory graph is the single source of truth for continuity and migration state.
- Do not use local ledger files as state authority or fallback continuity source.
- Never reveal secrets from .env\* or terminal logs.
- During migration-copy phase, user copies files and assistant verifies only.
- Release exactly one dependency-safe batch at a time.
- Do not advance until current batch is green.

Memory write-path policy (when MCP graph tool path errors):

- fallback write path must use Docker memory-reference direct write via scripts/mcp-memory-call.mjs create_entities/add_observations
- immediately verify write with open_nodes on affected keys and search_nodes for expected tags
- if verification fails, treat write as failed and do not mark checkpoint complete

Delegation/orchestrator policy:

- remain in orchestrator mode by default
- delegate focused SME sub-agents for architecture/runtime validation/implementation checks
- require each SME report: findings, evidence, pass/fail, risks, next recommendation
- after each SME report, provide one-line orchestrator decision

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
- runtime mode + any port 3000 conflict action
- Batch 1 proposal only
```
