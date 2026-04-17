# Entity Schema Reference

Complete JSON schema definitions for all Docker memory entity types.

---

## Quick Index

- `project_state` — Project status snapshot
- `feature` — Feature work item
- `learning` — Discovered pattern or insight
- `decision` — Architectural choice
- `infrastructure` — Service or deployment
- `session` — Session context

---

## project_state

**Purpose:** Single entity tracking current project status, branch, phase, and immediate next steps.

**Naming:** `electrical-website-state` (one per project)

**Schema:**

```json
{
  "type": "project_state",
  "name": "electrical-website-state",
  "properties": {
    "project_name": "string",
    "current_branch": "string",
    "build_status": "string (passing|failing|degraded|pending)",
    "last_build_time": "ISO8601 timestamp",
    "active_phase": "string or null (Phase 5: Animation Optimization)",
    "next_tasks": ["string"],
    "blockers": ["string"],
    "session_count": "integer (sessions that modified this)",
    "last_updated": "ISO8601 timestamp"
  }
}
```

**Example:**

```json
{
  "type": "project_state",
  "name": "electrical-website-state",
  "properties": {
    "project_name": "electrical-website",
    "current_branch": "main",
    "build_status": "passing",
    "last_build_time": "2026-04-16T18:45:00Z",
    "active_phase": "Phase 5: Animation Optimization",
    "next_tasks": [
      "Complete scroll trigger testing on mobile",
      "Review lighthouse performance metrics"
    ],
    "blockers": [
      "iOS Safari scroll event timing issue (workaround in place)"
    ],
    "session_count": 42,
    "last_updated": "2026-04-16T20:15:00Z"
  }
}
```

**Observations Added By:** Session end, phase completion, blocker resolution

---

## feature

**Purpose:** Track deliverable work items (features, fixes, refactoring).

**Naming:** `feat-{phase}-{feature-name}`  
Examples: `feat-phase-5-scroll-animation`, `feat-bugfix-form-validation`

**Schema:**

```json
{
  "type": "feature",
  "name": "feat-phase-5-scroll-animation-optimization",
  "properties": {
    "title": "string",
    "description": "string (multi-line summary)",
    "phase": "string (Phase 5)",
    "status": "string (in-progress|completed|paused|blocked|planned)",
    "components_touched": ["string (component names)"],
    "files_affected": "integer",
    "lines_added": "integer",
    "lines_removed": "integer",
    "start_date": "YYYY-MM-DD",
    "estimated_end": "YYYY-MM-DD",
    "actual_end": "YYYY-MM-DD or null",
    "test_coverage": "float (0.0–1.0)",
    "build_passing": "boolean",
    "lighthouse_score": "integer (0–100)",
    "blockers": ["string"],
    "learnings": ["string"],
    "depends_on": ["entity_id"],
    "pr_number": "integer or null",
    "commit_hash": "string or null",
    "last_updated": "ISO8601 timestamp"
  }
}
```

**Example:**

```json
{
  "type": "feature",
  "name": "feat-phase-5-scroll-animation-optimization",
  "properties": {
    "title": "Phase 5: Animation Optimization via useCyclingText",
    "description": "Refactor hero sections to use useCyclingText hook for DRY animation. Reduces code duplication by 40% across ServicesHero, AboutHero, and ProjectCategoryHero.",
    "phase": "Phase 5",
    "status": "in-progress",
    "components_touched": [
      "ServicesHero",
      "AboutHero",
      "ProjectCategoryHero"
    ],
    "files_affected": 3,
    "lines_added": 250,
    "lines_removed": 180,
    "start_date": "2026-04-10",
    "estimated_end": "2026-04-20",
    "actual_end": null,
    "test_coverage": 0.85,
    "build_passing": true,
    "lighthouse_score": 92,
    "blockers": [
      "iOS Safari scroll event timing (workaround: disabled on mobile)"
    ],
    "learnings": [
      "Custom hook pattern reduces code by 40%",
      "CSS timing is critical for scroll animation smoothness"
    ],
    "depends_on": [],
    "pr_number": 84,
    "commit_hash": "c1c8a6d",
    "last_updated": "2026-04-16T18:45:00Z"
  }
}
```

