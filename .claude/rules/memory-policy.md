# Docker Memory Policy

**Effective Date:** 2026-04-16
**Status:** Active — Authoritative
**Version:** 1.0
**Supersedes:** Informal file-based memory practice (.md files in any .claude/ subdirectory)

---

## Single Source of Truth

The Docker `memory-reference` MCP service is the **sole authoritative store** for all persistent session context in this project. Every orchestrator session must read from and write to this service, not to local `.md` files.

**UNIVERSAL PROHIBITION:**

NEVER create ANY .md file for memory, session state, staging, handoff, rehydration, or seeding purposes — regardless of filename, directory, or rationalization.

**Prohibited directories:**
- Any .claude/ subdirectory for memory or session-state .md files (examples: session-state, archives/session-context)
- Do not create subdirectories with names like session-state or archives/session-context
- Policy: Use Docker memory service exclusively for session state persistence

**Permitted .md writes in `.claude/` only:**
- Pre-existing policy documents (`rules/`, `security/`, `reference/`)
- Skill/agent definition files (`skills/`, `agents/`)
- One-line fallback note in CLAUDE.md `## Session State` (Docker down only)

**CRITICAL: If Docker entities do not exist yet, CREATE THEM IMMEDIATELY via `mcp__MCP_DOCKER__create_entities()`**  
**Never stage entity data in .md files "ready to seed later." This is the anti-pattern this policy forbids.**

**Why Docker over files:**

| Method | Tokens per query | Session rehydration time |
|--------|-----------------|--------------------------|
| `.md` file-based | ~5,000+ tokens | ~2 minutes |
| Docker entity graph | ~50 tokens | ~5 seconds |

Savings: 60–70% token reduction per session. This is non-negotiable.

**Guiding principle:** Memory informs decisions. Local code is source of truth for implementation details.

---

## Canonical Entity Types

Eight entity types are recognised in this project. Every entity must use one of these types — no ad-hoc types are permitted.

| Type | Purpose | Naming Pattern | Phase 5 Example |
|------|---------|---------------|-----------------|
| `project_state` | Current branch, build status, active phase, immediate next tasks | `{project}-state` (one per project) | `electrical-website-state` |
| `feature` | A unit of deliverable work with spec, implementation, and test coverage | `feat-{phase}-{kebab-name}` | `feat-phase-5-animation-optimization` |
| `learning` | A technical pattern, gotcha, or insight discovered during development | `learn-{topic}-{descriptor}` | `learn-hooks-conditional-effects` |
| `decision` | An architectural or strategic choice with full rationale preserved | `decide-{domain}-{choice}` | `decide-memory-docker-over-files` |
| `infrastructure` | Docker services, MCP tools, CI/CD pipelines, deployment config | `infra-{subsystem}-{descriptor}` | `infra-mcp-docker-services` |
| `session` | Handoff context enabling continuity between sessions | `session-{YYYY}-{MM}-{DD}-{seq}` | `session-2026-04-16-001` |
| `plan` | High-level implementation roadmap with phases, dependencies, and milestones | `plan-{domain}-{goal}` | `plan-phase-6-feature-roadmap` |
| `task` | Atomic work item with status, effort estimate, and completion tracking | `task-{area}-{descriptor}` | `task-animation-optimize-hero` |

### Naming Rules

All entity names must:

- Use `kebab-case` — lowercase, hyphens only, no spaces or underscores
- Include a type prefix (`feat-`, `learn-`, `decide-`, `infra-`, `session-`)
- Be specific enough to be found by partial search (avoid generic names like `learn-bug` or `feat-fix`)
- Be consistent — search before creating to avoid duplicates

**Valid examples:**

```
electrical-website-state
feat-phase-5-animation-optimization
learn-gpu-transform-compositing
decide-usespring-animation-standard
infra-mcp-docker-services
session-2026-04-16-001
```

**Invalid examples:**

```
ProjectState            ← not kebab-case
feature_phase5          ← uses underscore, not hyphen
learning                ← too generic, unsearchable
decision2               ← no domain prefix
```

---

## Observation Fields

Observations append findings to existing entities without creating new entities. Use `mcp__MCP_DOCKER__add_observations` to accumulate build status, blockers, learnings, and performance data over time.

### Observation Schema

Every observation must include `category` and `timestamp`. All other fields are category-specific.

```json
{
  "category": "build | test | visual-regression | learning | performance | blocker",
  "timestamp": "ISO8601 (e.g. 2026-04-16T18:45:00Z)"
}
```

### Category Definitions and Examples

**`build`** — Record after every `pnpm typecheck && pnpm build` run.

