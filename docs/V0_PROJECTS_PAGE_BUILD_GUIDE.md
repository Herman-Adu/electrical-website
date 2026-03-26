# v0 Build Guide — Projects Section Visual Design

## Purpose

This guide tells **v0.dev** exactly how to visually redesign the Projects section of this repo.
All routes, data contracts, TypeScript types, and Server Action wiring are **already scaffolded and working**.
v0's only job is to redesign/create the **component files** listed below with highly animated, visually stunning dark UI.

---

## Repo Context

- **Stack:** Next.js 16, TypeScript (strict), Tailwind CSS v4, Framer Motion `^12.38.0`, shadcn/ui
- **Design tokens:** CSS custom properties in `app/globals.css`
- **Primary accent:** `var(--electric-cyan)` → dark mode `#00f2ff`, light mode `#0891b2`
- **Warning accent:** `var(--amber-warning)` → dark mode `#f59e0b`, light mode `#d97706`
- **Mono font:** `var(--font-ibm-plex-mono)` → mapped to `font-mono` Tailwind class
- **Utility:** `cn()` from `lib/utils.ts`
- **Background (dark):** `hsl(var(--background))` ≈ `#0a0a0a`

---

## Absolute Constraints (Never Violate)

1. **Do NOT edit any `app/projects/**/page.tsx` files.** Routes are complete and correct.
2. **Do NOT change `types/projects.ts`.** All interfaces are final.
3. **Do NOT change `data/projects/index.ts`.** Data and helpers are final.
4. **Do NOT change `lib/actions/projects.ts`.** Server Action wiring is final.
5. **Do NOT change `lib/metadata-projects.ts`.** Metadata helpers are final.
6. **Do NOT add new named exports to `components/projects/index.ts`** unless you are adding a new component file — if you do, also add the export to `index.ts`.
7. **All props passed to redesigned components must keep the same TypeScript signatures** — the page files depend on them.
8. **No `any` types, no loosely typed props.**
9. **All animations use Framer Motion**, not CSS keyframes — import from `"framer-motion"`.
10. **Components that receive data props must stay purely presentational** — no fetching inside components.

---

## What Already Exists (Full Scaffold)

### Routes — all working, do not edit:

```
app/projects/page.tsx                                  ← SSR list, ?category= filter
app/projects/loading.tsx
app/projects/error.tsx
app/projects/[slug]/page.tsx                           ← legacy direct-slug (backward compat)
app/projects/[slug]/loading.tsx
app/projects/[slug]/error.tsx
app/projects/[slug]/not-found.tsx
app/projects/category/page.tsx                         ← static category index (SSG)
app/projects/category/[categorySlug]/page.tsx          ← per-category list (SSG)
app/projects/category/[categorySlug]/loading.tsx
app/projects/category/[categorySlug]/error.tsx
app/projects/category/[categorySlug]/not-found.tsx
app/projects/category/[categorySlug]/[projectSlug]/page.tsx   ← project detail (SSG)
app/projects/category/[categorySlug]/[projectSlug]/loading.tsx
app/projects/category/[categorySlug]/[projectSlug]/error.tsx
app/projects/category/[categorySlug]/[projectSlug]/not-found.tsx
```

### Components — functional stubs, need full visual redesign:

```
components/projects/projects-hero.tsx            ← REDESIGN (plain Tailwind, no animation)
components/projects/projects-featured-card.tsx   ← REDESIGN (plain Tailwind, no animation)
components/projects/projects-bento-grid.tsx      ← REDESIGN (plain Tailwind, no animation)
components/projects/projects-optimistic-list.tsx ← REDESIGN + add infinite scroll
components/projects/project-card-shell.tsx       ← REDESIGN (dark glass wrapper)
components/projects/project-meta-row.tsx         ← keep or improve
components/projects/project-status-badge.tsx     ← REDESIGN (animated pulse for in-progress)
components/projects/index.ts                     ← ADD new exports alongside existing ones
```

### New components to CREATE (do not exist yet):