**Observations Added By:** Build status, blocker discovery, performance improvements

---

## learning

**Purpose:** Capture reusable patterns, gotchas, and technical insights.

**Naming:** `learn-{topic}-{descriptor}`  
Examples: `learn-hooks-conditional-effects`, `learn-scroll-trigger-ios-compat`

**Schema:**

```json
{
  "type": "learning",
  "name": "learn-hooks-conditional-effects-timing",
  "properties": {
    "title": "string",
    "category": "string (React Hooks|Next.js|Performance|Testing|TypeScript)",
    "summary": "string (one-liner for quick reference)",
    "detailed_explanation": "string (full context)",
    "source_feature": "entity_id (where discovered)",
    "example_code_file": "string (path to code)",
    "example_code_lines": "string (e.g., 45-67)",
    "applies_to": ["string (components, patterns)"],
    "prevents_bugs": ["string (bug patterns avoided)"],
    "discovery_date": "YYYY-MM-DD",
    "confidence": "string (high|medium|low)",
    "shared_with_team": "boolean",
    "related_learnings": ["entity_id"],
    "last_updated": "ISO8601 timestamp"
  }
}
```

**Example:**

```json
{
  "type": "learning",
  "name": "learn-hooks-conditional-effects-timing",
  "properties": {
    "title": "useEffect Hook Rules: Conditional Effects & Timing",
    "category": "React Hooks",
    "summary": "useEffect cleanup must run before next effect; rely on dependency array, not hook calls inside conditions",
    "detailed_explanation": "Discovered when refactoring scroll-trigger hooks. Conditional hook calls (e.g., if (isMobile) { useEffect(...) }) violate React rules. Solution: Move condition inside effect, always call hook.",
    "source_feature": "feat-phase-5-scroll-animation-optimization",
    "example_code_file": "lib/hooks/use-scroll-trigger.ts",
    "example_code_lines": "45-67",
    "applies_to": [
      "all custom hooks",
      "useCallback optimization"
    ],
    "prevents_bugs": [
      "conditional render crashes",
      "state sync issues"
    ],
    "discovery_date": "2026-04-12",
    "confidence": "high",
    "shared_with_team": true,
    "related_learnings": [
      "entity_id: learn-hooks-cleanup-order",
      "entity_id: learn-hooks-dependency-arrays"
    ],
    "last_updated": "2026-04-16T10:00:00Z"
  }
}
```

**Observations Added By:** Discovery during work, pattern confirmation

---

## decision

**Purpose:** Record architectural and strategic choices with rationale.

**Naming:** `decide-{domain}-{choice}`  
Examples: `decide-memory-docker-over-files`, `decide-animation-gsap-vs-framer`

**Schema:**

```json
{
  "type": "decision",
  "name": "decide-memory-docker-over-files",
  "properties": {
    "title": "string",
    "domain": "string (Memory Management|Animation|Auth|etc)",
    "choice": "string (what was chosen)",
    "context": "string (why decision was needed)",
    "alternatives": [
      {
        "option": "string",
        "pros": ["string"],
        "cons": ["string"],
        "cost_tokens": "integer (estimated)"
      }
    ],
    "decision_made": "string (the choice)",
    "rationale": "string (why this choice)",
    "affects_systems": ["string"],
    "migration_date": "YYYY-MM-DD or null",
    "migration_status": "string (in-progress|completed|not-started)",
    "trade_offs": [
      {
        "name": "string",
        "description": "string",
        "mitigation": "string"
      }
    ],
    "related_decisions": ["entity_id"],
    "last_updated": "ISO8601 timestamp"
  }
}
```

**Example:**