```json
{
  "category": "build",
  "timestamp": "2026-04-16T18:45:00Z",
  "status": "passing",
  "typescript_errors": 0,
  "lint_warnings": 0,
  "build_duration_seconds": 42,
  "environment": "local"
}
```

**`test`** — Record after every `pnpm test` run.

```json
{
  "category": "test",
  "timestamp": "2026-04-16T18:45:00Z",
  "status": "passing",
  "coverage_percent": 95,
  "suites_passed": 36,
  "suites_failed": 0
}
```

**`visual-regression`** — Record when visual/screenshot comparison is run.

```json
{
  "category": "visual-regression",
  "timestamp": "2026-04-16T18:45:00Z",
  "status": "passing",
  "components_checked": ["ServicesHero", "AboutHero", "ProjectCategoryHero"],
  "diffs_found": 0
}
```

**`learning`** — Record when a non-obvious pattern is discovered.

```json
{
  "category": "learning",
  "timestamp": "2026-04-16T18:45:00Z",
  "insight": "GPU transform compositing requires will-change: transform on the animated element, not the container",
  "context": "Discovered while optimising Phase 5 hero animations",
  "references": ["components/sections/ServicesHero.tsx"],
  "shareable": true
}
```

**`performance`** — Record when a measurable improvement is achieved.

```json
{
  "category": "performance",
  "timestamp": "2026-04-16T18:45:00Z",
  "metric": "animation-frame-rate",
  "before": "45fps",
  "after": "60fps",
  "improvement_percent": 33,
  "technique": "Replaced setInterval with useSpring for physics-based animation",
  "component": "ServicesHero"
}
```

**`blocker`** — Record when progress is stopped by an unresolved issue.

```json
{
  "category": "blocker",
  "timestamp": "2026-04-16T18:45:00Z",
  "severity": "high",
  "title": "SVG useId() produces mismatched IDs on server/client hydration",
  "description": "Hydration mismatch in hero SVG defs. Tracked in issue #147.",
  "affected_component": "ProjectCategoryHero",
  "workaround": "Using static ID with component-level uniqueness guarantee",
  "resolution_date": null
}
```

---

## Relations

Relations link entities to preserve architectural context and dependency order. All relations are created via `mcp__MCP_DOCKER__create_relations`.

| Type | Meaning | Typical Source → Target |
|------|---------|------------------------|
| `derives_from` | Source implements or is informed by target | `feature` → `decision` |
| `depends_on` | Source cannot complete without target being complete | `feature` → `feature` |
| `documents` | Source explains the rationale for target | `decision` → `feature` |
| `updates` | Source modifies state tracked in target | `session` → `project_state` |
| `supersedes` | Source replaces target; target is now deprecated | `learning` → `learning`, `decision` → `decision` |
| `related_to` | Soft conceptual link; not a dependency | `learning` → `learning` |

**Phase 5 relation examples:**

```
feat-phase-5-animation-optimization  derives_from  decide-usespring-animation-standard
feat-phase-5-animation-optimization  derives_from  decide-gpu-transform-standardization
learn-gpu-transform-compositing       related_to    learn-prefers-reduced-motion-handling
session-2026-04-16-001                updates       electrical-website-state
decide-usespring-animation-standard   supersedes    decide-setinterval-animation-approach
```

---

## Session Lifecycle

Every session follows four phases. Token costs are shown to enforce discipline.

### Phase 1: Session Start — Rehydration

**Goal:** Load prior context in under 5 seconds at ~50 tokens.

**Required steps (in order):**

1. Search for project state:
   ```
   mcp__MCP_DOCKER__search_nodes("electrical-website-state")
   ```
2. Load the returned entity:
   ```
   mcp__MCP_DOCKER__open_nodes([returned_entity_id])
   ```
3. Read `current_branch`, `active_phase`, `next_tasks`, `blockers` from entity
4. Run `git status && git log --oneline -5` to confirm code state
5. Check `.claude/CLAUDE.md` section `## Session State` for any fallback notes left from a prior Docker-down session — if notes exist, hydrate from them and then clear them once Docker is confirmed available

**Cost: ~50 tokens. Failure to rehydrate from Docker before starting work violates this policy.**

---

### Phase 2: Active Work

**Goal:** Execute work. Do not spam Docker with mid-work updates.

**Rules:**

- Work normally; accumulate observations in memory (notes, findings) but do not push to Docker until a checkpoint or session end
- Run `pnpm typecheck && pnpm build && pnpm test` after each logical checkpoint
- Track files modified, commits created, blockers encountered, and learnings discovered

