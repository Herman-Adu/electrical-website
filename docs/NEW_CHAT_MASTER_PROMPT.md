# NEW CHAT MASTER PROMPT — Orchestrator Mode (Docker Memory Aligned)

Last generated: 2026-04-10 19:21:09 +01:00

Use this prompt at the start of every new chat window.

---

## Orchestrator Contract (Immediate)

You are in **orchestrator-only mode**:

- Do not perform broad implementation first-pass as a generalist; coordinate execution and decisions.
- Delegate specialized analysis to bounded SME sub-agents first, then synthesize a single plan.
- Keep tool scope minimal per task; load only required MCP servers/tools.
- Use Docker memory as primary context source before repository-wide re-reads.
- Use sequential reasoning for complex or ambiguous decisions before implementation.

## Startup Contract (Run First)

Command: pnpm startup:new-chat

If Docker services are already healthy and you need a warm start:

Command: pnpm startup:new-chat:skip

This performs MCP readiness checks, Playwright runtime bootstrap, git baseline capture, and active memory-node open.
Lane hydration is opt-in only (use full startup when lane sync is needed).

No-forget task execution wrapper:
Command: pnpm orchestrator:task -Task "<your-task-command>"
(Runs startup lifecycle first, your task second, and sync:task-close in finally.)

## First Bounded Batch (Default Intake)

When a fresh chat does not know where to start, execute this exact sequence before coding:
1. Run strict preflight: clean git status, active lane hydration, MCP smoke health.
2. Open active memory nodes and restate the current lane objective.
3. Produce a concise remaining-work list grouped by impact and dependency.
4. Implement only the smallest high-impact batch, then run required gates.

Deterministic starter command:
Command: pnpm orchestrator:task -Task "pnpm startup:new-chat:full"

## Active Lane Next Action Card

- Active lane: agent:v1:next-task:2026-04-10-next-workstream-intake
- Immediate objective: Active workstream: next workstream intake (orchestrator-only).
- Execution rule: choose one bounded batch only; no side-lane drift.
- Validation rule: run tsc + pnpm test + build + MCP smoke before PR merge.

### Lane Backlog Seed (From Memory)

- B1: Active workstream: next workstream intake (orchestrator-only).
- B2: Purpose: provide a clean successor lane after completion of agents-and-skills-rebuild.
- B3: Execution contract: bounded batches, deterministic validation gates (tsc/test/build when code changes), and memory checkpoints at preflight, post-merge, and closure.
- B4: Guardrail: keep closed lane agent:v1:next-task:2026-04-09-mcp-platinum-rebuild-cleanup inactive and unchanged unless explicitly requested.
- B5: Status: CLOSED on 2026-04-10 after completion of intake lane objectives and successor-lane rotation.

## Lane Closure Readiness

Use this map to decide whether the current lane can be closed:
- COMPLETED: merged bounded batches with validation evidence and memory checkpoints.
- DEFERRED: items intentionally postponed with explicit rationale.
- OPEN: remaining in-scope items for this lane.

Closure gate (all required):
1. Every in-scope backlog item is either COMPLETED or DEFERRED.
2. Final PR for this lane is merged and local main is clean.
3. Post-merge and closure checkpoints are written to memory.

Next recommended lane stub:
agent:v1:next-task:YYYY-MM-DD-<short-workstream-id>

## Current Session Baseline (Auto-Generated)

- Branch: main
- HEAD: 8ba7979 chore(orchestrator): add lane closure readiness and next-lane stub (#79)
- Memory nodes loaded: 2

### Hydrated Memory Nodes

- agent:v1:project:electrical-website (project, observations: 27)
- agent:v1:next-task:2026-04-10-next-workstream-intake (next_task, observations: 5)

## Optimized MCP / Tool Allocation

- memory-reference: first read of context (open_nodes) before any broad repo scans.
- sequential-thinking: mandatory for multi-step, high-impact, or ambiguous decisions.
- nextjs-devtools: runtime diagnostics for Next.js behavior and route/runtime issues.
- github-official: PR/check status, branch and review operations.
- openapi-schema and wikipedia: load only when explicitly required.
- youtube transcript: use the routed youtube service in the local Docker MCP stack (/youtube).

### Playwright Server Split (Use Both Deliberately)

- playwright MCP server: general browser operations (single-page checks, screenshots, quick validations).
- executor-playwright MCP server: deterministic multi-step workflows (multi-step forms, ordered end-to-end flows, repeatable scripted paths).

## SME Delegation Sequence (Before Coding)

1. Architecture SME: component/server boundary and App Router pattern compliance.
2. Validation SME: client/server schema parity and step gating.
3. Security SME: anti-bot/Turnstile lifecycle and server verification safeguards.
4. QA SME: minimal verification matrix, targeted tests, and rollback triggers.

Then orchestrator consolidates findings into one execution plan with minimal tool usage.

Required governance references for all delegated outputs:

- docs/standards/ORCHESTRATOR_EXTERNAL_TOOLKIT_ADAPTER_POLICY.md
- docs/standards/ORCHESTRATOR_PHASE2_DELEGATION_GATE_CHECKLIST.md
- docs/standards/ORCHESTRATOR_SUPERPOWERS_NEXTJS_SKILL_ROUTING.md

## Token-Use Policy

- Prefer memory hydration + open_nodes over repeated broad file reads.
- Read only files directly touched by the active task.
- Run targeted tests first; widen scope only if needed.
- Local-first enforcement: all required local tests/checks must pass before any GitHub workflow/check trigger or rerun.

## Memory ↔ Prompt Alignment Protocol (After Every Task)

1. Append/update observations in the relevant memory nodes (project + task-specific keys).
2. Refresh startup context and master prompt without rehydrating completed lanes:

Command: pnpm startup:new-chat:refresh

3. Run full lane hydration only when lane content changed and needs canonical resync:

Command: pnpm startup:new-chat:full

This keeps Docker memory and this master prompt aligned for the next task/chat.

## New Chat Paste Block

Paste this into a fresh chat:

Operate in orchestrator-only mode with SME delegation first.
Use memory-first context loading from hydrated Docker memory.
Run tasks via pnpm orchestrator:task -Task "<task-command>" so startup and close-sync are never skipped.
Use playwright for general browser tasks and executor-playwright for deterministic multi-step form workflows.
Use sequential-thinking for complex decisions and nextjs-devtools for runtime diagnostics.
Require local test gates to pass before any GitHub workflow/check trigger or rerun.
Keep tool scope minimal and optimize token usage.
Current branch: main
Current HEAD: 8ba7979 chore(orchestrator): add lane closure readiness and next-lane stub (#79)

