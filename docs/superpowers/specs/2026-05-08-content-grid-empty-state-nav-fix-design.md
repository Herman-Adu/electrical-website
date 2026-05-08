---
title: ContentGridLayout Empty-State Navigation Fix
description: Fix category slider and header disappearing when a category has zero items — always render navigation shell regardless of item count; add enhanced empty-state message with CTA
category: spec
status: active
last-updated: 2026-05-08
---

# ContentGridLayout Empty-State Navigation Fix

**Branch to create:** `fix/content-grid-empty-state-nav`  
**Scope:** Single file change (`components/shared/content-grid-layout.tsx`) + spec doc + Docker/Obsidian memory  
**Risk:** Low — surgical removal of an early-return guard; zero behaviour change for non-empty categories

---

## Problem

`ContentGridLayout` has an early-return guard at line 114:

```tsx
if (items.length === 0) {
  return (
    <div className="grid ...">
      <div>{emptyMessage}</div>
      <ContentSidebar />
    </div>
  );
}
```

When `?category=community` resolves to 0 projects, this branch fires and returns **before** the slider, eyebrow, title, and count are ever rendered. The result:

- `ProjectCategorySlider` never mounts — user cannot navigate to other categories
- "LIVE FEED" eyebrow disappears
- Animated `ProjectCategoryTitle` ("Community Projects") disappears
- "0 PROJECTS" count disappears
- User is stranded with only a bare message card and the sidebar

The same `ContentGridLayout` powers the News Hub filter grid, so any News Hub category going empty would produce the same regression.

**Root cause:** The early-return was added before the `slider: ReactNode` prop existed on the component. The guard pre-dates the slider architectural decision (commit `e34037e`). The fix is to relax the guard.

---

## Solution — Option A: Surgical early-return restructure

Remove the early-return. The full render tree runs unconditionally. The empty-state message replaces the `<div role="feed">` block when `items.length === 0`.

### Render tree after fix

```
ContentGridLayout
└── grid wrapper (always)
    ├── Feed column (min-w-0 space-y-2)
    │   ├── {slider}              ← always rendered (category chips, sticky)
    │   └── space-y-4
    │       ├── Header row        ← always rendered
    │       │   ├── LIVE FEED eyebrow (ContentPulseIndicator)
    │       │   ├── {title}       ← "Community Projects" animated crossfade
    │       │   └── count badge   ← "0 PROJECTS"
    │       └── Content area      ← conditional on items.length
    │           ├── items > 0 → <div role="feed"> with animated cards
    │           └── items = 0 → enhanced empty-state card (see below)
    └── ContentSidebar            ← always rendered
```

### Enhanced empty-state card (items = 0)

Replace the bare `{emptyMessage}` string with a structured card:

```
┌─────────────────────────────────────────────────────────────┐
│  No {category} projects yet                                  │
│                                                              │
│  We're building our community portfolio — check back soon,   │
│  or explore other project categories above.                  │
│                                                              │
│  [← View all projects]                                       │
└─────────────────────────────────────────────────────────────┘
```

- Headline: `No {itemLabelPlural} yet` — uses the existing `itemLabelPlural` prop so it works for both projects and articles
- Sub-copy: composed from `emptyMessage` (caller-supplied) — callers upgrade their `emptyMessage` string to a full sentence
- CTA chip: "View all projects →" — only rendered when `slider` prop is present (i.e. a filterable list, not a standalone category page). Navigation uses `usePathname()` (already available — `ContentGridLayout` is `"use client"`) to construct `pathname` without the `?category` param, then `router.replace(pathname, { scroll: false })`. This is route-agnostic and works for both `/projects` and `/news-hub`.

The card retains the same `rounded-3xl border border-border/50 bg-card/60 p-8` shell as before. The interior gains hierarchy: an `<h3>` headline and a `<p>` description below it, plus an optional chip link.

---

## Files Changed

| File | Change | LOC delta |
|------|--------|-----------|
| `components/shared/content-grid-layout.tsx` | Remove early-return (lines 114–129); inline empty-state into content area; add enhanced card markup | ~+20, −16 |

No other files require changes.

---

## Props interface — no breaking changes

`ContentGridLayoutProps` is unchanged. The `emptyMessage` prop continues to accept a string. Callers opt in to the richer UX by passing a well-formed sentence (e.g. `"No community projects available yet."`) — the component wraps it in the card shell. The CTA chip is automatically suppressed on the standalone category page (`/projects/category/[slug]`) because that page passes no `slider` prop.

---

## Affected callers

| Caller | Passes `slider`? | CTA chip rendered? |
|--------|-----------------|-------------------|
| `components/projects/projects-list-section.tsx` | Yes (`<ProjectCategorySlider />`) | Yes |
| `components/news-hub/news-hub-grid-layout.tsx` | Yes (`<NewsHubCategorySlider />`) | Yes |
| `app/projects/category/[categorySlug]/page.tsx` | No | No |

---

## Key invariants preserved

