# NEXT SESSION PROMPT — News Hub Hero Alignment (2026-03-30)

You are continuing work in `Herman-Adu/electrical-website` on Windows (VS Code).

## Goal

Align `news-hub` hero sections with the production `projects` hero style system, including image-backed hero treatments where appropriate.

The scaffold is already complete on branch `feature/news-hub-skeleton` at commit `73ed07c`.

---

## Mandatory repo rules

Follow:

- `.github/copilot-instructions.md`
- `AGENTS.md`
- `CLAUDE.md`

Before changing Next.js behavior, run:

- `pnpm run status:next-docs`

(Expect local docs to resolve to `node_modules/next/README.md`.)

---

## Current state summary

`projects` hero system already uses advanced animated patterns:

- `components/projects/projects-hero.tsx`
- `components/projects/projects-categories-hero.tsx`
- `components/projects/project-category-hero.tsx`
- shared utilities:
  - `components/hero/hero-parallax-shell.tsx`
  - `components/hero/blueprint-background.tsx`
  - `components/hero/use-hero-parallax.ts`

`news-hub` currently has:

- `components/news-hub/news-hub-hero.tsx` (simple)
- category pages with inline static section markup:
  - `app/news-hub/category/page.tsx`
  - `app/news-hub/category/[categorySlug]/page.tsx`

---

## What to implement

### 1) Upgrade News Hub main hero

Redesign `components/news-hub/news-hub-hero.tsx` to visually align with `projects-hero` style:

- `"use client"`
- use `HeroParallaxShell`, `BlueprintBackground`, `useHeroParallax`
- add status strip + animated headline + chip filters
- preserve existing props exactly:
  - `categories`
  - `activeCategory`
  - `totalArticles`
- use `useReducedMotion()` guards for animations

### 2) Add category-index hero component

Create `components/news-hub/news-hub-categories-hero.tsx` inspired by `projects-categories-hero`:

- animated command-centre hero style
- props:
  - `categoryCount: number`
- include breadcrumb/action CTA similar to projects category index behavior

### 3) Add per-category hero component with image support

Create `components/news-hub/news-category-hero.tsx` inspired by `project-category-hero`:

- image-backed hero with gradient overlays
- animated status, breadcrumb, and category metadata
- props:
  - `category: NewsCategory`
  - `articleCount: number`
- include fallback config if slug not mapped

### 4) Wire new hero components into pages

Update only these route files to replace inline top sections:

- `app/news-hub/category/page.tsx`
  - render `<NewsHubCategoriesHero categoryCount={newsCategories.length} />`
- `app/news-hub/category/[categorySlug]/page.tsx`
  - render `<NewsCategoryHero category={category} articleCount={items.length} />`

Keep all existing data flow and route behavior intact.

### 5) Add exports

Update `components/news-hub/index.ts` to export:

- `NewsHubCategoriesHero`
- `NewsCategoryHero`

---

## Image mapping requirement (hero imagery)

Use existing assets only (no new images):

- residential → `/images/smart-living-interior.jpg`
- industrial → `/images/services-industrial.jpg`
- partners → `/images/community-hero.jpg`
- case-studies → `/images/power-distribution.jpg`
- insights → `/images/system-diagnostics.jpg`
- reviews → `/images/warehouse-lighting.jpg`
- category-index hero background fallback → blueprint or `/images/services-commercial.jpg`

Do not invent paths.

---

## Files in scope

### Edit

- `components/news-hub/news-hub-hero.tsx`
- `components/news-hub/index.ts`
- `app/news-hub/category/page.tsx`
- `app/news-hub/category/[categorySlug]/page.tsx`

### Create

- `components/news-hub/news-hub-categories-hero.tsx`
- `components/news-hub/news-category-hero.tsx`

### Reference only

- `components/projects/projects-hero.tsx`
- `components/projects/projects-categories-hero.tsx`
- `components/projects/project-category-hero.tsx`

---

## Constraints

- Keep current route contracts and types unchanged.
- No new npm packages.
- No changes to `types/news.ts` and `data/news/index.ts` unless required for strict type safety (prefer no changes).
- Use existing design tokens and utility patterns.
- Keep modifications surgical.

---

## Validation checklist

Run and report:

1. `pnpm run status:next-docs`
2. `pnpm build`
3. `pnpm lint` (warnings acceptable if pre-existing)

Manual spot-check expectations:

- `/news-hub` hero now matches project-style motion language
- `/news-hub/category` has dedicated animated hero component
- `/news-hub/category/industrial` has image-backed category hero
- category hero images map correctly to slug definitions above
- reduced-motion behavior does not break layout

---

## Suggested commit message

`feat(news-hub): align hero system with projects style and category image heroes`
