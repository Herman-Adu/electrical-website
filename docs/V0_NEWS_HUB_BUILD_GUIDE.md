# v0 Build Guide — News Hub Visual Design

## Purpose

This guide gives v0.dev a strict contract for redesigning the new `news-hub` feature without touching its route architecture, typed data layer, or metadata wiring.

The scaffold is intentionally modelled after the projects section:

- SSR landing page with `?category=` filtering
- Static category index
- Static category article routes
- Typed mock data ready to map to Strapi later
- Reusable presentational components in `components/news-hub/`

---

## Absolute constraints

1. Do **not** edit any `app/news-hub/**/page.tsx` files.
2. Do **not** change `types/news.ts`.
3. Do **not** change `data/news/index.ts`.
4. Do **not** change `lib/metadata-news.ts`.
5. Do **not** change `lib/actions/validate-search-params.ts` or `lib/schemas/search-params.ts` for news-hub contracts.
6. Keep all component prop signatures identical.
7. No `any` types.
8. Components receiving content props stay presentational.
9. Use Framer Motion for animation work.
10. Do not add new npm packages.

---

## Route architecture already wired

- `app/news-hub/page.tsx` — SSR list with `?category=` filter
- `app/news-hub/loading.tsx`
- `app/news-hub/error.tsx`
- `app/news-hub/category/page.tsx` — SSG category index
- `app/news-hub/category/[categorySlug]/page.tsx` — per-category list
- `app/news-hub/category/[categorySlug]/loading.tsx`
- `app/news-hub/category/[categorySlug]/error.tsx`
- `app/news-hub/category/[categorySlug]/not-found.tsx`
- `app/news-hub/category/[categorySlug]/[articleSlug]/page.tsx` — article detail
- `app/news-hub/category/[categorySlug]/[articleSlug]/loading.tsx`
- `app/news-hub/category/[categorySlug]/[articleSlug]/error.tsx`
- `app/news-hub/category/[categorySlug]/[articleSlug]/not-found.tsx`

---

## Typed data model summary

See `types/news.ts` for the final source of truth.

### Category slugs

`all | residential | industrial | partners | case-studies | insights | reviews`

### Core entities

- `NewsCategory`
- `NewsArticle`
- `NewsArticleListItem`
- `NewsHubMetricItem`
- `NewsSidebarCard`

### Important implementation note

The landing page uses **two data streams**:

1. article list content
2. right-rail sidebar cards for campaigns, social proof, partner stories, and reviews

That split must remain intact because it maps cleanly to future Strapi collections and OpenAPI schemas.

---

## Current component surface

- `components/news-hub/news-hub-hero.tsx`
- `components/news-hub/news-hub-featured-card.tsx`
- `components/news-hub/news-hub-bento-grid.tsx`
- `components/news-hub/news-hub-feed.tsx`
- `components/news-hub/news-hub-article-card.tsx`
- `components/news-hub/news-hub-sidebar.tsx`
- `components/news-hub/news-article-card-shell.tsx`
- `components/news-hub/news-category-card.tsx`
- `components/news-hub/news-detail-hero.tsx`
- `components/news-hub/news-related-articles.tsx`
- `components/news-hub/news-hub-categories-hero.tsx`
- `components/news-hub/news-category-hero.tsx`
- `components/news-hub/index.ts`

---

## Required layout intent

### Landing page

1. intro / hero at top
2. featured article section
3. metric strip / bento summary
4. content layout with:
   - left: article cards, about 2/3 width
   - right: sticky sidebar cards, about 1/3 width

### Category index

A premium category-card grid with counts and clear entry points.

### Category list page

A strong category header followed by article cards.

### Article detail page

A premium hero, readable story body, metrics/quote rail, and related articles.

---

## Prop signatures to preserve

```ts
interface NewsHubHeroProps {
  categories: NewsCategory[];
  activeCategory: NewsCategorySlug;
  totalArticles: number;
}

interface NewsHubFeaturedCardProps {
  article: NewsArticle;
}

interface NewsHubBentoGridProps {
  items: NewsHubMetricItem[];
}

interface NewsHubFeedProps {
  items: NewsArticleListItem[];
  sidebarCards: NewsSidebarCard[];
  initialCount?: number;
}

interface NewsHubArticleCardProps {
  item: NewsArticleListItem;
  isSaved?: boolean;
  isPending?: boolean;
  onToggleSave?: () => void;
}

interface NewsHubSidebarProps {
  cards: NewsSidebarCard[];
}

interface NewsCategoryCardProps {
  category: NewsCategory;
  articleCount: number;
}

interface NewsHubCategoriesHeroProps {
  categoryCount: number;
}

interface NewsCategoryHeroProps {
  category: NewsCategory;
  articleCount: number;
}

interface NewsDetailHeroProps {
  article: NewsArticle;
}

interface NewsRelatedArticlesProps {
  articles: NewsArticle[];
}
```

---

## Visual direction for v0

- dark premium UI, command-centre energy similar to projects
- electric cyan accents using existing design tokens only
- glass cards and strong content hierarchy
- mono eyebrow labels and metadata chips
- strong sidebar treatment for campaign cards
- the feed should feel editorial, not product-grid
- preserve the left-content / right-sidebar split on desktop
- mobile should stack cleanly with the sidebar after the feed

---

## v0 prompt

```text
I have a working Next.js 16 App Router project. A new feature called news-hub is already scaffolded with routes, typed data, metadata, and search-param validation. Your job is to redesign the visual component layer only.

Do not change:
- app/news-hub/**/page.tsx
- types/news.ts
- data/news/index.ts
- lib/metadata-news.ts
- lib/actions/validate-search-params.ts
- lib/schemas/search-params.ts

Use only these existing files for redesign:
- components/news-hub/news-hub-hero.tsx
- components/news-hub/news-hub-featured-card.tsx
- components/news-hub/news-hub-bento-grid.tsx
- components/news-hub/news-hub-feed.tsx
- components/news-hub/news-hub-article-card.tsx
- components/news-hub/news-hub-sidebar.tsx
- components/news-hub/news-article-card-shell.tsx
- components/news-hub/news-category-card.tsx
- components/news-hub/news-detail-hero.tsx
- components/news-hub/news-related-articles.tsx
- components/news-hub/news-hub-categories-hero.tsx
- components/news-hub/news-category-hero.tsx
- components/news-hub/index.ts

Design goals:
- dark premium newsroom aesthetic
- electric cyan accents using existing CSS variables only
- hero with category chip filtering visuals
- featured story card with strong editorial hierarchy
- metric strip / bento cards
- article feed on left (about 2/3 width)
- sticky sidebar modules on right (about 1/3 width) for campaigns, partner stories, social proof, and latest review
- category cards for category index
- premium article detail hero and related article cards
- Framer Motion for motion work
- preserve all prop signatures exactly
- no any types
- no new packages

Important: the page is intentionally data-driven for future Strapi/OpenAPI integration, so keep the components purely presentational around the existing props.
```

---

## Acceptance checklist

- `pnpm exec tsc --noEmit`
- `pnpm build`
- `/news-hub` renders with hero, featured article, metrics, feed, and sidebar
- `/news-hub?category=industrial` filters correctly
- `/news-hub/category` renders all category cards
- `/news-hub/category/reviews` renders article cards for that category
- `/news-hub/category/case-studies/hospital-power-ring-lessons-learned` renders detail page
- no prop contract changes
- no `any` types
- no data-layer edits outside the approved scaffold