```
components/projects/projects-infinite-scroll.tsx  ← NEW: scroll-triggered load-more list
components/projects/project-category-card.tsx     ← NEW: category index card
components/projects/project-detail-hero.tsx       ← NEW: full-width parallax hero for detail page
components/projects/project-kpi-grid.tsx          ← NEW: KPI grid with count-up on scroll
components/projects/project-related-carousel.tsx  ← NEW: related projects row/carousel
```

---

## Data Model (read-only reference)

```ts
// types/projects.ts — DO NOT MODIFY

export type ProjectStatus = "planned" | "in-progress" | "completed";

export type ProjectCategorySlug =
  | "all"
  | "residential"
  | "commercial-lighting"
  | "power-boards";

export interface ProjectCategory {
  slug: Exclude<ProjectCategorySlug, "all">;
  label: string;
  description: string;
}

export interface ProjectKpis {
  budget: string;
  timeline: string;
  capacity: string;
  location: string;
}

export interface Project {
  id: string;
  slug: string;
  category: Exclude<ProjectCategorySlug, "all">;
  categoryLabel: string;
  title: string;
  clientSector: string;
  status: ProjectStatus;
  description: string;
  coverImage: { src: string; alt: string };
  kpis: ProjectKpis;
  tags: string[];
  progress: number; // 0–100
  isFeatured: boolean;
  publishedAt: string;
  updatedAt: string;
}

export interface ProjectBentoItem {
  id: string;
  title: string;
  value: string;
  description: string;
}

export interface ProjectListItem {
  id: string;
  title: string;
  slug: string;
  category: Exclude<ProjectCategorySlug, "all">;
  categoryLabel: string;
  status: ProjectStatus;
  isFeatured: boolean;
  location: string;
  updatedAt: string;
}
```

### Data helpers available (from `data/projects/index.ts`):

```ts
allProjects: Project[]                                          // 4 projects
projectCategories: ProjectCategory[]                           // 3 categories
projectBentoItems: ProjectBentoItem[]                          // 4 metric tiles
getFeaturedProjectByCategory(category: ProjectCategorySlug): Project | undefined
getProjectsByCategory(category: ProjectCategorySlug): Project[]
getProjectListItemsByCategory(category: ProjectCategorySlug): ProjectListItem[]
getProjectByCategoryAndSlug(categorySlug, projectSlug): Project | undefined
getCategorySlugs(): Exclude<ProjectCategorySlug, "all">[]
getProjectSlugsByCategory(categorySlug): string[]
isProjectCategorySlug(value: string): value is Exclude<ProjectCategorySlug, "all">
```

### Available images in `/public/images/`:

```
services-industrial.jpg       (proj-001: West Dock Industrial Upgrade)
warehouse-lighting.jpg        (proj-002: Riverside Commercial Retrofit)
smart-living-interior.jpg     (proj-003: North Estate Residential Phase 2)
power-distribution.jpg        (proj-004: City Hospital Emergency Power Ring)
maintenance-engineer.jpg      (general / detail hero fallback)
system-diagnostics.jpg        (general)
services-commercial.jpg       (general)
community-hero.jpg            (general hero use)
```

---

## Component Prop Signatures (must not change)

These are the exact interfaces the page files expect. Keep them identical:

```ts
// projects-hero.tsx
interface ProjectsHeroProps {
  categories: ProjectCategory[];
  activeCategory: ProjectCategorySlug;
}

// projects-featured-card.tsx
interface ProjectsFeaturedCardProps {
  project: Project;
}

// projects-bento-grid.tsx
interface ProjectsBentoGridProps {
  items: ProjectBentoItem[];
}

// projects-optimistic-list.tsx
interface ProjectsOptimisticListProps {
  items: ProjectListItem[];
}

// project-card-shell.tsx
interface ProjectCardShellProps {
  children: React.ReactNode;
  className?: string;
}

// project-meta-row.tsx
interface ProjectMetaRowProps {
  label: string;
  value: string;
}

// project-status-badge.tsx
interface ProjectStatusBadgeProps {
  status: ProjectStatus;
}
```

### New component prop signatures to implement:

```ts
// projects-infinite-scroll.tsx — "use client"
// Wraps ProjectsOptimisticList. Shows N items, reveals more on scroll.
interface ProjectsInfiniteScrollProps {
  items: ProjectListItem[];
  initialCount?: number; // default: 3
}

// project-category-card.tsx — server-safe (no "use client")
interface ProjectCategoryCardProps {
  category: ProjectCategory;
  projectCount: number;
  href: string;
}

// project-detail-hero.tsx — "use client" (parallax needs scroll)
interface ProjectDetailHeroProps {
  project: Project;
  categorySlug: string;
}

// project-kpi-grid.tsx — "use client" (count-up on scroll)
interface ProjectKpiGridProps {
  kpis: ProjectKpis;
}

// project-related-carousel.tsx — "use client"
interface ProjectRelatedCarouselProps {
  projects: Project[];
  categorySlug: string;
  heading?: string;
}
```

---

## Page Wiring Reference

Understanding how pages already USE the components helps v0 know the rendering context.

### `app/projects/page.tsx` (SSR, do not edit)

```tsx
<ProjectsHero categories={projectCategories} activeCategory={activeCategory} />
<ProjectsFeaturedCard project={featuredProject} />
<ProjectsBentoGrid items={projectBentoItems} />
<ProjectsOptimisticList items={projectListItems} />
```

> `projectListItems` is the full filtered list. Design for 20+ items — only 4 exist now.
> `ProjectsOptimisticList` should incorporate scroll-triggered reveal (see Section D).

### `app/projects/category/[categorySlug]/page.tsx` (SSG, do not edit)

Uses `ProjectCardShell`, `ProjectStatusBadge`, `ProjectMetaRow` directly inline.
Introduce `ProjectCategoryCard` as a standalone export — the page can adopt it in a future update.
Leave a `// Usage: <ProjectCategoryCard ... />` comment at the top of the component.

### `app/projects/category/[categorySlug]/[projectSlug]/page.tsx` (SSG, do not edit)

Uses `ProjectCardShell`, `ProjectStatusBadge`, `ProjectMetaRow` directly inline.
Introduce `ProjectDetailHero`, `ProjectKpiGrid`, `ProjectRelatedCarousel` as standalone components
with `// Usage:` comments at the top. Pages will adopt them in a future update.

---

## UI Design Requirements

### All components share these base rules:

- Dark glass morphism base: `bg-card/60 backdrop-blur-md border border-border/40`
- Electric cyan glow on hover/active: `box-shadow: 0 0 15px var(--electric-cyan)`
- Use `font-mono` (IBM Plex Mono) for all labels, badges, metric values, monospace readouts
- Stagger-in entrance animations using `motion.div` with `initial/animate/exit`
- `useReducedMotion()` from `"framer-motion"` — skip all animations if user prefers reduced motion

---

### A. `ProjectsHero` — REDESIGN

**Visual concept:** Dark command-centre header with animated electric grid background.

- Animated SVG grid background (subtle, `opacity: 0.06`) — slow indefinite pulse loop
- Scanline sweep: a thin `h-px w-full bg-electric-cyan/20` div animates `y: "-100%" → "100%"` on mount, then hidden
- Headline stagger-in: each word/line enters with `y: 20 → 0`, `opacity: 0 → 1`, 80ms stagger between lines
- Category chip pills: active chip has `border-electric-cyan/40 bg-electric-cyan/15 shadow-[0_0_12px_var(--electric-cyan)]`; inactive chips have `border-border` with hover glow
- Font: headline in `font-black uppercase tracking-tight`, chips in `font-mono text-[10px] uppercase tracking-[0.18em]`
- On mobile: chips scroll horizontally with `overflow-x-auto` and `flex-nowrap`

---

### B. `ProjectsFeaturedCard` — REDESIGN

**Visual concept:** Dark showcase card with parallax image and live telemetry aesthetic.

- Left panel: Next.js `<Image>` with `useScroll` + `useTransform` parallax (`y` moves 0.2× scroll rate)
- Holographic gradient ribbon top-left over image: `bg-gradient-to-br from-electric-cyan/40 to-transparent text-[9px] font-mono uppercase` reading `FEATURED`
- `ProjectStatusBadge` bottom-left of image
- Right panel: `bg-card/60 backdrop-blur`
- KPI chips: 2×2 grid, each `ProjectMetaRow` as a `bg-muted/30 border border-border/40 rounded px-3 py-2` tile
- Progress bar: `motion.div` fills `width: "0%" → "{progress}%"` on mount via `useInView`
- Tags: stagger in `opacity: 0 → 1` + `y: 5 → 0` with 60ms between each
- CTA link arrow translates `x: 0 → 4` on hover