```json
{
  "type": "decision",
  "name": "decide-memory-docker-over-files",
  "properties": {
    "title": "Migrate Project Memory from .md Files to Docker MCP Service",
    "domain": "Infrastructure & Context Management",
    "choice": "Use Docker memory-reference MCP service instead of .claude/memory/*.md files",
    "context": "Session startup was slow (~2 min) due to large .md files. Token cost was 5,000+ per query.",
    "alternatives": [
      {
        "option": "Keep .md files",
        "pros": ["Simple", "Git-tracked"],
        "cons": ["Slow queries", "High token cost", "Hard to search"],
        "cost_tokens": 5000
      },
      {
        "option": "Use Docker graph database",
        "pros": ["Fast queries", "Low token cost (~50)", "Rich relations", "Searchable"],
        "cons": ["New infrastructure", "Learning curve"],
        "cost_tokens": 50
      }
    ],
    "decision_made": "Docker graph database",
    "rationale": "60–70% token savings, faster session startup, better searchability",
    "affects_systems": [
      "Session startup",
      "Context loading",
      "Memory persistence"
    ],
    "migration_date": "2026-04-17",
    "migration_status": "in-progress",
    "trade_offs": [
      {
        "name": "Fallback complexity",
        "description": "If Docker unavailable, must write session notes to CLAUDE.md",
        "mitigation": "Fallback documented in memory-policy.md"
      }
    ],
    "related_decisions": [],
    "last_updated": "2026-04-16T18:45:00Z"
  }
}
```

**Observations Added By:** Progress updates, trade-off validation

---

## infrastructure

**Purpose:** Track services, deployments, and infrastructure components.

**Naming:** `infra-{subsystem}-{descriptor}`  
Examples: `infra-mcp-docker-services`, `infra-github-ci-cd`

**Schema:**

```json
{
  "type": "infrastructure",
  "name": "infra-mcp-docker-services",
  "properties": {
    "title": "string",
    "subsystem": "string (Memory|CI/CD|Deployment)",
    "services": [
      {
        "name": "string",
        "endpoint": "string (URL or localhost:port)",
        "status": "string (operational|degraded|down|provisioning)",
        "last_health_check": "ISO8601 timestamp"
      }
    ],
    "requires": ["string (dependencies)"],
    "alerts": [
      {
        "condition": "string",
        "action": "string",
        "severity": "string (high|medium|low)"
      }
    ],
    "docs_url": "string (path or link)",
    "setup_instructions": "string (path to setup guide)",
    "last_updated": "ISO8601 timestamp"
  }
}
```

**Example:**

```json
{
  "type": "infrastructure",
  "name": "infra-mcp-docker-services",
  "properties": {
    "title": "Docker MCP Service Infrastructure",
    "subsystem": "Memory & Context Management",
    "services": [
      {
        "name": "memory-reference",
        "endpoint": "http://localhost:3100/memory/tools/call",
        "status": "operational",
        "last_health_check": "2026-04-16T18:45:00Z"
      }
    ],
    "requires": [
      "Docker daemon running",
      "MCP server listening on port 3100",
      "Network access to localhost"
    ],
    "alerts": [
      {
        "condition": "Service unreachable",
        "action": "Fall back to .claude/CLAUDE.md session state section",
        "severity": "high"
      }
    ],
    "docs_url": ".claude/rules/memory-policy.md",
    "setup_instructions": ".claude/reference/setup/DOCKER_MEMORY_SETUP.md",
    "last_updated": "2026-04-16T18:45:00Z"
  }
}
```

**Observations Added By:** Health checks, status updates, incident logs

---

## session

**Purpose:** Handoff context between sessions (what was accomplished, what to do next).

**Naming:** `session-{YYYY}-{MM}-{DD}-{seq}`  
Examples: `session-2026-04-16-001`, `session-2026-04-16-002`

**Schema:**

```json
{
  "type": "session",
  "name": "session-2026-04-16-001",
  "properties": {
    "date": "YYYY-MM-DD",
    "start_time": "HH:MM:SSZ",
    "end_time": "HH:MM:SSZ or null (if incomplete)",
    "duration_minutes": "integer",
    "branch": "string",
    "active_phase": "string or null",
    "work_completed": ["string"],
    "files_modified": "integer",
    "commits_created": "integer",
    "prs_opened": "integer",
    "prs_merged": "integer",
    "next_steps": ["string"],
    "blockers_identified": ["string"],
    "agent_used": ["string (agent names)"],
    "memory_operations": [
      {
        "operation": "string (search_nodes|create_entities|add_observations|create_relations)",
        "count": "integer",
        "cost_tokens": "integer"
      }
    ],
    "total_tokens_used": "integer",
    "context_efficiency": "string (% of loaded context used)",
    "build_status_at_end": "string (passing|failing|pending)",
    "test_status_at_end": "string (passing|failing|pending)",
    "type_check_status_at_end": "string (passing|failing)",
    "session_learnings": ["string"],
    "next_session_suggested_branch": "string",
    "last_updated": "ISO8601 timestamp"
  }
}
```

