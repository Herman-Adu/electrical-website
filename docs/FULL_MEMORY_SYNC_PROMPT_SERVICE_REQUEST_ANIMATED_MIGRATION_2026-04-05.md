# Full Memory Sync Prompt — Service Request Animated + Shared-Core Migration (2026-04-05)

Use this in a new chat to rehydrate context for the service-request migration under master orchestrator mode.

Canonical companion prompt:

- `docs/Service request form migration/NEXT_WINDOW_PROMPT_SERVICE_REQUEST_ANIMATED_MIGRATION_2026-04-05.md`

```md
You are in full orchestrator mode for Herman-Adu/electrical-website.

Mission:

- Keep full Service Request form behavior and preserve unique electric/light-bulb step animations.
- Run it on the shared generic DRY multistep core used across forms.
- Scope is only the embedded Service Request section on `/services`.
- Do not migrate unrelated page blocks.

Operating model (non-negotiable):

- Docker memory graph is the single source of truth.
- No local ledger fallback.
- One dependency-safe batch at a time.
- Delegate SME sub-agents for implementation and validation.
- Orchestrator independently verifies every SME result before advancing.
- Never expose `.env*` values.

Mandatory startup sequence:

1. Preflight
   - `pnpm run status:next-docs`
   - `docker ps --format "table {{.Names}}\t{{.Status}}"`
   - Resolve runtime ownership of port 3000 and report action taken.
2. Hydration
   - Read memory entities:
     - `agent:v1:batch:forms-hardening:batch-1`
     - `agent:v1:batch:forms-hardening:batch-2`
     - `agent:v1:batch:forms-hardening:batch-3`
     - `agent:v1:batch:forms-hardening:batch-8-hotfix`
     - `agent:v1:batch:forms-hardening:finalization-2026-04-05`
     - `agent:v1:heuristic_snapshots:2026-04-05-orchestrator-workflow-gold-standard`
     - `agent:v1:pr:47`
     - `agent:v1:scope:service-request:form-section-only-2026-04-05`
     - `agent:v1:doc:service-request-form-section-only-migration-2026-04-05`
     - `agent:v1:next-task:service-request:section-only-implementation`
3. Tool orchestration policy
   - Use sequential reasoning for architecture/risk decisions.
   - Use Context7/library docs lookup before behavior changes.
   - Use Next.js runtime/devtools for app/runtime diagnostics.
   - Use Playwright server for focused page interaction checks.
   - Use executor-playwright for ordered end-to-end workflow validation.
4. Execution policy per batch
   - Delegate SME sub-agent with strict scope.
   - SME returns: findings, evidence, pass/fail, risks, recommendation.
   - Orchestrator runs independent checks:
     - `get_errors` on touched files
     - targeted tests first, then broader gates
     - `tsc --noEmit` / build as needed
   - Sync to Docker memory graph and verify write immediately.
5. Quality gates before close
   - Local tests pass
   - Typecheck/build pass
   - PR checks green
   - Memory entities + relations verified

Current baseline to carry forward:

- Contact and quotation forms aligned on shared multistep architecture.
- Quotation action-state submission flow is active and validated.
- Shared Turnstile security module is active.
- Prompt/memory-sync docs hardened for memory-first orchestration.
- Service-request target is hybrid: shared core + unique animation layer.

Batch objective for this migration:

- Keep full service-request flow (validation, review/edit routing, server action, security, email).
- Preserve light-bulb/electric animation UX.
- Ensure reusable shared core contracts remain consistent with contact/quotation.

At each checkpoint output:

- findings
- evidence
- pass/fail
- risks
- next recommendation

Start by reporting:

- Branch + git status
- Preflight result
- Hydrated memory summary
- Proposed next batch only
```
