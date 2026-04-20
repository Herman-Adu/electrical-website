---
title: MCP Automation + Docker Workflow Example
description: Complete worked example showing Design → Execute → Persist flow for weekly progress review automation
category: example
status: active
last-updated: 2026-04-20
---

# MCP Automation + Docker Workflow Example

## Scenario

**Goal:** Design and execute a weekly progress review automation that aggregates work completed, learnings discovered, and next steps for a development team.

**Workflow Type:** Automation → Persistence → Reuse (Pattern 3 from INTEGRATION_MATRIX.md)

**Trigger:** Every Friday at 5pm via cron job

**Expected Outcome:** Automated aggregation of GitHub activity, Docker learnings, and session metadata into a summary document that persists for next week's planning.

---

## Phase 1: Discovery (Search Docker for Prior Automations)

**Orchestrator executes:**

```bash
mcp__MCP_DOCKER__search_nodes("infra-weekly")
```

**Response:** (Hypothetical) No existing weekly automation found in Docker.

**Orchestrator decision:** Design new automation from scratch. Invoke MCP-Automation agent.

---

## Phase 2: Design Workflow with MCP-Automation Agent

**Orchestrator dispatch to MCP-Automation agent:**

```
Subtask: Design a weekly progress review automation
Goal: Aggregate GitHub activity, Docker learnings, team metrics
Context:
  - Available skills: planning, code-generation, knowledge-memory
  - Available tools: GitHub API, Docker memory (search_nodes, add_observations, create_entities)
  - Team size: 3 engineers
  - Scope: Phase 8 (navbar refactor + animation optimization)
Intensity: FULL (comprehensive, include error handling)
```

**Agent returns workflow design:**

### Workflow: Weekly Progress Review Automation

**Goal:** Automatically aggregate team progress, learnings, and metrics every Friday at 5pm.

**Steps:**

1. **Fetch GitHub Activity**
   - Query GitHub API for PRs merged, issues closed, commits pushed
   - Filter by repo: electrical-website
   - Date range: last 7 days
   - Output: JSON array of events

2. **Load Project State from Docker**
   - Search: `mcp__MCP_DOCKER__search_nodes("electrical-website-state")`
   - Load: `mcp__MCP_DOCKER__open_nodes([returned_id])`
   - Extract: active_phase, current_branch, build_status
   - Output: project context object

3. **Search for Session Entities**
   - Search: `mcp__MCP_DOCKER__search_nodes("session-2026-04-*")`
   - Load all sessions from this week
   - Extract: work_completed, next_steps, blockers
   - Output: aggregated session findings

4. **Search for Learning Entities**
   - Search: `mcp__MCP_DOCKER__search_nodes("learn-*")`
   - Filter by discovery_date (this week)
   - Extract: insights, context, shareable notes
   - Output: learnings summary

5. **Synthesize Summary Document**
   - Combine GitHub activity + Docker context + learnings
   - Format as markdown with sections: Summary, Completed, Learnings, Blockers, Next
   - Output: summary.md file

6. **Save to Knowledge-Memory**
   - Call knowledge-memory skill
   - Save summary to: `archives/weekly-progress/{YYYY-W}.md` (ISO week)
   - Output: file path

7. **Create Session Entity**
   - Create: `mcp__MCP_DOCKER__create_entities([session entity])`
   - Type: `session`
   - Name: `session-2026-04-18-weekly-automation`
   - Properties: summary_path, github_activity_count, learnings_count, build_status
   - Output: entity_id

8. **Add Observations**
   - Call: `mcp__MCP_DOCKER__add_observations(project_state_id, [execution_metadata])`
   - Category: `automation_run`
   - Metadata: execution_time_seconds, entities_created, errors (if any)
   - Output: observation_id

9. **Wire Relations**
   - Create: `mcp__MCP_DOCKER__create_relations([...])`
   - Link: session → derives_from → project_state
   - Link: session → documents → learnings (created this week)
   - Output: relation_ids

10. **Return Workflow Completion**
    - Summary: "Weekly automation executed successfully"
    - Outputs: summary_path, entity_ids, execution_time

**Tools / Skills Used:**

- GitHub API (fetch activity)
- Docker memory tools (search_nodes, open_nodes, create_entities, add_observations, create_relations)
- Knowledge-Memory skill (save summary document)