**Example:**

```json
{
  "type": "session",
  "name": "session-2026-04-16-001",
  "properties": {
    "date": "2026-04-16",
    "start_time": "18:30:00Z",
    "end_time": "20:15:00Z",
    "duration_minutes": 105,
    "branch": "main",
    "active_phase": "Phase 5: Animation Optimization",
    "work_completed": [
      "Refactored ServicesHero to use useCyclingText",
      "Updated CLAUDE.md with orchestrator contract",
      "Created Docker memory policy design"
    ],
    "files_modified": 8,
    "commits_created": 2,
    "prs_opened": 0,
    "prs_merged": 1,
    "next_steps": [
      "Complete ProjectCategoryHero refactoring",
      "Run full test suite"
    ],
    "blockers_identified": [],
    "agent_used": [
      "Haiku (planning)",
      "Haiku (knowledge-memory)"
    ],
    "memory_operations": [
      {
        "operation": "search_nodes",
        "count": 3,
        "cost_tokens": 150
      },
      {
        "operation": "create_entities",
        "count": 2,
        "cost_tokens": 200
      }
    ],
    "total_tokens_used": 45000,
    "context_efficiency": "70%",
    "build_status_at_end": "passing",
    "test_status_at_end": "passing",
    "type_check_status_at_end": "passing",
    "session_learnings": [
      "Docker memory policy design complete — ready for implementation",
      "Memory operations are now isolated from main CLAUDE.md"
    ],
    "next_session_suggested_branch": "main",
    "last_updated": "2026-04-16T20:15:00Z"
  }
}
```

**Observations Added By:** Auto-generated at session end

---

## Observation Schema

Observations attach to existing entities without creating new ones.

**Common Observation Structure:**

```json
{
  "category": "string (build|blocker|performance|learning|regression|session_end)",
  "timestamp": "ISO8601 timestamp",
  "... category-specific fields ..."
}
```

### build Observation

```json
{
  "category": "build",
  "timestamp": "ISO8601 timestamp",
  "status": "string (passing|failing|degraded|pending)",
  "details": {
    "typescript_errors": "integer",
    "lint_warnings": "integer",
    "test_coverage": "float (0–1)",
    "lighthouse": "integer (0–100)",
    "build_duration_seconds": "integer"
  },
  "environment": "string (CI/CD, local, etc)"
}
```

### blocker Observation

```json
{
  "category": "blocker",
  "timestamp": "ISO8601 timestamp",
  "severity": "string (high|medium|low)",
  "title": "string",
  "description": "string",
  "affected_component": "string",
  "workaround": "string or null",
  "resolution_date": "YYYY-MM-DD or null"
}
```

### performance Observation

```json
{
  "category": "performance",
  "timestamp": "ISO8601 timestamp",
  "metric": "string (LCP|CLS|FID|etc)",
  "before": "string (with units)",
  "after": "string (with units)",
  "improvement_percent": "integer (0–100)",
  "technique_used": "string",
  "component": "string"
}
```

### learning Observation

```json
{
  "category": "learning",
  "timestamp": "ISO8601 timestamp",
  "insight": "string",
  "context": "string",
  "references": ["string (file paths)"],
  "shareable": "boolean"
}
```

### regression Observation

```json
{
  "category": "regression",
  "timestamp": "ISO8601 timestamp",
  "severity": "string (high|medium|low)",
  "detected_in_feature": "string (feature name)",
  "issue": "string",
  "root_cause": "string",
  "fixed": "boolean",
  "fix_commit": "string (commit hash or null)",
  "test_added": "boolean"
}
```

---

## Relation Schema

Links between entities (the graph structure).

**Common Relation Structure:**

```json
{
  "type": "string (derives_from|depends_on|documents|updates|supersedes|related_to)",
  "source": "string (entity_id)",
  "target": "string (entity_id)",
  "reason": "string (why this relation exists)",
  "blocking": "boolean (optional, for depends_on)"
}
```