---

### C. `ProjectsBentoGrid` — REDESIGN

**Visual concept:** Dark data dashboard tiles with count-up metric values.

- `grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4`
- Each tile: dark glass card with `border-l-2 border-electric-cyan` left accent
- `value` field: count-up animation on `useInView` — animate from `0` to target over 1.2s `easeOut`; for non-numeric values (e.g., `"0 LTIs"`) fade in at 0.8s
- Title: `font-mono text-[9px] uppercase tracking-[0.2em] text-muted-foreground`
- Value: `text-3xl font-black text-electric-cyan tabular-nums`
- Description: `text-sm text-muted-foreground/80`
- Tile hover: `scale: 1 → 1.02`, glow border pulse
- Tiles stagger left-to-right with 120ms delay between each

---

### D. `ProjectsOptimisticList` — REDESIGN + INFINITE SCROLL

**Visual concept:** Dark data table / terminal list with real-time feel.

**Critical:** Keep ALL existing hook logic — `useOptimistic`, `useTransition`, `useState`, `applyUpdate`. Only redesign JSX and styles.

- Each row: `grid grid-cols-[4px_1fr_auto]` — status bar, content, actions
- Status color bar (leftmost, `w-1 rounded-full`): in-progress → `bg-electric-cyan animate-pulse`, planned → `bg-amber-warning/60`, completed → `bg-green-500/60`
- Content: title `text-sm font-semibold`, category badge `font-mono text-[9px]`, location `text-xs text-muted-foreground`
- Actions: `ProjectStatusBadge` + featured star toggle button
- Row entrance: `initial={{ opacity: 0, x: -8 }} animate={{ opacity: 1, x: 0 }}` stagger 80ms per row
- Pending row: `opacity-60` + shimmer overlay `animate-pulse bg-white/5`
- Error feedback: `role="alert"` banner with `border-red-500/30 bg-red-500/10` slides down on error
- **Infinite scroll (built into this component):**
  - Maintain a `visibleCount` state starting at `initialCount` (default `3`)
  - A sentinel `<div ref={sentinelRef}>` below the last rendered row
  - `useEffect` with `IntersectionObserver` on sentinelRef — when visible, increment `visibleCount` by 3 after a 200ms delay (show skeleton rows during delay)
  - Skeleton rows: 3× `motion.div h-14 rounded bg-muted/30 animate-pulse` during the 200ms load window
  - When `visibleCount >= items.length`: show `"ALL PROJECTS LOADED"` in `font-mono text-[9px] uppercase tracking-[0.2em] text-muted-foreground/40 text-center py-4`

---

### E. `ProjectsInfiniteScroll` (NEW FILE) — `"use client"`

Standalone IntersectionObserver wrapper that slices `items` and passes to `ProjectsOptimisticList`:

- Props: `{ items: ProjectListItem[]; initialCount?: number }` (default `initialCount = 3`)
- State: `visibleCount: number`
- `useRef` sentinel div at bottom; `useEffect` sets up `IntersectionObserver`
- On intersection: `startTransition(() => { await delay(200); setVisibleCount(prev => min(prev + 3, items.length)) })`
- During loading: render 3× skeleton rows below the list
- Passes `items.slice(0, visibleCount)` to `<ProjectsOptimisticList>`
- "ALL PROJECTS LOADED" message when exhausted

> **Note:** Either implement infinite scroll inside `ProjectsOptimisticList` directly (Section D) or via this wrapper — do not implement both. Pick the cleaner approach and document the choice.

---

### F. `ProjectCategoryCard` (NEW FILE) — server-safe

**Visual concept:** Dark tile card linking to a category, enterprise data feel.

