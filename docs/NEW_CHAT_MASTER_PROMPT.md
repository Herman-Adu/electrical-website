# NEW CHAT MASTER PROMPT — Orchestrator Mode (Docker Memory Aligned)

Last generated: 2026-04-14 00:37:54 +01:00

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

- Active lane: agent:v1:next-task:2026-04-13-timeline-unification-platform
- Immediate objective: laneObjective: Unify company/project/news timelines into one generic data-driven timeline platform with variant renderers
- Execution rule: choose one bounded batch only; no side-lane drift.
- Validation rule: run tsc + pnpm test + build + MCP smoke before PR merge.

### Lane Backlog Seed (From Memory)

- B1: laneObjective: Unify company/project/news timelines into one generic data-driven timeline platform with variant renderers
- B2: scope: R&D complete, implementation staged across adapters, canonical types, and shared renderers
- B3: canonicalModel: Introduce TimelineSectionData + TimelineItem discriminated union with variants story|status|list
- B4: validationPlan: Add strict Zod schema for canonical timeline payload and source adapters for project/news/company data
- B5: securityPlan: Treat CMS timeline content as untrusted; plain-text rendering, strict allowlist validation, bounded field lengths
- B6: migrationPhase1: Add types/schemas/adapters and shared TimelineSection shell
- B7: migrationPhase2: Migrate news inline timeline to generic list variant preserving id=timeline
- B8: migrationPhase3: Migrate project timeline to generic status variant preserving existing visual tokens
- B9: migrationPhase4: Migrate company timeline to generic story variant preserving reduced-motion behavior
- B10: qaGates: adapter contract tests + integration variant tests + focused e2e for about/projects/news timeline routes
- B11: constraints: Keep TOC/deep-link contract stable via anchorId timeline across pages
- B12: nextAction: Start PR1 with domain contracts and adapters only, no visual changes
- B13: checkpoint: R&D packet saved at docs/timeline-unification/TIMELINE_UNIFICATION_RND_2026-04-13.md
- B14: checkpoint: New chat prompt saved at docs/NEW_CHAT_PROMPT_TIMELINE_UNIFICATION_2026-04-13.md
- B15: checkpoint: Active lane pointer switched in config/active-memory-lanes.json
- B16: readyState: Next implementation batch is PR1 domain contracts + adapters + adapter contract tests
- B17: 2026-04-14 PR5 checkpoint: cleaned legacy NewsArticleContent timeline prop surface by removing unused categorySlug pass-through and updating news route caller.
- B18: 2026-04-14 PR5 verification: added focused timeline integration tests in __tests__/timeline/timeline-route-integration.test.tsx covering about anchor id=timeline, project timeline canonical-item rendering with anchor, and news timeline conditional section rendering.
- B19: 2026-04-14 validation gates passed: runTests for timeline contract + integration suite (12/12 passed) and pnpm exec tsc --noEmit passed.
- B20: 2026-04-14 orchestrator follow-up: added focused Playwright route smoke spec e2e/timeline-routes.spec.ts for timeline anchor verification on about, project detail, and news detail routes.
- B21: 2026-04-14 e2e result: PLAYWRIGHT_REUSE_SERVER=true pnpm exec playwright test e2e/timeline-routes.spec.ts --project=chromium passed 3/3.
- B22: 2026-04-14 docs checkpoint: added PR5 QA evidence block to docs/timeline-unification/TIMELINE_UNIFICATION_RND_2026-04-13.md including timeline e2e spec e2e/timeline-routes.spec.ts and 3/3 pass result.
- B23: 2026-04-14 orchestrator fix: migrated news article timeline renderer in components/news-hub/news-article-content.tsx from legacy inline list UI to company-style alternating timeline layout while preserving id=timeline anchor and canonical timelineItems input.
- B24: 2026-04-14 validation: __tests__/timeline/timeline-route-integration.test.tsx + timeline-adapters.contract.test.ts passed (12/12) and pnpm exec tsc --noEmit passed.
- B25: 2026-04-14 lane update: PR5-A complete (cleanup + timeline integration/e2e/type gates) and active target moved to PR5-B timeline animation calibration optimization.
- B26: 2026-04-14 R&D finding: static useScroll offsets and index-based trigger spacing cause end-of-section timeline under-animation in narrow/two-column routes with sticky navbar+breadcrumb.
- B27: 2026-04-14 continuation docs refreshed: docs/NEW_CHAT_PROMPT_TIMELINE_UNIFICATION_2026-04-13.md and docs/timeline-unification/TIMELINE_UNIFICATION_RND_2026-04-13.md now specify PR5-B shared progress-controller extraction and adaptive offset/threshold verification scope.

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
- HEAD: cbee00e Merge pull request #80 from Herman-Adu/project-theme-polish
- Memory nodes loaded: 1

### Hydrated Memory Nodes

- agent:v1:next-task:2026-04-13-timeline-unification-platform (next_task, observations: 27)

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

1. Append/update observations in the active timeline lane memory keys.
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
Current HEAD: cbee00e Merge pull request #80 from Herman-Adu/project-theme-polish

