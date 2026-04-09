# MCP Automation Agent

# MCP Automation Agent

## Summary

The MCP automation agent designs multi-step workflows orchestrating skills and tools with optimized data flow. It produces detailed specifications that minimize redundant operations and maximize efficiency through parallel execution and step sequencing.

## Key Responsibilities

- Workflow Decomposition — Break high-level automation goals into ordered, executable steps with clear inputs and outputs
- Skill/Tool Mapping — Map each step to appropriate skills (20 available) or MCP tools, understand their constraints and capabilities
- Data Flow Design — Design data flow between steps, identify opportunities for parallel execution, ensure outputs align with next step inputs
- Optimization — Estimate token usage, identify redundancies, suggest efficiency improvements, estimate execution time
- Error Handling — Surface dependencies, flag constraints, suggest error recovery paths, note state management requirements

## Confidence Level

High (90%+) — Workflow design methodology is sound and well-tested. Step sequencing and data flow mapping are reliable. Limitation: complex branching logic or conditional workflows may require manual refinement.

## What This Agent Does

The MCP Automation Agent specialises in workflow design and orchestration planning. It takes a high-level automation goal and produces a detailed, step-by-step workflow specification that other systems can execute. The agent understands the available skills (20 in the assistant system) and MCP tools, knows their inputs/outputs, and designs efficient pipelines that minimise redundant operations and maximise data reuse.

### Capabilities

- Decompose high-level automation goals into ordered, executable steps
- Map steps to specific skills (Brand Voice, Content Creation, Social Media, etc.) or MCP tools
- Design data flow between steps (outputs of step N become inputs to step N+1)
- Identify parallel execution opportunities (steps that can run simultaneously)
- Suggest error handling and fallback paths
- Estimate workflow complexity and token usage
- Flag dependencies and constraints
- Optimise for efficiency (token use, step count, execution time)
- Generate human-readable workflow specifications

### Scope Boundaries

This agent does NOT:

- Execute workflows — Agent designs only; execution is handled by MCP Automation Skill or other orchestration systems
- Call other agents or skills — Agent produces a specification; no runtime invocation
- Make final automation decisions — Opus reviews and approves workflows before execution
- Handle complex branching logic — Agent focuses on linear workflows with optional error handling
- Manage state or side effects — Agent assumes stateless tools/skills (or notes state management requirements)

## How It Fits Into the System

1. The **MCP Automation Skill** (`.claude/skills/mcp-automation/SKILL.md`) receives a user request to design or execute an automation (e.g., "Create a workflow to research competitors and generate a LinkedIn post")
2. Skill gathers context: available skills (list of 20), available MCP tools, constraints (token budget, time), and goal specifics
3. Skill invokes this **MCP Automation Agent** with a subtask (e.g., "Design a 4-step workflow: research → write post → generate hashtags → save to archive")
4. Agent designs the workflow and returns a specification (Summary, Steps, Tools/Skills Map, Inputs/Outputs, Notes, Confidence)
5. Skill (Opus) reviews the specification, makes final decisions, and either: (a) executes the workflow, or (b) presents it to Herman for approval
6. **Other systems** (MCP servers, external tools) execute the steps

The agent is never called directly by users — only by the MCP Automation Skill in response to automation requests.

## Input Contract

| Parameter | Required | Description                                                                                          |
| --------- | -------- | ---------------------------------------------------------------------------------------------------- |
| `subtask` | Yes      | The automation goal (e.g., "Design a workflow to research competitors and post summary to LinkedIn") |
| `goal`    | Yes      | Detailed outcome specification (what success looks like, output format, constraints)                 |
| `context` | Yes      | Available skills (list of 20), available MCP tools, token budget, execution timeline, constraints    |

**Token guidance:** `context` should include the current scaffolded skill list. See `.claude/reference/SKILLS.md` for canonical names.

## Output Contract

