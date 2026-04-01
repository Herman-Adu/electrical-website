# v0 Build Guide — News Hub Visual Design

## Purpose

This guide documents the News Hub feature architecture, design patterns, and implementation details. It covers the complete system from routing through component rendering, data fetching, and the shared component integrations.

**Cross-references**:
- For shared components used across sections, see `V0_SHARED_COMPONENTS_GUIDE.md`
- For breadcrumb system, see `V0_BREADCRUMB_SYSTEM_GUIDE.md`

The scaffold is intentionally modelled after the projects section:

- SSR landing page with `?category=` filtering
- Static category index
- Static category article routes
- Typed mock data ready to map to Strapi later
- Reusable presentational components in `components/news-hub/`
- Shared grid and breadcrumb components from `components/shared/`

---

## Absolute constraints

1. Do **not** edit any route architecture in `app/news-hub/**/page.tsx` without updating breadcrumb implementation
2. Do **not** change `types/news.ts` — extends base `NewsArticleListItem`
3. Do **not** change `data/news/index.ts` — maintains typed mock data
4. Do **not** change `lib/metadata-news.ts` — SEO metadata generation
5. Do **not** change `lib/actions/validate-search-params.ts` or `lib/schemas/search-params.ts`
6. Keep all component prop signatures identical
7. No `any` types — maintain full type safety
8. Components receiving content props stay presentational
9. Use Framer Motion for animation work
10. Do not add new npm packages
11. Update breadcrumb items when changing route structure
12. Maintain sidebar offset `top-[132px]` on detail pages (navbar + breadcrumb + gap)

---

## Route architecture

## Route architecture

All routes properly implemented and wired:

- `app/news-hub/page.tsx` — SSR list with `?category=` filter + Home/News Hub breadcrumb
- `app/news-hub/loading.tsx`
- `app/news-hub/error.tsx`
- `app/news-hub/category/page.tsx` — SSG category index + Home/News Hub/Categories breadcrumb
- `app/news-hub/category/[categorySlug]/page.tsx` — per-category list + Home/News Hub/Categories/{Category} breadcrumb
- `app/news-hub/category/[categorySlug]/loading.tsx`
- `app/news-hub/category/[categorySlug]/error.tsx`
- `app/news-hub/category/[categorySlug]/not-found.tsx`
- `app/news-hub/category/[categorySlug]/[articleSlug]/page.tsx` — article detail + full breadcrumb trail
- `app/news-hub/category/[categorySlug]/[articleSlug]/loading.tsx`
- `app/news-hub/category/[categorySlug]/[articleSlug]/error.tsx`
- `app/news-hub/category/[categorySlug]/[articleSlug]/not-found.tsx`

---

## Breadcrumb Implementation

All News Hub pages render `<ContentBreadcrumb>` below the hero section:

### Main Page (`/news-hub`)

```typescript
<ContentBreadcrumb
  items={[
    { label: "Home", href: "/" },
    { label: "News Hub", href: "/news-hub", isCurrent: true },
  ]}
  section="news"
/>
```

### Category Index (`/news-hub/category`)

```typescript
<ContentBreadcrumb
  items={[
    { label: "Home", href: "/" },
    { label: "News Hub", href: "/news-hub" },
    { label: "Categories", href: "/news-hub/category", isCurrent: true },
  ]}
  section="news"
/>
```

### Category Page (`/news-hub/category/[categorySlug]`)

```typescript
<ContentBreadcrumb
  items={[
    { label: "Home", href: "/" },
    { label: "News Hub", href: "/news-hub" },
    { label: "Categories", href: "/news-hub/category" },
    { label: category.label, href: `/news-hub/category/${categorySlug}`, isCurrent: true },
  ]}
  section="news"
/>
```

### Article Detail (`/news-hub/category/[categorySlug]/[articleSlug]`)

```typescript
<ContentBreadcrumb
  items={[
    { label: "News Hub", href: "/news-hub" },
    { label: "Categories", href: "/news-hub/category" },
    { label: category.label, href: `/news-hub/category/${categorySlug}` },
    { label: article.title, href: "#", isCurrent: true },
  ]}
  section="news"
/>
```

See `V0_BREADCRUMB_SYSTEM_GUIDE.md` for complete breadcrumb documentation and styling.

---

## Typed data model summary

See `types/news.ts` for the final source of truth.

### Hierarchy

```
NewsCategory (category metadata)
  └─ NewsArticle (article detail with full content)
      ├─ NewsArticleListItem (article in list view — extends ArticleListItem)
      └─ Also used in detail pages with full content sections
```

### Category slugs

`all | residential | industrial | partners | case-studies | insights | reviews`

### Core entity types

- `NewsCategory` — Category metadata (slug, label, description)
- `NewsArticle` — Full article with sections, timeline, gallery, testimonials
- `NewsArticleListItem` — List-view card (extends `ArticleListItem` with category, author, readTime, tags)
- `NewsHubMetricItem` — Stats for landing page bento grid
- `NewsSidebarCard` — Campaign/social proof cards for right rail

### Type-Safe Integration

News Hub types are integrated with shared types:

```typescript
// types/news.ts
export interface NewsArticleListItem extends ArticleListItem {
  category: string;
  categoryLabel: string;
  author: string;
  readTime: string;
  tags: string[];
}

// types/shared-content.ts
export interface ArticleListItem extends ContentListItem {
  // Guarantees NewsArticleListItem can be used in ContentGridLayout
}
```

### Important implementation note

The landing page uses **two data streams**:

1. Article list content (handled by `ContentGridLayout`)
2. Right-rail sidebar cards for campaigns, social proof, partner stories, reviews (handled by `ContentSidebar`)

That split mirrors future Strapi collections and OpenAPI schemas.

---

## Shared Components Integration

News Hub uses shared components from `components/shared/`:

### ContentGridLayout (News Category Pages)

Used on `/news-hub/category/[categorySlug]` to display article list with pagination:

```typescript
<ContentGridLayout
  items={articles}
  sidebarCards={sidebarCards}
  cardType="article"
  title={`${category.label} Articles`}
  itemLabel="article"
  itemLabelPlural="articles"
  sidebarTitle="Other Categories"
  sidebarDescription="Browse more news topics"
/>
```

**Features**:
- Generic grid with 50/50 image/content split on featured card
- Load More pagination (4 initial + 3 per batch)
- Sidebar with category cards
- Fully typed with `NewsArticleListItem` extending `ArticleListItem`

See `V0_SHARED_COMPONENTS_GUIDE.md` for complete documentation.

### ContentToc (Article Detail Pages)

Used on article detail page to show scrollable table of contents:

```typescript
<aside className="sticky top-[132px] self-start">
  <ContentToc
    items={[
      { num: "01", title: "Overview", description: "..." },
      { num: "02", title: "Impact", description: "..." },
    ]}
  />
</aside>
```

**Features**:
- Sticky positioning at `top: 132px` (below navbar + breadcrumb)
- Scroll tracking via `IntersectionObserver`
- Mobile expandable on screens < 640px
- Smooth scroll-to-section navigation

### ContentSidebar (Landing + Category Pages)

Used to display filtered sidebar cards:

```typescript
<ContentSidebar
  cards={sidebarCards}
  title="Related Content"
  description="Explore more stories"
/>
```

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
