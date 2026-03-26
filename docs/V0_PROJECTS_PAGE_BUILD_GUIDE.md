# v0 Build Guide — Projects (SSR + Category Routes + Slug + Metadata + Data-Driven)

## Purpose

This guide tells **v0.dev** how to build a new Projects experience that follows this repo’s architecture exactly:

- SSR-first App Router pages
- Slug-based project detail route
- Metadata best practices for list + detail pages
- Purely data-driven rendering
- Shared reusable components
- Professional layout with featured card, compact bento grid, and optimistic list

---

## Non-Negotiable Constraints

1. **SSR-first**

- `app/projects/page.tsx` must be a Server Component.
- `app/projects/category/[categorySlug]/page.tsx` must be a Server Component.
- `app/projects/category/[categorySlug]/[projectSlug]/page.tsx` must be a Server Component.
- No page-level `"use client"`.

2. **Category + Slug nested routes required**

- `/projects` — all-projects list page (SSR, dynamic — uses `searchParams`)
- `/projects/category` — static category index (SSG)
- `/projects/category/[categorySlug]` — per-category list (SSG, 3 routes)
- `/projects/category/[categorySlug]/[projectSlug]` — project detail (SSG, all pairs)
- The legacy `/projects/[slug]` remains for direct backward-compatible slug links.

3. **Metadata best practices**

- Use page-level `metadata` constant for fully-static routes.
- Use `generateMetadata({ params })` for dynamic slug routes — must `await params` (Next.js 15+ pattern).
- Canonical and OpenGraph URLs must be category+slug-aware.

4. **`params` is always a `Promise<...>` in Next.js 15+**

- All `params` props in Server Components must be typed as `Promise<{ ... }>` and awaited.
- In Client Components use `React.use(params)` — never `async/await` on client.

5. **`dynamicParams = false` on leaf slug pages**

- Set `export const dynamicParams = false` on `[projectSlug]/page.tsx`.
- Unknown category+slug combos return 404 — no on-demand fallback.

6. **Purely data-driven**

- No hardcoded card content in component JSX.
- All project cards, bento tiles, featured module, and list items come from typed data.
- `projectCategories` array is the single source of truth for all category data.

7. **`generateStaticParams` uses flat-pairs approach**

- Child `[projectSlug]/page.tsx` generates all `{ categorySlug, projectSlug }` pairs:

```ts
export async function generateStaticParams() {
  return getAllProjects().map((p) => ({
    categorySlug: p.category,
    projectSlug: p.slug,
  }));
}
```

- Parent `[categorySlug]/page.tsx` only generates `{ categorySlug }` pairs.

8. **Shared component architecture**

- Build reusable components (`ProjectCardShell`, `ProjectStatusBadge`, `ProjectMetaRow`, etc.) used across all route levels.

9. **Loading + Error UX required**

- Route-level skeleton loading states for each segment.
- Route-level error boundaries with retry — must be `"use client"`.
- `not-found.tsx` at both `[categorySlug]` and `[projectSlug]` segments.

---

## Current Repo Patterns to Follow

### Server/client split

- Route files under `app/**/page.tsx` are server-first composition shells.
- Client components are isolated to interactions/animations only.

### Styling

- Tailwind + tokens from `app/globals.css`.
- Reuse existing semantic tokens and brand accents.
- Use `cn()` from `lib/utils.ts`.

### Animations

- Framer Motion with subtle stagger/reveal.
- Reuse hooks in `lib/hooks/` when relevant.

### Data/typing

- Typed interfaces in `types/`.
- Render from data structures in `data/`.

---

## Required File Structure

```
app/projects/
  page.tsx                                       ← SSR list, dynamic (searchParams)
  loading.tsx                                    ← list skeleton
  error.tsx                                      ← list error boundary ("use client")
  [slug]/                                        ← legacy direct-slug detail
    page.tsx
    loading.tsx
    error.tsx
    not-found.tsx
  category/
    page.tsx                                     ← static category index (SSG ○)
    [categorySlug]/
      page.tsx                                   ← category list (SSG ●, 3 routes)
      loading.tsx
      error.tsx
      not-found.tsx
      [projectSlug]/
        page.tsx                                 ← project detail (SSG ●, all pairs)
        loading.tsx
        error.tsx
        not-found.tsx

components/projects/
  projects-hero.tsx                              ← hero with category chip filters
  projects-featured-card.tsx                     ← flagship project card
  projects-bento-grid.tsx                        ← 4-tile metrics bento
  projects-optimistic-list.tsx                   ← "use client" interactive list
  project-card-shell.tsx                         ← shared card wrapper primitive
  project-meta-row.tsx                           ← shared label/value row
  project-status-badge.tsx                       ← shared status chip
  index.ts                                       ← barrel export

data/projects/index.ts                           ← all data + helpers
types/projects.ts                                ← typed contract
lib/metadata-projects.ts                         ← metadata helpers
lib/actions/projects.ts                          ← server actions (optimistic)
```