**Checkpoints that trigger an interim Docker update (optional but recommended for long sessions):**

- After 2+ hours of uninterrupted work
- After a major blocker is discovered
- After a build failure and recovery

---

### Phase 3: Session End — Persistence

**Goal:** Persist context for next session. Target: ~200–300 tokens, ~3 minutes.

**Required steps (in order):**

1. Create session entity:
   ```
   mcp__MCP_DOCKER__create_entities([{
     "type": "session",
     "name": "session-2026-04-16-001",
     "properties": {
       "date": "2026-04-16",
       "start_time": "18:30:00Z",
       "end_time": "20:15:00Z",
       "work_completed": ["Refactored ServicesHero to use useCyclingText", "..."],
       "next_steps": ["Complete 9 remaining hero components", "..."],
       "blockers_identified": [],
       "build_status_at_end": "passing",
       "test_status_at_end": "passing"
     }
   }])
   ```

2. Update project state with session-end observation:
   ```
   mcp__MCP_DOCKER__add_observations(project_state_id, [{
     "category": "session_end",
     "timestamp": "2026-04-16T20:15:00Z",
     "branch": "main",
     "build_status": "passing",
     "active_phase": "Phase 5: Animation Optimization",
     "next_tasks": ["Complete remaining 9 hero components", "Lighthouse audit"]
   }])
   ```

3. Update active feature entity with build + learning observations
4. Create `learning` entities for any non-obvious patterns discovered
5. Create `decision` entities for any architectural choices made
6. Wire relations between new entities and existing context
7. Commit: `git add . && git commit -m "session-end: [summary]" && git push`

---

### Phase 4: Session Timeout — Interrupted Work

**When:** Token limit reached, user stops mid-task, or unexpected interruption.

**Required steps:**