- Entire card wrapped in `<Link href={href}>` from `"next/link"`
- Dark glass base with `rounded-xl`
- Category label: `text-xl font-black uppercase tracking-tight`
- Slug as mono label: `font-mono text-[9px] uppercase tracking-[0.2em] text-electric-cyan/70`
- Description: `text-sm text-muted-foreground leading-relaxed`
- Project count chip: `{projectCount} PROJECTS` in `font-mono text-[9px] border border-electric-cyan/30 rounded px-2 py-0.5`
- Bottom arrow CTA: translates `x: 0 → 4` on hover via CSS `group-hover:translate-x-1`
- Hover: `group` on card → cyan glow border + `scale-[1.01]`
- Entry animation: `initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}`

---

### G. `ProjectDetailHero` (NEW FILE) — `"use client"`

**Visual concept:** Full-bleed cinematic hero with parallax scroll and sticky breadcrumb.

- Full-width Next.js `<Image>` in a `motion.div`: `min-h-[40vh] sm:min-h-[60vh] object-cover`
- Parallax: `useScroll` + `useTransform` — image `y` moves at `0.2×` scroll rate
- Gradient overlay: `bg-gradient-to-t from-background via-background/50 to-transparent absolute inset-0`
- `ProjectStatusBadge` bottom-left; category mono chip bottom-right
- FEATURED ribbon (if `project.isFeatured`): top-right corner triangle with `FEATURED` — CSS `clip-path` or absolute positioned corner
- Title below image: `text-3xl sm:text-5xl font-black uppercase tracking-tight`, `initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}`
- **Sticky breadcrumb:** `useScroll`; when `scrollY > 100` show a `position: sticky top-0 z-50 bg-background/80 backdrop-blur border-b border-border/20` strip
  - Format: `Projects / Categories / {categoryLabel} / {project.title}` — each segment a `<Link>` except the last
- Description paragraph stagger animates 200ms after title

---

### H. `ProjectKpiGrid` (NEW FILE) — `"use client"`

**Visual concept:** Monochrome telemetry panel with count-up values.

- `grid grid-cols-2 sm:grid-cols-4 gap-0`
- Each cell: dark glass tile, `border-t-2 border-electric-cyan`, `border-r border-border/30 last:border-r-0`
- Label: `font-mono text-[9px] uppercase tracking-[0.16em] text-muted-foreground`
- Value: numeric count-up using `useInView` — extract number with regex `(\D*)([\d.]+)(\D*)`, animate numeric part from `0` to target over `1.4s easeOut`, re-attach prefix/suffix
  - Example: `"£1.2M"` → prefix `"£"`, number `1.2`, suffix `"M"` → animate `0.0 → 1.2`
- All 4 cells animate simultaneously on first scroll-into-view

---

### I. `ProjectRelatedCarousel` (NEW FILE) — `"use client"`

**Visual concept:** Horizontal drag-scroll row of project cards.

- Framer Motion `motion.div` with `drag="x"` and `dragConstraints` computed from container ref width
- Layout: `flex gap-4 overflow-hidden cursor-grab active:cursor-grabbing`
- Each card: dark glass `min-w-[280px] rounded-xl` with Next.js `<Image>` (`h-28 object-cover`), title, `ProjectStatusBadge`, location chip, `→ View Project` link
- Card entry: stagger `x: 40 → 0, opacity: 0 → 1` with 100ms between cards
- Drag hint: `font-mono text-[9px] text-muted-foreground/40` label `"DRAG TO EXPLORE"` fades out after 2s via `useEffect` timeout
- Heading above: `font-mono text-[10px] uppercase tracking-[0.2em] text-electric-cyan mb-4`
- Returns `null` if `projects.length === 0`
- Each card links to `/projects/category/{categorySlug}/{project.slug}`

---

## File-by-File Output Instructions

Output **complete** file contents — no elisions, no `// ...existing code` placeholder comments.

