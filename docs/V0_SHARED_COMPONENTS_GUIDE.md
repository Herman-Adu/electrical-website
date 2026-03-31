# Shared Components Architecture Guide

## Overview

This guide documents the shared component system used across News Hub and Projects sections. The architecture prioritizes **server components first**, **minimal client islands** for interactivity, and **type-safe data-driven rendering**.

### Design Philosophy

- **Server Components by Default**: All layout, data fetching, and rendering logic lives in RSCs
- **Client Islands**: Only interactive features (animations, toggles, hooks) use `'use client'`
- **Type Safety**: Unified type system ensures consistency and prevents runtime errors
- **DRY Pattern**: Generic components eliminate duplication across similar features
- **Accessibility First**: ARIA attributes, semantic HTML, and keyboard navigation built-in

---

## Type System

All shared components use types defined in `/types/shared-content.ts`.

### Core Interfaces

```typescript
// Generic content item for list rendering
export interface ContentListItem {
  id: string;
  slug: string;
  title: string;
  description: string;
  coverImage: { src: string; alt: string };
  publishedAt: string;
  updatedAt: string;
}

// Article-specific extension
export interface ArticleListItem extends ContentListItem {
  category: string;
  categoryLabel: string;
  author: string;
  readTime: string;
  tags: string[];
}

// Project-specific extension
export interface ProjectListItemExtended extends ContentListItem {
  category: string;
  categoryLabel: string;
  clientSector: string;
  status: "completed" | "in-progress" | "upcoming";
  isFeatured: boolean;
  kpis: Record<string, string>;
  progress: number;
}

// Sidebar card for category-filtered display
export interface SidebarCard {
  id: string;
  title: string;
  description: string;
  href: string;
  section: "news" | "projects";
  category?: string;
  icon?: string;
}

// Table of contents item with scroll targeting
export interface TocItem {
  num: string;
  title: string;
  description: string;
}

// Breadcrumb navigation item
export interface BreadcrumbItem {
  label: string;
  href: string;
  isCurrent?: boolean;
}
```

---

## Component: ContentGridLayout

**Location**: `/components/shared/content-grid-layout.tsx`  
**Type**: Client Component (`'use client'`)  
**Purpose**: Generic two-column grid with pagination, sidebar, and Load More button

### Props Interface

```typescript
interface ContentGridLayoutProps<T extends ContentListItem> {
  items: T[];
  sidebarCards: SidebarCard[];
  cardType: "article" | "project";
  title: string;
  initialCount?: number;
  batchSize?: number;
  showLiveIndicator?: boolean;
  itemLabel?: string;
  itemLabelPlural?: string;
  emptyMessage?: string;
  sidebarTitle?: string;
  sidebarDescription?: string;
}
```

### How It Works

1. **Accepts generic `ContentListItem` type** — Works with any list item that extends the base interface
2. **Uses `cardType` prop instead of `renderCard` function** — Eliminates RSC/Client boundary violations
3. **Renders cards internally** — Maps `cardType` to appropriate component (`NewsHubArticleCard` or `ProjectListCard`)
4. **Handles pagination** — Uses `usePagination` hook to show `initialCount` items, then Load More reveals batches
5. **Always renders sidebar** — Filtered cards displayed in right column

### Server-Side Usage (Pages)

```typescript
// News Hub category page
export default async function NewsCategoryPage({ params }) {
  const category = getNewsCategoryBySlug(params.categorySlug);
  const items = getNewsArticleListItemsByCategory(params.categorySlug);
  const sidebarCards = getSidebarCardsByCategory("news", params.categorySlug);

  return (
    <ContentGridLayout
      items={items}
      sidebarCards={sidebarCards}
      cardType="article"
      title={`${category.label} Articles`}
      itemLabel="article"
      itemLabelPlural="articles"
      sidebarTitle="Other Categories"
      sidebarDescription="Browse more news topics"
    />
  );
}
```

### Client-Side Pagination

Uses `usePagination` hook to manage visible items without server round-trips. Initial load shows 4 items, each Load More adds 3 more.

---

## Component: ContentSidebar

**Location**: `/components/shared/content-sidebar.tsx`  
**Type**: Server Component  
**Purpose**: Renders sidebar cards with hover animations

### Props Interface

```typescript
interface ContentSidebarProps {
  cards: SidebarCard[];
  title?: string;
  description?: string;
  className?: string;
}
```

### Features

- Card hover animation with gradient border
- Link navigation with proper href routing
- Empty state handling
- Mobile responsive (hides on small screens)

---

## Component: ContentToc (Table of Contents)

**Location**: `/components/shared/content-toc.tsx`  
**Type**: Client Component (`'use client'`)  
**Purpose**: Sticky TOC with scroll tracking for detail pages

### Props Interface

