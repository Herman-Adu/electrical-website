---
name: mcp-automation
description: Use when someone asks to automate multi-step workflows, batch-generate content, create repeatable processes, or orchestrate multiple tools and skills together.
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

1. **Docker Infrastructure Validation** (NEW for Phase 22)
   - Check docker-compose status: `docker-compose ps` (list running services)
   - **Step 0: Pre-Workflow Container Health Check** (NEW in Phase 22 Week 3):
     - For each required service:
       - Get restart count: `docker inspect [service] | grep '"RestartCount"'`
       - If RestartCount >= 3 (at max limit):
         - Log warning: "Service [name] has hit max restart limit (3/3)"
         - Recommend diagnostic: "Run `bash scripts/docker-recovery.sh --verbose` for details"
         - Fail workflow with actionable error message (do not attempt restart)
       - If RestartCount 1-2 (elevated):
         - Log info: "Service [name] has experienced [N] restarts recently"
         - Continue workflow but monitor closely
       - If RestartCount == 0:
         - Service is healthy, proceed normally
   - Identify required Tier-1 services for this workflow:
     - GitHub: For research/client work
     - OpenAPI: For code generation/schema analysis
     - Playwright: For web automation/screenshots
     - Sequential Thinking: For complex reasoning/planning
     - Memory: For knowledge base access
     - Next.js DevTools: For development/testing tools
     - Executor: For complex browser automation
     - Wikipedia: For reference/research context
   - Identify required Tier-2 services (on-demand):
     - Prisma PostgreSQL: For code-generation (database schema validation)
     - Resend: For client-management (sending proposals/emails)
     - astgrep: For code-generation (AST pattern analysis)
     - Context7: For planning (context aggregation/synthesis)
     - Fetch (Reference): For research (HTTP fetching alternative)
     - Excalidraw (Reference): For visualization (diagram generation)
   - Start auto-startup logic:
     - If Tier-1 service not running: `docker-compose start [service-name]` → wait 10–30s for health check
     - If Tier-2 service needed: `docker-compose -f compose.tier2.yml up -d [service-name]` → wait 2–5s for health check
     - If any service fails to start: Report error with container logs; abort workflow

2. **Fetch context via Context7** (if needed)
   - Before workflow design, resolve relevant documentation:
   - Identify workflow domain (e.g., “GitHub automation”, “content batch generation”, “data pipeline”)
   - Call `mcp__MCP_DOCKER__resolve-library-id [domain-name]` to identify relevant tools/libraries
   - Call `mcp__MCP_DOCKER__get-library-docs [library-id]` to fetch current API and tool docs
   - Inject resolved context into workflow design to ensure steps use current tool signatures
   - Fallback: If library resolution fails, proceed with agent using cached tool knowledge
   - **Why:** Ensures workflows reflect current MCP tool APIs, not outdated tool signatures

3. **Parse the request**
   - The request is: $ARGUMENTS
   - **DISAMBIGUATION:** If the request is only “save this to archives” or “store this in context”, delegate to Knowledge Memory instead. This skill is for multi-step workflows with 3+ steps, not single file operations.
   - Identify the workflow goal
   - Identify the steps (explicit or inferred)
   - Identify which skills/tools are involved

4. **Pre-Workflow Validation Gate**
   - After infrastructure check, validate prerequisites:
     - Check: Are all required services healthy? (health check pass)
     - Check: Is there enough memory available? (docker stats)
     - Check: Is network connectivity OK? (ping localhost:3000/health)
     - Fail gracefully with actionable error messages (e.g., “Prisma not healthy. Start with: `docker-compose -f compose.tier2.yml up prisma-postgres`”)
     - Cache health status (5s TTL to avoid repeated checks)

5. **If needed, call the MCP Automation Agent**
   - Call `.claude/agents/mcp-automation/AGENT.md` with:
     - `subtask`: [the specific automation request: workflow design, step decomposition, tool selection, or error handling strategy]
     - `goal`: [what the user wants to achieve]
     - `context`: [skills/tools available, file structure, constraints, + Context7 library docs if resolved]
   - Use the agent for: workflow design, step decomposition, tool mapping, input/output definition
   - Do NOT use the agent for: execution or final synthesis (keep at Opus level)

6. **Design the workflow** (ultrathink)
   - Synthesize priorities, available skills, and constraints
   - Define each step clearly
   - Map steps to skills and MCP tools
   - Define inputs/outputs between steps

7. **Available Workflow Templates**
   - Check `templates/` folder for pre-built workflow templates

- `templates/meeting-transcript-to-summary.md` — Converts meeting transcripts to structured summaries
  - **Trigger phrases:** “summarize the meeting”, “turn this transcript into notes”, “extract action items from the call”
  - **Output path:** `archives/meetings/YYYY-MM-DD-[client]-summary.md`

8. **Execute or simulate the workflow**
   - Call skills/tools in sequence
   - Handle failures gracefully
   - Log key outputs
   - Start Tier-2 idle countdown after each Tier-2 service use (5-min timeout):
     - If workflow completes and no other workflow uses this Tier-2 service within 5 min → `docker-compose -f compose.tier2.yml stop [service-name]`
     - If new workflow arrives before timeout → reset countdown
   - Log idle cleanup actions to `.claude/logs/docker-tier2-cleanup.log`

9. **On-Demand Tier-2 Startup Logic**
   - When workflow step needs Tier-2 service:
     - Detect which Tier-2 services required (based on skill requirements)
     - `docker-compose -f compose.tier2.yml up -d [service-name]` (start container)
     - Wait for health check to pass (max 30s; if timeout: report error)
     - Continue workflow
   - Supported Tier-2 triggers:
     - `/code-generation` → Start Prisma (schema validation) + astgrep (AST analysis)
     - `/client-management` → Start Resend (email API)
     - `/planning` → Start Context7 (context aggregation)
     - `/research` → Start Fetch (HTTP alternative) if needed
     - `/visualization` → Start Excalidraw (diagram rendering)

10. **Error Handling & Recovery**

- Network failures: Stop and request operator approval before any retry (fail-closed default)
- Container crashes: Check docker logs, report cause (OOM? Signal? Code error?)
- Cascading failures: Implement circuit breaker (after 5 consecutive failures to service X, stop routing for 60s)
- Resource exhaustion: Monitor memory/CPU; fail gracefully with resource recommendation

11. **Update archives/context if requested**
    - Save outputs to the correct folders (follow Knowledge Memory routing table)
    - Update context files
    - Append to logs or histories

12. **Return the final result**
    - Workflow summary (including Tier-2 services started/cleaned up)
    - Outputs with paths
    - How to re-run it
    - Tier-2 cleanup status (e.g., “Prisma will auto-stop after 5 min idle”)

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