- **`usePagination` is not touched** — `totalCount` returns `items.length` (0), which is correct for the "0 PROJECTS" counter.
- **Static rendering is unaffected** — `ProjectCategorySlider` and `ProjectCategoryTitle` both use `useSearchParams`, already inside the `<Suspense>` boundary on `app/projects/page.tsx`.
- **`section-container overflow:hidden` rule** — the sticky slider requires NO `overflow:hidden` ancestor. `projects-list-section.tsx` already omits `section-container`; this fix does not reintroduce it.
- **News Hub grid section** — `news-hub-grid-layout.tsx` passes `slider` and benefits from the same fix automatically.

---

## Learnings captured

**`learn-content-grid-empty-state-strips-nav`** (new Docker entity):

> ContentGridLayout's early-return empty guard strips the slider and header context — always render the full navigation shell (slider, eyebrow, title, count) regardless of item count; only gate the content list area.
> Context: The early-return pre-dated the `slider: ReactNode` prop. When a category has 0 items (e.g. Community), users lost all navigation and could not return to other categories.
> References: `components/shared/content-grid-layout.tsx` lines 114–129, commit `e34037e` (slider prop added), PR fix branch `fix/content-grid-empty-state-nav`.

---

## Verification

**Build gate (mandatory before commit):**
```bash
pnpm typecheck && pnpm build
```
Must return: 0 TypeScript errors, all pages built.

**Manual browser verification:**
1. Navigate to `/projects?category=community` — slider shows all category chips with Community active, "Community Projects" title animates in, "0 PROJECTS" count shows, enhanced empty card renders below with CTA chip.
2. Click "All" chip in the slider — navigates to `/projects`, full list renders. Slider remains visible.
3. Click "Residential" — 2 projects render. Slider visible.
4. Click "Community" again — empty state with full header context. No regression.
5. Click "View all projects →" CTA in the empty card — navigates to `/projects` (all).

**Regression check:**
- Residential (2), Commercial (6), Industrial (3) — all still render correctly with items present.
- No layout shift on the projects page between empty and non-empty categories.

---

## Docker memory plan

Entities to create/update after implementation:

| Entity name | Type | Action |
|-------------|------|--------|
| `fix-content-grid-empty-state-nav` | `feature` | Create — tracks fix status, branch, PR |
| `learn-content-grid-empty-state-strips-nav` | `learning` | Create — captures the invariant for future sessions |
| `nexgen-electrical-innovations-state` | `project_state` | `add_observations` — branch, build status, next tasks |
| `session-2026-05-08-001` | `session` | Create — session handoff |

Relations:
- `fix-content-grid-empty-state-nav` → `feat-projects-category-slider` (`fixes_regression_from`)
- `learn-content-grid-empty-state-strips-nav` → `fix-content-grid-empty-state-nav` (`documents`)
- `session-2026-05-08-001` → `nexgen-electrical-innovations-state` (`updates`)

---

## Obsidian note

**Path:** `Projects/Nexgen Electrical Innovations/Features/fix-content-grid-empty-state-nav.md`

Content: link to this spec, link to Docker entity `fix-content-grid-empty-state-nav`, link to `learn-content-grid-empty-state-strips-nav`, PR link after creation.

---

## Rehydration prompt

For a future session to execute this fix cold:

```
TASK: Fix empty-state navigation regression on /projects?category=community

CONTEXT:
- Repo: electrical-website (Next.js 16 + React 19, App Router, strict TS)
- Problem: ContentGridLayout's early-return at lines 114–129 strips the category slider,
  eyebrow, title, and count when items.length === 0. User cannot navigate away.
- Approved solution: Option A — remove early-return, inline empty state into content area,
  add enhanced empty-state card with headline + CTA chip.
- Spec: docs/superpowers/specs/2026-05-08-content-grid-empty-state-nav-fix-design.md
- Docker entities: fix-content-grid-empty-state-nav, learn-content-grid-empty-state-strips-nav
- Branch: fix/content-grid-empty-state-nav (off main)

FILES:
- components/shared/content-grid-layout.tsx — ONLY file to change
  - Remove lines 114–129 (early-return empty guard)
  - Replace <div role="feed"> area with: items.length > 0 ? <feed> : <enhanced empty card>
  - Enhanced card: h3 headline "No {itemLabelPlural} yet", p {emptyMessage}, optional CTA chip
  - CTA chip "View all →" only rendered when slider prop is truthy
  - CTA uses usePathname() + router.replace to strip ?category param (route-agnostic)

BUILD GATE (mandatory before commit): pnpm typecheck && pnpm build

DOCKER MEMORY SYNC (session end):
- add_observations to nexgen-electrical-innovations-state
- create fix-content-grid-empty-state-nav feature entity
- create learn-content-grid-empty-state-strips-nav learning entity
- create session-2026-05-08-001 session entity
- wire relations as documented in spec
```

---

## Out of scope

- The standalone category page (`/projects/category/[categorySlug]`) — uses a different layout path (`ProjectCategoryHero` + `SectionIntro`), not `ContentGridLayout`'s slider. Not affected.
- Animation polish on Services/About/ProjectCategory heroes — Phase 8 work, separate branch.
- Lighthouse audit — separate task.
