# Integration Matrix — Orchestrator Lifecycle System

**Complete mapping of all components: hooks, skills, agents, and their interactions**

---

## System Overview

```
ORCHESTRATOR SESSION LIFECYCLE SYSTEM (Batches 1-5 Complete)
═════════════════════════════════════════════════════════════

HOOKS (Automatic)         SKILLS (Manual)       AGENTS (Dispatch)
─────────────────         ───────────────       ────────────────
• SessionStart            • session-lifecycle   • Architecture SME
• UserPromptSubmit        (start/sync/end)      • Validation SME
• PreCompact                                    • Security SME
                          MEMORY (Docker)       • QA SME
                          ──────────────────
                          • project_state
                          • sessions
                          • features
                          • learnings
                          • decisions
```

---

## Components Completed

### Batch 1-2: Hooks & Context Monitor
- ✅ `session-start.sh` — SessionStart hook (Docker health check)
- ✅ `context-monitor.mjs` — UserPromptSubmit hook (70% warning)
- ✅ Settings registered in `.claude/settings.json`

### Batch 3: PreCompact Safety
- ✅ `precompact-safety.sh` — PreCompact hook (safety during compaction)
- ✅ Hook registered in settings.json

### Batch 4: Session-Lifecycle Skill
- ✅ `skills/session-lifecycle/SKILL.md` — User-facing skill definition
- ✅ `skills/session-lifecycle/README.md` — Usage guide

### Batch 5: Sub-Agent Dispatch System
- ✅ `agents/ORCHESTRATOR_DISPATCH_PREAMBLE.md` — Shared context
- ✅ `agents/README.md` — Agent overview
- ✅ `agents/architecture-sme/AGENT.md` + `README.md`
- ✅ `agents/validation-sme/AGENT.md` + `README.md`
- ✅ `agents/security-sme/AGENT.md` + `README.md`
- ✅ `agents/qa-sme/AGENT.md` + `README.md`

### Documentation
- ✅ All README files (hooks, skills, agents)
- ✅ INTEGRATION_MATRIX.md (this file)

---

## Key Files Organization

```
.claude/
├── settings.json                          # 3 hooks registered
├── hooks/
│   ├── session-start.sh                   # SessionStart
│   ├── context-monitor.mjs                # UserPromptSubmit
│   └── precompact-safety.sh               # PreCompact
├── skills/session-lifecycle/
│   ├── SKILL.md                           # Skill definition
│   └── README.md                          # How to use
├── agents/
│   ├── ORCHESTRATOR_DISPATCH_PREAMBLE.md  # Shared preamble
│   ├── README.md                          # Agent overview
│   ├── architecture-sme/                  # 4 SME agents
│   ├── validation-sme/                    # (each with AGENT.md
│   ├── security-sme/                      #  + README.md)
│   └── qa-sme/
├── rules/
│   ├── memory-policy.md                   # Docker entities
│   ├── delegation-gates.md                # Delegation rules
│   └── naming-conventions.md              # Naming rules
├── reference/
│   └── INTEGRATION_MATRIX.md              # This file
└── CLAUDE.md                              # Orchestrator contract
```

---

## Status Summary

| Component | Status | Files | Purpose |
|-----------|--------|-------|---------|
| **Hooks** | ✅ Complete | 3 | Automatic session management |
| **Skills** | ✅ Complete | 2 | Manual session control |
| **Agents** | ✅ Complete | 10 | Feature analysis (4 SMEs) |
| **Documentation** | ✅ Complete | 8 README files | Usage guides |
| **Docker Memory** | ✅ Available | — | Project state persistence |

---

## Progress Tracking

```
Batches Completed: 1, 2, 3, 4, 5, 6, 7 (100%)
├─ Batch 1 — Foundation (session-start hook)
├─ Batch 2 — Context Monitor (context-monitor hook)
├─ Batch 3 — PreCompact Safety (precompact hook)
├─ Batch 4 — Session-Lifecycle Skill (skill definition)
├─ Batch 5 — Sub-Agent Dispatch (4 SME agents + preamble)
├─ Batch 6 — Knowledge-Memory Skill/Agent + CLAUDE.md + Integration updates
└─ Batch 7 — Cleanup (.gitkeep deletion) + Build verification PASSING

Status: COMPLETE & PRODUCTION READY
```

---

## Ready for Deployment

All components are now in place and documented. The orchestrator is fully operational:

