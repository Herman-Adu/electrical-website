# Orchestrator Contract

## Core Rules
1. Never implement code directly (>50 LOC → delegate to specialised agent)
2. Always delegate via `Agent(subagent_type="general-purpose")` → specialised sub-agents
3. Docker memory ONLY — never write session state or memory to .md or JSON files
4. Superpowers mandatory: TDD + extended thinking for all 2hr+ tasks and architecture decisions
5. Hard stop at 60% context — do not continue; sync Docker memory and wait for user
6. Read Docker memory first on session start before any work begins
7. Validate: `pnpm typecheck && pnpm build` must pass before any commit
8. React 19 + Next.js 16 first — use `useTransition`, `useOptimistic`, `useActionState`, `useFormStatus`, `use()`, PPR, ISR, Suspense, Error Boundaries; **never** `useEffect` when a React 19 alternative exists

## Delegation Rules

| Trigger | Agent |
|---------|-------|
| Architecture / multi-file changes | `architecture-sme` |
| Code implementation (>50 LOC) | `code-generation` via general-purpose agent |
| Security / auth / secrets | `security-sme` (always — no exceptions) |
| QA / Playwright testing | `qa-sme` |
| New features (2hr+) | `planning` agent first, then `code-generation` |
| Skill creation / audit | `skill-builder` |
| Memory capture | `knowledge-memory` |

Dispatch pattern: `Agent(subagent_type="general-purpose", prompt="...")` — never invoke specialised agents directly from main context for large tasks.

## MCP Stack — localhost:3100 (Docker Compose — always first)

| Tool namespace | Purpose | Never use instead |
|----------------|---------|-------------------|
| `mcp__MCP_DOCKER__github_official__*` | All GitHub ops (PRs, merges, checks) | `gh` CLI |
| `mcp__MCP_DOCKER__memory_reference__*` | Session state and project knowledge | .md files |
| `mcp__MCP_DOCKER__playwright__*` | Browser automation and verification | Manual browser |
| `mcp__MCP_DOCKER__sequential_thinking__*` | Complex multi-step reasoning | — |
| `mcp__MCP_DOCKER__nextjs_devtools__*` | Build and type checking | — |

Playwright: always set `PLAYWRIGHT_REUSE_SERVER=true` when dev server is running on port 3000.
Docker compose: `pnpm docker:mcp:ready` starts all services. Health check: `pnpm docker:mcp:smoke`.
Superpowers: brainstorm → plan (TDD) → execute → verify — mandatory for ALL code generation, planning, and architecture work.

## Memory Rules

Session start (always, in order):
1. `pnpm docker:mcp:memory:search "electrical-website-state"` → note entity IDs
2. `pnpm docker:mcp:memory:open electrical-website-state` → read current phase, next tasks, blockers
3. `git log --oneline -5 && git status` → confirm code state

Session end (always, before closing):
1. `add_observations` to project state entity — branch, build status, next tasks
2. `create_entities` — new session entity (`session-YYYY-MM-DD-seq`)
3. `create_relations` — link session → project state (`updates`)
4. Search before creating — never duplicate entities

Entity types: `project_state`, `feature` (feat-), `learning` (learn-), `decision` (decide-), `session` (session-), `infrastructure` (infra-).
Observations: arrays of strings — never objects. Every entity requires `entityType` field.

## Memory Lanes

Active lane: `config/active-memory-lanes.json` (`status` field — must be `active` to match current branch)
Lifecycle: PENDING → ACTIVE → PAUSED/COMPLETED → ARCHIVED → HARD_DELETED (automated via hooks)
Auto-managed: PostCheckout hook (activate/pause), Stop hook (sync session), PostCommit hook (observe)
Manual commands: `pnpm lane:activate` | `pnpm memory:sync` | `pnpm memory:status` | `pnpm memory:stale`
Token budget: ≤3,000 tokens at session start — enforced by `scripts/memory-rehydrate.mjs`

## Self-Check (before closing session)
- [ ] All work committed and pushed
- [ ] `pnpm typecheck && pnpm build` passing
- [ ] Docker memory synced (session entity created, project state updated)
- [ ] No .md files written for memory/state purposes
- [ ] Used `github_official__*` tools — not `gh` CLI
- [ ] Stopped at 60% context (if reached)

## Session State
[Docker-down fallback only — one line: YYYY-MM-DD — summary. Delete when Docker recovers.]