| File | Action |
|------|--------|
| `components/projects/projects-hero.tsx` | Full redesign |
| `components/projects/projects-featured-card.tsx` | Full redesign |
| `components/projects/projects-bento-grid.tsx` | Full redesign |
| `components/projects/projects-optimistic-list.tsx` | Full redesign (keep all hook logic, add infinite scroll) |
| `components/projects/project-card-shell.tsx` | Full redesign (dark glass primitive) |
| `components/projects/project-status-badge.tsx` | Full redesign (animated pulse) |
| `components/projects/project-meta-row.tsx` | Improve or keep minimal |
| `components/projects/projects-infinite-scroll.tsx` | **NEW FILE** |
| `components/projects/project-category-card.tsx` | **NEW FILE** |
| `components/projects/project-detail-hero.tsx` | **NEW FILE** |
| `components/projects/project-kpi-grid.tsx` | **NEW FILE** |
| `components/projects/project-related-carousel.tsx` | **NEW FILE** |
| `components/projects/index.ts` | Add exports for all 5 new components |

**Files to NOT output:** Anything in `app/`, `data/`, `lib/`, `types/`, `hooks/`.

---

## v0 Prompt (copy exactly into v0.dev)

```
I have a working Next.js 16 App Router project (electrical-website). All routes, data, server actions, and metadata are complete and must not be changed. I need you to design and build a highly creative, visually stunning, fully animated component layer for the Projects section.

TECH STACK (exact versions — do not deviate):
- Next.js 16, TypeScript strict mode
- Tailwind CSS v4 (no tailwind.config.js — config uses CSS variables in app/globals.css)
- Framer Motion ^12.38.0 — import only from "framer-motion"
- shadcn/ui (component library already installed)
- cn() utility from "@/lib/utils"

DESIGN TOKENS (CSS custom properties — use only these, no new color values):
- Background dark: hsl(var(--background)) ≈ #0a0a0a
- Primary accent: var(--electric-cyan) = #00f2ff in dark mode, #0891b2 in light mode
- Warning: var(--amber-warning) = #f59e0b dark, #d97706 light
- Muted: hsl(var(--muted)) and hsl(var(--muted-foreground))
- Border: hsl(var(--border))
- Mono font: font-mono Tailwind class maps to IBM Plex Mono via var(--font-ibm-plex-mono)
- Card bg: hsl(var(--card))

TYPESCRIPT TYPES — import from "@/types/projects", do not modify:
ProjectStatus = "planned" | "in-progress" | "completed"
ProjectCategorySlug = "all" | "residential" | "commercial-lighting" | "power-boards"
ProjectCategory { slug, label, description }
Project { id, slug, category, categoryLabel, title, clientSector, status, description, coverImage, kpis: { budget, timeline, capacity, location }, tags, progress, isFeatured, publishedAt, updatedAt }
ProjectBentoItem { id, title, value, description }
ProjectListItem { id, title, slug, category, categoryLabel, status, isFeatured, location, updatedAt }
ProjectKpis { budget, timeline, capacity, location }

DATA IMPORTS — import from "@/data/projects", do not modify:
allProjects, projectCategories, projectBentoItems
getFeaturedProjectByCategory(category), getProjectsByCategory(category)
getProjectListItemsByCategory(category), getCategorySlugs()
getProjectSlugsByCategory(categorySlug), isProjectCategorySlug(value)

PROP SIGNATURES — do not change (page files depend on exact prop names):
ProjectsHero: { categories: ProjectCategory[]; activeCategory: ProjectCategorySlug }
ProjectsFeaturedCard: { project: Project }
ProjectsBentoGrid: { items: ProjectBentoItem[] }
ProjectsOptimisticList: { items: ProjectListItem[] }
ProjectCardShell: { children: React.ReactNode; className?: string }
ProjectMetaRow: { label: string; value: string }
ProjectStatusBadge: { status: ProjectStatus }
New components — implement these exact interfaces:
ProjectsInfiniteScroll: { items: ProjectListItem[]; initialCount?: number }
ProjectCategoryCard: { category: ProjectCategory; projectCount: number; href: string }
ProjectDetailHero: { project: Project; categorySlug: string }
ProjectKpiGrid: { kpis: ProjectKpis }
ProjectRelatedCarousel: { projects: Project[]; categorySlug: string; heading?: string }

FILES TO REDESIGN (replace complete file content — keep same named export):

1. components/projects/projects-hero.tsx
Dark command-centre style. Animated SVG electric grid background (opacity 0.06, slow pulse loop). Scanline sweep: thin horizontal line animates top-to-bottom on mount then hidden. Headline stagger: each line y:20→0 opacity:0→1 with 80ms stagger. Category chips: active chip gets border-electric-cyan/40 bg-electric-cyan/15 glow shadow, inactive chips border-border hover:glow. Chips are Next.js Link components pointing to ?category=. Horizontal scroll on mobile.

2. components/projects/projects-featured-card.tsx
Two-column dark card. Left: Next.js Image with useScroll/useTransform parallax (0.2× scroll factor). FEATURED holographic ribbon top-left (gradient from-electric-cyan/40 to-transparent). ProjectStatusBadge bottom-left. Right: bg-card/60 backdrop-blur panel. KPIs as 2×2 grid of bg-muted/30 border tiles. Progress bar width animates 0%→{progress}% via useInView motion.div. Tags stagger in y:5→0 60ms apart. Arrow CTA translates on hover.

3. components/projects/projects-bento-grid.tsx
4-tile dark grid. Each tile: dark glass with border-l-2 border-electric-cyan accent. Count-up animation on useInView: extract numeric part with regex, animate from 0 to target over 1.2s easeOut — re-attach any prefix/suffix. Non-numeric values fade in at 0.8s. Tiles stagger left-to-right 120ms apart. Hover: scale 1.02 + glow border.

4. components/projects/projects-optimistic-list.tsx
KEEP ALL HOOK LOGIC: useOptimistic, useTransition, useState, applyUpdate function — these cannot change. Redesign only JSX/styles. Rows: grid cols [4px 1fr auto] — left status bar (in-progress=cyan animate-pulse, planned=amber/60, completed=green/60), content column (title font-semibold, category font-mono badge, location text-xs muted), actions column (ProjectStatusBadge + featured toggle). Row entry: x:-8→0 opacity animation stagger 80ms. Pending: opacity-60 + shimmer. Error: role=alert red banner slides down. INFINITE SCROLL: visibleCount state starts at 3. Sentinel div at bottom triggers IntersectionObserver. On intersection: show 3 skeleton rows for 200ms then reveal next 3 items. When all shown: "ALL PROJECTS LOADED" font-mono text-[9px] label.

5. components/projects/project-card-shell.tsx
Dark glass primitive used everywhere. bg-card/60 backdrop-blur-sm border border-border/40 rounded-xl transition-all. Accepts children and className. No animations inside — stays as a composable shell.

6. components/projects/project-status-badge.tsx
Three variants: planned (amber border/text + clock icon), in-progress (cyan border/text + animated pulse dot left), completed (green border/text + check icon). font-mono text-[9px] uppercase tracking-[0.16em]. Compact pill. Framer Motion animate-pulse on the dot for in-progress.

FILES TO CREATE NEW:

7. components/projects/projects-infinite-scroll.tsx ("use client")
Props: { items: ProjectListItem[]; initialCount?: number }
IntersectionObserver wrapper that slices items and passes sliced array to ProjectsOptimisticList.
visibleCount state, sentinel div ref, useEffect for observer. On intersection: 200ms delay then visibleCount += 3 capped at items.length. Skeleton rows during delay. "ALL PROJECTS LOADED" mono label when exhausted.
Note: if you implement infinite scroll inside ProjectsOptimisticList directly, make this a thin passthrough wrapper.

8. components/projects/project-category-card.tsx (no "use client" needed)
Props: { category: ProjectCategory; projectCount: number; href: string }
Entire card is a Next.js Link. Dark glass rounded-xl with group hover. Category label text-xl font-black uppercase. Mono slug chip text-electric-cyan/70. Description text-sm muted. Project count chip with electric-cyan/30 border. Bottom arrow translates on group-hover. Entry: opacity:0 y:16 → opacity:1 y:0.

9. components/projects/project-detail-hero.tsx ("use client")
Props: { project: Project; categorySlug: string }
Full-bleed motion.div image min-h-[40vh] sm:min-h-[60vh] with object-cover and useScroll/useTransform parallax (y at 0.2× scroll rate). Gradient overlay from-background. Status badge bottom-left, category chip bottom-right. FEATURED corner ribbon if project.isFeatured. Title below image text-3xl sm:text-5xl font-black uppercase animate opacity/y. Sticky breadcrumb strip: appears when scrollY>100, frosted glass bg-background/80 backdrop-blur, full path as Links. Description paragraph stagger 200ms after title.

10. components/projects/project-kpi-grid.tsx ("use client")
Props: { kpis: ProjectKpis }
grid grid-cols-2 sm:grid-cols-4. Each cell: dark tile border-t-2 border-electric-cyan. Label font-mono text-[9px] uppercase. Value: count-up via useInView — regex (\D*)([\d.]+)(\D*) extracts number, animates from 0 to target over 1.4s easeOut, prefix/suffix re-attached. All 4 animate on scroll-into-view.

11. components/projects/project-related-carousel.tsx ("use client")
Props: { projects: Project[]; categorySlug: string; heading?: string }
Horizontal Framer Motion drag carousel: drag="x" with dragConstraints from container ref scroll width. Cards: dark glass min-w-[280px]. Image h-28 object-cover. Title, ProjectStatusBadge, location, arrow CTA link to /projects/category/{categorySlug}/{slug}. Cards stagger x:40→0 100ms apart. "DRAG TO EXPLORE" hint fades out after 2s. Returns null if projects empty.

CRITICAL RULES:
- Every file must be output in full — no "// ...rest" shortcuts
- All animations via Framer Motion only, never CSS @keyframes
- useReducedMotion() from "framer-motion" must wrap animation values: const shouldReduce = useReducedMotion(); use it to set initial/animate to no-op when true
- No new color values — only var(--electric-cyan), var(--amber-warning), hsl(var(--background)), hsl(var(--muted)), hsl(var(--border)), hsl(var(--card)) etc
- No new npm packages — framer-motion, lucide-react, next/image, next/link are already available
- No "any" types anywhere
- Components with hooks or browser APIs need "use client"; purely presentational server-safe components do not
- After all component files, output the updated components/projects/index.ts adding exports for all 5 new components
```

