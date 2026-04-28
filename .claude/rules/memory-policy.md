# Docker Memory Policy

**Status:** Active — Authoritative | **Version:** 1.1

---

## Policy

Docker `memory-reference` MCP service is the **sole store** for all session context. Never write memory to `.md` files under any circumstance.

Permitted `.md` writes in `.claude/` only: pre-existing policy docs, skill/agent definitions, one-line fallback note in `CLAUDE.md ## Session State` (Docker down only).

> Full working examples: [DOCKER_MCP_QUICK_REFERENCE.md](../reference/DOCKER_MCP_QUICK_REFERENCE.md)

---

## Entity Types

| entityType | Purpose | Naming Pattern |
|------------|---------|---------------|
| `project_state` | Branch, build, phase, next tasks (one per project) | `{project}-state` |
| `feature` | Deliverable work unit with spec, impl, tests | `feat-{phase}-{kebab-name}` |
| `learning` | Technical pattern, gotcha, or insight | `learn-{topic}-{descriptor}` |
| `decision` | Architectural choice with rationale | `decide-{domain}-{choice}` |
| `infrastructure` | Docker services, MCP tools, CI/CD | `infra-{subsystem}-{descriptor}` |
| `session` | Handoff context between sessions | `session-{YYYY}-{MM}-{DD}-{seq}` |
| `plan` | Implementation roadmap with phases | `plan-{domain}-{goal}` |
| `task` | Atomic work item with status | `task-{area}-{descriptor}` |

---

## Naming Rules

- `kebab-case` only — lowercase, hyphens, no underscores or spaces
- Always include the type prefix (`feat-`, `learn-`, `decide-`, `infra-`, `session-`)
- Specific enough to find via partial search (avoid `learn-bug`, `feat-fix`)
- Search before creating to avoid duplicates

---

## Observation Categories

| Category | Required Fields |
|----------|----------------|
| `build` | `status`, `typescript_errors`, `build_duration_seconds` |
| `test` | `status`, `suites_passed`, `suites_failed` |
| `visual-regression` | `status`, `components_checked`, `diffs_found` |
| `learning` | `insight`, `context`, `references` |
| `performance` | `metric`, `before`, `after`, `improvement_percent` |
| `blocker` | `severity`, `title`, `description`, `workaround` |

Every observation must include `category` and `timestamp` (ISO8601).

---

## Session Lifecycle

**Phase 1 — Start (Rehydration, ~50 tokens):**
- `pnpm docker:mcp:memory:search "electrical-website-state"`
- `pnpm docker:mcp:memory:open electrical-website-state`
- Read `current_branch`, `active_phase`, `next_tasks`, `blockers`

**Phase 2 — Active Work:**
- Accumulate findings locally; do not spam Docker mid-work
- Run `pnpm typecheck && pnpm build && pnpm test` at logical checkpoints

**Phase 3 — Session End (Persistence):**
- Create session entity (`session-YYYY-MM-DD-seq`)
- `add_observations` to project state with branch, build status, next tasks
- Create `learning` and `decision` entities for anything discovered
- Wire relations between new entities and existing context

**Phase 4 — Interrupted (Timeout/Token limit):**
- Commit WIP: `git commit -m "WIP: [feature] — session interrupted"`
- Create session entity marked incomplete
- If Docker down: write fallback note to `CLAUDE.md ## Session State`

---

## Fallback Policy

Docker is down when: `search_nodes()` times out (5s), MCP returns 5xx, or network fails.

1. Write ONE note to `.claude/CLAUDE.md` under `## Session State`
2. Format: `YYYY-MM-DD HH:MM — [summary]. Next: [step]. Blocker: [if any].`
3. Continue working normally
4. Next session: load Docker if recovered, then delete the fallback note

The fallback is a breadcrumb, not a memory system. One to two lines maximum.

---

## Verification Checklist

- [ ] All work committed: `git status` shows clean working tree
- [ ] Build passing: `pnpm build` exits 0
- [ ] Tests passing: `pnpm test` exits 0
- [ ] Types passing: `pnpm typecheck` exits 0
- [ ] Session entity created (`session-YYYY-MM-DD-seq`) in Docker
- [ ] Project state updated via `add_observations`
- [ ] Learning and decision entities created for non-obvious patterns
- [ ] Relations wired (new entities linked to existing context)
- [ ] No memory `.md` files written during session
- [ ] Git pushed

---

**Last Updated:** 2026-04-28 | **Maintained by:** Orchestrator (Herman Adu / Claude Code)