| Section            | Always Present | Description                                                                                            |
| ------------------ | -------------- | ------------------------------------------------------------------------------------------------------ |
| Summary            | Yes            | 3–5 sentence explanation of the workflow design and why it's optimal for the goal                      |
| Steps              | Yes            | Numbered list of ordered steps, each with a clear action and responsible tool/skill                    |
| Tools / Skills Map | Yes            | List of tools and skills used, with their role in the workflow                                         |
| Inputs / Outputs   | Yes            | Data flowing between steps (what each step consumes and produces)                                      |
| Notes              | Yes            | Dependencies, constraints, error handling suggestions, parallel opportunities, and token cost estimate |
| Confidence         | Yes            | High / Medium / Low — indicates feasibility of the workflow as designed                                |

**Format:** Markdown with section headers. Steps should be numbered for clarity.

## Usage Example

**Skill invocation:** `/mcp-automation "Design a workflow to research competitors and generate a LinkedIn post"`

**Skill supplies to agent:**

```
subtask: Design a 4-step workflow: research competitor, write LinkedIn post, generate hashtags, save to archive

goal:
- Research 3 competitors in AI coding space
- Generate a 300–500 word LinkedIn post comparing features
- Create 10 relevant hashtags
- Save research notes and post to archives/content/
- Total token budget: 8000 tokens
- Timeline: single execution

context:
Available scaffolded `.claude` skills:
1. Research — Deep dives and market analysis
2. Business Strategy — Positioning, offers, pricing, GTM
3. Planning — Strategy, timelines, task breakdown
4. Idea Mining — Analyse YouTube, competitors, trends
5. Code Generation — Features, APIs, tests, docs
6. Content Creation — Blogs, social, email, landing pages
7. Planning — Strategic planning and execution breakdowns
... [include all currently scaffolded skills from `.claude/reference/SKILLS.md`]

Available MCP tools:
- WebFetch (fetch URLs)
- WebSearch (search the web)
- Bash (run commands)

Constraints:
- Single-user execution
- Herman must review outputs before posting
- Save to archives/content/ and archives/insights/
```

**Agent returns:**

```
### Summary
This workflow combines research (web search + analysis), content creation (LinkedIn post writing), and brand-applied social media formatting. The design uses parallel research steps for efficiency, streams findings into content creation, applies brand voice, and archives results. Total estimated execution: ~6500 tokens; 4 steps.

### Steps

1. **Research competitors** — Use `/research` skill to analyse 3 competitors (GitHub Copilot, ChatGPT, Claude Code). Gather features, pricing, market positioning, unique selling points.

2. **Synthesise competitive analysis** — Compile research into structured findings (features matrix, pricing comparison, positioning gaps). Store in temporary variable for next step.

3. **Write LinkedIn post** — Use `/content-creation` skill to write a 300–500 word LinkedIn post comparing Full Stack Fusion to competitors. Use synthesised analysis as context. Output: raw post draft.

4. **Apply brand voice + generate hashtags** — Use `/brand-voice` and `/social-media` skills in sequence. (a) Apply brand voice to post (professional, approachable, educational). (b) Use `/social-media` to generate 10 hashtags and LinkedIn-optimised formatting.

5. **Archive results** — Use `/knowledge-memory` skill to save research findings to `archives/insights/competitive-analysis/`. Save final post to `archives/content/linkedin-posts/`.

### Tools / Skills Map

| Step | Skill | Input | Output |
|------|-------|-------|--------|
| 1 | Research | "GitHub Copilot, ChatGPT, Claude Code" | Competitor analysis (features, pricing, positioning) |
| 2 | (Synthesis) | Competitor data | Structured competitive matrix |
| 3 | Content Creation | Competitive matrix + audience context | Draft LinkedIn post (300–500 words) |
| 4a | Brand Voice | Draft post + existing brand voice notes | Polished post with voice applied |
| 4b | Social Media | Polished post | Final post + 10 hashtags + formatting |
| 5 | Knowledge Memory | Research + final post | Archives written; references returned |

### Inputs / Outputs

- **Step 1 input:** List of 3 competitors (GitHub Copilot, ChatGPT, Claude Code)
- **Step 1 output:** Competitive analysis (features, pricing, market positioning)
- **Step 2 input:** Competitive analysis from Step 1
- **Step 2 output:** Structured competitive matrix (features, pricing, positioning, gaps)
- **Step 3 input:** Competitive matrix + Full Stack Fusion positioning + target audience (early-career developers)
- **Step 3 output:** Draft LinkedIn post (300–500 words, hook-body-CTA structure)
- **Step 4 input:** Draft post + existing brand voice guidelines
- **Step 4 output:** Polished post + 10 hashtags + LinkedIn formatting
- **Step 5 input:** Research analysis + final post
- **Step 5 output:** Archive paths (research in insights/, post in content/)

### Notes

- **Parallel opportunities:** Steps 1 research could be split into 3 parallel WebFetch calls (one per competitor) for faster execution. Skill may optimise.
- **Token estimate:** Research (~1500), synthesis (~800), content creation (~2500), brand voice (~800), social media (~600), archival (~300) = ~6500 tokens total.
- **Error handling:** If research fails (no data), Content Creation skill should note ambiguity and ask Herman for competitive context. If brand voice not available, use default tone.
- **Manual approval:** After Step 4, present final post to Herman for review before archival (Step 5).
- **Data persistence:** Competitive analysis should be stored in `archives/insights/` for reuse in future positioning updates.

### Confidence

High (Workflow is linear, uses standard skills, has clear inputs/outputs. All steps are feasible within token budget. Parallel opportunities exist but are optional.)
```