1. ✅ Load session state automatically (SessionStart hook)
2. ✅ Monitor context window at 70% (UserPromptSubmit hook)
3. ✅ Manually control sessions (/session-lifecycle skill)
4. ✅ Dispatch SME agents (Architecture, Validation, Security, QA)
5. ✅ Persist context to Docker (memory-first approach, fallback to CLAUDE.md)
6. ✅ Generate continuation prompts (inline, copy-paste ready)
7. ✅ Sub-agents use deterministic prompts (ORCHESTRATOR_DISPATCH_PREAMBLE.md)
8. ✅ Knowledge-memory integrates Docker (primary) + file archives (secondary)

**System Status:** All gates passing (build ✅ | tests ✅ | types ✅)

---

---

## Workflow Design Patterns (Docker-Aware)

Every workflow orchestrates steps into an automation. Three canonical patterns cover most use cases.

### Pattern 1: Research → Plan → Execute

**Use for:** Data gathering, analysis, decision-making workflows

**Example:** "Aggregate weekly performance metrics, analyze trends, create action plan"

**Flow:**

```
START
  ↓
[1] Search Docker for prior analysis:
    mcp__MCP_DOCKER__search_nodes("learn-performance-analysis")
  ↓
[2] Execute research step:
    Call knowledge-memory skill or research tool
    Collect findings, metrics, insights
  ↓
[3] Load planning context from Docker:
    mcp__MCP_DOCKER__open_nodes([plan_entity_id])
    Retrieve prior roadmap structure
  ↓
[4] Synthesize findings into plan:
    Orchestrator combines research + prior context
    Creates new plan entity with recommendations
  ↓
[5] Execute planned steps:
    Call code-generation, planning, or domain-specific skills
    Generate output (report, code, tasks)
  ↓
[6] Persist learning:
    create_entities([learning]) — analysis insight
    add_observations(plan_id) — execution metadata
    create_relations([derives_from → decision])
  ↓
END
```

**Docker Entities Created:**
- `learn-*` (new insight discovered during analysis)
- `plan-*` (updated or new planning entity)
- Observations on `project_state` (session work logged)

**Session-End Persistence:**
```bash
mcp__MCP_DOCKER__create_entities([
  { "type": "learning", "name": "learn-performance-metrics-analysis" },
  { "type": "session", "name": "session-2026-04-20-002" }
])
mcp__MCP_DOCKER__add_observations(plan_id, [{ "category": "build", ... }])
mcp__MCP_DOCKER__create_relations([
  { "type": "derives_from", "source": "session-...", "target": "decide-..." }
])
```

---

### Pattern 2: Design → Audit → Implement → Document

**Use for:** Feature development, code generation, complex refactoring

**Example:** "Design new component, audit for accessibility, implement with tests, document usage"

**Flow:**

```
START
  ↓
[1] Load architecture from Docker:
    mcp__MCP_DOCKER__search_nodes("feat-phase-*")
    mcp__MCP_DOCKER__open_nodes([existing_feature_ids])
  ↓
[2] Design phase:
    Orchestrator + architecture-sme agent
    Define component hierarchy, API surface, test structure
    Create implementation plan
  ↓
[3] Audit phase:
    Validation SME: input schemas, error cases
    Security SME: auth, data sensitivity
    Accessibility SME: WCAG compliance
  ↓
[4] Implement phase:
    Code-generation skill with TDD (tests first)
    Generate unit tests, integration tests, implementation
    All tests passing before moving forward
  ↓
[5] Document phase:
    Knowledge-memory skill: save spec, usage examples, gotchas
    Create learning entity with pattern discovered
  ↓
[6] Persist feature:
    create_entities([
      { "type": "feature", "name": "feat-phase-*-..." },
      { "type": "learning", "name": "learn-pattern-..." }
    ])
    add_observations(feature_id, [build, test, visual-regression])
    create_relations([feature derives_from design_decision])
  ↓
END
```

**Docker Entities Created:**
- `feat-*` (new feature with implementation details)
- `learn-*` (pattern or insight discovered)
- `decide-*` (architectural decision documented)
- Observations: build, test, visual-regression

**Session-End Persistence:**
```bash
mcp__MCP_DOCKER__create_entities([
  { "type": "feature", "name": "feat-phase-8-navbar-refactor" },
  { "type": "learning", "name": "learn-navbar-hash-based-highlighting" },
  { "type": "session", "name": "session-2026-04-20-003" }
])
mcp__MCP_DOCKER__add_observations(feature_id, [
  { "category": "build", "timestamp": "2026-04-20T19:30:00Z", "status": "passing" },
  { "category": "test", "timestamp": "2026-04-20T19:30:00Z", "suites_passed": 42 }
])
mcp__MCP_DOCKER__create_relations([
  { "type": "derives_from", "source": "feat-phase-8-...", "target": "decide-navbar-state-mgmt" }
])
```

