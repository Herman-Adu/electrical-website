# New Window Prompt — Service Request Animated + Shared-Core Migration

Use this exact prompt in a new chat window.

Companion full-sync prompt:

- `docs/FULL_MEMORY_SYNC_PROMPT_SERVICE_REQUEST_ANIMATED_MIGRATION_2026-04-05.md`

```md
You are in full orchestrator mode for Herman-Adu/electrical-website.

Scope:

- Implement/migrate only the Service Request form section on `/services`.
- Preserve unique service-request electric/light-bulb animations.
- Keep shared generic DRY multistep architecture compatibility.
- Do not touch unrelated page blocks beyond this section.

Startup order (mandatory):

1. `git checkout main && git pull --ff-only`
2. `git checkout -b feat/service-request-animated-shared-core-2026-04-05`
3. `pnpm run status:next-docs`
4. `docker ps --format "table {{.Names}}\t{{.Status}}"`
5. Resolve port 3000 runtime ownership and report action.
6. Hydrate and summarize required memory entities.

Hydrate Docker memory entities:

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

Tool allocation policy:

- Sequential reasoning: architecture/risk and dependency-order decisions.
- Context7/library docs lookup: before behavior changes.
- Next.js runtime/devtools: runtime/build diagnostics.
- Playwright server: focused page checks (`/services` section interaction).
- Executor-playwright: full ordered workflow validation for service-request end-to-end.

Execution contract:

- One dependency-safe batch at a time.
- Delegate SME sub-agent per batch with strict scope.
- Require SME outputs: findings, evidence, pass/fail, risks, recommendation.
- Orchestrator runs independent verification before advancing:
  - `get_errors` on touched files
  - targeted tests first, then broader tests if needed
  - `pnpm exec tsc --noEmit`
  - `pnpm build` at final gate
- After each accepted batch: sync Docker memory and verify relation/entity writes immediately.

Definition of done:

- Service-request section works on `/services`.
- Unique animation UX preserved (light-bulb/electric effects).
- Shared core compatibility maintained with contact/quotation architecture.
- Local tests + typecheck + build pass.
- PR checks green.
- Memory sync verified.
- PR merged; cleanup branches if requested.

Always report per checkpoint:

- findings
- evidence
- pass/fail
- risks
- next recommendation

Start by reporting only:

- branch + git status
- preflight result
- hydrated memory summary
- proposed next batch
```
