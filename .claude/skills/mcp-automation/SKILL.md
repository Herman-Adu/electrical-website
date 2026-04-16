---
name: mcp-automation
description: Use this skill WHENEVER the user mentions repetition, batch operations, or workflow sequences — even if they don't explicitly ask to "automate". Use for: automating multi-step workflows, batch-generating content, creating repeatable processes, orchestrating tools/APIs/skills together, setting up pipelines, chaining operations. Trigger on: "how can I do this repeatedly", "automate X", "batch process", "connect these tools", "can we chain", "I need to do this every time", "set up a workflow", or any mention of doing the same thing multiple times.
argument-hint: "[workflow goal]"
disable-model-invocation: true
---

## Current Priorities (auto-injected)

!`cat context/current-priorities.md 2>/dev/null || echo "No priorities file. Ask user for workflow context and priority alignment."`

# MCP Automation Skill

A system that orchestrates MCP tools and automates multi-step workflows.
This skill acts as the Automation Engineer of the Executive Assistant.

It integrates with:

- Research Skill (automated research workflows)
- Planning Skill (auto-updating plans and tasks)
- Content Creation & Social Media (batch generation and repurposing)
- Code Generation (scaffold, refactor, document)
- Client Management (auto-summaries, filing, logging)
- Knowledge/Memory Skill (saving, retrieving, updating files)

## Execution Method

1. **Validate required tools are available**
   - Confirm all skills (planning, code-generation, knowledge-memory) are accessible
   - Check Context7 library resolver is working (for current API docs)
   - Fail gracefully with error message if dependencies missing

2. **Parse the request**
   - Identify the workflow goal and steps
   - Identify which skills/tools are involved
   - **DISAMBIGUATION:** If the request is only “save this to archives”, delegate to Knowledge Memory instead

3. **If needed, call the MCP Automation Agent**
   - Use agent for: workflow design, step decomposition, tool mapping, input/output definition
   - Do NOT use for: execution or final synthesis

4. **Design the workflow**
   - Synthesize available skills and constraints
   - Define each step clearly
   - Map steps to skills and MCP tools
   - Define inputs/outputs between steps

5. **Check workflow templates** (if applicable)
   - Browse `templates/` folder for pre-built patterns
   - Adapt templates to current request

6. **Execute the workflow**
   - Call skills/tools in sequence
   - Handle failures gracefully
   - Log key outputs

7. **Return the result**
   - Workflow summary with outputs and paths
   - How to re-run it

---

## Output Format

### For workflow design:

# Workflow: {Name}

## Goal

…

## Steps

1. …
2. …
3. …

## Tools / Skills Used

- …

## Inputs / Outputs

- …

---

### For execution summary:

# Automation Run Summary

## Workflow

…

## Steps Executed

- …

## Outputs

- …

## Notes

- …

---

## Notes

- Use Haiku for workflow design and step decomposition.
- Use Opus for orchestration and explanation.
- Always respect file structure and naming conventions.
- Never delete or overwrite without explicit instruction.
- For simple single-file saves, use Knowledge Memory instead (not this skill).
- See `README.md` for documentation and workflow templates.
- See `templates/` folder for pre-built workflow templates and integration examples.
