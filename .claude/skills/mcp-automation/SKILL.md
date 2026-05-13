---
name: mcp-automation
description: Use when automating multi-step workflows, chaining MCP tools, or setting up pipelines. Trigger phrases: automate, batch process, workflow, chain operations, repeat, run CI, set up a pipeline.
argument-hint: "[workflow goal]"
disable-model-invocation: true
---

# MCP Automation Skill — Nexgen Electrical Innovations

Orchestrates MCP tools and automates multi-step workflows for the Nexgen Electrical Innovations project. Always prefer MCP tools over CLI equivalents.

## MCP Tool Namespace Reference

| Namespace | Purpose | Never use instead |
|-----------|---------|-------------------|
| `mcp__MCP_DOCKER__github_official__*` | All GitHub ops (PRs, merges, CI checks, issues) | `gh` CLI |
| `mcp__MCP_DOCKER__memory_reference__*` | Session state and project knowledge | .md files |
| `mcp__MCP_DOCKER__playwright__*` | Browser automation and E2E verification | Manual browser |
| `mcp__MCP_DOCKER__sequential_thinking__*` | Complex multi-step reasoning | — |
| `mcp__MCP_DOCKER__nextjs_devtools__*` | Build and type checking | — |

**Playwright:** Always set `PLAYWRIGHT_REUSE_SERVER=true` when dev server is running on port 3000.
**GitHub automation:** Use `mcp__MCP_DOCKER__github_official__*` tools — NOT `gh` CLI.
**Agent dispatch:** `Agent(subagent_type="general-purpose")` for subtask delegation — never implement >50 LOC directly.

## Execution Method

1. **Docker Preflight**
   - Search project state: `pnpm docker:mcp:memory:search "nexgen-electrical-innovations-state"`
   - Load context: `pnpm docker:mcp:memory:open nexgen-electrical-innovations-state`
   - If Docker unavailable: check `.claude/CLAUDE.md` § Session State for fallback notes

2. **Validate tool availability**
   - Confirm required MCP namespaces are reachable (health: `curl -sf http://localhost:3100/health`)
   - Fail gracefully with clear error message if dependencies missing

3. **Parse the request**
   - Identify the workflow goal and steps
   - Identify which MCP tools / namespaces are involved
   - If request is only "save this to archives" → delegate to knowledge-memory instead

4. **Design the workflow**
   - Synthesize available tools and constraints
   - Map each step to the correct MCP namespace
   - Define inputs/outputs between steps

5. **Execute the workflow**
   - Call MCP tools in sequence via correct namespaces
   - Handle failures gracefully; log key outputs

6. **Persist workflow result**
   - Persist via Docker memory — see `.claude/CLAUDE.md` Memory Rules

7. **Return the result**
   - Workflow summary with outputs
   - How to re-run it

---

## Output Format

### For workflow design:

# Workflow: {Name}
## Goal …
## Steps
1. …
2. …
## Tools / MCP Namespaces Used
- …
## Inputs / Outputs
- …

---

### For execution summary:

# Automation Run Summary
## Workflow …
## Steps Executed
- …
## Outputs
- …
## Notes
- …

---

## Notes

- Always respect file structure and naming conventions (see `.claude/rules/naming-conventions.md`)
- Never delete or overwrite without explicit instruction
- For simple single-file saves, use knowledge-memory instead (not this skill)
- Safety guardrails (rate limits, rollback policy, destructive-op rules): see [guardrails.md](guardrails.md)
