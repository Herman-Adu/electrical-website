# Entity Schema Reference

Complete schema definitions for all Docker memory entity types.

> For working commands: [DOCKER_MCP_QUICK_REFERENCE.md](DOCKER_MCP_QUICK_REFERENCE.md)

---

## Entity Types

| entityType | Naming Pattern | Purpose |
|------------|---------------|---------|
| `project_state` | `{project}-state` | Single entity: branch, build, phase, next tasks |
| `feature` | `feat-{phase}-{kebab-name}` | Deliverable unit with spec, impl, tests |
| `learning` | `learn-{topic}-{descriptor}` | Technical pattern, gotcha, or insight |
| `decision` | `decide-{domain}-{choice}` | Architectural choice with rationale |
| `infrastructure` | `infra-{subsystem}-{descriptor}` | Services, MCP tools, CI/CD |
| `session` | `session-{YYYY}-{MM}-{DD}-{seq}` | Handoff context between sessions |
| `plan` | `plan-{domain}-{goal}` | Implementation roadmap with phases |
| `task` | `task-{area}-{descriptor}` | Atomic work item with status |

---

## project_state

```json
{
  "name": "electrical-website-state",
  "entityType": "project_state",
  "observations": [
    "current_branch: main",
    "build_status: passing",
    "active_phase: Phase N",
    "next_tasks: [task1, task2]",
    "blockers: none"
  ]
}
```

---

## feature

```json
{
  "name": "feat-phase-N-kebab-name",
  "entityType": "feature",
  "observations": [
    "title: Feature title",
    "status: in-progress|completed|paused|blocked|planned",
    "components: [ComponentA, ComponentB]",
    "files_affected: 5",
    "build_passing: true",
    "pr_number: 84"
  ]
}
```

---

## learning

```json
{
  "name": "learn-topic-descriptor",
  "entityType": "learning",
  "observations": [
    "title: Short title",
    "category: React Hooks|Next.js|Performance|Testing|TypeScript",
    "summary: One-line takeaway",
    "source_feature: feat-phase-N-name",
    "confidence: high|medium|low"
  ]
}
```

---

## decision

```json
{
  "name": "decide-domain-choice",
  "entityType": "decision",
  "observations": [
    "title: Decision title",
    "domain: Memory|Animation|Auth|Infrastructure",
    "choice: What was chosen",
    "rationale: Why this choice",
    "trade_offs: [trade-off description]"
  ]
}
```

---

## infrastructure

```json
{
  "name": "infra-subsystem-descriptor",
  "entityType": "infrastructure",
  "observations": [
    "title: Service title",
    "subsystem: Memory|CI-CD|Deployment",
    "endpoint: http://localhost:3100",
    "status: operational|degraded|down",
    "fallback: Write note to CLAUDE.md if down"
  ]
}
```

---

## session

```json
{
  "name": "session-YYYY-MM-DD-001",
  "entityType": "session",
  "observations": [
    "date: YYYY-MM-DD",
    "branch: main",
    "work_completed: [item1, item2]",
    "commits_created: 3",
    "build_status_at_end: passing",
    "test_status_at_end: passing",
    "next_steps: [step1, step2]"
  ]
}
```

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

## Relations

| relationType | Meaning | Typical Source → Target |
|-------------|---------|------------------------|
| `derives_from` | Source implements or is informed by target | `feature` → `decision` |
| `depends_on` | Source cannot complete without target | `feature` → `feature` |
| `documents` | Source explains rationale for target | `decision` → `feature` |
| `updates` | Source modifies state tracked in target | `session` → `project_state` |
| `supersedes` | Source replaces target (target deprecated) | `learning` → `learning` |
| `related_to` | Soft conceptual link | `learning` → `learning` |

---

**Last Updated:** 2026-04-28 | **Status:** Reference
