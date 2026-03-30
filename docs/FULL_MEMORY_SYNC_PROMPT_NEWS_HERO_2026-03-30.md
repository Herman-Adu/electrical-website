# FULL MEMORY SYNC PROMPT — News Hub Hero Alignment + Spacing + Article Hero (2026-03-30)

Use this exact prompt in a new chat window. Do not summarize or compact context before acting.

---

You are continuing work in Herman-Adu/electrical-website on Windows (VS Code).

## Mandatory operating rules

- Follow .github/copilot-instructions.md, AGENTS.md, CLAUDE.md.
- Before changing Next.js behavior, run: pnpm run status:next-docs.
- Docs resolution order:
  1. node_modules/next/dist/docs/
  2. node_modules/next/docs/
  3. node_modules/next/README.md
- In this repo, status currently resolves to node_modules/next/README.md.
- No new npm packages for this task line.
- Keep edits surgical and preserve route contracts/types.

## Session objective that was executed

Primary objective was completed in multiple passes:

1. Align News Hub hero system to Projects hero style language.
2. Add animated category index hero and image-backed per-category hero.
3. Wire those heroes into category routes.
4. Fix vertical spacing regression by replacing hard-coded spacing with shared section utilities (matching Projects rhythm).
5. Add image-backed hero for each article detail page using the article’s own featured image.
6. Ensure hero scroll targets are correctly wired.

## Current repository state (important)

Git status currently shows these tracked modifications:

- app/news-hub/page.tsx
- app/news-hub/category/page.tsx
- app/news-hub/category/[categorySlug]/page.tsx
- app/news-hub/category/[categorySlug]/[articleSlug]/page.tsx
- components/news-hub/news-hub-hero.tsx
- components/news-hub/news-hub-categories-hero.tsx (new)
- components/news-hub/news-category-hero.tsx (new)
- components/news-hub/news-detail-hero.tsx
- components/news-hub/index.ts

And these additional untracked docs/files from prior parallel workstreams are present:

- CONTINUE_PHASE4_CI_HARDENING.md
- NEXT_SESSION_PROMPT_2026-03-30_TIER2_ALIGNMENT.md
- PHASE_4_COMPLETION_HANDOFF.md
- RESUME_PROMPT_2026-03-30_MCP_HARDENING.md
- agent/pnpm-lock.yaml
- docs/NEXT_SESSION_PROMPT_NEWS_HERO_ALIGNMENT_2026-03-30.md

Do not delete unrelated untracked files unless explicitly requested.

## What is already implemented (News Hub)

### A) Main News Hub hero upgraded

File: app/news-hub/page.tsx + components/news-hub/news-hub-hero.tsx

- news-hub hero now uses:
  - HeroParallaxShell
  - BlueprintBackground
  - useHeroParallax
  - useReducedMotion guards
- added status strip, animated headline, animated chips
- preserved props contract:
  - categories
  - activeCategory
  - totalArticles
- hero scroll CTA now targets section id news-hub-feed (wired)

### B) Category index hero added

File: components/news-hub/news-hub-categories-hero.tsx

- animated command-centre style hero implemented
- prop contract:
  - categoryCount: number
- includes breadcrumb + CTA behavior aligned to projects categories pattern

### C) Per-category hero with image mapping added

File: components/news-hub/news-category-hero.tsx

- image-backed hero + overlay + parallax shell implemented
- prop contract:
  - category: NewsCategory
  - articleCount: number
- includes fallback config
- mapping implemented exactly:
  - residential -> /images/smart-living-interior.jpg
  - industrial -> /images/services-industrial.jpg
  - partners -> /images/community-hero.jpg
  - case-studies -> /images/power-distribution.jpg
  - insights -> /images/system-diagnostics.jpg
  - reviews -> /images/warehouse-lighting.jpg
  - fallback -> /images/services-commercial.jpg

### D) Category pages wired to new heroes

Files:

- app/news-hub/category/page.tsx
- app/news-hub/category/[categorySlug]/page.tsx

Wiring done:

- category index page renders NewsHubCategoriesHero categoryCount={newsCategories.length}
- per-category page renders NewsCategoryHero category={category} articleCount={items.length}
- existing data flow and route behavior preserved

### E) Barrel exports updated

File: components/news-hub/index.ts

Added exports:

- NewsHubCategoriesHero
- NewsCategoryHero

### F) Article detail now has image-backed hero per article

Files:

- components/news-hub/news-detail-hero.tsx
- app/news-hub/category/[categorySlug]/[articleSlug]/page.tsx

Implemented:

- NewsDetailHero migrated to image-backed parallax hero using article.featuredImage
- overlay/decor/motion language aligned to hero system
- reduced-motion aware behavior retained
- scroll indicator points to article-content section id
- article page section spacing normalized with section utilities

## Vertical spacing regression resolution

Root cause found and fixed:

- section-container alone has no vertical padding in this design system.
- prior News Hub sections were using ad-hoc pb-24 and mixed spacing.
- replaced with shared spacing primitives used in Projects:
  - section-standard
  - section-container section-padding-sm
  - section-container section-padding

Applied patterns:

- app/news-hub/page.tsx
  - featured block -> section-standard
  - bento block -> section-container section-padding-sm
  - feed block -> section-container section-padding
- app/news-hub/category/page.tsx
  - categories grid -> section-standard
- app/news-hub/category/[categorySlug]/page.tsx
  - articles grid -> section-standard
- app/news-hub/category/[categorySlug]/[articleSlug]/page.tsx
  - article content -> section-standard
  - related articles -> section-container section-padding

## Validation evidence from session

Executed and passing during this session:

1. pnpm run status:next-docs

- Result: node_modules/next/README.md found and selected.

2. pnpm build

- Result: successful build and static generation completed.

3. pnpm lint

- Result: 0 errors, warnings are pre-existing global warnings in repo.

## Manual checks still recommended in fresh window

Please run visual checks for:

- /news-hub
  - hero spacing from navbar
  - hero -> featured -> bento -> feed rhythm
  - hero scroll button lands on feed section
- /news-hub/category
  - hero to categories grid spacing
  - command-centre hero animation/reduced motion behavior
- /news-hub/category/industrial
  - category hero image and overlay quality
  - article count/breadcrumb display
- /news-hub/category/industrial/docklands-switchgear-watch
  - article hero uses the article featured image
  - hero scroll button lands on article content
  - related section spacing

## Immediate next action in new window

Start with:

1. pnpm run status:next-docs
2. git status --short
3. pnpm build
4. pnpm lint

Then do browser verification at desktop and mobile breakpoints.

## If anything still feels tightly stacked

Do not introduce hard-coded py/mt/pb values at route section level.
Use only section utilities:

- section-standard (full section rhythm)
- section-container section-padding-sm (compact mid rhythm)
- section-container section-padding (full content rhythm)

## Suggested commit message for this line of work

feat(news-hub): align hero system with projects style, normalize vertical spacing, and add image-backed article heroes

---

End of memory sync. Continue from this exact state.