---

### Pattern 3: Automation → Persistence → Reuse

**Use for:** Repetitive processes, scheduled tasks, batch operations, workflow templates

**Example:** "Design weekly progress review automation, execute, persist for reuse, document discovery"

**Flow:**

```
START
  ↓
[1] Search Docker for prior automations:
    mcp__MCP_DOCKER__search_nodes("infra-weekly-*")
  ↓
[2] Load existing automation patterns:
    mcp__MCP_DOCKER__open_nodes([infra_entity_ids])
    Extract tool bindings, configuration, execution notes
  ↓
[3] Design workflow with MCP-automation agent:
    Decompose steps: Research → Aggregate → Synthesize → Persist
    Map steps to skills/tools: GitHub API, Docker, Knowledge-Memory
    Define inputs/outputs between steps
  ↓
[4] Execute workflow:
    Call each skill/tool in sequence
    Log key outputs and metadata
    Handle failures gracefully (backoff, retry)
  ↓
[5] Create workflow entity:
    Type: "infrastructure" (reusable automation pattern)
    Name: "infra-{domain}-{workflow-name}"
    Include: trigger (cron), tool_bindings, execution_log
  ↓
[6] Add observations & learnings:
    add_observations(infra_id, [
      { "category": "learning", "insight": "Concurrency issue with batch operations" },
      { "category": "performance", "metric": "execution_time_seconds", "value": 42 }
    ])
    create_entities([learn-*]) if new pattern discovered
  ↓
[7] Enable discovery for next session:
    create_relations([
      { "type": "updates", "source": "infra-id", "target": "project-state-id" }
    ])
    Future search: search_nodes("infra-weekly-*") finds this automation
  ↓
END
```

**Docker Entities Created:**
- `infra-*` (automation infrastructure entity with tool bindings)
- `learn-*` (optimization or gotcha discovered during execution)
- Observations: performance, learning, blocker (if needed)

**Session-End Persistence:**
```bash
mcp__MCP_DOCKER__create_entities([
  {
    "type": "infrastructure",
    "name": "infra-weekly-progress-review",
    "properties": {
      "trigger": "cron: 0 17 * * 5",
      "tools": ["github-api", "docker-memory", "knowledge-memory"],
      "execution_time_seconds": 42,
      "last_run": "2026-04-20T17:00:00Z"
    }
  },
  { "type": "learning", "name": "learn-batch-operation-concurrency" }
])
mcp__MCP_DOCKER__add_observations(infra_id, [
  { "category": "performance", "metric": "execution_time", "value": 42 },
  { "category": "learning", "insight": "Concurrent API calls cause rate-limit threshold" }
])
```

---

## Discovery & Registry Integration

All three patterns enable **discovery** via Docker search:

| Pattern | Entity Type | Search Query | Reusable For |
|---------|------------|--------------|-------------|
| Research → Plan → Execute | `plan-*` + `learning-*` | `search_nodes("plan-domain-*")` | Similar analyses, different datasets |
| Design → Audit → Implement | `feature-*` + `decide-*` | `search_nodes("feat-phase-*")` | Similar components, different domains |
| Automation → Persistence → Reuse | `infrastructure-*` | `search_nodes("infra-workflow-*")` | Same automation, different schedules |

**Key:** Always search Docker before designing a workflow. If a similar pattern exists, adapt it rather than reinvent.

---

## Library Agent Discovery (Docker-Enabled)

**Specialized library agents** for animation and scroll domains are registered in Docker as `infrastructure` entities, enabling orchestrator discovery, contextual learning, and pattern reuse.

### Three Registered Library Agents

| Agent | Entity Name | Domain | Discovery | Contributes |
|-------|-----------|--------|-----------|-------------|
| **Framer Motion** | `agent-framer-motion` | Component animations | `search_nodes("agent-framer-motion")` | `learn-framer-motion-*` |
| **GSAP ScrollTrigger** | `agent-gsap-scrolltrigger` | Scroll animation fixes | `search_nodes("agent-gsap-scrolltrigger")` | `learn-scrolltrigger-*` |
| **AOS Scroll Reveal** | `agent-aos-scroll-reveal` | Bulk scroll animations | `search_nodes("agent-aos-scroll-reveal")` | `learn-aos-config-*` |

### Discovery Flow When Orchestrator Needs Animation Work

