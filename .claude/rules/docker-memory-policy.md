# Docker Memory Policy (Superseded)

> **⚠️ SUPERSEDED by `.claude/rules/memory-policy.md` (2026-04-16)**  
> This document is archived for reference only. The authoritative policy is in `memory-policy.md`.

**Effective Date:** 2026-04-16  
**Status:** Superseded (reference only)  
**Version:** 1.0

## Overview

This project uses **Docker `memory-reference` MCP service** as the single source of truth for persistent context across sessions. This policy defines how entities are created, named, linked, and maintained.

**Why Docker over files:**
- File-based `.md` memory: ~5,000+ tokens per query
- Docker entity graph: ~50 tokens per query
- Savings: 60–70% reduction in context load costs
- Speed: Session rehydration in ~5 seconds instead of ~2 minutes

**Core principle:** Memory informs decisions; local code is source of truth for implementation details.

---

## Part 1: Entity Types & Naming Conventions

All entities are created via `mcp__MCP_DOCKER__create_entities` with a `type` field. Each type has a standardized purpose, naming pattern, and schema.

### Entity Type: `project_state`

**Purpose:** Current snapshot of project branch, build health, active phase, and immediate next steps.

**Naming Pattern:** `electrical-website-state` (one per project)

**Fields:**

```yaml
type: project_state
name: electrical-website-state
properties:
  project_name: "electrical-website"
  current_branch: "main"  # or feature branch
  build_status: "passing"  # or "failing", "pending", "degraded"
  last_build_time: "2026-04-16T14:30:00Z"
  active_phase: "Phase 5: Animation Optimization"  # or null
  next_tasks: ["Complete hero refactoring", "Test scroll triggers"]
  blockers: []  # Tasks/issues stopping progress
  last_updated: "2026-04-16T18:45:00Z"
  session_count: 42  # How many sessions have touched this
```

**Usage:**
- Load at session start via `search_nodes("electrical-website-state")`
- Update at session end when branch/phase/priorities change
- Single source of truth for "what was I working on?"

**Refresh Interval:** Every session end, or when phase changes

**Example Query:**
```
search_nodes("electrical-website-state")
→ Returns entity ID
open_nodes([entity_id])
→ Returns current branch, build status, active phase
```

---

### Entity Type: `feature`

**Purpose:** Track completed or in-progress feature work (a deliverable with spec, implementation, tests).

**Naming Pattern:** `{type}-{phase}-{feature-name}`  
Examples:
- `feat-phase-4b-hero-refactoring`
- `feat-phase-5-scroll-animation-optimization`
- `feat-2026-q2-dark-mode-support`

**Fields:**

```yaml
type: feature
name: feat-phase-5-scroll-animation-optimization
properties:
  title: "Phase 5: Animation Optimization via useCyclingText"
  description: "Refactor hero sections to use useCyclingText hook for DRY animation"
  phase: "Phase 5"
  status: "in-progress"  # or "completed", "paused", "blocked", "planned"
  
  # Scope
  components_touched: ["ServicesHero", "AboutHero", "ProjectCategoryHero"]
  files_affected: 3
  lines_added: 250
  
  # Timeline
  start_date: "2026-04-10"
  estimated_end: "2026-04-20"
  actual_end: null
  
  # Quality metrics
  test_coverage: 0.85
  build_passing: true
  lighthouse_score: 92
  
  # Learnings & blockers
  blockers: []
  learnings: ["Custom hook pattern reduces code by 40%", "CSS timing critical for smoothness"]
  
  # Links to other entities
  depends_on: []  # Feature IDs this depends on
  pr_number: 84
  commit_hash: "c1c8a6d"
  
  last_updated: "2026-04-16T18:45:00Z"
```

**Usage:**
- Create when starting a feature
- Update regularly (weekly or at checkpoints)
- Link to `decision` and `learning` entities
- Close when PR merged

**Example Query:**
```
search_nodes("feat-phase")  # Find all phase features
→ ["feat-phase-4b-hero-refactoring", "feat-phase-5-scroll-animation-optimization"]
search_nodes("status:blocked")  # Find blocked features
→ ["feat-...", "feat-..."]
```

---

### Entity Type: `learning`

