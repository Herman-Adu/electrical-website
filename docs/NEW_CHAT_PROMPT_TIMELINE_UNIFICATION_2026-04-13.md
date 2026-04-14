# NEW CHAT PROMPT — Timeline Unification Lane (Orchestrator-Only)

Paste everything below into a fresh Copilot Chat window.

---

You are GitHub Copilot using GPT-5.3-Codex.

Operate in **full orchestrator-only mode** for this repository.

## Lane + Context

- Active memory lane key: `agent:v1:next-task:2026-04-13-timeline-unification-platform`
- Context budget risk is high; optimize for low-token operation and memory-first hydration.

## Progress Snapshot

- Lane completion: **~85%**
- Completed batches: **PR1, PR2, PR3, PR4, PR5-A (cleanup + verification)**
- Active batch: **PR5-B** (shared scroll-progress controller + adaptive timeline calibration)

## Mandatory Startup Sequence

1. Run `pnpm startup:new-chat:full`.
2. Hydrate and open only active memory lane keys from `config/active-memory-lanes.json`.
3. Restate lane objective in <= 8 bullets.
4. Do not broad-scan the whole repo unless explicitly required.

## Tooling Priority (First Choice Order)

1. Docker Memory MCP (open/update lane entities)
2. Docker Sequential Thinking MCP (complex/ambiguous reasoning)
3. Context7 / library docs resolution for external docs fallback
4. Next.js DevTools MCP for Next.js runtime diagnostics
5. Parallel SME sub-agents for Architecture, Validation, Security, QA

## Required SME Delegation Pattern

Before implementation, run parallel SME analysis for:

- Architecture
- Validation
- Security
- QA

Then synthesize one minimal execution plan with bounded batches.

## Current Workstream Objective

Unify timeline implementations across:

- `components/about/company-timeline.tsx`
- `components/projects/project-timeline.tsx`
- `components/news-hub/news-article-content.tsx`

Target:

- One reusable, data-driven timeline platform with strict TypeScript contracts and runtime validation.
- Preserve current visual differences through explicit renderer variants.
- Keep TOC/anchor compatibility (`id="timeline"`) unchanged.
- Ensure timeline segment/indicator animation remains visible to end-of-section in both single-column and two-column layouts with sticky top chrome present.

## Constraints

- No inference-based weak typing from local constants as final domain contract.
- No design drift; preserve existing UX by variant mapping.
- Keep changes incremental by PR phases.
- Prefer adapters over immediate breaking type rewrites in page-level content models.

## Execution Guardrails

- Work in small, testable batches.
- After each batch: run targeted tests first, then widen scope if needed.
- Persist checkpoints to memory lane after each merged batch.
- If context usage approaches limit, summarize decisions into memory and continue from memory-first state.

## Next Batch Request

Produce and execute PR5-B only (bounded):

- Extract shared timeline progress controller logic from company timeline into reusable utilities/hooks.
- Apply adaptive fixed-header-aware `useScroll` offset calibration for timeline progress on article/project routes.
- Replace static index-based trigger spacing with geometry-derived node trigger thresholds where timeline height changes by layout.
- Preserve existing visual style tokens for each route (no redesign), but ensure in-view line/indicator animation reaches final nodes.
- Validate across single-column and two-column contexts, including sticky navbar + breadcrumb scenarios.
- Persist checkpoint + verification evidence to memory lane after tests pass.

### Existing Evidence (Do Not Rework)

- Adapter + integration tests already passed: `12/12`
- Focused route timeline e2e already passed: `3/3`
- Type gate already passed: `pnpm exec tsc --noEmit`

### New Verification Scope

- Focused tests for adaptive offset/threshold math
- Route checks ensuring final timeline indicators animate into view
- Regression check for TOC/anchor `id="timeline"` compatibility

## Deliverable Format

- Short status
- Files changed
- Tests run
- Memory updates written
- Next bounded batch

---

If any required MCP server is unavailable, stop and provide the minimal unblock command sequence only.
