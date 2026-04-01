# Breadcrumb System Architecture Guide

## Overview

This guide documents the breadcrumb navigation system implemented across all major sections (News Hub, Projects, Services, Home, About, Contact). The system uses **pure CSS sticky positioning** instead of JavaScript intersection observers, providing superior performance and accessibility.

---

## Design Philosophy

### Why CSS Sticky Over IntersectionObserver?

**IntersectionObserver Pattern** (Original Approach):
- Tracks when breadcrumb scrolls out of view
- Renders duplicate breadcrumb bar when detected
- Adds ~50 lines of JavaScript for state management
- Creates duplicate DOM nodes
- More complex event handling

**CSS Sticky Pattern** (Current Implementation):
- Browser handles stick/unstick natively
- Zero JavaScript for positioning
- Single breadcrumb element
- Cleaner HTML
- Better accessibility
- Lower cognitive overhead

**Performance Comparison:**
```
IntersectionObserver: ~120 lines JS + DOM duplication
CSS Sticky:           ~30 lines CSS + single element
```

---

## Type System

### BreadcrumbItem Interface

```typescript
export interface BreadcrumbItem {
  /** Display label for the breadcrumb segment */
  label: string;
  /** Navigation destination URL */
  href: string;
  /** Whether this is the current/active page */
  isCurrent?: boolean;
}
```

### Section Support

The breadcrumb component supports 6 different sections, each with distinct styling:

```typescript
type BreadcrumbSection = 
  | "projects"      // Green accent, Projects section
  | "news"          // Green accent, News Hub section
  | "services"      // Green accent, Services section
  | "home"          // Green accent, Home page
  | "about"         // Green accent, About page
  | "contact"       // Green accent, Contact page
```

---

## Components

### ContentBreadcrumb (Server Component)

**Location**: `/components/shared/content-breadcrumb.tsx`  
**Type**: React Server Component  
**Purpose**: Main breadcrumb navigation, renders breadcrumb items and delegates mobile interactivity to client component

#### Props Interface

```typescript
interface ContentBreadcrumbProps {
  /** Array of breadcrumb segments */
  items: BreadcrumbItem[];
  /** Section identifier for styling and context */
  section: BreadcrumbSection;
}
```

#### Sticky Positioning CSS

```css
position: sticky;
top: 80px;  /* Navbar height: 5rem = 80px */
z-index: 40;
```

The breadcrumb docks at `top: 80px`, placing it directly below the navbar (80px) without overlapping.

#### Rendering Logic

1. **Guard**: Returns null if items array is empty
2. **Single Item Check**: If only one item exists (e.g., Home page), renders just the current page label
3. **Multi-Item Split**:
   - First item: Always visible (usually "Home")
   - Middle items: Visible on desktop, expandable on mobile via `BreadcrumbMobileToggle`
   - Last item: Always visible (current page, highlighted)

#### Single Item Edge Case

The breadcrumb handles the Home page edge case elegantly:

```typescript
// Home page usage
<ContentBreadcrumb
  items={[{ label: "Home", href: "/", isCurrent: true }]}
  section="home"
/>

// Renders: [Home] (no dividers, no redundant links)
```

When `items.length === 1`, the component renders only the current page label in cyan without navigation links or dividers.

#### Multiple Items Rendering

```typescript
// Projects detail page
<ContentBreadcrumb
  items={[
    { label: "Home", href: "/" },
    { label: "Projects", href: "/projects" },
    { label: "Categories", href: "/projects/category" },
    { label: "Power Boards", href: "/projects/category/power-boards" },
    { label: "My Project", href: "#", isCurrent: true },
  ]}
  section="projects"
/>

// Renders:
// [Home] / [Projects] / [Categories] / ... (mobile: expandable) ... / [My Project]
//  link    separator   link          link    middle items           current page
```

### BreadcrumbMobileToggle (Client Component)

**Location**: `/components/shared/breadcrumb-mobile-toggle.tsx`  
**Type**: React Client Component (`'use client'`)  
**Purpose**: Expand/collapse middle breadcrumb items on mobile devices

#### Props Interface

```typescript
interface BreadcrumbMobileToggleProps {
  /** Middle breadcrumb items to toggle */
  items: BreadcrumbItem[];
}
```

#### Features

- Expandable button showing "..." when collapsed
- Smooth height animation on expand/collapse
- Only rendered on `sm:` (640px) and below breakpoint
- Hides on `sm:` breakpoint (desktop)

#### Mobile UX Flow

```
Before expand: [Home] / ... / [Current Page]
                      ↓ (click ...)
After expand:  [Home] / [Projects] / [Categories] / ... / [Current Page]
                      (collapses after 5s if no interaction)
```

---

## Integration Pattern

### Page-Level Usage

All pages follow the same pattern: hero → breadcrumb → content