**Purpose:** Capture technical patterns, gotchas, and insights discovered during development.

**Naming Pattern:** `learn-{concept}-{brief-descriptor}`  
Examples:
- `learn-hooks-conditional-effects-timing`
- `learn-scroll-trigger-browser-compatibility`
- `learn-server-actions-error-boundary-scope`

**Fields:**

```yaml
type: learning
name: learn-hooks-conditional-effects-timing
properties:
  title: "useEffect Hook Rules: Conditional Effects & Timing"
  category: "React Hooks"  # or "Next.js", "Performance", "TypeScript", "Testing"
  
  # The insight
  summary: "useEffect cleanup must run before next effect; rely on dependency array, not hook calls inside conditions"
  detailed_explanation: |
    Discovered when refactoring scroll-trigger hooks.
    Conditional hook calls (e.g., if (isMobile) { useEffect(...) }) violate React rules.
    Solution: Move condition inside effect, always call hook.
    
  # Evidence & examples
  source_feature: "feat-phase-5-scroll-animation-optimization"
  example_code_file: "lib/hooks/use-scroll-trigger.ts"
  example_code_lines: "45-67"
  
  # Impact
  applies_to: ["all custom hooks", "useCallback optimization"]
  prevents_bugs: ["conditional render crashes", "state sync issues"]
  
  # Metadata
  discovery_date: "2026-04-12"
  confidence: "high"  # or "medium", "low"
  shared_with_team: true
  
  last_updated: "2026-04-16T10:00:00Z"
```

**Usage:**
- Create when discovering a non-obvious pattern
- Reference in future feature planning
- Search by category to find related learnings
- Share via `shared_with_team` flag for team learning

**Example Query:**
```
search_nodes("learn-hooks")  # All hook-related learnings
→ ["learn-hooks-conditional-effects-timing", "learn-hooks-cleanup-order"]
search_nodes("learn-performance")  # Performance optimizations
→ ["learn-...", "learn-..."]
```

---

### Entity Type: `decision`

**Purpose:** Record architectural and strategic choices with rationale (explains "why").

**Naming Pattern:** `decide-{domain}-{choice-descriptor}`  
Examples:
- `decide-memory-docker-over-files`
- `decide-animation-gsap-vs-framer-motion`
- `decide-auth-nextauth-vs-auth0`

**Fields:**

```yaml
type: decision
name: decide-memory-docker-over-files
properties:
  title: "Migrate Project Memory from .md Files to Docker MCP Service"
  domain: "Infrastructure & Context Management"
  
  # The decision
  choice: "Use Docker memory-reference MCP service instead of .claude/memory/*.md files"
  
  # Rationale
  context: "Session startup was slow (~2 min) due to large .md files. Token cost was 5,000+ per query."
  alternatives:
    - option: "Keep .md files"
      pros: ["Simple", "Git-tracked"]
      cons: ["Slow queries", "High token cost", "Hard to search"]
      cost_tokens: 5000
    - option: "Use Docker graph database"
      pros: ["Fast queries", "Low token cost (~50)", "Rich relations", "Searchable"]
      cons: ["New infrastructure", "Learning curve"]
      cost_tokens: 50
  
  decision_made: "Docker graph database"
  rationale: "60–70% token savings, faster session startup, better searchability."
  
  # Impact
  affects_systems: ["Session startup", "Context loading", "Memory persistence"]
  migration_date: "2026-04-16"
  migration_status: "in-progress"  # or "completed"
  
  # Trade-offs
  trade_off_1:
    name: "Fallback complexity"
    description: "If Docker unavailable, must write session notes to CLAUDE.md"
    mitigation: "Fallback documented in docker-memory-policy.md"
  
  related_decisions: []  # Other decision IDs
  
  last_updated: "2026-04-16T18:45:00Z"
```

**Usage:**
- Create when making non-trivial architectural choices
- Record before implementation to document intent
- Link to features that depend on the decision
- Use for team onboarding and design docs

**Example Query:**
```
search_nodes("decide-memory")  # All memory-related decisions
→ ["decide-memory-docker-over-files"]
search_nodes("domain:animation")  # All animation decisions
→ ["decide-animation-gsap-vs-framer-motion", "decide-animation-..."]
```

