# NEW CHAT MASTER PROMPT — Orchestrator Mode (Docker Memory Aligned)

Last generated: 2026-04-09 15:09:11 +01:00

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

This performs strict hydration, Playwright runtime bootstrap, git baseline capture, and memory-node open.

No-forget task execution wrapper:
Command: pnpm orchestrator:task -Task "<your-task-command>"
(Runs startup lifecycle first, your task second, and sync:task-close in finally.)

## Current Session Baseline (Auto-Generated)

- Branch: chore/orchestrator-governance-standards
- HEAD: 49607d0 fix(startup): embed governance references in master-prompt generation template
- Memory nodes loaded: 4

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
2. Run strict hydration session to sync Docker memory state:

Command: pnpm migration:all:hydrate:strict:session:skip

3. Regenerate this master prompt with latest branch/HEAD/memory summary:

Command: pnpm startup:new-chat:skip

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
Current branch: chore/orchestrator-governance-standards
Current HEAD: 49607d0 fix(startup): embed governance references in master-prompt generation template

