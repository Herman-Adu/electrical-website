# Planning Skill

Strategic planning system: breaks goals into projects, projects into tasks, creates timelines and execution plans.

## When to Use

Use Planning when you need to:
- Create 90-day, monthly, weekly, or daily execution plans
- Break a goal into projects and workstreams
- Estimate timelines and identify dependencies
- Identify risks and mitigation strategies
- Define milestones and success criteria
- Constrain planning to current phase (if active)

**Trigger phrases:**
- `/planning [goal or timeframe]`
- "Create a 90-day plan for X"
- "Break down this project into tasks"
- "Plan our Q1 strategy"
- "What's our weekly execution plan?"

## How It Works

```
1. You provide goal + timeframe (e.g., "90-day product launch")
2. Planning skill clarifies constraints (current priorities, phase, goals)
3. Uses agents for task decomposition, estimation, dependency mapping
4. Generates structured plan with:
   - Phases and milestones
   - Workstreams and dependencies
   - Weekly/daily breakdown
   - Risks and mitigation
5. Updates context files (goals, priorities) if long-term
6. Saves to archives/plans/
```

## Key Features

- **Adaptive Resource Mode** — LOW (fast, cheap), FULL (comprehensive)
- **Parallel Planning** — Haiku agents decompose subtasks in parallel
- **Context-Aware** — Respects current priorities and phase constraints
- **Risk Analysis** — Identifies blockers and mitigation strategies
- **Milestone Tracking** — Clear milestones for execution
- **Phase Integration** — Plans respect active phase (if using Phase Tracker)

## Resource Modes

**LOW-INTENSITY** (limited budget, fast results):
- Sequential execution (1 agent at a time)
- ~10–15 minutes, ~10K tokens
- Good for simple plans

**FULL-INTENSITY** (best results):
- Parallel execution (4–6 agents simultaneously)
- ~20–30 minutes, ~30K tokens
- Excellent for complex strategic planning

**Usage:**
```
/planning "90-day roadmap" --mode=low-intensity
/planning "GTM strategy" --mode=full-intensity
/planning "quarterly plan" (defaults to full)
```

## Output

Plans are saved to: `archives/plans/[YYYY-MM-DD]-[plan-name].md`

## Context Files Setup

Planning uses three optional context files (auto-injected at skill start). **All are optional** — planning works without them — but provide continuity across sessions.

### File 1: `context/current-priorities.md`
**Purpose:** Short-term focus areas (weekly/monthly)

**When used:** Skill checks this to constrain planning to immediate priorities

**Format:**
```markdown
# Current Priorities — [Month/Quarter]

1. **[Priority 1]** — [Why it matters]
2. **[Priority 2]** — [Why it matters]
3. **[Priority 3]** — [Why it matters]

**Updated:** YYYY-MM-DD
```

**Initialize:**
```bash
/planning "Define our top 5 priorities for the next month"
# OR manually: touch context/current-priorities.md
```

### File 2: `context/goals.md`
**Purpose:** Long-term goals (quarterly/yearly)

**When used:** Skill aligns plans with strategic direction

**Format:**
```markdown
# Quarterly Goals — Q1 2026

## Goal 1: [Name]
- Target: [Measurable outcome]
- Timeline: [Target date]
- Success metric: [How we measure]

**Updated:** YYYY-MM-DD
```

**Initialize:**
```bash
/planning "Define our Q1 2026 goals"
# OR manually: touch context/goals.md
```

### File 3: `plans/phases/current.md`
**Purpose:** Active phase state (cross-conversation continuity)

**When used:** Planning respects current phase if set

**Initialize:** Managed by `/phase-tracker` skill automatically

**Fallback:** If missing, planning proceeds unconstrained.

**Note:** Never overwrite context files without summarizing previous content first.

## Error Handling

| Scenario | Recovery |
|----------|----------|
| Goal is too vague | Ask clarifying questions (what "done" looks like, deadline, constraints) |
| Timeline unrealistic | Break into phases; identify critical path |
| Missing dependencies | Flag blockers; note what must complete first |
| Conflicting priorities | Rank by impact/urgency; sequence phases accordingly |

## When NOT to Use

❌ Do NOT use planning for:
- Quick 1-off tasks (just do them)
- Immediate tactical decisions (use business-strategy for strategy first)
- Plans without clear goals (clarify first)
- Projects without stakeholder alignment (confirm goals before planning)

## Workflow Chain

**Common integration pattern:**
1. **Research** — Gather market/technical insights
2. **Business Strategy** — Define strategic direction
3. **Planning** — Break strategy into execution phases
4. **Phase Tracker** — Execute the plan day-by-day
5. **Knowledge Memory** — Archive learnings for future reference

---

**For full documentation, see [`SKILL.md`](SKILL.md)**