---

## Data Model Requirements

Define typed contracts in `types/projects.ts`:

```ts
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

export interface Project {
  id: string;
  slug: string;
  category: Exclude<ProjectCategorySlug, "all">;
  categoryLabel: string;
  title: string;
  clientSector: string;
  status: "planned" | "in-progress" | "completed";
  description: string;
  coverImage: { src: string; alt: string };
  kpis: {
    budget: string;
    timeline: string;
    capacity: string;
    location: string;
  };
  tags: string[];
  progress: number; // 0–100
  isFeatured: boolean;
  publishedAt: string; // ISO 8601
  updatedAt: string;
}
```

`data/projects/index.ts` must export:

- `allProjects: Project[]`
- `projectCategories: ProjectCategory[]`
- `featuredProject: Project`
- `projectsBySlug: Record<string, Project>`
- `getProjectBySlug(slug: string): Project | undefined`
- `getProjectSlugs(): string[]`
- `getCategoryBySlug(slug: string): ProjectCategory | undefined`
- `getCategorySlugs(): string[]`
- `getProjectsByCategory(category: ProjectCategorySlug): Project[]`
- `getProjectByCategoryAndSlug(categorySlug, projectSlug): Project | undefined`
- `getProjectSlugsByCategory(categorySlug): string[]`
- `isProjectCategorySlug(value: string): value is Exclude<ProjectCategorySlug, "all">`

---

## SSR + Category + Slug + Metadata Implementation Rules

### `/projects` — All-projects list page

- Dynamic SSR (has `searchParams` for `?category=` filter).
- Export static `metadata` via helper.
- Resolve `activeCategory` from `searchParams`, call `getProjectListItemsByCategory()`.
- Provide `loading.tsx` + `error.tsx`.

### `/projects/category` — Category index

- Pure SSG (`○` static). No dynamic params.
- Export static `metadata`.
- Render 3 category cards linking to `/projects/category/[categorySlug]`.

### `/projects/category/[categorySlug]` — Category list page

- SSG via `generateStaticParams()` returning `getCategorySlugs()`.
- `params` typed as `Promise<{ categorySlug: string }>` — always `await params`.
- `generateMetadata({ params })` uses `getCategoryBySlug()` output.
- Call `notFound()` if category not found.
- Provide `loading.tsx` + `error.tsx` + `not-found.tsx`.

### `/projects/category/[categorySlug]/[projectSlug]` — Project detail

- SSG via flat-pairs `generateStaticParams()` on the **child only**:

```ts
export async function generateStaticParams() {
  return getCategorySlugs().flatMap((categorySlug) =>
    getProjectSlugsByCategory(categorySlug).map((projectSlug) => ({
      categorySlug,
      projectSlug,
    })),
  );
}
export const dynamicParams = false;
```

- `params` typed as `Promise<{ categorySlug: string; projectSlug: string }>`.
- Resolve `category` first, then `project` — each gets its own `notFound()` guard.
- `generateMetadata()` reuses `createProjectDetailMetadata(project)`.
- Provide `loading.tsx` + `error.tsx` + `not-found.tsx`.

### Metadata quality bar

- Title + description specific to each route segment.
- Canonical URL uses full nested path `/projects/category/[categorySlug]/[projectSlug]`.
- OpenGraph title/description/url aligned with project data.

---

## UI Requirements

### A) Category filter chips (hero)

- Category chips are data-driven from `projectCategories`.
- "All" chip always first.
- Active chip highlighted with `text-electric-cyan` + border.
- Chips are `<Link>` components pointing to `?category=` or category route.
- Props: `{ categories: ProjectCategory[], activeCategory: ProjectCategorySlug }`.

### B) Professional grid layout

- Balanced top-level spacing and enterprise visual rhythm.
- Use shared card primitives consistently.

### C) Full-featured project card

- Image, status badge, category chip, sector, description, KPI chips, progress bar, tags, CTA.

### D) Small bento grid

- 4–6 compact data-driven tiles with controlled visual hierarchy.