**Inputs / Outputs:**

| Step | Input | Output |
|------|-------|--------|
| 1 | repo_name, date_range | github_events (JSON) |
| 2 | project_id | project_state (object) |
| 3 | date_filter | session_findings (array) |
| 4 | discovery_date_filter | learnings_summary (array) |
| 5 | (combined inputs 1-4) | summary.md (markdown) |
| 6 | summary.md | file_path (string) |
| 7 | summary.md + metadata | session_entity_id (string) |
| 8 | session_entity_id | observation_id (string) |
| 9 | entity_ids | relation_ids (array) |
| 10 | all outputs | completion_report (object) |

**Confidence:** High (clear steps, well-defined tool signatures, error handling defined)

**Implementation Notes:**

- All Docker API calls use canonical MCP signatures from `.claude/rules/memory-policy.md`
- GitHub API errors (rate-limit, auth) handled by retry logic with backoff
- Entity names use kebab-case with proper type prefix: `session-2026-04-18-weekly-automation`
- Observations use defined categories only: `automation_run` (custom category for workflow executions; see memory-policy.md)
- Relations use only canonical types: `derives_from`, `documents`, `updates`

---

## Phase 3: Execute Workflow (Orchestrator Coordinates)

**Orchestrator synthesizes agent design and executes:**

### Step 1: Fetch GitHub Activity

```bash
curl -H "Authorization: token $GITHUB_TOKEN" \
  "https://api.github.com/repos/electrical-website/events?per_page=100"
```

**Output:**

```json
[
  {
    "type": "PullRequestEvent",
    "action": "closed",
    "pull_request": {
      "title": "feat: Navbar hash-based highlighting",
      "merged_at": "2026-04-20T18:30:00Z"
    }
  },
  ...
]
```

### Step 2: Load Project State

```bash
mcp__MCP_DOCKER__search_nodes("electrical-website-state")
# Returns: entity_id = "abc123"

mcp__MCP_DOCKER__open_nodes(["abc123"])
# Returns: {
#   "current_branch": "main",
#   "active_phase": "Phase 8: ScrollReveal Production",
#   "build_status": "passing",
#   "next_tasks": ["Merge Phase 8 PR", "Run Lighthouse"]
# }
```

### Step 3: Search Session Entities

```bash
mcp__MCP_DOCKER__search_nodes("session-2026-04-*")
# Returns: [entity_id_1, entity_id_2, entity_id_3, ...]

mcp__MCP_DOCKER__open_nodes([entity_id_1, entity_id_2, entity_id_3])
# Returns: Aggregated work_completed, blockers, next_steps
```

### Step 4: Search Learning Entities

```bash
mcp__MCP_DOCKER__search_nodes("learn-*")
# Returns: [learn-navbar-hash-based-highlighting, learn-gpu-transform-compositing, ...]

mcp__MCP_DOCKER__open_nodes([returned_ids])
# Filters by discovery_date >= (today - 7 days)
# Aggregates: insights, patterns, shareable discoveries
```

### Step 5: Synthesize Summary

**Orchestrator combines all data:**

```markdown
# Weekly Progress Review — Week 16 (Apr 14–20, 2026)

## Overview
- **Phase:** Phase 8: ScrollReveal Production
- **Status:** On track (build passing, 267/270 tests passing)
- **PRs Merged:** 4
- **Issues Closed:** 2
- **Learnings Discovered:** 3

## Completed This Week

### GitHub Activity
- ✅ Merged: "feat: Navbar hash-based highlighting" (#147)
- ✅ Merged: "fix: SectionValues CSS Grid responsive layout" (#146)
- ✅ Closed: "bug: Flicker on scroll-to-hash navigation" (#145)

### Docker Sessions
- Session 1: Refactored ServicesHero animation (6 commits)
- Session 2: Fixed navbar scroll detection (3 commits)
- Session 3: Optimized SectionValues grid layout (2 commits)

## Learnings Discovered

1. **learn-navbar-hash-based-highlighting**
   - Removing scroll detection in favor of URL hash
   - Prevents nav re-highlights during page scroll
   - Simpler state management

2. **learn-gpu-transform-compositing**
   - GPU transform compositing requires will-change: transform
   - Must be on animated element, not container
   - Critical for 60fps smooth animations

3. **learn-hooks-conditional-effects**
   - useEffect cleanup is critical for scroll event listeners
   - Missing cleanup causes memory leaks on navigation
   - Always return cleanup function

## Blockers / Issues

- None at end of week (all resolved)

## Next Steps (Week 17)

1. Apply brightness/saturation to remaining hero components
2. Run Lighthouse audit post-optimization
3. Merge Phase 8 feature branch to main
4. Begin Phase 9 work (performance profiling)

---

**Generated by:** Weekly Progress Review Automation  
**Generated at:** 2026-04-20T17:00:00Z  
**Session Entity:** session-2026-04-18-weekly-automation
```

