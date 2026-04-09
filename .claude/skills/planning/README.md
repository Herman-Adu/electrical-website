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

## Context Files

Planning uses three optional context files (auto-injected):

- **`context/current-priorities.md`** — Short-term focus areas
- **`context/goals.md`** — Quarterly goals
- **`plans/phases/current.md`** — Active phase state

All optional. If missing, planning proceeds unconstrained.

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
