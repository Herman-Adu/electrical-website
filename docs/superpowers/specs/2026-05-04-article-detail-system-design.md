---
title: Article Detail System
description: Type-aware rendering layer for news-hub article detail pages
category: feature
status: planned
feature: feat-article-detail-system
branch: feat/article-detail-system
created: 2026-05-04
---

# Article Detail System — Design Spec

## Problem

All six article categories (residential, industrial, partners, case-studies, insights, reviews)
render through one monolithic `NewsArticleContent` component. A £2M case study and a
residential blog post look identical. The data model has rich optional fields —
the rendering layer ignores them aesthetically.

## Solution: Type-Aware Composer Pattern

Single route unchanged. `LayoutDispatcher` dispatches on `article.category`:

```
page.tsx → <LayoutDispatcher> → CaseStudyLayout | InsightLayout | ReviewLayout | ArticleLayout
```

Each composer assembles blocks from `components/news-hub/detail/` differently.

## Category → Layout Map

| Category | Layout | Aesthetic |
|---|---|---|
| case-studies | CaseStudyLayout | Industrial dashboard — data-forward, animated metrics |
| insights | InsightLayout | Editorial white paper — stat strip, methodology steps |
| reviews | ReviewLayout | Testimonial showcase — quote-first, verified badge |
| residential | ArticleLayout | Project portfolio — image-led, narrative |
| industrial | ArticleLayout (dense) | Project portfolio — technical detail emphasis |
| partners | ArticleLayout (co-brand) | Partner badge space, co-authored framing |

## Component Library: `components/news-hub/detail/`

### Universal Blocks
- `detail-intro-block.tsx` — lead paragraphs, drop-cap, author attribution
- `detail-body-block.tsx` — body paragraphs with pull-quote support
- `detail-takeaway-block.tsx` — Framer Motion staggered checklist
- `detail-quote-block.tsx` — pull quote, oversized mark, author pill
- `detail-conclusion-block.tsx` — closing text, subtle border
- `detail-gallery-block.tsx` — GSAP horizontal scroll (3+) or 2-col grid

### Case Study Blocks
- `case-study-status-badge.tsx` — "PROJECT STATUS: COMPLETED" pulsing dot, GSAP glow
- `case-study-progress-metrics.tsx` — CountUp + horizontal fill bars (Framer Motion useInView)
- `case-study-challenge-cards.tsx` — challenge (amber) + solution (cyan) 2-col cards
- `case-study-specs-grid.tsx` — monospace data sheet, category headers, bordered cells
- `case-study-scope-list.tsx` — numbered step cards with icons
- `case-study-results-showcase.tsx` — before/after metric comparison, delta indicators

### Insight Blocks
- `insight-key-stat-strip.tsx` — full-width horizontal stat bar, CountUp numbers
- `insight-methodology-steps.tsx` — numbered steps, connecting progress dots
- `insight-data-callout.tsx` — framed stat + supporting sentence

### Review Blocks
- `review-verified-badge.tsx` — "VERIFIED CLIENT REVIEW" shield + checkmark animation
- `review-highlight-quote.tsx` — oversized quote treatment, quote IS the hero

### Composers + Dispatcher
- `case-study-layout.tsx` — CaseStudyLayout composer
- `insight-layout.tsx` — InsightLayout composer
- `review-layout.tsx` — ReviewLayout composer
- `article-layout.tsx` — ArticleLayout composer (residential/industrial/partners variants)
- `layout-dispatcher.tsx` — dispatches on article.category
- `index.ts` — re-exports all

## Global Enhancement
Reading progress bar: GSAP ScrollTrigger → 2px electric-cyan line, viewport top.
Wire in page.tsx, applies to all types.

## Files Modified
- `app/news-hub/category/[categorySlug]/[articleSlug]/page.tsx` — swap NewsArticleContent → LayoutDispatcher
- `components/news-hub/index.ts` — add detail/ re-exports

## No Breaking Changes
- `types/news.ts` — unchanged
- URL structure — unchanged
- Sidebar, breadcrumb, related articles — unchanged

## Phased Implementation
- Phase 1: Universal blocks + case-study blocks + CaseStudyLayout + LayoutDispatcher + page.tsx
- Phase 2: InsightLayout + ArticleLayout
- Phase 3: ReviewLayout
- Phase 4: Content migration (separate session)

## TDD Requirements
- Each block: renders with minimal required props (content assertions, no snapshots)
- LayoutDispatcher: dispatches correct layout for all 6 categories
- Build gate: pnpm typecheck && pnpm build && pnpm test

## Verification
1. `pnpm typecheck` — zero errors
2. `pnpm build` — 81+ static pages
3. `pnpm test` — 334+ passing
4. Playwright: /news-hub/category/case-studies/[slug] — status badge + progress bars visible
5. Playwright: /news-hub/category/residential/[slug] — no regression