```typescript
// News Hub category page example
export default async function NewsCategoryPage() {
  const category = getNewsCategoryBySlug(categorySlug);
  const articles = getArticlesByCategory(categorySlug);

  return (
    <main>
      <NewsCategoryHero category={category} />
      
      <ContentBreadcrumb
        items={[
          { label: "Home", href: "/" },
          { label: "News Hub", href: "/news-hub" },
          { label: "Categories", href: "/news-hub/category" },
          { 
            label: category.label, 
            href: `/news-hub/category/${categorySlug}`, 
            isCurrent: true 
          },
        ]}
        section="news"
      />

      <NewsGridLayout items={articles} />
    </main>
  );
}
```

### Breadcrumb Hierarchy Map

| Page | Breadcrumb Trail | isCurrent |
|------|-----------------|-----------|
| `/` | `Home` | Yes |
| `/about` | `Home / About` | Last |
| `/contact` | `Home / Contact` | Last |
| `/services` | `Home / Services` | Last |
| `/services/residential` | `Home / Services / Residential` | Last |
| `/projects` | `Home / Projects` | Last |
| `/projects/category` | `Home / Projects / Categories` | Last |
| `/projects/category/power-boards` | `Home / Projects / Categories / Power Boards` | Last |
| `/projects/category/power-boards/project-slug` | `Projects / Categories / Power Boards / Project Title` | Last |
| `/news-hub` | `Home / News Hub` | Last |
| `/news-hub/category` | `Home / News Hub / Categories` | Last |
| `/news-hub/category/renewable` | `Home / News Hub / Categories / Renewable Energy` | Last |
| `/news-hub/category/renewable/article-slug` | `News Hub / Categories / Renewable / Article Title` | Last |

---

## Sidebar Offset Coordination

### Why Sidebar Offset Changed

When breadcrumb was added, the sidebar had to move down to avoid overlapping:

```
Before Breadcrumb:
│ Navbar (80px)                                    │
│ Content section                                  │
│ ├─ Sidebar (top: 88px) ← 80px navbar + 8px gap │
│ └─ Main content                                  │

After Breadcrumb:
│ Navbar (80px)                                    │
│ Breadcrumb (44px sticky) ← NEW                   │
│ Content section                                  │
│ ├─ Sidebar (top: 132px) ← 80px + 44px + 8px     │
│ └─ Main content
```

### Implementation

Both News Hub and Projects detail pages now use:

```typescript
<aside className="sticky top-[132px] self-start">
  <ContentToc items={tocItems} />
</aside>
```

The `top-[132px]` value accounts for:
- 80px: Navbar height
- 44px: Breadcrumb height (py-3 = 12px top + 12px bottom + ~20px content)
- 8px: Gap between breadcrumb and sidebar

### Section Scroll Margins

All detail pages also updated `scroll-mt` values from `scroll-mt-24` (96px) to `scroll-mt-36` (144px) for proper TOC anchor scrolling:

```typescript
// Project detail page
<section id="overview" className="scroll-mt-36">
  <h2>Overview</h2>
</section>
```

This ensures clicked TOC items scroll to be visible below the breadcrumb bar.

---

## Styling

### CSS Classes

```css
/* Sticky positioning */
.breadcrumb {
  position: sticky;
  top: 80px;
  z-index: 40;
}

/* Grid layout for items */
.breadcrumb-list {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  flex-wrap: wrap;
}

/* Individual item styling */
.breadcrumb-link {
  color: hsl(var(--foreground));
  transition: color 0.2s;
}

.breadcrumb-link:hover {
  color: hsl(var(--electric-cyan));
}

.breadcrumb-current {
  color: hsl(var(--electric-cyan));
  font-weight: 500;
}

/* Separator */
.breadcrumb-separator {
  color: hsl(var(--muted-foreground) / 0.4);
  font-size: 0.875rem;
}
```

### Design Tokens

Breadcrumbs use the shared design system:

```css
--electric-cyan: Brand accent color for current/hover state
--foreground: Text color for links
--muted-foreground: Separator and muted text color
--background: Section background
```

---

## Accessibility Features

### ARIA Attributes

```html
<nav aria-label="Breadcrumb">
  <ol role="list">
    <li>
      <a href="/">Home</a>
    </li>
    <li>
      <span aria-current="page">Current Page</span>
    </li>
  </ol>
</nav>
```

### Keyboard Navigation

- All links keyboard accessible (Tab, Enter)
- Mobile expand button toggles with Space/Enter
- Focus outlines use brand accent color
- Skip navigation available for keyboard users

### Screen Reader Experience

- `aria-label="Breadcrumb"` on navigation
- `aria-current="page"` on current item (semantic indicator)
- Separator characters not announced (role="presentation" or `aria-hidden`)
- Links have descriptive text: `<a href="/">Home</a>` (not just emoji)

### Reduced Motion Support

```typescript
const prefersReducedMotion = useReducedMotion();

return (
  <motion.div
    variants={prefersReducedMotion ? {} : variants}
  >
    {/* Mobile toggle animation respects user preference */}
  </motion.div>
);
```