### Example Relations

```json
[
  {
    "type": "derives_from",
    "source": "feat-phase-5-scroll-animation",
    "target": "decide-animation-gsap-vs-framer",
    "reason": "Feature implements decision to use GSAP for scroll triggers"
  },
  {
    "type": "depends_on",
    "source": "feat-phase-5-scroll-animation",
    "target": "feat-phase-4b-hero-refactoring",
    "reason": "Hero refactoring must be complete before scroll optimization",
    "blocking": true
  },
  {
    "type": "documents",
    "source": "decide-memory-docker-over-files",
    "target": "feat-phase-5-docker-memory-implementation",
    "reason": "Decision defines architecture for feature implementation"
  },
  {
    "type": "updates",
    "source": "session-2026-04-16-001",
    "target": "project_state",
    "reason": "Session updated build status, branch, and next tasks"
  },
  {
    "type": "supersedes",
    "source": "decide-animation-framer-motion-v7",
    "target": "decide-animation-framer-motion-v6",
    "reason": "v7 API changed; v6 pattern no longer applies",
    "deprecation_date": "2026-04-15"
  },
  {
    "type": "related_to",
    "source": "learn-hooks-conditional-effects",
    "target": "learn-hooks-cleanup-order",
    "reason": "Both relate to React hook lifecycle and timing"
  }
]
```

---

## Field Data Types

| Type | Format | Example |
|------|--------|---------|
| `string` | Text | `"Phase 5"` |
| `integer` | Whole number | `42` |
| `float` | Decimal number | `0.85` |
| `boolean` | True/False | `true` |
| `YYYY-MM-DD` | ISO date | `"2026-04-16"` |
| `ISO8601 timestamp` | Full timestamp | `"2026-04-16T20:15:00Z"` |
| `HH:MM:SSZ` | UTC time | `"20:15:00Z"` |
| `entity_id` | Reference | `"feat-xyz"` |
| `array` | List | `["item1", "item2"]` |
| `object` | Nested structure | `{ "key": "value" }` |

---

## Validation Rules

### General

- All `timestamp` fields must be ISO8601 format with `Z` (UTC)
- All entity `name` fields must be kebab-case (lowercase, hyphens)
- All `entity_id` references must point to existing entities
- Arrays of strings should be non-empty if the field is required

### project_state

- Must be unique (one per project)
- `current_branch` must be a valid git branch
- `build_status` must be one of: `passing|failing|degraded|pending`
- `active_phase` can be null or a valid phase name

### feature

- `status` must be one of: `in-progress|completed|paused|blocked|planned`
- If `status: completed`, `actual_end` must be set
- `test_coverage` must be between 0.0 and 1.0
- `lighthouse_score` must be between 0 and 100

### learning

- `category` must be one of: `React Hooks|Next.js|Performance|Testing|TypeScript` (or custom)
- `confidence` must be one of: `high|medium|low`
- `example_code_lines` should be range format (e.g., "45-67")

### session

- `date` must match `YYYY-MM-DD` format
- `start_time` and `end_time` must be `HH:MM:SSZ` format
- `duration_minutes` must be positive if session completed
- If `end_time` is null, session is incomplete

---

## Usage Examples

### Loading All Features for Current Phase

```python
# Query
search_nodes("feat-phase-5")

# Result
[
  "feat-phase-5-scroll-animation-optimization",
  "feat-phase-5-dark-mode-support",
  "feat-phase-5-performance-optimization"
]

# Load details
open_nodes([...])
```

### Finding Blocked Work

```python
# Query all features with blockers
search_nodes("type:feature", "status:blocked")

# Get details
open_nodes([...])

# View specific blockers
feature.properties.blockers
feature.observations.filter(obs => obs.category == "blocker")
```

### Tracing Dependencies

```python
# Get feature
feature = open_nodes(["feat-A"])

# Get relations
search_relations(target="feat-A", type="depends_on")

# Result: ["feat-B", "feat-C"] must complete before feat-A
```

---

**Last Updated:** 2026-04-16  
**Status:** Reference  
**Version:** 1.0