### E) Optimistic project list

- Client island only (`"use client"`).
- Optimistic updates with pending state + rollback on failure.
- Wire actions through Server Actions (`lib/actions/projects.ts`).

### F) Breadcrumb on nested routes

- Projects → Categories → [Category label] → [Project title]
- Each segment is a `<Link>` except the last (current).

---

## v0 Prompt (copy/paste into v0.dev)

> **NOTE:** This prompt assumes the scaffold is already in place. Use it to layer creative animated design on top — do NOT rebuild from scratch. All types, data, routes, and components described below already exist.

---

```
I have an existing Next.js 16 App Router codebase (electrical-website) with a fully scaffolded /projects section. I need you to design a highly creative, visually stunning, animated UI layer on top of the existing scaffold — without changing any route structure, data contracts, or TypeScript types.

The scaffold already includes:
- app/projects/page.tsx — SSR list page with ?category= filter via searchParams
- app/projects/category/page.tsx — static categories index
- app/projects/category/[categorySlug]/page.tsx — per-category list (SSG)
- app/projects/category/[categorySlug]/[projectSlug]/page.tsx — project detail (SSG)
- All loading.tsx, error.tsx, not-found.tsx files for each segment
- types/projects.ts — ProjectCategorySlug, ProjectCategory, Project, ProjectListItem
- data/projects/index.ts — allProjects (4 projects), projectCategories (3 categories), all helper functions
- components/projects/ — ProjectCardShell, ProjectStatusBadge, ProjectMetaRow, ProjectsHero, ProjectsFeaturedCard, ProjectsBentoGrid, ProjectsOptimisticList

DO NOT change:
- Route structure or page.tsx composition logic
- TypeScript types (types/projects.ts)
- Data helpers (data/projects/index.ts)
- SSR/SSG patterns — params must remain Promise<{...}> and awaited
- Server Action wiring in lib/actions/projects.ts

DO redesign with highly creative animated visual design:
1. ProjectsHero — dark glassmorphism hero with animated electric grid background, scanline effect, category chips with glowing active state, stagger-in reveal
2. ProjectsFeaturedCard — large dark card with parallax cover image, glowing cyan border on hover, KPI chips that count up on mount, animated progress bar fill on scroll, holographic gradient badge
3. ProjectsBentoGrid — dark bento tiles with animated number counters, electric cyan accent, subtle hover lift effect
4. ProjectsOptimisticList — dark list rows with status indicator dots (animated pulse for in-progress), quick slide-in optimistic animation, row hover scanline
5. Category list page ([categorySlug]/page.tsx) — project cards with hover reveal, staggered grid entry
6. Project detail page ([projectSlug]/page.tsx) — full-width parallax cover, sticky breadcrumb, KPI grid with count-up, animated tags, related projects carousel

Design system:
- Dark default theme (bg: hsl(var(--background)) = ~#0a0a0a)
- Primary accent: var(--electric-cyan) = #00e5ff
- Warning: var(--amber-warning)
- Font: Inter for body, IBM Plex Mono for labels/badges (var(--font-ibm-plex-mono))
- Tailwind v4 + Framer Motion 12 for all animations
- No new color tokens — use existing CSS custom properties only

Output:
- Updated component files only (not route page.tsx files)
- All animations use Framer Motion (not CSS keyframes)
- Components remain purely presentational — all data props passed in from SSR pages
- Strong TypeScript — no `any`, no loosely typed props
```

---

## Acceptance Checklist

- `/projects` is SSR and data-driven, filters by `?category=`
- `/projects/category` is static, renders 3 category cards
- `/projects/category/[categorySlug]` is SSG, renders projects in that category
- `/projects/category/[categorySlug]/[projectSlug]` is SSG, renders full project detail
- Legacy `/projects/[slug]` still resolves (backward compatibility)
- `generateMetadata()` implemented on all dynamic routes
- All `params` typed as `Promise<{...}>` and awaited
- `dynamicParams = false` set on `[projectSlug]` page
- `generateStaticParams()` uses flat-pairs approach on child segment
- Category chips are data-driven from `projectCategories`
- Breadcrumbs on category list and project detail pages
- Each route segment has `loading.tsx`, `error.tsx`, and `not-found.tsx`
- All 4 projects use real available images from `/public/images/`
- No page-level `"use client"` on SSR/SSG routes
- Typecheck (`tsc --noEmit`) passes clean
- Production build passes clean (`pnpm run build`)