---

### Entity Type: `infrastructure`

**Purpose:** Track Docker services, MCP tools, CI/CD pipelines, and deployment infrastructure.

**Naming Pattern:** `infra-{subsystem}-{descriptor}`  
Examples:
- `infra-mcp-docker-services`
- `infra-github-workflows-ci-cd`
- `infra-vercel-deployment-staging`

**Fields:**

```yaml
type: infrastructure
name: infra-mcp-docker-services
properties:
  title: "Docker MCP Service Infrastructure"
  subsystem: "Memory & Context Management"
  
  # Service details
  services:
    - name: "memory-reference"
      endpoint: "http://localhost:7777/docker-memory"  # or remote endpoint
      status: "operational"  # or "degraded", "down", "provisioning"
      last_health_check: "2026-04-16T18:45:00Z"
      schema: "entity graph (nodes, edges, properties)"
      
  # Dependencies
  requires:
    - "Docker daemon running"
    - "MCP server listening on port 7777"
    - "Network access to localhost"
  
  # Monitoring
  alerts:
    - condition: "Service unreachable"
      action: "Fall back to .claude/CLAUDE.md session state section"
      severity: "high"
  
  # Documentation
  docs_url: ".claude/rules/docker-memory-policy.md"
  setup_instructions: ".claude/reference/setup/DOCKER_MEMORY_SETUP.md"
  
  last_updated: "2026-04-16T18:45:00Z"
```

**Usage:**
- Track critical infrastructure components
- Monitor health and uptime
- Document fallback procedures
- Reference in incident reports

---

### Entity Type: `session`

**Purpose:** Handoff context between sessions (what was I doing? where did I stop?).

**Naming Pattern:** `session-{YYYY}-{MM}-{DD}-{sequence}`  
Examples:
- `session-2026-04-16-001` (first session of the day)
- `session-2026-04-16-002` (second session)
- `session-2026-04-17-001` (next day)

**Fields:**

```yaml
type: session
name: session-2026-04-16-001
properties:
  date: "2026-04-16"
  start_time: "18:30:00Z"
  end_time: "20:15:00Z"
  duration_minutes: 105
  
  # Context at session start
  branch: "main"
  active_phase: "Phase 5: Animation Optimization"
  
  # What was accomplished
  work_completed:
    - "Refactored ServicesHero to use useCyclingText"
    - "Updated CLAUDE.md with orchestrator contract"
    - "Created Docker memory policy design"
  
  files_modified: 8
  commits_created: 2
  prs_opened: 0
  prs_merged: 1
  
  # What to do next
  next_steps: ["Complete ProjectCategoryHero refactoring", "Run full test suite"]
  blockers_identified: []
  
  # Session metadata
  agent_used: ["Haiku (planning)", "Haiku (knowledge-memory)"]
  memory_operations:
    - operation: "search_nodes"
      count: 3
      cost_tokens: 150
    - operation: "create_entities"
      count: 2
      cost_tokens: 200
  
  total_tokens_used: 45000
  context_efficiency: "70%"  # How much of loaded context was actually used
  
  # Quality metrics
  build_status_at_end: "passing"
  test_status_at_end: "passing"
  type_check_status_at_end: "passing"
  
  # Learnings from this session
  session_learnings:
    - "Docker memory policy design complete — ready for implementation"
    - "Memory operations are now isolated from main CLAUDE.md"
  
  next_session_suggested_branch: "main"
  last_updated: "2026-04-16T20:15:00Z"
```

**Usage:**
- Create at session end
- Load at session start to understand prior context
- Reference for handoff between team members
- Track efficiency metrics (token cost, file changes, quality)

---

## Part 2: Observation Schema

Observations accumulate findings, blockers, and quality metrics over time without creating new entities. They attach to existing entities (features, decisions, infrastructure).

### Observation Categories

#### Build & Quality Observations

```yaml
category: "build"
timestamp: "2026-04-16T18:45:00Z"
status: "passing"  # or "failing", "degraded", "pending"
details:
  typescript_errors: 0
  lint_warnings: 3
  test_coverage: 0.85
  lighthouse: 92
  build_duration_seconds: 45
environment: "CI/CD (GitHub Actions)"
```

