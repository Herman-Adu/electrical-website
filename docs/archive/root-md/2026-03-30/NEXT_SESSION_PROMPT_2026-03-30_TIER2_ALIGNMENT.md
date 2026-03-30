# NEXT SESSION PROMPT — MCP Hardening + Tier-2 Scope Alignment (2026-03-30)

You are continuing work in `Herman-Adu/electrical-website` on Windows (VS Code).

## Operating mode

- Orchestrator-first, delegate substantive work to SME sub-agents.
- Do not claim commands/tests were run unless this session produced tool output.
- Use minimal, targeted edits only.

## Mandatory repo rules

Follow:

- `.github/copilot-instructions.md`
- `AGENTS.md`
- `CLAUDE.md`

Before any Next.js behavior changes:

1. `pnpm run status:next-docs`
2. Resolve local docs in order:
   - `node_modules/next/dist/docs/`
   - `node_modules/next/docs/`
   - `node_modules/next/README.md`

## Current confirmed state

- Next docs source resolves to `node_modules/next/README.md` only.
- Tier-2 is **not** part of default runtime in this repo.
- `docker/TIER2-USAGE.md` is retained as optional blueprint/reference.
- `docker/README.md` and `docker/SECRET-ROTATION.md` now explicitly treat Tier-2 as optional/provisioned-only.

## Immediate objective

Continue **Phase 4 CI MCP compatibility hardening** for:

- `.github/workflows/agent-audit.yml`
- `.github/workflows/skill-sync-check.yml`

Required outcomes:

1. Start Docker MCP stack in CI context.
2. Wait for container health.
3. Run MCP initialize + tool discovery checks.
4. Run one dry-run-safe smoke call for priority services:
   - github-official
   - memory
   - nextjs-devtools
   - openapi-schema
   - sequential-thinking
   - playwright
   - executor-playwright
5. Remove workflow drift (service names, assumptions, PM consistency).

## Execution sequence

1. Discovery (delegated)
2. Design (delegated + orchestrator synthesis)
3. Implementation (delegated)
4. Validation (delegated)
5. Memory sync (delegated only after verified success)

## Required preflight commands

Run and report output:

- `pnpm run status:next-docs`
- `git status --short`

## Validation gate for successful batches

- `pnpm install --frozen-lockfile`
- `pnpm build`
- `pnpm lint`

If a batch fails validation, do not memory-sync that batch.

## Response format for major updates

Start with a compact status table, then sections:

1. discovery
2. design
3. implementation
4. validation
5. memory-sync