## Error Handling

| Scenario                                                                       | Agent Behaviour                                                                                                                                                                                         |
| ------------------------------------------------------------------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Ambiguous goal (e.g., "automate something")                                    | Returns Confidence: Low; Notes: "Goal is too vague. Recommend clarifying: (1) What is the end result? (2) What inputs are available? (3) What constraints exist?" Provides generic multi-step template. |
| Goal requires unavailable skills (e.g., "deploy to production")                | Notes: "Goal requires [skill not available]. Current skill set can achieve [alternative outcome]." Suggests workaround or flags for manual step.                                                        |
| Circular dependencies (step A needs output of step B, but B needs output of A) | Confidence: Low; Notes: "Workflow has circular dependency: Step A → B → A. Recommend splitting into 2 workflows or adding external input."                                                              |
| Out-of-scope request (e.g., "execute this workflow")                           | Notes: "Out of scope — agent designs workflows. MCP Automation Skill or external system handles execution." Returns design specification only.                                                          |
| Token budget exceeded                                                          | Confidence: Medium; Notes: "Estimated tokens [X] exceed budget [Y]. Recommend: (1) Reducing step count, (2) Using simpler skills, (3) Running in parallel batches."                                     |

## Related Files

- **Calling skill:** `.claude/skills/mcp-automation/SKILL.md` — User-facing skill that orchestrates agent invocations and may execute workflows
- **Agent prompt:** `.claude/agents/mcp-automation/AGENT.md` — The sub-agent Haiku prompt (source of truth for I/O)
- **Execution:** Workflows are executed by the MCP Automation Skill or external orchestration systems; this agent produces specifications only
- **Related skills:** This agent may reference all scaffolded `.claude` skills; see `.claude/reference/SKILLS.md` for the complete list

## Integration

- **Receives from:** `/mcp-automation` skill via Agent tool delegation (for workflow design and orchestration planning subtasks)
- **Returns to:** `/mcp-automation` skill for execution and monitoring
- **Invocation pattern:** Body text in mcp-automation SKILL.md delegates focused workflow design subtask (e.g., "Design a workflow to research competitors and post to LinkedIn")
- **Data format:** Structured output with summary, ordered steps, tools/skills mapping, inputs/outputs, notes, and confidence level

## Integration Notes

- **Skill registry:** The `context` parameter must include an accurate list of scaffolded skills. See `.claude/reference/SKILLS.md` for the canonical list.
- **Token budgeting:** Workflows can be optimized for token efficiency. Agent provides estimates; actual execution may vary.
- **Parallel execution:** Agent identifies parallel opportunities but does not force them. Executor decides which steps run in parallel.
- **Data persistence:** Agent assumes output of one step is available as input to the next (via variables, files, or context). Executor handles data passing.
- **Future enhancement:** As workflows grow in complexity, consider adding support for conditional branching and loops (not currently supported by this agent).
