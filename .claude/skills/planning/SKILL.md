---
name: planning
description: Use this skill WHENEVER someone mentions goals, timelines, tasks, roadmaps, phases, sprints, milestones, or deadlines — even if they don't explicitly ask for a "plan". Use for: breaking down projects, creating execution timelines (90-day/monthly/weekly/daily), estimating effort, sequencing work, identifying dependencies, and managing priorities. Trigger on any statement involving "how should I", "in what order", "what's the timeline", "I need to figure out", or ambiguity about project sequencing.
argument-hint: "[goal or timeframe]"
disable-model-invocation: true
---

## Live Context (auto-injected)

Current priorities: !`cat context/current-priorities.md 2>/dev/null || echo "No current priorities defined. Proceed with planning based on the goal provided."`
Current goals: !`cat context/goals.md 2>/dev/null || echo "No quarterly goals defined. Proceed with planning based on the goal provided."`
Active phase: !`cat plans/phases/current.md 2>/dev/null || echo "No active phase. Planning is not phase-constrained."`

# Planning Skill

A strategic planning system that:

- Breaks goals into projects
- Breaks projects into tasks
- Creates timelines and milestones
- Generates 90-day, monthly, weekly, and daily plans
- Tracks progress and updates context files
- Uses sub-agents for task breakdown, estimation, and risk analysis
- Integrates with the Research Skill to turn insights into execution

This skill acts as the COO of the Executive Assistant.

---

## Execution Method

1. **Parse the request**
   - The request is: $ARGUMENTS
   - Identify the goal, timeframe, constraints, and desired outcome.

2. **Docker Preflight (Session Start)**
   - Search for project state: `mcp__MCP_DOCKER__search_nodes("electrical-website-state")`
   - Load context: `mcp__MCP_DOCKER__open_nodes([returned_entity_ids])`
   - Extract: active phase, next_tasks, blockers, prior decisions
   - If Docker unavailable: check `.claude/CLAUDE.md` § Session State for fallback notes
   - This ensures plans build on verified prior context, not assumptions

3. **Inject current context (Context7)**
   - After Docker preflight, inject live documentation context:
   - Call `mcp__MCP_DOCKER__resolve-library-id` to identify relevant context docs
   - Call `mcp__MCP_DOCKER__get-library-docs` to pull in current goals, priorities, architecture
   - Inject resolved context into planning subtasks for grounding in current state
   - This ensures plans build on verified, up-to-date information (not stale memory)

3. **Break into components**
   - Define projects, phases, or workstreams.
   - If needed, call `.claude/agents/planning/AGENT.md` with:
     - `subtask`: [the specific planning sub-question: task breakdown, timeline estimation, dependency mapping, or risk analysis]
     - `context`: [relevant notes from Context7 injection + research from prior steps]
   - Use the agent for: task decomposition, timeline estimation, dependency mapping, risk identification, milestone generation
   - Do NOT use the agent for: high-level strategic framing or synthesis (keep at Opus level)
   - Where workstreams are independent, run planning agents in parallel to reduce total execution time.

3. **Generate the plan** (ultrathink)
   - Create a structured plan with:
     - phases
     - milestones
     - tasks
     - timelines
     - dependencies
     - risks
     - success criteria

4. **Update context files**
   - **IMPORTANT: Never overwrite context files without summarizing previous content first.**
   - If the plan is long-term:
     - Update `context/goals.md` with long-term milestones and quarterly roadmap
   - If the plan is short-term:
     - Update `context/current-priorities.md` with immediate focus areas
   - Log major decisions in `decisions/log.md`
   - Save full plan to: `archives/plans/YYYY-MM-DD-[plan-name].md`

5. **Return the plan**
   - Deliver a clean, structured Markdown plan.

---

### Resource Mode Handling (P2.7 Enhanced)

The Planning Skill adapts to available resources and user preferences.

#### Specify Resource Mode

Users explicitly request resource mode in skill invocation (auto-detection is a future enhancement):

**Explicit request:**
- "low-intensity" / "reduced mode" / "sequential mode" → **LOW MODE**
- "full-intensity" / "full resources" / "stress test" → **FULL MODE**
- No explicit request → defaults to **FULL MODE** (unless context/goals.md specifies otherwise)

#### LOW-INTENSITY MODE (Limited Resources)

