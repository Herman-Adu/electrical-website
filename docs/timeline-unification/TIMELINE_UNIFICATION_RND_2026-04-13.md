# Timeline Unification R&D Packet (2026-04-13)

## Objective

Unify all timeline implementations (about/company, projects, news-hub articles) into one reusable, data-driven timeline platform with strict TypeScript + runtime validation, while preserving existing designs via explicit variants.

## Active Memory Lane

- `agent:v1:next-task:2026-04-13-timeline-unification-platform`

## Current Implementation Inventory

- `components/about/company-timeline.tsx` (advanced scroll-linked story timeline, local data + animation logic)
- `components/projects/project-timeline.tsx` (status-based project timeline)
- `components/news-hub/news-article-content.tsx` (inline timeline section)
- Types split across:
  - `types/projects.ts` (`ProjectTimelinePhase` with status)
  - `types/news.ts` (`NewsTimelineItem` without status)

## Core Findings

1. Three parallel timeline renderers cause duplicated layout/animation logic and type divergence.
2. Existing data contracts are close enough to normalize through adapters.
3. About timeline behavior should become a variant, not a special one-off component.
4. TOC/deep-link contract (`id="timeline"`) must remain stable during migration.
5. Future Strapi ingestion requires strict runtime validation and defensive rendering.

## Target Architecture

### Canonical Domain

- `TimelineSectionData`
- `TimelineItem` discriminated union
- `TimelineVariant = "story" | "status" | "list"`

### Render Architecture

- Shared section shell for heading/anchor semantics
- Variant renderers:
  - `story` (company style)
  - `status` (project style)
  - `list` (news style)
- Variant config for visuals (status tokens/icons/marker behavior)

### Source Adapters

- `project` adapter: `ProjectTimelinePhase[] -> TimelineItem[]`
- `news` adapter: `NewsTimelineItem[] -> TimelineItem[]`
- `company` adapter: milestone source -> `TimelineItem[]`

## Validation + Security Contract

1. Zod schema for canonical timeline payload (strict object, bounded fields, max items).
2. Treat all CMS timeline content as untrusted input.
3. Plain text rendering only (no raw HTML rendering in timeline content path).
4. Explicit enum policy for status values; unknown values are rejected or mapped by policy.
5. Validation failure should fail closed for timeline section payload, not crash full page.

## Migration Sequence (Low-Risk)

1. ✅ **PR1**: Add canonical timeline types/schemas/adapters only (no UI changes).
2. ✅ **PR2**: Migrate news timeline to generic `list` variant.
3. ✅ **PR3**: Migrate project timeline to generic `status` variant (preserve visual parity).
4. ✅ **PR4**: Migrate company timeline to generic `story` variant (preserve reduced-motion behavior).
5. ✅ **PR5-A**: Cleanup legacy timeline paths + focused integration/e2e verification.
6. ⏳ **PR5-B**: Shared scroll-progress controller + adaptive offset/threshold calibration for narrow/two-column timeline contexts.

## Current Status (2026-04-14)

- Progress: **~85% complete**
- Batches completed: **PR1–PR5-A**
- Active continuation target: **PR5-B timeline animation calibration optimization**

### New Chat Continuation Prompt (PR5-B)

- Run `pnpm startup:new-chat:full`.
- Hydrate active lane keys from `config/active-memory-lanes.json`.
- Restate remaining objective as: implement shared timeline progress controller and adaptive offset/threshold calibration.
- Keep scope bounded to motion-progress correctness and resilience; no visual redesign.
- Validate with targeted tests first, then `pnpm exec tsc --noEmit`.
- Persist PR5-B checkpoint to memory lane on completion.

## QA Gates

- Adapter contract tests
- Variant integration tests
- Focused e2e checks for about/projects/news timeline routes
- Reduced-motion and anchor navigation checks

## PR5 QA Evidence (2026-04-14)

- ✅ Adapter + integration tests passed:
  - `runTests` on `__tests__/timeline/timeline-adapters.contract.test.ts`
  - `runTests` on `__tests__/timeline/timeline-route-integration.test.tsx`
  - Result: **12/12 passed**
- ✅ Focused route e2e timeline anchors passed:
  - Spec: `e2e/timeline-routes.spec.ts`
  - Command: `PLAYWRIGHT_REUSE_SERVER=true pnpm exec playwright test e2e/timeline-routes.spec.ts --project=chromium`
  - Result: **3/3 passed** (`/about`, first project detail route, first news detail route)
- ✅ Type safety gate passed:
  - Command: `pnpm exec tsc --noEmit`

## R&D Addendum — PR5-B (2026-04-14)

### Observed Production-Like Runtime Issue

1. In article/project detail layouts using narrow content columns + sticky top chrome (navbar + breadcrumb), timeline line progression can appear to stop early.
2. Final node indicators are sometimes not visibly reached by animated segment progression.
3. Behavior is more pronounced in two-column routes where timeline sections are taller due to reduced card width.

### Root-Cause Findings

1. **Static `useScroll` offsets** (`start 78%`, `end 22%`) are not robust when effective viewport is reduced by sticky top UI.
2. **Index-based trigger spacing** underestimates/overestimates node activation when layout causes non-uniform row heights.
3. Company timeline has stronger logic (fixed-header-aware offsets + geometry-derived thresholds) that is not yet shared by article/project timelines.

### PR5-B Optimization Strategy (No Redesign)

1. Extract shared progress-controller utilities from company timeline:

- fixed-header measurement,
- adaptive offset derivation,
- geometry-derived node trigger thresholds,
- resize/content-change recalculation.

2. Reuse the controller in article + project timelines.
3. Preserve route-specific visuals and tokens; only improve animation/progress correctness.
4. Keep `id="timeline"` anchor behavior stable.

### PR5-B Verification Gates

- Targeted tests for offset/threshold calibration behavior.
- Route-level checks that final timeline indicators animate into view in single-column and two-column layouts.
- Regression check for TOC/anchor compatibility and reduced-motion behavior.

## Definition of Done

- One reusable timeline platform powers about + projects + news timelines.
- Existing UX preserved via variants.
- Strict TS + Zod contracts in place.
- TOC/anchor behavior unchanged.
- Tests cover adapters, variant rendering, and route-level timeline behavior.