```typescript
interface ContentTocProps {
  items: TocItem[];
  activeIndex?: number;
  onItemClick?: (index: number) => void;
}
```

### How It Works

1. **Sticky positioning** — `top: 132px` (below navbar + breadcrumb)
2. **Scroll tracking** — `IntersectionObserver` on section elements highlights active item
3. **Smooth scroll navigation** — Click to jump to section
4. **Mobile collapse** — Expandable on mobile, always visible on desktop

### Usage on Detail Pages

```typescript
const article = getNewsArticleBySlug(articleSlug);

<aside className="sticky top-[132px] self-start">
  <ContentToc 
    items={[
      { num: "01", title: "Overview", description: "..." },
      { num: "02", title: "Timeline", description: "..." },
    ]}
  />
</aside>
```

---

## Component: ContentBreadcrumb

**Location**: `/components/shared/content-breadcrumb.tsx`  
**Type**: Server Component (renders client component for mobile toggle)  
**Purpose**: Sticky breadcrumb navigation below navbar

### Props Interface

```typescript
interface ContentBreadcrumbProps {
  items: BreadcrumbItem[];
  section: "projects" | "news" | "services" | "home" | "about" | "contact";
}
```

### CSS Sticky Pattern (Not IntersectionObserver)

The breadcrumb uses pure CSS `position: sticky; top: 80px` instead of JavaScript-based visibility tracking. The browser handles stick/unstick automatically, eliminating complex state management.

### Mobile Expand/Collapse

- First item (Home) always visible
- Middle items hidden on mobile, expandable via `BreadcrumbMobileToggle` client component
- Last item (current page) always visible

### Usage Example

```typescript
// Home page
<ContentBreadcrumb
  items={[{ label: "Home", href: "/", isCurrent: true }]}
  section="home"
/>

// Projects detail page
<ContentBreadcrumb
  items={[
    { label: "Home", href: "/" },
    { label: "Projects", href: "/projects" },
    { label: "Categories", href: "/projects/category" },
    { label: project.title, href: "#", isCurrent: true },
  ]}
  section="projects"
/>
```

---

## Component: ContentCardShell

**Location**: `/components/shared/content-card-shell.tsx`  
**Type**: Server Component  
**Purpose**: Consistent card wrapper with border, shadow, and hover animation

### Props Interface

```typescript
interface ContentCardShellProps {
  children: React.ReactNode;
  className?: string;
  href?: string;
}
```

### When to Use

- Individual article or project card display
- Sidebar card container
- Featured card wrapper

---

## Component: LoadMoreButton

**Location**: `/components/shared/load-more-button.tsx`  
**Type**: Client Component  
**Purpose**: Trigger pagination to load additional items

### Props Interface

```typescript
interface LoadMoreButtonProps {
  onClick: () => void;
  isLoading?: boolean;
  itemsLoaded: number;
  totalItems: number;
}
```

---

## Component: ContentPulseIndicator

**Location**: `/components/shared/content-pulse-indicator.tsx`  
**Type**: Server Component  
**Purpose**: Visual indicator for live/new content

### Props Interface

```typescript
interface ContentPulseIndicatorProps {
  label?: string;
  show?: boolean;
}
```

---

## Hook: usePagination

**Location**: `/hooks/use-pagination.ts`  
**Type**: Client Hook  
**Purpose**: Generic pagination state management

### Signature

```typescript
export function usePagination<T>(items: T[], initialCount = 4, batchSize = 3) {
  // Returns { visibleItems, hasMore, loadMore }
}
```

### Usage

```typescript
const { visibleItems, hasMore, loadMore } = usePagination(allItems, 4, 3);

return (
  <>
    {visibleItems.map(item => <Card item={item} />)}
    {hasMore && <LoadMoreButton onClick={loadMore} />}
  </>
);
```

---

## Data Layer: Sidebar Cards

**Location**: `/data/shared/sidebar-cards.ts`  
**Purpose**: Centralized sidebar card data with section/category filtering

### Key Functions

```typescript
// Get all sidebar cards for a section
export function getSharedSidebarCards(section: "news" | "projects"): SidebarCard[]

// Get sidebar cards filtered by category
export function getProjectsSidebarCards(
  section?: "editorial" | "infrastructure" | "power-boards"
): SidebarCard[]

// Get news sidebar cards by category
export function getNewsSidebarCards(
  section?: "renewable-energy" | "grid-modernization"
): SidebarCard[]
```

### Structure

Sidebar cards are **filtered at the data layer**, not the component. This means:

1. Page layer fetches filtered sidebar cards
2. Grid component receives pre-filtered cards
3. No runtime filtering logic in components

---

## Animation Patterns

### Framer Motion Integration

All shared components support optional Framer Motion animations:

