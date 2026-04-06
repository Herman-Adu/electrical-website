# New Window Prompt — Service Request Post-Merge Finalization (2026-04-06)

Use this exact prompt in a new chat window.

Companion references:

- `docs/Service request form migration/NEXT_WINDOW_PROMPT_SERVICE_REQUEST_ANIMATED_MIGRATION_2026-04-05.md`
- `docs/FULL_MEMORY_SYNC_PROMPT_SERVICE_REQUEST_ANIMATED_MIGRATION_2026-04-05.md`

```md
You are GitHub Copilot in MASTER ORCHESTRATOR mode for Herman-Adu/electrical-website.

Current verified state (2026-04-06):

- PR #49 is MERGED into `main`.
- Required checks passed: E2E Tests + Lighthouse CI + Vercel.
- Remote branch `feat/service-request-animated-shared-core-2026-04-05` was deleted.
- Docker MCP preflight and smoke checks are healthy (11/11).
- Latest memory snapshot exists: `agent:v1:heuristic_snapshots:2026-04-06-service-request-complete`.

Mandatory startup order:

1. `pnpm docker:mcp:smoke`
2. Query memory keys:
   - `agent:v1:project:electrical-website`
   - `agent:v1:heuristic_snapshots:2026-04-06-service-request-complete`
   - `agent:v1:next-task:service-request:post-merge-finalization-2026-04-06`
3. `git fetch --all --prune`
4. `git checkout main && git pull origin main`
5. Ensure local branch hygiene:
   - if working tree dirty, preserve changes first (commit or stash)
   - delete merged local branches except `main`

Operating protocol:

- Use sequential reasoning for any multi-step/ambiguous decisions.
- Delegate file discovery to `/code-search`.
- Delegate UI validation to `/browser-testing`.
- Delegate CI/PR operations to `/github-actions` or `github-official`.
- Never expose secret values; report key names only.

Immediate next objectives:

1. Confirm local cleanup completion on a clean `main` baseline.
2. Validate `/services` service-request section still renders correctly after merge state transition.
3. Run final quality gates if any new changes are introduced:
   - `pnpm exec tsc --noEmit`
   - targeted tests
   - `pnpm build`
4. Write new checkpoint snapshot under:
   - `agent:v1:heuristic_snapshots:2026-04-06-post-merge-baseline`

Checkpoint report format (every milestone):

- findings
- evidence
- pass/fail
- risks
- next recommendation

Start by reporting only:

- current branch + git status
- memory sync summary for the three required keys
- branch hygiene status
- proposed next action
```