**Usage:**
- Limited API quota (e.g., free tier, rate-limited account)
- Need results ASAP (accept lower quality for speed)
- Testing/validation (don't need perfect output)

**Execution:**
- Haiku agents only (smaller, faster, cheaper)
- Sequential execution (1 agent at a time, not parallel)
- 1 web search maximum per subtask
- Compress outputs (shorter, no fluff)
- Opus does heavy lifting (synthesis, final polish)

**Example:**
```
PLANNING: 90-day roadmap for startup
MODE: Low-intensity (limited budget)
  ├─ Agent 1: Task breakdown (sequential)
  ├─ Agent 2: Timeline estimation (after Agent 1)
  ├─ Agent 3: Risk identification (after Agent 2)
  └─ Opus: Final plan synthesis
TOTAL TIME: 10–15 minutes
```

#### FULL-INTENSITY MODE (Full Resources)

**Usage:**
- Claude Pro account (unlimited access)
- Want best possible output (accept slower for quality)
- Complex planning (multiple scenarios, deep analysis)

**Execution:**
- Opus + Haiku agents (best quality + speed)
- Parallel execution (multiple agents simultaneously)
- 2–3 web searches per subtask
- Rich outputs (detailed analysis, scenarios, trade-offs)
- Opus does synthesis + validation

**Example:**
```
PLANNING: Go-to-market strategy for SaaS
MODE: Full-intensity (Pro account)
  ├─ Agent 1: Market research (parallel)
  ├─ Agent 2: Competitive analysis (parallel)
  ├─ Agent 3: Customer discovery (parallel)
  ├─ Agent 4: Pricing models (parallel)
  └─ Opus: Final strategy + recommendations
TOTAL TIME: 20–30 minutes
```

#### Resource Estimation Table

| Mode | Agents | Parallelization | Web Searches | Token Budget | Est. Time | Quality |
|------|--------|-----------------|--------------|--------------|-----------|---------|
| LOW | 3 (Haiku) | Sequential | 1 per task | ~10K | 10–15m | Good |
| FULL | 6–12 (Opus+Haiku) | Parallel | 2–3 per task | ~30K | 20–30m | Excellent |

#### How to Specify Mode

**In skill invocation:**
```
/planning "90-day roadmap" --mode=low-intensity
/planning "GTM strategy" --mode=full-intensity
/planning "quarterly plan" (defaults to full-intensity)
```

**In context via comment:**
```markdown
[MODE: Low-intensity - budget constraints]
Plan our Q1 marketing campaign.
```

**Via context/goals.md:**
```yaml
resource_mode: low-intensity  # or full-intensity
```

**Note:** Auto-detection (intelligent mode switching based on timeouts) is a future enhancement. Currently, modes must be explicitly specified or will default to full-intensity.

---

## Output Format

Return a Markdown document:

# Plan — {topic}

## Objective

A clear statement of the goal.

## Timeline

- Start date
- End date
- Phases

## Milestones

- Milestone 1
- Milestone 2
- Milestone 3

## Workstreams

### Workstream A

- Tasks
- Dependencies
- Risks

### Workstream B

- Tasks
- Dependencies
- Risks

## Weekly Breakdown

Week-by-week plan.

## Daily Focus (optional)

A suggested daily execution plan.

## Success Criteria

How we know the plan worked.

---

## Integration Points

### Consumers
- **Code Generation** — Consumes planning tasks to understand feature scope, timeline, and dependencies for implementation
- **Content Creation** — Uses planning framework (calendar, topic structure, messaging) to guide content strategy and cadence
- **Client Management** — References planning deliverables (timelines, milestones, scope) to inform proposals and status updates
- **MCP Automation** — Consumes planning breakdowns to orchestrate multi-step workflows and automation sequences

---

## Edge Cases & Error Recovery

| Scenario | Recovery |
|----------|----------|
| **Unrealistic timeline** | Flag immediately: "Timeline seems tight for [reason]. Add [N weeks] or reduce scope to [subset]?" |
| **Missing resource estimates** | Ask user: "Do you have budget/team for this? I'll adjust scope accordingly." |
| **Unclear success metrics** | Suggest metrics: "For [goal], success could mean: [3 options]. Which resonates?" |
| **Conflicting priorities** | Surface trade-offs: "You want [A] and [B], but they compete on [resource]. Recommend: [priority order]." |
| **Incomplete business context** | Continue with sensible defaults: "Missing business context. Using standard execution costs. Update if different." |

---

## Notes

- Use Haiku for subtasks to save tokens.
- Use Opus for synthesis and strategy.
- Always update context files when plans affect priorities or goals.
- Never overwrite context files without summarizing previous content.
- See `README.md` for documentation and planning templates.