---

## Acceptance Checklist

After applying v0 output, verify each item before committing:

- [ ] `pnpm exec tsc --noEmit` — zero TypeScript errors
- [ ] `pnpm build` — production build passes, all static pages generate
- [ ] `/projects` renders: animated hero with filter chips + featured card + bento grid + infinite-scroll list
- [ ] `/projects?category=residential` filters correctly, active category chip highlighted
- [ ] `/projects/category` renders 3 `ProjectCategoryCard` tiles (once wired in)
- [ ] `/projects/category/residential` renders per-category project cards with breadcrumb
- [ ] `/projects/category/power-boards/west-dock-industrial-upgrade` renders full detail page
- [ ] `/projects/west-dock-industrial-upgrade` (legacy slug) still resolves
- [ ] `ProjectStatusBadge` in-progress shows animated cyan pulse dot
- [ ] Bento grid values count up on first scroll into view
- [ ] Featured card progress bar animates on mount
- [ ] List shows 3 items on initial load, reveals more on scroll
- [ ] "ALL PROJECTS LOADED" appears after all items revealed
- [ ] `ProjectDetailHero` sticky breadcrumb appears on scroll
- [ ] `ProjectKpiGrid` values count up on scroll into view
- [ ] `ProjectRelatedCarousel` is draggable horizontally
- [ ] `useReducedMotion()` skips all animations when system preference active
- [ ] No `any` types in any new or modified component file
- [ ] All 5 new component exports present in `components/projects/index.ts`

---

## Custom Project Pages (Future Pattern)

Some projects may warrant fully bespoke page designs. The recommended pattern:

1. Add `customComponent?: string` field to `Project` type when ready
2. In `[projectSlug]/page.tsx`, lazy-import the custom component if `project.customComponent` is set
3. Fall back to the template layout (`ProjectDetailHero` + `ProjectKpiGrid` + `ProjectRelatedCarousel`) when no custom component is defined

The components built in this guide form the **template baseline** all project pages use by default.
Custom components extend this template — they do not replace it wholesale.