### Step 6: Save to Knowledge-Memory

```bash
# Call knowledge-memory skill
save_to_memory(
  file_path: "archives/weekly-progress/2026-W16.md",
  content: [markdown above],
  tags: ["weekly-review", "phase-8", "automation"]
)
```

**Output:** `/archives/weekly-progress/2026-W16.md` (file created)

### Step 7: Create Session Entity

```bash
mcp__MCP_DOCKER__create_entities([{
  "type": "session",
  "name": "session-2026-04-18-weekly-automation",
  "properties": {
    "date": "2026-04-20",
    "automation_type": "weekly_progress_review",
    "trigger": "cron: 0 17 * * 5",
    "work_period_start": "2026-04-14",
    "work_period_end": "2026-04-20",
    "summary_path": "archives/weekly-progress/2026-W16.md",
    "github_activity_count": 4,
    "learnings_count": 3,
    "sessions_aggregated": 3,
    "build_status_at_close": "passing",
    "test_status_at_close": "passing (267/270)",
    "execution_time_seconds": 18
  }
}])
```

**Output:** entity_id = `session-2026-04-18-weekly-automation`

### Step 8: Add Observations

```bash
mcp__MCP_DOCKER__add_observations("electrical-website-state", [{
  "category": "automation_run",
  "timestamp": "2026-04-20T17:00:00Z",
  "automation_name": "weekly-progress-review",
  "status": "success",
  "execution_time_seconds": 18,
  "entities_created": 1,
  "entities_updated": 1,
  "observations_added": 1,
  "relations_created": 3,
  "errors": null
}])
```

**Output:** observation_id confirmed

### Step 9: Wire Relations

```bash
mcp__MCP_DOCKER__create_relations([
  {
    "type": "updates",
    "source": "session-2026-04-18-weekly-automation",
    "target": "electrical-website-state",
    "reason": "Session captures project state at end of week"
  },
  {
    "type": "documents",
    "source": "session-2026-04-18-weekly-automation",
    "target": "learn-navbar-hash-based-highlighting",
    "reason": "Session documents learning discovered"
  },
  {
    "type": "documents",
    "source": "session-2026-04-18-weekly-automation",
    "target": "learn-gpu-transform-compositing",
    "reason": "Session documents learning discovered"
  },
  {
    "type": "documents",
    "source": "session-2026-04-18-weekly-automation",
    "target": "learn-hooks-conditional-effects",
    "reason": "Session documents learning discovered"
  }
])
```

**Output:** relation_ids confirmed (4 relations created)

### Step 10: Complete Automation

**Orchestrator returns execution summary:**

```
AUTOMATION RUN SUMMARY

Workflow: Weekly Progress Review
Status: SUCCESS
Execution Time: 18 seconds
Timestamp: 2026-04-20T17:00:00Z

Outputs:
- Summary File: archives/weekly-progress/2026-W16.md
- Entity Created: session-2026-04-18-weekly-automation
- Observations Added: 1
- Relations Created: 4
- GitHub Events Aggregated: 4
- Learnings Documented: 3

Next Run: Friday 2026-04-25 at 5pm (cron scheduled)

For next week:
1. Search Docker for "session-2026-04-25-*" to find new sessions
2. Repeat workflow to generate W17 summary
3. Workflow will automatically discover newly created entities via search_nodes()
```

---

## Phase 4: Persist Workflow & Enable Discovery

**Orchestrator creates infrastructure entity for reuse:**