1. Commit WIP immediately: `git commit -m "WIP: [feature] — session interrupted"`
2. Create session entity marked incomplete with blocker observation noting interruption point and next step
3. If Docker is available: push session entity and feature update now
4. If Docker is unavailable: write fallback note per [Fallback Policy](#fallback-policy)

---

## Fallback Policy

Docker is considered unavailable when any of the following occurs:

- `search_nodes()` times out after 5 seconds
- MCP server returns a 500-level error
- Network connection to service endpoint fails

**When Docker is unavailable:**

1. Write ONE note to `.claude/CLAUDE.md` under the `## Session State` section
2. Format: `YYYY-MM-DD HH:MM — [Work summary]. Next: [next step]. Blocker: [if any].`
3. Example:
   ```
   2026-04-16 20:15 — Phase 5: Completed ServicesHero, AboutHero refactoring (6 commits).
   Next: 9 remaining hero components. Blocker: none.
   ```
4. Continue working normally — do not stop work because Docker is down
5. At the next session start: attempt Docker connection, load from it if recovered, then delete the fallback note

**The fallback is a breadcrumb, not a memory system.** It must be:

- One to two lines maximum
- Deleted as soon as Docker is recovered
- Never used as an alternative to Docker for multi-session tracking

### What Does NOT Trigger the Fallback

The fallback is only for Docker service UNAVAILABILITY. These are NOT valid triggers:

- **"Docker entities don't exist yet"** → Create them NOW via `mcp__MCP_DOCKER__create_entities()`. Never defer.
- **"I want to stage data before seeding"** → Seed directly. Do not create staging .md files.
- **"I want a handoff prompt for next session"** → Provide it inline in the response. Do not create handoff .md files.
- **"I want to document the seeding process"** → Document in response text. Do not create documentation .md files.
- **"I want to save the execution commands"** → Do not save to .md. Construct them when needed or store in Docker observations.

These rationalizations are exactly the anti-pattern this policy forbids. If Docker is up (not timing out, not returning 500, not unreachable), use it. Do not create .md files as a substitute.

**The fallback is NOT:**

- A substitute for Docker memory
- A detailed session log
- A permanent record
- An excuse to create `.md` memory files

---

## Pruning and Cleanup

The entity graph must stay lean and searchable. These rules govern retention, archival, and consolidation.

### Retention Periods

| Entity Type | Keep Active | Archive After | Archive Location |
|-------------|------------|---------------|-----------------|
| `project_state` | Indefinite | Never (single entity; updated in place) | — |
| `feature` | Until PR merged + 30 days | 6 months after completion | archives/completed-features |
| `learning` | Indefinite | Never (always reusable) | — |
| `decision` | Indefinite | Only when superseded | Mark `superseded: true`; keep in graph |
| `infrastructure` | Indefinite | Only when decommissioned | — |
| `session` | 30 days | 90 days total | archives/sessions |

### Pruning Schedule

**Weekly (every Monday):**
- Search for `session` entities older than 90 days
- Mark `archived: true` in Docker; create monthly summary entity if applicable

**Quarterly (end of quarter):**
- Search for `feature` entities with `status: completed` older than 6 months
- Create a `feature-archive-{period}` consolidation entity listing accomplishments and learnings
- Mark individual feature entities `archived: true`

**On demand (as needed):**
- Merge duplicate entities that represent the same concept using the `supersedes` relation
- Consolidate fine-grained learnings into broader categories (example: `learn-hooks-conditional-effects` + `learn-hooks-cleanup-order` → `learn-hooks-lifecycle-rules`)
- Remove relations that no longer reflect current architecture

### Consolidation Rule

Before creating a new entity, always search for an existing one:

```
mcp__MCP_DOCKER__search_nodes("learn-hooks")
```

If a close match exists, add an observation to the existing entity rather than creating a new one.

---

## Naming Conventions

### Universal Rules

All entity names must be:
- `kebab-case` only — lowercase, hyphens, no underscores or spaces
- Prefixed by type (`feat-`, `learn-`, `decide-`, `infra-`, `session-`)
- Specific enough to return useful results from a partial-name search
- Consistent — search before creating to avoid duplicates

### Type-Specific Patterns

| Type | Pattern | Format Notes |
|------|---------|-------------|
| `project_state` | `{project}-state` | One per project; do not date-stamp |
| `feature` | `feat-{phase}-{kebab-name}` | Use phase number: `feat-phase-5-…` |
| `learning` | `learn-{topic}-{descriptor}` | Topic = technology area (hooks, gpu, svg) |
| `decision` | `decide-{domain}-{choice-descriptor}` | Domain = area of impact (memory, animation, auth) |
| `infrastructure` | `infra-{subsystem}-{descriptor}` | Subsystem = functional area (mcp, ci, vercel) |
| `session` | `session-{YYYY}-{MM}-{DD}-{seq}` | Sequence `001`–`999` within a day |

### Date-Stamped Decisions

When multiple decisions exist in the same domain, disambiguate with a date suffix:

```
decide-animation-standard-2026-q1
decide-animation-standard-2026-q2   ← supersedes the Q1 entity
```

---

## Example Workflow

This example uses real Phase 5 entities from the `electrical-website` project to illustrate a complete session.

### Initial State (Session Start)

```
search_nodes("electrical-website-state")
→ entity_id: "state-abc123"

open_nodes(["state-abc123"])
→ {
    "current_branch": "main",
    "active_phase": "Phase 5: Animation Optimization",
    "next_tasks": [
      "Refactor remaining 9 hero components to use useCyclingText",
      "Run Lighthouse audit post-refactor"
    ],
    "blockers": [],
    "build_status": "passing"
  }
```

Orchestrator reads this and knows: branch is `main`, Phase 5 is in progress, 9 components remain, no blockers.

### Mid-Session (Active Work)

After refactoring `ServicesHero`, `AboutHero`, and `ProjectCategoryHero`:

- Three commits created (PR #84: `feat-phase-4b-hero-refactoring`)
- Phase 5 feature entity `feat-phase-5-animation-optimization` updated: `files_affected: 36`, `lines_added: 412`
- Learning discovered: `learn-svg-useid-hydration-safety` (SVG `useId()` prevents server/client ID mismatch)
- Decision confirmed: `decide-gpu-transform-standardization` (all animated elements use `will-change: transform`)

No Docker updates yet — these are held for session end.

### End State (Session End)

```
# 1. Create session entity
create_entities([{
  "type": "session",
  "name": "session-2026-04-16-001",
  "properties": {
    "date": "2026-04-16",
    "active_phase": "Phase 5: Animation Optimization",
    "work_completed": [
      "ServicesHero refactored to useCyclingText",
      "AboutHero refactored to useCyclingText",
      "ProjectCategoryHero refactored to useCyclingText"
    ],
    "files_modified": 36,
    "commits_created": 6,
    "prs_merged": 1,
    "next_steps": ["Refactor remaining 9 hero components"],
    "build_status_at_end": "passing",
    "test_status_at_end": "passing",
    "coverage_percent": 95
  }
}])

# 2. Update project state
add_observations("state-abc123", [{
  "category": "session_end",
  "timestamp": "2026-04-16T20:15:00Z",
  "branch": "main",
  "build_status": "passing",
  "active_phase": "Phase 5: Animation Optimization",
  "next_tasks": ["9 remaining hero components", "Lighthouse audit"]
}])

# 3. Create learning entity
create_entities([{
  "type": "learning",
  "name": "learn-svg-useid-hydration-safety",
  "properties": {
    "title": "SVG useId() prevents server/client hydration ID mismatch",
    "category": "React / Next.js",
    "summary": "Using React useId() for SVG def IDs eliminates hydration warnings on SSR components",
    "source_feature": "feat-phase-5-animation-optimization",
    "discovery_date": "2026-04-16",
    "confidence": "high"
  }
}])

# 4. Wire relation
create_relations([{
  "type": "derives_from",
  "source": "feat-phase-5-animation-optimization",
  "target": "decide-gpu-transform-standardization",
  "reason": "Feature implements GPU transform standard across all hero components"
}])
```

**Result:** Next session starts with a fully loaded context in ~5 seconds and ~50 tokens. No `.md` files written.

---

## MCP Tool Reference

All memory operations use the `mcp__MCP_DOCKER__` tool namespace. These are the only tools that may be used for session memory operations.

| Tool | When to Use | Cost |
|------|------------|------|
| `mcp__MCP_DOCKER__search_nodes` | Find entities by name prefix or property | ~10–20 tokens |
| `mcp__MCP_DOCKER__open_nodes` | Load entity content by ID | ~20–30 tokens |
| `mcp__MCP_DOCKER__create_entities` | Create new entity (feature, learning, decision, session) | ~50–100 tokens |
| `mcp__MCP_DOCKER__add_observations` | Append observation to existing entity | ~30–50 tokens |
| `mcp__MCP_DOCKER__create_relations` | Link two entities with a typed relation | ~20–30 tokens |
| `mcp__MCP_DOCKER__delete_entities` | Remove archived or duplicate entities | ~10 tokens |
| `mcp__MCP_DOCKER__delete_relations` | Remove stale or incorrect relations | ~10 tokens |

**Canonical sequence for session start:**

```
search_nodes("electrical-website-state")
→ open_nodes([id])
```

**Canonical sequence for session end:**

```
create_entities([session])
→ add_observations(project_state_id, [session_end])
→ add_observations(feature_id, [build, learning])
→ create_entities([learning entities])
→ create_relations([new links])
```

For full schema definitions, query patterns, and troubleshooting, see:

- This file (`.claude/rules/memory-policy.md`) — Complete policy and implementation guide
- `.claude/reference/MEMORY_QUICK_REFERENCE.md` — fast lookup card
- `.claude/reference/ENTITY_SCHEMA_REFERENCE.md` — JSON schema per entity type
- `.claude/reference/setup/DOCKER_MEMORY_SETUP.md` — service setup and health checks
- `.claude/CLAUDE.md` section `## Memory System — Docker First` — orchestrator contract

---

## Verification Checklist

Use at session close to confirm memory hygiene before committing.

### Session Close Confirmation

- [ ] All work committed: `git status` shows clean working tree
- [ ] Build passing: `pnpm build` exits 0
- [ ] Tests passing: `pnpm test` exits 0
- [ ] Types passing: `pnpm typecheck` exits 0
- [ ] Docker health confirmed: `curl http://localhost:3100/health` returns `200`
- [ ] Session entity created: `session-{YYYY}-{MM}-{DD}-{seq}` exists in Docker
- [ ] Project state updated: `add_observations(state-id, [session_end])` confirmed
- [ ] Active feature updated: build + learning observations added
- [ ] Learning entities created for any non-obvious patterns discovered
- [ ] Decisions recorded for any architectural choices made
- [ ] Relations wired: new entities linked to existing context
- [ ] No memory .md files written to any `.claude/` subdirectory during this session
- [ ] Fallback note in .claude/CLAUDE.md (## Session State section): present only if Docker was down; deleted if Docker recovered
- [ ] Git pushed: `git push` confirmed

### Policy Compliance Check

- [ ] All entity names use `kebab-case` with correct type prefix
- [ ] No entity created with an ad-hoc type (only the six canonical types used)
- [ ] `search_nodes()` was called before `create_entities()` to prevent duplicates
- [ ] Observations use only the six defined categories (`build`, `test`, `visual-regression`, `learning`, `performance`, `blocker`)
- [ ] Relations use only the six defined types (`derives_from`, `depends_on`, `documents`, `updates`, `supersedes`, `related_to`)

---

**Last Updated:** 2026-04-16
**Status:** Active — Authoritative
**Maintained by:** Orchestrator (Herman Adu / Claude Code)
**Related documents:** `.claude/CLAUDE.md` Memory System section