```typescript
// Container animation with stagger
<motion.div
  variants={containerVariants}
  initial="hidden"
  whileInView="visible"
  viewport={{ once: true }}
>
  {items.map((item, i) => (
    <motion.div key={item.id} variants={itemVariants}>
      <Card item={item} />
    </motion.div>
  ))}
</motion.div>
```

### Reduced Motion Support

All animations check `useReducedMotion()` hook to respect user preferences. Components gracefully degrade to instant rendering when `prefers-reduced-motion` is set.

---

## Styling Strategy

### Design Tokens

All components use CSS variables defined in `/globals.css`:

```css
--background
--foreground
--muted-foreground
--border
--electric-cyan (brand accent)
--ring
```

### Tailwind Classes

Components use semantic Tailwind classes:

```tsx
className="bg-background text-foreground border border-border hover:text-electric-cyan"
```

### No Arbitrary Values

All spacing, colors, and sizing use the Tailwind scale. No `[arbitrary]` values in shared components.

---

## Performance Considerations

### Code Splitting

- `ContentGridLayout` is a client component only because of `usePagination` hook
- All data fetching happens on the server before props are passed down
- Image `srcSet` and `sizes` attributes optimize lazy loading

### Lazy Loading

- Images use Next.js `Image` component with `loading="lazy"`
- `IntersectionObserver` on sidebar prevents unnecessary calculations
- Pagination keeps DOM small (only visible items rendered)

---

## Accessibility

### ARIA Attributes

- Breadcrumb: `aria-current="page"` on current item, `aria-label="Breadcrumb"`
- Table of Contents: `aria-label="Article Contents"`, `aria-current="true"` on active item
- Sidebar: `aria-label="Related Items"`, proper link semantics

### Keyboard Navigation

- All links and buttons are keyboard accessible
- Focus outlines match brand accent (electric-cyan)
- Tab order follows DOM order (no tabindex manipulation)

### Screen Readers

- Links have descriptive text (not "Read More", but "Read More: Article Title")
- Skip links available for keyboard users
- Semantic HTML (`<nav>`, `<aside>`, `<section>`) used throughout

---

## Testing & Validation

### Type Safety

All props are strictly typed. TypeScript catches missing or incorrect props at development time.

```typescript
// ✅ Correct
<ContentGridLayout
  items={newsArticles}
  sidebarCards={sidebarCards}
  cardType="article"
  title="Latest News"
/>

// ❌ Error: cardType must be "article" | "project"
<ContentGridLayout
  items={newsArticles}
  cardType="invalid"
/>
```

### Data Validation

Sidebar cards are validated at data layer before reaching components. Each section has a specific shape enforced by TypeScript.

---

## Extending the System

### Adding a New Section

To add breadcrumbs to a new section (e.g., "resources"):

1. Add to `BreadcrumbProps` section union: `"resources"`
2. Create data layer functions following `getSidebarCardsByCategory` pattern
3. Use in page: `<ContentBreadcrumb items={[...]} section="resources" />`

### Creating a New Card Type

To support a new card type in `ContentGridLayout`:

1. Create interface extending `ContentListItem` in `types/shared-content.ts`
2. Create card component in appropriate component folder
3. Add case to `renderCardByType` function in `content-grid-layout.tsx`
4. Use: `<ContentGridLayout cardType="newtype" ... />`

---

## Migration Path

### From Old to New Pattern

**Before** (duplication):
```typescript
// NewsGridLayout (News-only)
<NewsGridLayout items={articles} renderCard={...} />

// ProjectsGridLayout (Projects-only)
<ProjectsGridLayout items={projects} renderCard={...} />
```

**After** (unified):
```typescript
// Both use same component
<ContentGridLayout 
  items={articles} 
  cardType="article" 
/>

<ContentGridLayout 
  items={projects} 
  cardType="project" 
/>
```

Existing section-specific layouts can coexist alongside the new shared component for gradual migration.

---

## Troubleshooting

### Breadcrumb Not Sticking Below Hero

**Issue**: Breadcrumb appears at top of page  
**Solution**: Ensure navbar has consistent `h-20` height. Check `top: 80px` value in breadcrumb CSS.

### Sidebar TOC Not Tracking Scroll

**Issue**: Active indicator doesn't update while scrolling  
**Solution**: Verify detail page sections have proper `id` attributes matching TOC item titles.

### Load More Showing Incorrect Count

**Issue**: "Load more" button shows wrong remaining count  
**Solution**: Check `initialCount` and `batchSize` values. Ensure `items` array is correctly filtered at data layer.

---

## References

- `/components/shared/` — All shared component implementations
- `/types/shared-content.ts` — Type definitions
- `/data/shared/sidebar-cards.ts` — Data layer
- `/hooks/use-pagination.ts` — Pagination hook