---

## Mobile UX

### Breakpoint Behavior

**Mobile (< 640px)**:
- First item always visible: `[Home]`
- Middle items hidden: `... (expandable)`
- Last item always visible: `[Current]`
- Expand/collapse on click

**Desktop (≥ 640px)**:
- All items visible: `[Home] / [Projects] / [Categories] / [Current]`
- No toggle button

### Touch-Friendly Sizing

- Expand button min height: 44px (Apple HIG standard)
- Spacing between items: 0.5rem (8px)
- Separators: Small but tappable area

---

## Performance Considerations

### Rendering

- Server-rendered component means breadcrumb HTML is in initial page load
- No hydration mismatch (single render on client)
- CSS sticky is GPU-accelerated (no reflow during scroll)

### Bundle Size

- `ContentBreadcrumb`: ~2KB (minified)
- `BreadcrumbMobileToggle`: ~1.5KB (minified)
- Total: ~3.5KB (negligible)

### Runtime Performance

- No layout thrashing during scroll
- CSS sticky is cheaper than JavaScript scroll listeners
- Framer Motion animations only on mobile expand (no continuous scroll tracking)

---

## Common Patterns

### Root Level Breadcrumb (Home Page)

```typescript
<ContentBreadcrumb
  items={[{ label: "Home", href: "/", isCurrent: true }]}
  section="home"
/>
```

**Renders**: Just "Home" in cyan, no links or separators.

### Category Index Breadcrumb

```typescript
<ContentBreadcrumb
  items={[
    { label: "Home", href: "/" },
    { label: "Projects", href: "/projects" },
    { label: "Categories", href: "/projects/category", isCurrent: true },
  ]}
  section="projects"
/>
```

**Renders**: Full path to category browse page.

### Detail Page Breadcrumb

```typescript
<ContentBreadcrumb
  items={[
    { label: "Home", href: "/" },
    { label: "Projects", href: "/projects" },
    { label: "Categories", href: "/projects/category" },
    { label: category.label, href: `/projects/category/${categorySlug}` },
    { label: project.title, href: "#", isCurrent: true },
  ]}
  section="projects"
/>
```

**Renders**: Full navigation path with current project highlighted.

---

## Adding Breadcrumbs to New Sections

### Step 1: Extend Type

```typescript
// types/shared-content.ts
export type BreadcrumbSection = 
  | "projects"
  | "news"
  | "services"
  | "home"
  | "about"
  | "contact"
  | "my-new-section"  // Add here
```

### Step 2: Add to All Pages

Add `<ContentBreadcrumb>` after hero on:
- Root page (`/my-new-section`)
- Category index (`/my-new-section/category`)
- Category page (`/my-new-section/category/[slug]`)
- Detail page (`/my-new-section/category/[slug]/[item]`)

### Step 3: Update Sidebar Offset if Needed

If section has sidebar TOC:

```typescript
<aside className="sticky top-[132px] self-start">
  <ContentToc items={items} />
</aside>
```

---

## Troubleshooting

### Breadcrumb Not Sticking

**Issue**: Breadcrumb scrolls away instead of staying below navbar  
**Solution**: 
- Verify navbar has `h-20` (80px) height
- Check no parent has `overflow: hidden` (breaks sticky)
- Ensure `z-index: 40` is set

### Mobile Expand/Collapse Not Working

**Issue**: "..." button doesn't expand on mobile  
**Solution**:
- Verify `BreadcrumbMobileToggle` is rendered (check screen size)
- Check JavaScript is enabled
- Inspect browser console for errors

### Sidebar TOC Overlapping Breadcrumb

**Issue**: Sidebar appears on top of breadcrumb  
**Solution**: Update sidebar `top` value to `top-[132px]` (80px navbar + 44px breadcrumb + 8px gap)

### Wrong Section Styling

**Issue**: Breadcrumb has wrong accent color  
**Solution**: Verify `section` prop matches intended section: `"projects" | "news" | "services" | "home" | "about" | "contact"`

---

## Future Enhancements

### Schema.org Integration

Could add JSON-LD breadcrumb schema for SEO:

```typescript
<script type="application/ld+json">
{
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  "itemListElement": [
    {"@type": "ListItem", "position": 1, "name": "Home", "item": "https://example.com/"},
    {"@type": "ListItem", "position": 2, "name": "Projects", "item": "https://example.com/projects"}
  ]
}
</script>
```

### Analytics Integration

Could track breadcrumb clicks for user navigation patterns:

```typescript
const handleBreadcrumbClick = (label: string, href: string) => {
  analytics.track("breadcrumb_click", { label, href });
};
```

---

## References

- `/components/shared/content-breadcrumb.tsx` — Main component
- `/components/shared/breadcrumb-mobile-toggle.tsx` — Mobile interactions
- `/types/shared-content.ts` — Type definitions
- `/app/*/page.tsx` — Usage examples across all sections