```bash
mcp__MCP_DOCKER__create_entities([{
  "type": "infrastructure",
  "name": "infra-weekly-progress-review",
  "properties": {
    "description": "Automated aggregation of weekly work, learnings, and metrics",
    "trigger": "cron: 0 17 * * 5",  // Friday 5pm
    "tools_used": [
      "github-api",
      "docker-search-nodes",
      "docker-open-nodes",
      "docker-create-entities",
      "docker-add-observations",
      "docker-create-relations",
      "knowledge-memory-skill"
    ],
    "execution_steps": [
      "Fetch GitHub activity",
      "Load project state",
      "Aggregate session findings",
      "Collect learnings",
      "Synthesize summary",
      "Save to knowledge-memory",
      "Create session entity",
      "Add observations",
      "Wire relations"
    ],
    "configuration": {
      "github_repo": "electrical-website",
      "date_range_days": 7,
      "output_format": "markdown",
      "archive_path": "archives/weekly-progress/",
      "entity_naming_pattern": "session-{YYYY}-{MM}-{DD}-weekly-automation"
    },
    "execution_history": [
      {
        "date": "2026-04-20",
        "status": "success",
        "execution_time_seconds": 18,
        "entities_created": 1
      }
    ],
    "last_run": "2026-04-20T17:00:00Z",
    "next_run": "2026-04-25T17:00:00Z"
  }
}])
```

**Output:** entity_id = `infra-weekly-progress-review`

**Enable discovery for next session:**

```bash
mcp__MCP_DOCKER__create_relations([{
  "type": "documents",
  "source": "infra-weekly-progress-review",
  "target": "plan-phase-8-completion",
  "reason": "Automation supports Phase 8 planning and retrospectives"
}])
```

---

## Phase 5: Future Discovery (Next Session)

**Next Friday (2026-04-25), orchestrator can rediscover this automation:**

```bash
# Orchestrator before running any new automation:
mcp__MCP_DOCKER__search_nodes("infra-weekly-progress-review")
# Returns: entity_id

mcp__MCP_DOCKER__open_nodes([entity_id])
# Returns: Existing automation configuration + execution history
# Orchestrator loads prior trigger (cron: 0 17 * * 5), tool bindings, output format
# Decision: Reuse existing automation (don't redesign)
# Optimization: Extract execution_history to learn avg execution time (18s)
```

**Key benefit:** No manual configuration needed. Automation is self-documenting and discoverable.

---

## Learning: Workflow Design Checklist

From executing this automation, the orchestrator documents key learnings:

```bash
mcp__MCP_DOCKER__create_entities([{
  "type": "learning",
  "name": "learn-mcp-automation-docker-discovery",
  "properties": {
    "title": "Docker Entity Search Enables Automation Discovery & Reuse",
    "category": "MCP Automation / Docker Integration",
    "summary": "Searching Docker for prior automations (infra-*) before design saves 30-50% implementation time. Automation metadata (trigger, tools, config) should be stored in entity properties for easy rediscovery.",
    "discovery_context": "Weekly progress review automation execution",
    "key_insight": "Infrastructure entities act as automation templates. Search before designing.",
    "implementation_reference": "infra-weekly-progress-review",
    "confidence": "high",
    "shareable": true,
    "tags": ["automation", "docker-integration", "workflow-design"]
  }
}])
```

---

## Summary

This example demonstrates:

1. ✅ **Discovery:** Search Docker for prior automations before designing
2. ✅ **Design:** Use MCP-Automation agent to decompose workflow into steps
3. ✅ **Execution:** Orchestrator coordinates skill/tool calls in sequence
4. ✅ **Persistence:** Create infrastructure + session + learning entities
5. ✅ **Relations:** Wire entities to enable discovery + context linkage
6. ✅ **Reuse:** Infrastructure entity can be rediscovered and adapted next week
7. ✅ **Documentation:** Learnings captured for future reference

**Expected outcome for next week:** When Friday 5pm arrives, orchestrator searches Docker, finds `infra-weekly-progress-review`, loads prior configuration, and re-executes automation with minimal overhead.

---

**Example created:** 2026-04-20  
**Automation executed:** 2026-04-20T17:00:00Z  
**Reference entities:**
- `session-2026-04-18-weekly-automation`
- `infra-weekly-progress-review`
- `learn-mcp-automation-docker-discovery`