#### Blocker Observations

```yaml
category: "blocker"
timestamp: "2026-04-16T18:45:00Z"
severity: "high"  # or "medium", "low"
title: "Scroll trigger not firing on mobile"
description: "useScrollTrigger hook not detecting viewport changes on iOS Safari"
affected_component: "ServicesHero"
workaround: "Temporarily disabled on mobile; filed issue #142"
resolution_date: null  # Set when resolved
```

#### Performance Observations

```yaml
category: "performance"
timestamp: "2026-04-16T18:45:00Z"
metric: "Largest Contentful Paint"
before: "2.8s"
after: "1.2s"
improvement_percent: 57
technique_used: "Image optimization + lazy loading"
component: "ProjectCardShell"
```

#### Learnings & Insights

```yaml
category: "learning"
timestamp: "2026-04-16T18:45:00Z"
insight: "Custom hook pattern reduces code duplication by 40%"
context: "Refactored 3 hero components to use useCyclingText"
references: ["lib/hooks/use-cycling-text.ts", "components/ServicesHero"]
shareable: true  # Worth sharing with team
```

#### Regression Observations

```yaml
category: "regression"
timestamp: "2026-04-16T18:45:00Z"
severity: "high"
detected_in_feature: "feat-phase-5-scroll-animation-optimization"
issue: "Form submission broken after server action refactor"
root_cause: "Missing Zod schema validation on field names"
fixed: true
fix_commit: "abc1234"
test_added: true  # Prevent recurrence
```

### Adding Observations

Use `mcp__MCP_DOCKER__add_observations` to append to entities:

```
add_observations(
  entity_id="feat-phase-5-scroll-animation-optimization",
  observations=[
    {
      category: "build",
      status: "passing",
      timestamp: "2026-04-16T18:45:00Z",
      details: { ... }
    },
    {
      category: "learning",
      insight: "...",
      timestamp: "2026-04-16T18:45:00Z"
    }
  ]
)
```

---

## Part 3: Relation Types

Relations link entities to build a dependency graph and preserve architectural context.

### Relation Type: `derives_from`

Links a feature or learning to a prior decision or architecture.

```yaml
type: derives_from
source: "feat-phase-5-scroll-animation-optimization"
target: "decide-animation-gsap-vs-framer-motion"
reason: "Feature implements decision to use GSAP for scroll triggers"
```

### Relation Type: `depends_on`

One entity depends on another being complete.

```yaml
type: depends_on
source: "feat-phase-5-scroll-animation-optimization"
target: "feat-phase-4b-hero-refactoring"
reason: "Hero refactoring must be complete before scroll optimization"
blocking: true  # If true, blocks completion of source
```

### Relation Type: `documents`

A decision or learning documents architectural intent for a feature.

```yaml
type: documents
source: "decide-memory-docker-over-files"
target: "feat-docker-memory-implementation"
reason: "Decision defines architecture for feature implementation"
```

### Relation Type: `updates`

A feature or observation updates the state of a prior entity.

```yaml
type: updates
source: "session-2026-04-16-001"
target: "project_state"
reason: "Session updated build status, branch, and next tasks"
```

### Relation Type: `supersedes`

A newer decision or learning replaces a prior one.

```yaml
type: supersedes
source: "decide-animation-framer-motion-v7"
target: "decide-animation-framer-motion-v6"
reason: "v7 API changed; v6 pattern no longer applies"
deprecation_date: "2026-04-15"
```

### Relation Type: `related_to`

Soft link between conceptually related entities (not strict dependency).

```yaml
type: related_to
source: "learn-hooks-conditional-effects-timing"
target: "learn-hooks-cleanup-order"
reason: "Both relate to React hook lifecycle and timing"
```

### Creating Relations

Use `mcp__MCP_DOCKER__create_relations`:

```
create_relations([
  {
    type: "depends_on",
    source: "feat-A-id",
    target: "feat-B-id",
    reason: "Feature A needs B complete first",
    blocking: true
  }
])
```

---

## Part 4: Session Lifecycle Workflow

Every session follows this lifecycle to maintain context and update Docker memory.

