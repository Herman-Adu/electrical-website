---
title: News Hub TOC Sticky Fix + Category Slider Refactor
description: Fix sticky TOC on article detail pages, add testimonial heading, replace category filter with horizontally-scrollable URL-driven slider
category: spec
status: active
last-updated: 2026-05-06
---

# News Hub TOC Sticky Fix + Category Slider Refactor

**Branch:** `feat/news-hub-toc-and-category-slider` (off `main`, after PR #135 merged)
**Plan source:** `C:\Users\herma\.claude\plans\graceful-honking-umbrella.md`

---

## Context

After PR #135 (data-driven TOC) merged, two issues remain on the News Hub:

1. **TOC sticky breaks early on article detail pages.** The right-column TOC stops sticking before the user scrolls past the article body, while on `/projects/category/[...]` the sticky sidebar correctly stays docked through the related/supplemental content. The TOC's last anchor link (`testimonial`) jumps to a section that has no visible heading, so users can't see where they landed.

2. **Category filter buttons wrap on overflow, sit in the wrong place, and stick at the viewport top.** They wrap when there isn't enough horizontal space, render below the grid section's eyebrow rather than between the page's two eyebrows ("Latest Articles" → "Live Feed"), use ad-hoc styling that doesn't match the cards' "Read Article" buttons, and stick at `top-0` (sliding under the fixed navbar) instead of docking under the sticky breadcrumb. The bar is also pure local state, so a filtered view isn't shareable via URL and the title doesn't update to reflect the active category.

**Goal:** Match the working `/projects` sticky pattern, add a visible testimonial heading, replace the filter row with a horizontally-scrollable slider that mirrors the card "Read Article" button styling, dock under the breadcrumb, persist state to the URL, and animate the title between categories.

---

## Decisions (confirmed by user 2026-05-06)

| Decision | Choice |
|---|---|
| Slider technology | Native CSS scroll-snap + Tailwind. Framer Motion only for "Latest [Category]" title crossfade. Zero new deps. |
| Active category state | URL params (`?category=<slug>`). `useSearchParams` + `router.replace(scroll: false)`. Shareable, back-button works, indexable. |
| Testimonial heading | `"Client Testimonial"` — uniform across all four layout types. |
| TOC sticky fix scope | Mirror `/projects` exactly: pull related-articles section INTO the grid left column to extend the row height. |

---

## Critical Files

### Feature 1 — TOC sticky fix on article detail pages

| File | Change |
|---|---|
| `app/news-hub/category/[categorySlug]/[articleSlug]/page.tsx` | Move the related-articles `<section>` INSIDE the grid's left cell (a wrapping `<div>` that contains both `<LayoutDispatcher>` and `<RelatedArticlesSection>`). Mirror the structure already present in `app/projects/category/[categorySlug]/[projectSlug]/page.tsx` lines 261–276. |
| `app/news-hub/category/[categorySlug]/[articleSlug]/page.tsx` | Standardize the sticky offset on the `<aside>`: change `sticky top-33 self-start min-h-[calc(100vh-132px)]` → `sticky top-37.5 self-start mt-2` (matches `/projects` reference; documented 128px = 80px nav + 40px breadcrumb + 8px gap; the 132px-based min-h was harmless decoration but is now redundant). |
| `components/news-hub/detail/detail-quote-block.tsx` | Add an `<h2>` heading "Client Testimonial" inside the `<motion.section id="testimonial">` block, using the existing eyebrow/heading pattern from neighbouring blocks (e.g. `detail-results-block.tsx`). The `id="testimonial"` already exists at line 28; only the visible heading is missing. |

### Feature 2 — Category slider refactor

| File | Change |
|---|---|
| `components/news-hub/news-hub-category-slider.tsx` | **NEW.** Client component. Native CSS scroll-snap row of `<button>` chips. Reads active slug from `useSearchParams()`. Calls `router.replace('/news-hub?category=…', { scroll: false })` inside `startTransition`. Uses `scrollIntoView({ inline: 'center', behavior: 'smooth' })` on the active chip when category changes. Chip className mirrors the "Read Article" button on cards: `inline-flex items-center gap-1.5 rounded-lg border border-electric-cyan/30 bg-electric-cyan/10 px-4 py-2 font-mono text-[10px] uppercase tracking-[0.18em] text-electric-cyan transition-all hover:bg-electric-cyan/20 hover:shadow-[0_0_15px_rgba(0,243,189,0.15)]` (active state: `bg-electric-cyan/20` + cyan ring). |
| `components/news-hub/news-hub-category-slider.tsx` | Sticky behavior: `sticky top-26 lg:top-30 z-30 bg-background/95 backdrop-blur-md border-b border-electric-cyan/10`. `top-26` = 64px nav (mobile) + 40px breadcrumb + ~8px gap. `top-30` = 80px nav (desktop) + 40px breadcrumb + ~8px gap. `z-30` sits below breadcrumb's `z-40` so the breadcrumb covers the slider when both are docked, and below navbar's `z-50`. |
| `components/news-hub/news-hub-category-slider.tsx` | Container layout: `flex overflow-x-auto snap-x snap-mandatory scroll-px-4 gap-2 scrollbar-hide -mx-4 px-4`. Edge gradient masks (left/right) via pseudo-elements or `mask-image: linear-gradient(...)` for "more here" affordance. No JS-side drag-to-scroll (CSS scroll-snap handles touch + wheel + trackpad natively). |
| `components/news-hub/news-hub-category-title.tsx` | **NEW.** Client component. Reads active slug from `useSearchParams`. Renders `<AnimatePresence mode="wait">` + `<motion.h2 key={active}>` crossfade with text "Latest {label}" — `label` resolves from a `categorySlug → label` map (e.g. `reviews → "Reviews"`, `case-studies → "Case Studies"`, `all → "Articles"`). Existing Framer Motion patterns in `components/news-hub/news-article-toc.tsx` are the styling reference. |
| `components/news-hub/news-hub-filter-client.tsx` | Refactor: replace internal `useState<NewsCategorySlug>` with `useSearchParams().get('category') ?? 'all'`. Keep `useTransition` wrapping the filter computation. Remove the legacy `news-article-filter-bar.tsx` rendering. |
| `components/news-hub/news-article-filter-bar.tsx` | **DELETE** (replaced by `news-hub-category-slider.tsx`). |
| `app/news-hub/page.tsx` | Render order between the two eyebrows: `<SectionIntro newsHubIntroData />` (owns "Latest Articles" eyebrow) → `<NewsHubFeaturedSection />` → bento → `<NewsHubCategorySlider />` (sticky, between eyebrows) → `<NewsHubCategoryTitle />` (dynamic "Latest [Category]" h2) → `<Suspense><NewsHubFilterClient /></Suspense>` (now URL-driven). The "Live Feed" eyebrow inside `NewsHubGridSection` stays where it is. |

---

## Existing Utilities to Reuse

- **`lib/scroll-to-section.ts`** — `STICKY_BREADCRUMB_SELECTOR`, `getStickyHeaderHeight()`, `SCROLL_GAP`. The slider uses `scrollIntoView({ inline: 'center' })` for horizontal centering, which is browser-native and doesn't need this lib. The TOC anchor scroll already uses this lib correctly via `news-article-toc.tsx`.
- **`components/shared/content-breadcrumb.tsx`** — `data-sticky-breadcrumb="true"` is the marker the breadcrumb already exposes. The slider does not need to read it; the `top-26 lg:top-30` offset is a static measurement (matches the comment at lines 17–20 of `content-breadcrumb.tsx` documenting 128px combined offset).
- **Framer Motion `AnimatePresence`** — pattern already used in `components/news-hub/news-article-toc.tsx:92-198`. Mirror it for the title crossfade.
- **`useTransition` + `router.replace`** — current `news-hub-filter-client.tsx` already uses `useTransition`. Keep that wrapping pattern; only swap the state source from `useState` to `useSearchParams`.
- **Card "Read Article" button className** — copy verbatim from `components/news-hub/news-hub-article-card.tsx` lines 109–115 onto the slider chips (active state adds emphasis, not a different style).

---

## Implementation Phases

### Phase 1 — TOC sticky fix (small, low risk, ship first)

1.1 Restructure `app/news-hub/category/[categorySlug]/[articleSlug]/page.tsx` to wrap `<LayoutDispatcher />` + `<RelatedArticlesSection />` in a single `<div>` inside the grid left cell.
1.2 Standardize sticky offset on the `<aside>` (`top-37.5 self-start mt-2`).
1.3 Add `<h2>Client Testimonial</h2>` to `detail-quote-block.tsx` matching the existing block heading pattern.
1.4 Verify: `pnpm typecheck && pnpm build` (must remain 81 pages, 0 errors).
1.5 Manual verify in browser on one article per layout type (article, case-study, insight, review): TOC stays docked through related-articles, last link "Testimonial" scrolls to a section with a visible "Client Testimonial" heading.

### Phase 2 — Category slider component (new file, isolated)

2.1 Build `news-hub-category-slider.tsx` (chips, scroll-snap, URL state, sticky positioning, active scroll-into-view). Verify in isolation (render it without wiring into page).
2.2 Build `news-hub-category-title.tsx` (Framer Motion crossfade reading from URL).
2.3 Verify: `pnpm typecheck && pnpm build` after each component.

### Phase 3 — Wire URL state through filter client

3.1 Refactor `news-hub-filter-client.tsx` to consume `useSearchParams`.
3.2 Verify the legacy filter still works as a fallback while we swap the renderer (paranoia step — can be skipped if confident).

### Phase 4 — Page composition

4.1 Update `app/news-hub/page.tsx` render order: insert slider + dynamic title between `SectionIntro` and `NewsHubFilterClient`.
4.2 Delete `news-article-filter-bar.tsx`.
4.3 Verify: `pnpm typecheck && pnpm build && pnpm test` and `pnpm test:e2e --reporter=list` (Playwright with `PLAYWRIGHT_REUSE_SERVER=true`).

### Phase 5 — Tests

5.1 Add Playwright test in `e2e/navigation-flows.spec.ts` (or new spec): visit `/news-hub?category=reviews`, assert active chip is "Reviews", assert title text is "Latest Reviews", assert grid only shows review-typed articles.
5.2 Add Playwright test for sticky TOC on article detail page: scroll to bottom of article body + related-articles, assert `[data-sticky-toc="true"]` is still in viewport at the very end of the grid section.
5.3 Add Playwright test: testimonial TOC link click scrolls to `#testimonial`, the "Client Testimonial" heading is visible above the quote.

---

## Verification

**Local build gate (mandatory before commit each phase):**
```bash
pnpm typecheck && pnpm build
```
Must return: 0 TypeScript errors, 81 pages built.

**Full test suite (before PR):**
```bash
pnpm test                                                # Vitest — expect 396+ passing
PLAYWRIGHT_REUSE_SERVER=true pnpm test:e2e --reporter=list   # Playwright — expect 93+ passing
```

**Manual browser verification (one article per layout type):**
- Open article in `/news-hub/category/reviews/[slug]`. Click TOC item "Client Testimonial". Verify scroll lands on visible "Client Testimonial" heading above the quote.
- Scroll all the way through the article + related-articles. Verify the right-side TOC sidebar stays docked until the user has scrolled past the entire grid section (mirror /projects behavior).
- Open `/news-hub`. Click "Reviews" chip. Verify URL becomes `/news-hub?category=reviews`, the eyebrow title crossfades to "Latest Reviews", grid filters. Hit browser back — URL reverts, title and grid restore. Refresh on `/news-hub?category=insights` — chip "Insights" is active on load.
- Resize to mobile width (375px). Verify chips don't wrap; horizontal swipe reveals overflow chips; the active chip auto-centres after click.
- Scroll the page. Verify the slider docks UNDER the breadcrumb (breadcrumb on top, slider just below it, both visible). Confirmed that `top-26 lg:top-30 z-30` produces this stacking with breadcrumb at `top-16 lg:top-20 z-40`.

**MCP-driven verification:**
- `mcp__MCP_DOCKER__playwright__browser_navigate` to `localhost:3000/news-hub?category=reviews`
- `browser_take_screenshot` to capture the stacked sticky state
- `browser_console_messages` to confirm no `[TOC] Missing section IDs:` warnings (dev-mode guard from PR #135)

---

## Risk Notes

- **Sticky stacking visual collision:** Breadcrumb (z-40) and slider (z-30) at adjacent top offsets — confirm in browser that the breadcrumb's bottom border doesn't visually clash with the slider's top border. Mitigation: slider gets `border-t-0` and breadcrumb keeps its `border-b`, so the seam is single-line.
- **`router.replace` with `scroll: false`:** must NOT cause Next.js to remount Server Components in the page. `useSearchParams` triggers a re-render of the consuming Client Components only. Verify in build output that the page is still statically rendered (Suspense boundary around `NewsHubFilterClient` already isolates the dynamic part).
- **Initial page load with `?category=reviews`:** `useSearchParams()` requires `Suspense` upstream. The existing `<Suspense>` wrapping `NewsHubFilterClient` (page.tsx:64-71) covers this; the new slider + title components must render INSIDE that Suspense or have their own Suspense boundaries.
- **Existing `e2e/navigation-flows.spec.ts` may reference the old filter bar selector** — check before refactor; update test selectors to match new component.

---

## Already Implemented (correction — was previously listed as out of scope)

- **Load More pagination** — `components/news-hub/load-more-button.tsx` already provides accessible pagination (remaining count, loading state, `aria-busy`, `aria-live`). Used by `news-hub-feed.tsx` and `news-grid-layout.tsx`. No change needed.

---

## Future Enhancements (captured for later — not this PR)

User-confirmed roadmap, captured to Docker entity `decide-news-hub-future-roadmap` and to this spec for retrieval. None block the current feature; each is a self-contained increment.

| # | Enhancement | Recommended approach | Strapi-future fit |
|---|---|---|---|
| 1 | **Infinite scroll** | Hybrid: IntersectionObserver auto-loads next batch when near bottom; after 2–3 auto-loads fall back to existing Load More button (preserves footer access). Use `useTransition` + `useOptimistic` for placeholder cards. Restore scroll position on back-nav via `scrollRestoration` + sessionStorage anchor. | Pagination already maps cleanly to GraphQL `first: N, after: cursor` — same shape, swap data source. |
| 2 | **Search input on filter bar** | Client-side now (Fuse.js ~5kb, or simple `title+tags+summary includes(q)`) → Strapi GraphQL filter parameter later. Position: right edge of filter slider on desktop (icon → expands), full-width row above slider on mobile. Combines with category, doesn't replace it. | URL contract `?category=X&q=Y` future-proofs both. |
| 3 | **Tag filtering** | Cross-cutting TOPIC axis (vs category which is TYPE). Articles already have tags in `data/news/index.ts` — picker should exclude category-name tags ("Residential", "Insights") and surface only topical tags ("EV", "Healthcare", "Smart Living", etc). URL contract: `?tag=ev`. Combines with category + search. | Strapi tag relations map natively — `articles(filter: { tags: { name_in: [$tags] } })`. |
| 4 | **Sort options** | Newest / most-read / read-time. URL contract: `?sort=newest`. | Strapi sort: `articles(sort: ["publishedAt:desc"])`. |
| 5 | **Saved articles persistence** | The Save button on cards already exists but doesn't persist. localStorage now → user-account-bound later. | Strapi user collection + `savedArticles` relation. |
| 6 | **RSS feed at `/news-hub/feed.xml`** | Next.js 16 `app/news-hub/feed.xml/route.ts` returning XML. SEO win + power-user feature. | Drop-in once data source moves to Strapi — same feed shape. |

**URL contract evolution:** `?category=<slug>&tag=<topic>&q=<query>&sort=<order>&page=<n>` — five orthogonal axes, all combine, none duplicate.

---

## Truly Out of Scope (this PR + likely permanently)

- Animating the chip ring/glow on hover beyond the existing card pattern.
- Mobile bottom-sheet variant of the filter — current sliding bar is sufficient per user request.
- Lighthouse audit and brightness/saturation polish on Services/About/ProjectCategory — separate Phase 8 work, not blocked by this.

---

## Memory Lane Optimization

After plan approval, sync the new lane lean — only what's needed for execution, no full rehydration.

**New lane:** `news-hub-toc-and-category-slider`

**Docker entities to create:**
- `feat-news-hub-toc-and-category-slider` (feature) — auto-created by lane hook; use `add_observations`
- `plan-news-hub-toc-and-category-slider` (plan, with phases above)
- `decide-category-filter-url-state` (decision: URL params over local state)
- `decide-slider-native-scroll-snap` (decision: native CSS over library)
- `decide-news-hub-future-roadmap` (decision: 6 future enhancements with rationale per item — infinite scroll hybrid, search, tag filter, sort, saved articles, RSS)
- `session-2026-05-06-007` (session) — note: 003 already taken; sessions 001–006 exist on 2026-05-06

**Relations to wire (8 total):**
- `plan-news-hub-toc-and-category-slider` → `feat-news-hub-toc-and-category-slider` (`describes`)
- `decide-category-filter-url-state` → `plan-news-hub-toc-and-category-slider` (`derives_from`)
- `decide-slider-native-scroll-snap` → `plan-news-hub-toc-and-category-slider` (`derives_from`)
- `decide-news-hub-future-roadmap` → `feat-news-hub-toc-and-category-slider` (`informs`) — roadmap parked, not blocking
- `session-2026-05-06-007` → `feat-news-hub-toc-and-category-slider` (`designs`)
- `session-2026-05-06-007` → `nexgen-electrical-innovations-state` (`updates`)
- `feat-news-hub-toc-and-category-slider` → `nexgen-electrical-innovations-state` (`extends`)
- `feat-news-hub-toc-and-category-slider` → `feat-toc-data-driven-article` (`follows`)

**Lane manifest** (`config/memory-lanes/news-hub-toc-and-category-slider.json`):
- Includes only the 4 critical files above + the `lib/scroll-to-section.ts` reference
- Includes the plan + decision entities
- Excludes the Phase 1–7 historical context (already on `electrical-website-state` archived entity)
- Token budget target: ≤2,000 at session rehydration (well under 3,000 enforced cap)

**Obsidian note:** `Projects/Nexgen Electrical Innovations/Features/feat-news-hub-toc-and-category-slider.md` — link to plan + decision entities, link to spec doc, link to PR (after creation).
