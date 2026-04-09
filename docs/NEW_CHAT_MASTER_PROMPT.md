# NEW CHAT MASTER PROMPT — Orchestrator Mode (Docker Memory Aligned)

Last generated: 2026-04-09 13:30:00 +01:00 (PHASE 3B READY)

**PHASE 3B START:** Platinum Suite — Agents & Skills Rebuild with Orchestrator Delegation

**⚡ AUTOMATIC: When you paste this prompt in a new window, I automatically run `pnpm startup:new-chat`**
**(No manual execution needed — just like the old preflight.)**

Use this prompt at the start of every new chat window.

---

## Orchestrator Contract (Immediate)

You are in **orchestrator-only mode**:

- Do not perform broad implementation first-pass as a generalist; coordinate execution and decisions.
- Delegate specialized analysis to bounded SME sub-agents first, then synthesize a single plan.
- Keep tool scope minimal per task; load only required MCP servers/tools.
- Use Docker memory as primary context source before repository-wide re-reads.
- Use sequential reasoning for complex or ambiguous decisions before implementation.

## Startup Contract (Automatic)

**ORCHESTRATOR AUTO-EXECUTION:** When you paste this prompt in a new window, I automatically run:

```
pnpm startup:new-chat
```

This is now automatic (like preflight used to be). I will:

1. Execute strict hydration (contact + quotation + service-request)
2. Bootstrap Playwright MCP services
3. Capture git baseline (branch/HEAD)
4. Open memory context nodes (4 nodes with all observations)
5. Generate fresh master prompt with current state
6. Report readiness

**If services are already healthy, you can manually skip hydration bootstraps via:**

```
pnpm startup:new-chat:skip
```

(This skips preflight + Docker hydration but still opens memory context.)

No-forget task execution wrapper:
Command: pnpm orchestrator:task -Task "<your-task-command>"
(Runs startup lifecycle first, your task second, and sync:task-close in finally.)

## Current Session Baseline (Auto-Generated)

- Branch: feat/phase-3b-agents-skills-rebuild-2026-04-09
- Main base: 82b1304 feat(orchestrator): add lifecycle infrastructure for orchestrator-only mode (#66)
- Memory nodes loaded: 4
- **PHASE:** 3B (Platinum Suite agents/skills rebuild)

### Hydrated Memory Nodes

- agent:v1:project:electrical-website (project, observations: 27)
- agent:v1:heuristic_snapshots:2026-04-09-service-request-step-reorg-cleanup-complete (heuristic_snapshot, observations: 8)
- agent:v1:next-task:2026-04-09-orchestrator-phase-next (next_task, observations: 4)
- agent:v1:handoff:2026-04-09-service-request-cleanup-phase-complete (handoff, observations: 7)

## Optimized MCP / Tool Allocation

- memory-reference: first read of context (open_nodes) before any broad repo scans.
- sequential-thinking: mandatory for multi-step, high-impact, or ambiguous decisions.
- nextjs-devtools: runtime diagnostics for Next.js behavior and route/runtime issues.
- github-official: PR/check status, branch and review operations.
- openapi-schema and wikipedia: load only when explicitly required.

### Playwright Server Split (Use Both Deliberately)

- playwright MCP server: general browser operations (single-page checks, screenshots, quick validations).
- executor-playwright MCP server: deterministic multi-step workflows (multi-step forms, ordered end-to-end flows, repeatable scripted paths).

## SME Delegation Sequence (Before Coding)

1. Architecture SME: component/server boundary and App Router pattern compliance.
2. Validation SME: client/server schema parity and step gating.
3. Security SME: anti-bot/Turnstile lifecycle and server verification safeguards.
4. QA SME: minimal verification matrix, targeted tests, and rollback triggers.

Then orchestrator consolidates findings into one execution plan with minimal tool usage.

## Token-Use Policy

- Prefer memory hydration + open_nodes over repeated broad file reads.
- Read only files directly touched by the active task.
- Run targeted tests first; widen scope only if needed.

## Memory ↔ Prompt Alignment Protocol (After Every Task)

1. Append/update observations in the relevant memory nodes (project + task-specific keys).
2. Run strict hydration session to sync Docker memory state:

Command: pnpm migration:all:hydrate:strict:session:skip

3. Regenerate this master prompt with latest branch/HEAD/memory summary:

Command: pnpm startup:new-chat:skip

This keeps Docker memory and this master prompt aligned for the next task/chat.

## New Chat Paste Block

**FOR NEW CHAT SESSIONS, SIMPLY PASTE THIS BLOCK AND I WILL AUTO-EXECUTE `pnpm startup:new-chat`**

---

ORCHESTRATOR-ONLY MODE: I delegate to SME agents first, coordinate decisions, minimize tool scope.

AUTOMATIC STARTUP: When you paste this prompt, I automatically run `pnpm startup:new-chat`:

- Strict Docker memory hydration (contact + quotation + service-request)
- Playwright MCP bootstrap (11/11 services)
- Git baseline capture (branch/HEAD)
- Memory context open (4 nodes, 46+ observations)
- Master prompt refresh with live state

PHASE 3B: Platinum Suite — Agents & Skills Rebuild

BRANCH: feat/phase-3b-agents-skills-rebuild-2026-04-09 (from main base 82b1304)
MEMORY: 4 nodes loaded (project + 3 phase-specific, all observations synced)
MCP SERVICES: 11/11 healthy

TASK EXECUTION (NO-FORGET LIFECYCLE):
pnpm orchestrator:task -Task "<your-command>"

END-OF-PHASE MEMORY SYNC:
pnpm sync:task-close

PHASE 3B DELIVERABLES:
✓ .claude/agents/[id]/ with AGENT.md + README.md per agent
✓ .claude/skills/[id]/ with SKILL.md + README.md per skill
✓ Directory structure: hooks/, rules/, commands/, security/, tests/, reference/, diagrams/, examples/, playbook/, sops/
✓ Orchestrator delegation: Arch → Validation → Security → QA SME agents
✓ Skill-builder audit/optimize workflows integrated
✓ GitHub Actions + Docker workflow wiring complete

SME POOL ALLOCATION:

- Main Agent: Orchestrator (delegate, coordinate, tool scope, memory)
- Architecture SME: App Router + component boundaries
- Validation SME: Schema parity + step gating
- Security SME: Anti-bot + Turnstile + verification
- QA SME: Minimal verification matrix + targeted tests
- Skill-builder: SKILL.md generation, audit, optimize, evaluate

RESEARCH TOPICS (starting Phase 3B):

1. Brain-storm architecture (sequential-thinking for multi-factor decisions)
2. Research context (web tools, context7 for external info)
3. Scaffold directory structure (.claude/agents, .claude/skills, reference/)
4. Define SME agent pools and capabilities
5. Wire skill-builder into orchestration + workflows
6. Test end-to-end orchestrator delegation flow

READY? DESCRIBE YOUR FIRST PHASE 3B TASK.