```
USER: "Add entrance animation to hero section"
  ↓
ORCHESTRATOR STEP 1: Categorize need
  - Needs Framer Motion (component animation)
  ↓
ORCHESTRATOR STEP 2: Search Docker for agent
  mcp__MCP_DOCKER__search_nodes("agent-framer-motion")
  → Returns: entity_id, SLA (180s), capabilities
  ↓
ORCHESTRATOR STEP 3: Load agent configuration
  mcp__MCP_DOCKER__open_nodes([entity_id])
  → Returns: Full agent metadata + execution history
  ↓
ORCHESTRATOR STEP 4: Search for prior learnings
  mcp__MCP_DOCKER__search_nodes("learn-framer-motion-*")
  → Returns: Prior patterns (spring physics, gesture gotchas, scroll viewport)
  ↓
ORCHESTRATOR STEP 5: Dispatch agent
  Inject spec + prior learnings into prompt
  Agent executes with full library domain knowledge
  ↓
ORCHESTRATOR STEP 6: Create learning entity at session end
  mcp__MCP_DOCKER__create_entities([{
    "type": "learning",
    "name": "learn-framer-motion-{new-pattern}"
  }])
  ↓
NEXT SESSION: Agent finds learning automatically
  search_nodes("learn-framer-motion-*")
  Orchestrator loads and injects into dispatch
```

### Example: Framer Motion Agent Dispatch

**Orchestrator coordinates:**

```bash
# Preflight: Load project context from Docker
mcp__MCP_DOCKER__search_nodes("electrical-website-state")
mcp__MCP_DOCKER__open_nodes([state_id])

# Load animation agent
mcp__MCP_DOCKER__search_nodes("agent-framer-motion")
mcp__MCP_DOCKER__open_nodes([agent_id])
# Returns: subtasks=[implement, create-variants, gesture, stagger, validate]

# Load prior learnings about Framer Motion
mcp__MCP_DOCKER__search_nodes("learn-framer-motion-viewport-once")
# Returns: "viewport={{ once: true }} prevents re-trigger on scroll"

# Dispatch with injected context
prompt = """
Framer Motion Agent Dispatch

Subtask: Implement
Target: HeroSection (entrance animation, 0.6s duration)

Prior Learning (inject):
- viewport={{ once: true }} prevents re-animation on scroll
- Use this pattern to avoid wasting frames

Agent config:
- SLA: 180 seconds
- Return: structured (code + testing checklist)
"""

# Agent executes with full context
# Returns: component code + new learning if discovered
```

### Entity Contribution Example

After Framer Motion agent completes:

```bash
# Agent discovers new pattern, orchestrator creates learning entity
mcp__MCP_DOCKER__create_entities([{
  "type": "learning",
  "name": "learn-framer-motion-gesture-stagger-conflict",
  "properties": {
    "title": "Gesture animations (whileHover/whileTap) conflict with staggerChildren",
    "discovery_context": "HeroSection entrance animation with item stagger",
    "issue": "Child items re-animate when parent hover fires",
    "solution": "Wrap gesture in container motion div; apply stagger only to children",
    "code_reference": "components/sections/HeroSection.tsx",
    "confidence": "high",
    "shareable": true
  }
}])

# Wire relation to show this learning came from the agent
mcp__MCP_DOCKER__create_relations([{
  "type": "documents",
  "source": "session-2026-04-20-{seq}",
  "target": "learn-framer-motion-gesture-stagger-conflict",
  "reason": "Learning discovered during HeroSection animation implementation"
}])
```

### Future Discovery: Next Animation Task

**Next week, when orchestrator needs similar animation:**

```bash
# Orchestrator automatically finds the new learning
mcp__MCP_DOCKER__search_nodes("learn-framer-motion-gesture-stagger")
# Returns: learn-framer-motion-gesture-stagger-conflict

# Injects into dispatch context
"Prior learning: Gesture animations conflict with staggerChildren.
Use the pattern documented in learn-framer-motion-gesture-stagger-conflict."

# Agent benefits from prior discovery without reinvention
```

### Central Registry Location

Full agent details (capabilities, discovery triggers, learnings structure) documented in:

**File:** `.claude/reference/LIBRARY_AGENT_REGISTRY.md`

Includes:
- Complete agent directory (3 agents)
- Capabilities table per agent
- Discovery trigger keywords
- Prior learnings examples
- Template for adding new library agents

---

**Key Benefits:**

1. ✅ **Discovery:** Agents found via `search_nodes("agent-{name}")`
2. ✅ **Context Injection:** Prior learnings loaded before dispatch
3. ✅ **Learning Accumulation:** New patterns captured and discoverable
4. ✅ **Reusability:** Next session finds and reuses patterns automatically
5. ✅ **Scalability:** New library agents added to registry; learnings grow over time

---

**Version:** 2.0 | **Status:** Complete (All Batches 1-7 + Library Agents) | **Last Updated:** 2026-04-20