### Phase 1: Session Start (Preflight)

**Goal:** Load prior context and understand what was in progress.

**Steps:**

1. **Search for project state:**
   ```
   mcp__MCP_DOCKER__search_nodes("electrical-website-state")
   → Returns entity ID (e.g., "state-xyz")
   ```

2. **Load project state:**
   ```
   mcp__MCP_DOCKER__open_nodes(["state-xyz"])
   → Returns current_branch, active_phase, next_tasks, blockers, last_updated
   ```

3. **Check git status:**
   ```bash
   git status
   git log --oneline -5
   ```

4. **Load CLAUDE.md:**
   - Read `.claude/CLAUDE.md` for orchestrator contract
   - Check .claude/CLAUDE.md (## Session State section) fallback section (if Docker was down)

5. **Determine work focus:**
   - If session state indicates active feature: load that feature entity
   - If session state indicates blockers: assess and plan unblocking
   - If session state is null: ask user for clarification on work intent

**Cost:** ~50 tokens for Docker queries (vs ~5,000 for .md files)  
**Duration:** ~5 seconds

---

### Phase 2: Active Work (Session)

**Goal:** Execute work; accumulate findings in Docker memory.

**Steps:**

1. **Work on features/fixes** per execution plan
2. **After each checkpoint (1–2 hours):**
   - Run `pnpm typecheck && pnpm build && pnpm test`
   - Create build observation (passing/failing)
   - Note any blockers or learnings
   - **Do NOT update Docker memory yet** (batch at session end)

3. **Track what you're working on:**
   - Files modified
   - Commits created
   - Blockers encountered
   - Learnings/patterns discovered

---

### Phase 3: Session End (Sync)

**Goal:** Persist session context to Docker memory for next session reuse.

**Steps:**

1. **Create session entity:**
   ```
   create_entities([{
     type: "session",
     name: "session-2026-04-16-001",
     properties: {
       date: "2026-04-16",
       start_time: "18:30:00Z",
       end_time: "20:15:00Z",
       work_completed: [...],
       next_steps: [...],
       blockers_identified: [...]
     }
   }])
   ```

2. **Update project state:**
   ```
   add_observations(
     entity_id="state-xyz",
     observations=[{
       category: "session_end",
       timestamp: "2026-04-16T20:15:00Z",
       branch: "main",
       build_status: "passing",
       active_phase: "Phase 5",
       next_tasks: [...]
     }]
   )
   ```

3. **Update feature entity** (if working on one):
   ```
   add_observations(
     entity_id="feat-phase-5-...",
     observations=[
       {
         category: "build",
         status: "passing",
         timestamp: "2026-04-16T20:15:00Z"
       },
       {
         category: "learning",
         insight: "...",
         timestamp: "2026-04-16T20:15:00Z"
       }
     ]
   )
   ```

4. **Create learnings** (if discovered):
   ```
   create_entities([{
     type: "learning",
     name: "learn-scroll-trigger-ios-compatibility",
     properties: { ... }
   }])
   ```

5. **Create relations** (link features to decisions/learnings):
   ```
   create_relations([
     {
       type: "documents",
       source: "decide-animation-gsap-vs-framer-motion",
       target: "feat-phase-5-...",
       reason: "Decision defines architecture for feature"
     }
   ])
   ```

6. **Update CLAUDE.md** (if Docker unavailable):
   - **Only if Docker service is down**
   - Add one-line note to .claude/CLAUDE.md (## Session State section) section
   - Example: `2026-04-16 20:15 — Phase 5 animation work complete. Next: scroll testing.`

7. **Commit and push:**
   ```bash
   git add .
   git commit -m "session-end: Phase 5 progress synced"
   git push
   ```

**Cost:** ~200–300 tokens (multiple create/update operations)  
**Duration:** ~2–3 minutes

---

### Phase 4: Session Timeout (Incomplete Work)

**If work is interrupted** (e.g., token limit, user stops mid-task):

1. **Save partial progress** (even if uncommitted):
   - Commit WIP branch: `git commit -m "WIP: [feature]"`
   - Create session entity (mark as `incomplete`)
   - Add blockers observation (reason for interruption)

2. **Document unfinished work:**
   ```
   add_observations(
     entity_id="feat-phase-5-...",
     observations=[{
       category: "blocker",
       severity: "medium",
       title: "Session interrupted",
       description: "Work paused at [file/function]. Resume by [next step]",
       resolution_date: null
     }]
   )
   ```

3. **Fall back to CLAUDE.md** (if Docker still unavailable):
   ```
   # Session State (Fallback)
   2026-04-16 19:30 — Session interrupted. Working on Phase 5 scroll triggers.
   Last file: components/ScrollTrigger.tsx (line 45)
   Next: Complete mobile compatibility checks
   Blocker: iOS Safari scroll event timing issue
   ```

---

## Part 5: Fallback Policy (Docker Unavailable)

If Docker memory service is **unreachable or degraded**, follow this fallback procedure:

### Fallback Trigger

Docker is considered unavailable if:
- Service endpoint times out (>5 seconds)
- Service returns 500+ error
- Network unreachable
- MCP server not responding

### Fallback Actions

1. **Log session notes to CLAUDE.md:**
   - Open `.claude/CLAUDE.md`
   - Add a single one-line or two-line note under `## Session State` section
   - Format: `YYYY-MM-DD HH:MM — [Work summary]. Next: [next step]. Blocker: [if applicable]`
   - Example:
     ```markdown
     ## Session State (Fallback)
     
     2026-04-16 20:15 — Completed Phase 5 hero refactoring.
     Next: Test scroll animations. Blocker: iOS Safari compatibility.
     ```

2. **Continue work normally:**
   - Don't block on Docker unavailability
   - Implement features as planned
   - Run `pnpm build && pnpm test` normally

3. **At next session start:**
   - Try Docker again (may be recovered)
   - If recovered: load from Docker, delete fallback notes
   - If still down: continue with .md fallback, append new notes

### Why Minimal Fallback

**Why only 1–2 lines?**
- File-based memory defeats the purpose (high token cost)
- Fallback should be minimal (temporary, not permanent)
- Next session can recreate context from Git history + code inspection
- Docker should be back online within a session or two

**Fallback is NOT:**
- A permanent alternative to Docker
- A detailed log of all work
- A replacement for Git commits

**Fallback IS:**
- A breadcrumb for next session ("here's what I was doing")
- A way to avoid losing 1–2 hours of context
- Temporary (ideally deleted within 24 hours when Docker recovers)

---

## Part 6: Pruning Rules (Keep Graph Lean)

The entity graph grows over time. These rules keep it searchable and efficient.

### Retention Policy

| Entity Type | Retention | Archive Rule |
|-------------|-----------|--------------|
| `project_state` | Indefinite | Single entity; overwrite with observations |
| `feature` | 6 months after completion | Move to `archives/completed-features/` |
| `learning` | Indefinite | Keep; highly reusable |
| `decision` | Indefinite | Keep; architectural reference |
| `infrastructure` | Indefinite | Keep; operational reference |
| `session` | 30 days (active work) | 90 days (audit trail) | Archive old sessions to `.claude/archives/sessions/` |

### Pruning Schedule

**Weekly (Every Monday):**
- Search for `session` entities older than 90 days
- Move to `.claude/archives/sessions/`
- Keep in Docker but mark `archived: true`

**Quarterly (End of quarter):**
- Search for `feature` entities with `status: completed` older than 6 months
- Create `feature-archive-[date]` entity summarizing learnings
- Move to `.claude/archives/completed-features/`

**Manual (As needed):**
- Merge duplicate entities (same concept, different names)
- Consolidate related learnings (e.g., "hook-timing" + "hook-effects" → "hook-lifecycle")
- Remove obsolete decisions (marked `superseded`)

### Merging Entities

If two entities represent the same concept, merge them:

```
Before:
  - learn-scroll-trigger-ios-bug
  - learn-scroll-trigger-mobile-compat

After:
  - learn-scroll-trigger-mobile-compatibility (consolidates both)
  - Create relation: supersedes("learn-scroll-trigger-mobile-compatibility", "learn-scroll-trigger-ios-bug")
```

### Archival Format

When archiving a session, create a summary entity:

```yaml
type: session_archive
name: session-archive-2026-03-01-to-2026-03-31
properties:
  period: "2026-03-01 to 2026-03-31"
  session_count: 12
  key_accomplishments:
    - "Refactored component library"
    - "Implemented dark mode"
  learnings_discovered: 8
  features_completed: 3
  blockers_unresolved: 1
  summary_url: ".claude/archives/sessions/2026-03-monthly-summary.md"
```

---

## Part 7: Searchability & Query Patterns

Entity graphs are searchable via properties, relations, and observations.

### Common Search Patterns

**Find current active work:**
```
search_nodes("project_state")
→ Load latest project_state, read next_tasks
```

**Find all Phase 5 work:**
```
search_nodes("phase:5")  # or "phase-5"
→ ["feat-phase-5-scroll-animation", "feat-phase-5-performance-optimization"]
```

**Find blocked work:**
```
search_nodes("status:blocked")
→ ["feat-...", "feat-..."]
```

**Find learnings about hooks:**
```
search_nodes("learn-hooks")
→ ["learn-hooks-conditional-effects", "learn-hooks-cleanup-order"]
```

**Find all decisions:**
```
search_nodes("type:decision")
→ ["decide-animation-gsap", "decide-memory-docker", "decide-auth-..."]
```

**Find features related to a decision:**
```
search_nodes("decide-animation-gsap")
→ [entity_id]
get_relations(entity_id, type="documents")
→ ["feat-phase-5-scroll-animation", "feat-..."]
```

**Find recent learnings (last 7 days):**
```
search_nodes("learn", discovery_date=["2026-04-09", "2026-04-16"])
→ [entities from past week]
```

### Query Naming Convention

Use these prefixes for predictable queries:

- `feat-` → Feature entities
- `learn-` → Learning entities
- `decide-` → Decision entities
- `infra-` → Infrastructure entities
- `phase-N` → Entities in specific phase
- `status:X` → Entities with status (completed, blocked, in-progress)
- `category:X` → Observation categories (build, blocker, learning, regression)

---

## Part 8: Checklist for Orchestrator

Use this checklist at session start and end to maintain memory hygiene.

### Session Start Checklist

- [ ] Docker service is reachable (`curl http://localhost:7777/`)
- [ ] Load project state: `search_nodes("electrical-website-state")`
- [ ] Read active phase and next tasks from project state
- [ ] Check .claude/CLAUDE.md (## Session State section) for fallback notes (if any)
- [ ] Load current feature entity (if in-progress work exists)
- [ ] Check for unresolved blockers in feature observations
- [ ] Read recent learnings related to current phase

### During Session Checklist

- [ ] Commit work frequently (`git commit -m "..."`)
- [ ] Run `pnpm typecheck && pnpm build && pnpm test` after changes
- [ ] Document blockers as they arise
- [ ] Note learnings/patterns discovered
- [ ] Update feature observation if build status changes

### Session End Checklist

- [ ] All work committed: `git status` shows clean tree
- [ ] Build passing: `pnpm build` exits 0
- [ ] Tests passing: `pnpm test` exits 0
- [ ] Create session entity: `create_entities([session-...])`
- [ ] Update project state: `add_observations(project_state, [...])`
- [ ] Update feature entity: `add_observations(feat-..., [...])`
- [ ] Create learnings: `create_entities([learn-...])`
- [ ] Create relations: `create_relations([...])`
- [ ] Verify Docker operations succeeded (check for errors)
- [ ] If Docker failed: add fallback note to .claude/CLAUDE.md (## Session State section)
- [ ] Push changes: `git push`

---

## Part 9: Implementation Checklist

To activate this policy:

- [ ] Review and approve policy document (this file)
- [ ] Create Docker memory service setup guide (`.claude/reference/setup/DOCKER_MEMORY_SETUP.md`)
- [ ] Create memory initialization script (`.claude/scripts/init-memory.sh`)
- [ ] Update `.claude/CLAUDE.md` to reference this policy
- [ ] Update session preflight workflow to call `search_nodes("electrical-website-state")`
- [ ] Train all agents and scripts to use entity naming conventions
- [ ] Create .claude/CLAUDE.md (## Session State section) section (for fallback)
- [ ] Migrate initial context from `.claude/memory/` to Docker (one-time)
- [ ] Test Docker service health check in CI/CD
- [ ] Document fallback procedure in runbooks
- [ ] Schedule first pruning (Week 1)

---

## Part 10: Example Workflows

### Workflow 1: Starting a New Feature

**Goal:** Create feature entity and link to decision.

```
1. search_nodes("electrical-website-state")
   → Load current phase

2. create_entities([{
     type: "feature",
     name: "feat-phase-5-dark-mode-support",
     properties: {
       title: "Dark Mode Support",
       phase: "Phase 5",
       status: "planned",
       start_date: "2026-04-17",
       ...
     }
   }])
   → Returns feature_id

3. create_relations([{
     type: "derives_from",
     source: "feat-phase-5-dark-mode-support",
     target: "decide-design-system-dark-mode",
     reason: "Feature implements decision on dark mode approach"
   }])

4. Update project_state:
   add_observations(project_state_id, [{
     category: "session_end",
     active_feature: "feat-phase-5-dark-mode-support",
     ...
   }])
```

---

### Workflow 2: Documenting a Blocker

**Goal:** Create blocker observation and flag for next session.

```
1. Discover blocker during work (e.g., scroll not firing on iOS)

2. add_observations(feature_id, [{
     category: "blocker",
     severity: "high",
     title: "Scroll trigger not firing on iOS Safari",
     description: "useScrollTrigger hook doesn't detect viewport changes...",
     affected_component: "ServicesHero",
     workaround: "Disabled on mobile; filed issue #142"
   }])

3. Create learning entity (if pattern discovered):
   create_entities([{
     type: "learning",
     name: "learn-scroll-trigger-ios-compatibility",
     properties: {
       title: "Safari scroll events have platform-specific timing",
       ...
     }
   }])

4. At session end, project_state observation includes:
   blockers: ["scroll-trigger-ios"]
   
5. Next session: orchestrator sees blocker in project_state, knows to unblock first
```

---

### Workflow 3: Learning Extraction & Reuse

**Goal:** Capture learning, share with team, use in future planning.

```
Session 1:
1. Discover learning (e.g., "useEffect cleanup must run before next effect")
2. create_entities([{
     type: "learning",
     name: "learn-hooks-conditional-effects-timing",
     properties: {
       category: "React Hooks",
       summary: "...",
       source_feature: "feat-phase-5-scroll-animation",
       confidence: "high",
       shared_with_team: false
     }
   }])

Session 2 (different feature, same pattern):
1. search_nodes("learn-hooks")
   → ["learn-hooks-conditional-effects-timing", "..."]
2. Load learning entity
3. Reference in implementation (cite learning in code comment)
4. No need to rediscover the pattern

Team Meeting:
1. search_nodes("shared_with_team:false", type:"learning")
   → Find unshared learnings
2. Review with team
3. Update learning entities: shared_with_team: true
```

---

## Troubleshooting

### Docker service is down

**Symptom:** `search_nodes()` times out or returns error

**Action:**
1. Confirm docker daemon is running: `docker ps`
2. Confirm MCP server is listening: `curl http://localhost:7777/health`
3. If down: restart Docker MCP service (instructions in `.claude/reference/setup/`)
4. If still down: use fallback (write to .claude/CLAUDE.md (## Session State section))

### Entity not found

**Symptom:** `search_nodes("feat-phase-5-scroll")` returns empty

**Cause:** Entity name doesn't match search term

**Fix:** Check naming convention. Search by type instead:
```
search_nodes("type:feature", "phase:5")
```

### Circular dependencies detected

**Symptom:** Feature A depends on B, B depends on C, C depends on A

**Action:**
1. Review dependency relations
2. Break one cycle (usually a design issue)
3. Document why in decision entity
4. Update relations

---

## Document Versioning

| Version | Date | Changes |
|---------|------|---------|
| 1.0 | 2026-04-16 | Initial policy design (entity types, observations, relations, lifecycle, fallback, pruning) |

---

**Last Updated:** 2026-04-16  
**Status:** Ready for Implementation  
**Next Steps:** Create setup guide, initialize Docker service, migrate initial context
