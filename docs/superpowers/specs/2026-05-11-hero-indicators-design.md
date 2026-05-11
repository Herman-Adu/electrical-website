---
title: Hero Indicators — Generic Trust Card System
description: Replace project KPI grid and article metadata with content-specific HeroTrustIndicators cards on all detail heroes
category: guides
status: active
last-updated: 2026-05-11
---

# Hero Indicators — Generic Trust Card System

## Problem

Project detail heroes show a `ProjectKpiGrid` (bold cyan value + small label below — no icons, no descriptions). Article detail heroes show 1–2 bespoke inline boxes (author + optional spotlight metric). Neither matches the established `HeroTrustIndicators` card style used on category heroes (icon + single-line cyan title + 2–3 line description, dark glassmorphism).

This inconsistency breaks visual cohesion across the site. Additionally, the project KPI grid exposes budget data the client does not want shown publicly.

## Goal

Every project and article detail hero displays exactly 4 `HeroTrustIndicators` cards in `variant="image-overlay"` style. Each set of 4 is content-specific to that project or article — factual, richly written, no budget data.

## Architecture Decision: Approach A — Reuse Existing Types and Component

`TrustIndicatorItem` already exists in `types/sections.ts`. `HeroTrustIndicators` already exists in `components/shared/hero-trust-indicators.tsx` with the correct `variant="image-overlay"` style. No new components are created. This is the DRY choice.

## Type Changes

### `types/sections.ts`
Expand `IconName` union with two additional values needed for indicators:
```ts
| 'MapPin'
| 'Calendar'
```

### `types/projects.ts`
Add to `Project` interface after `isFeatured`:
```ts
heroIndicators: readonly [TrustIndicatorItem, TrustIndicatorItem, TrustIndicatorItem, TrustIndicatorItem];
```
Import `TrustIndicatorItem` from `@/types/sections`.

Remove: `heroIndicators` must NOT include any budget or cost field — client requirement.

### `types/news.ts`
Add to `NewsArticle` interface after `isFeatured`:
```ts
heroIndicators: readonly [TrustIndicatorItem, TrustIndicatorItem, TrustIndicatorItem, TrustIndicatorItem];
```
Import `TrustIndicatorItem` from `@/types/sections`.

## Component Changes

### `components/projects/project-detail-hero.tsx`
Remove the `{/* KPI stats */}` motion block (lines ~180–188) that renders `<ProjectKpiGrid kpis={project.kpis} />`.

Replace with:
```tsx
{/* Hero indicators */}
<motion.div
  className="mt-12 mb-12"
  initial={shouldReduce ? {} : { opacity: 0, y: 16 }}
  animate={{ opacity: 1, y: 0 }}
  transition={{ delay: 0.5, duration: 0.5 }}
>
  <HeroTrustIndicators
    items={project.heroIndicators}
    variant="image-overlay"
  />
</motion.div>
```

Add import: `import { HeroTrustIndicators } from "@/components/shared/hero-trust-indicators";`

Remove import: `ProjectKpiGrid` (check if used elsewhere before removing).

### `components/news-hub/news-detail-hero.tsx`
Remove the entire bespoke `motion.div` block (~lines 182–220) that renders author box, spotlightMetric box, and location box inline.

Replace with:
```tsx
<motion.div
  variants={itemVariants}
  className="mt-8 w-full"
>
  <HeroTrustIndicators
    items={article.heroIndicators}
    variant="image-overlay"
  />
</motion.div>
```

Add import: `import { HeroTrustIndicators } from "@/components/shared/hero-trust-indicators";`

## Data Changes

### `data/projects/index.ts` — 16 entries
Each project gets `heroIndicators` added after `heroHeadline`. 4 cards per project, content-specific.

**Card writing rules:**
- Card 1: Project type / sector credential (e.g. "Part P Certified", "NICEIC Approved")
- Card 2: Scope / scale indicator (e.g. "Full Rewire", "3-Phase Install")
- Card 3: Technical specification (drawn from project detail — capacity, standard, system type) — NO budget
- Card 4: Outcome / location / timeline fact

**Icon palette for projects:** `Shield`, `CheckCircle`, `Zap`, `Wrench`, `ClipboardCheck`, `Award`, `Building2`, `Home`, `Factory`, `Gauge`, `MapPin`, `Calendar`, `Battery`, `Plug`, `Settings`, `Star`

### `data/news/index.ts` — 24 articles
Each article gets `heroIndicators` added after `heroHeadline`. 4 cards per article, content-specific.

**Card writing rules:**
- Card 1: Article category credential or topic authority (e.g. "BS 7671 Compliant", "Industry Expert")
- Card 2: Key metric or insight from the article (draw from spotlightMetric if present)
- Card 3: Practical relevance / scope of application
- Card 4: Author context or publication credential

**Icon palette for articles:** `BookOpen`, `Award`, `Lightbulb`, `Users`, `Shield`, `CheckCircle`, `Activity`, `Star`, `ClipboardCheck`, `Gauge`, `Zap`, `MessageSquare`

## Execution Order (for implementation plan)

1. Expand `IconName` in `types/sections.ts` (+2 values)
2. Add `heroIndicators` as optional (`heroIndicators?:`) to both type files — enables migration without immediate typecheck failures
3. Delegate: write all 64 project indicators to `data/projects/index.ts` via agent
4. Delegate: write all 96 article indicators to `data/news/index.ts` via agent (parallel with step 3)
5. Make `heroIndicators` required (remove `?`) in both types
6. Update `project-detail-hero.tsx` — swap KPI block for `HeroTrustIndicators`
7. Update `news-detail-hero.tsx` — swap bespoke metadata block for `HeroTrustIndicators`
8. Update any test mocks that construct `Project` or `NewsArticle` objects
9. `pnpm typecheck && pnpm build` — must pass, 84 static pages unchanged
10. Playwright spot-check: harvey-nichols, calcot-park, news-001, news-021

## Non-Goals

- Do NOT show budget on any project card
- Do NOT create a new component — `HeroTrustIndicators` is sufficient
- Do NOT change the `HeroTrustIndicators` component itself
- Do NOT modify `ProjectKpiGrid` — it may still be used on category pages

## Verification Gates

- [ ] `pnpm typecheck` — zero errors
- [ ] `pnpm build` — 84 static pages (no regression)
- [ ] Harvey Nichols hero: 4 indicator cards, icon + title + description each
- [ ] Calcot Park hero: 4 cards, no budget shown
- [ ] news-001 (Taplow): 4 cards replacing author/metric boxes
- [ ] news-021 (Developer Framework Agreement): 4 cards
- [ ] Dark/light mode: cards render correctly in both

## Files Touched

| File | Change |
|------|--------|
| `types/sections.ts` | +2 IconName values |
| `types/projects.ts` | +heroIndicators field + TrustIndicatorItem import |
| `types/news.ts` | +heroIndicators field + TrustIndicatorItem import |
| `components/projects/project-detail-hero.tsx` | Swap KPI → HeroTrustIndicators |
| `components/news-hub/news-detail-hero.tsx` | Swap metadata → HeroTrustIndicators |
| `data/projects/index.ts` | 16 × 4 indicator objects |
| `data/news/index.ts` | 24 × 4 indicator objects |
| `components/news-hub/detail/__tests__/detail-blocks.test.tsx` | Add heroIndicators to `mockArticle()` helper |
