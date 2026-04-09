# MCP Automation Skill

Automation engineer: design and execute multi-step workflows that orchestrate skills, tools, and file operations to accomplish complex goals efficiently.

## When to Use

- **Automate multi-step workflows** — Chain operations: research → create content → apply brand voice → archive
- **Batch process multiple files** — Apply the same operation across multiple files or items at once
- **Compose complex tasks** — Break large goals into ordered steps and execute them sequentially
- **Orchestrate tool combinations** — Combine tools (Read, Write, Glob, Grep) with skills for complex operations
- **Archive and organize** — Automatically save, tag, and organize results from multi-step operations
- **Recurring automations** — Create reusable templates for common workflows (daily content pipeline, weekly reports)
- **Error recovery workflows** — Design workflows with fallback steps for robustness

**Trigger:** `/mcp-automation "[workflow goal and steps]"`

## Key Features

- **Workflow Design** — Plan multi-step operations with MCP Automation agent (doesn't execute, just designs)
- **Tool Orchestration** — Coordinate MCP tools (Read, Write, Glob, Grep) and scaffolded skills
- **Data Flow Management** — Pass outputs from step N as inputs to step N+1
- **Batch Processing** — Apply workflows to multiple files or items
- **Error Handling** — Include fallback steps for common failure scenarios
- **Reusable Templates** — Save workflow designs and reuse them across projects
- **Parallel Execution** — Run independent steps simultaneously for faster completion
- **Archive Integration** — Automatically save results to appropriate archives

## How to Invoke

```bash
/mcp-automation "Design workflow: research 3 competitors → write comparison blog → generate 10 hashtags → save to archives"
/mcp-automation "Create workflow to batch-process all client emails and archive them"
/mcp-automation "Automate daily content pipeline: analyze YouTube trends → write 3 post ideas → generate social captions"
/mcp-automation "Design error-recovery workflow: try operation, fall back to manual, log reason"
```

## Workflow Building Blocks

### Skills Available (current `.claude` scaffold)

- `code-generation`
- `knowledge-memory`
- `mcp-automation`
- `skill-builder`

Canonical list: `.claude/reference/SKILLS.md`.

### Tools Available

- **File Operations:** Read, Write, Edit, Glob, Grep
- **Git:** Safe git operations (no force-push, no reset --hard)
- **Web:** WebFetch, WebSearch (read-only)
- **System:** Bash (approved commands only)

## Examples

### Example 1: Content Pipeline Workflow

```
/mcp-automation "Design workflow: (1) Research YouTube trends, (2) Write 3 blog post ideas, (3) Pick best idea, (4) Write full blog post, (5) Generate social captions, (6) Archive blog + captions"
```

**Output Workflow:**

- Step 1: `/idea-mining [YouTube trends]` → research findings
- Step 2: `/planning [3 blog ideas from research]` → outlined ideas
- Step 3: Opus selects best idea
- Step 4: `/content-creation [selected idea outline]` → full blog post
- Step 5: `/social-media [blog post]` → LinkedIn, X, Instagram captions
- Step 6: `/knowledge-memory [save blog + captions]` → archives
- Estimated tokens: 8000

### Example 2: Batch Client Email Processing

```
/mcp-automation "Design workflow to process 10 client emails: summarize each, extract action items, archive to client-work folder, generate status email"
```

**Output Workflow:**

- Step 1: Glob find all emails in `inbox/`
- Step 2: For each email: `/client-management [summarize and extract]`
- Step 3: For each result: `/knowledge-memory [save to archives/client-work/[client]/]`
- Step 4: `/client-management [generate summary status email]`
- Estimated tokens: 12000 (for 10 emails)

### Example 3: Daily Content Automation

```
/mcp-automation "Design recurring workflow (daily): check trending topics → generate 5 post ideas → write captions for each → schedule on social"
```

**Output Workflow:**

- Step 1: WebSearch trending topics → list
- Step 2: `/idea-mining [trending topics]` → 5 ideas
- Step 3: For each idea: `/content-creation [idea] → `/social-media [content]` → caption
- Step 4: Archive all captions to `archives/content/social/`
- Scheduled: Daily at 9 AM
- Estimated tokens: 6000/day

## Workflow Design Process

1. **Describe the goal** — What should the workflow accomplish?
2. **Agent designs workflow** — MCP Automation agent breaks it into steps
3. **Review design** — Check step order, data flow, error handling
4. **Approve & execute** — Confirm design, skill executes steps in order
5. **Archive results** — All outputs saved to appropriate archives

## When NOT to Use

❌ Do NOT use MCP Automation for:

- Simple single-step operations (invoke the skill directly)
- One-off, non-repeatable workflows (MCP best for reusable patterns)
- Operations requiring manual human judgment at each step
- Workflows with undefined step order or unclear data flow
- Operations that need real-time user input between steps

## Worked Examples

**For full worked examples:** `.claude/reference/examples/mcp-automation/worked-examples.md`

## Safety & Constraints

**Whitelisted Operations Only:**

- ✅ Read, Write, Edit, Glob, Grep (safe file operations)
- ✅ Safe git ops (commits, branch creation, safe merges)
- ✅ WebFetch, WebSearch (read-only)
- ✅ All scaffolded `.claude` skills
- ❌ Destructive git (force-push, reset --hard, delete branches)
- ❌ System commands (no arbitrary bash)
- ❌ Database operations
- ❌ External API calls (except approved tools)

See `.claude/skills/mcp-automation/guardrails.md` for full safety guidelines.

## Error Handling in Workflows

| Scenario                          | How Workflow Handles                                                             |
| --------------------------------- | -------------------------------------------------------------------------------- |
| Step fails (e.g., API rate limit) | Halt execution, log failure, and request explicit operator approval before retry |
| Missing input for step            | Workflow halts, logs what's missing, user reviews                                |
| Output format unexpected          | Workflow validates output, alerts if format doesn't match next step's input      |
| Concurrent steps conflict         | Sequential execution prevents conflicts; parallel steps don't share state        |
| Archive path doesn't exist        | Workflow creates directory structure if needed                                   |

## Advanced Usage

- **Token budgeting** — Workflows estimate token cost; can optimize by running steps in parallel or batches
- **Conditional branching** — Design: "If output contains X, do Y; else do Z"
- **State tracking** — Workflows maintain state across steps (e.g., "research findings → content → archive")
- **Version templating** — Save workflow designs and reuse them across projects
- **Monitoring** — Log all step executions to `.claude/logs/skill-executions.log` for auditing

## Integration with Other Skills

- **All scaffolded `.claude` skills** — Can orchestrate any registered skill in multi-step workflows
- **Knowledge Memory** — Archive workflow results automatically
- **Client Management** — Batch-process client communications
- **Content Creation** — Pipeline: research → write → apply voice → social → archive

## Related Files

- **MCP Automation Agent:** `.claude/agents/mcp-automation/AGENT.md` — Designs workflows (Haiku)
- **Safety Guidelines:** `.claude/skills/mcp-automation/guardrails.md` — Full safety specification
- **Execution Log:** `.claude/logs/skill-executions.log` — Track all workflow step executions
- **Related skills:** Knowledge Memory (archives), Client Management (batch processing)

---

**For full technical documentation, see [`SKILL.md`](SKILL.md)**
