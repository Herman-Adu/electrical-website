# v0 Build Guide — Projects (SSR + Slug + Metadata + Data-Driven)

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
- `app/projects/[slug]/page.tsx` must be a Server Component.
- No page-level `"use client"`.

2. **Slug route required**

- Detail page route must be `app/projects/[slug]/page.tsx`.
- Each project record must contain a unique `slug`.

3. **Metadata best practices**

- Use page-level metadata for list route.
- Use `generateMetadata()` for slug route.
- Canonical and OpenGraph URLs should be slug-aware.
- Reuse helper approach aligned with `lib/metadata.ts`.

4. **Purely data-driven**

- No hardcoded card content in component JSX.
- All project cards, bento tiles, featured module, and list items come from typed data.

5. **Shared component architecture**

- Build reusable components (`ProjectCardShell`, `ProjectBadge`, `ProjectMetaRow`, etc.) used by both list and slug pages.

6. **Loading + Error UX required**

- Add route-level skeleton loading states.
- Add route-level error boundaries with retry actions.
- Keep loading/error UI consistent with project card design language.

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

- `app/projects/page.tsx` (SSR list page)
- `app/projects/loading.tsx` (list skeleton state)
- `app/projects/error.tsx` (list error boundary, client component)
- `app/projects/[slug]/page.tsx` (SSR detail page)
- `app/projects/[slug]/loading.tsx` (detail skeleton state)
- `app/projects/[slug]/error.tsx` (detail error boundary, client component)
- `app/projects/[slug]/not-found.tsx` (optional but recommended)
- `components/projects/projects-hero.tsx`
- `components/projects/projects-featured-card.tsx`
- `components/projects/projects-bento-grid.tsx`
- `components/projects/projects-optimistic-list.tsx` (client)
- `components/projects/project-card-shell.tsx` (shared)
- `components/projects/project-meta-row.tsx` (shared)
- `components/projects/project-status-badge.tsx` (shared)
- `components/projects/index.ts`
- `data/projects/index.ts`
- `types/projects.ts`
- `lib/metadata-projects.ts` (or extend existing metadata helper)
- `lib/actions/projects.ts` (server actions for optimistic updates)

---

## Data Model Requirements

Define a strict `Project` type (and supporting unions) in `types/projects.ts`:

- `id`
- `slug`
- `title`
- `clientSector`
- `status` (`planned` | `in-progress` | `completed`)
- `description`
- `coverImage` (`src`, `alt`)
- `kpis` (budget/timeline/location/capacity)
- `tags`
- `progress` (0–100)
- `isFeatured`
- `publishedAt`
- `updatedAt`

`data/projects/index.ts` should export helpers such as:

- `allProjects`
- `featuredProject`
- `projectsBySlug`
- `getProjectBySlug(slug)`
- `getProjectSlugs()`

---

## SSR + Slug + Metadata Implementation Rules

### `/projects` page

- SSR render from `allProjects`.
- Export static metadata via helper (`createProjectsListMetadata`).
- Provide `app/projects/loading.tsx` skeletons matching list layout.
- Provide `app/projects/error.tsx` boundary with `reset()` retry.

### `/projects/[slug]` page

- Resolve data by slug using shared data helper.
- Use `notFound()` if slug does not exist.
- Implement `generateMetadata({ params })` using slug data (`createProjectDetailMetadata(project)`).
- Implement `generateStaticParams()` from `getProjectSlugs()` if prerendering desired.
- Provide `app/projects/[slug]/loading.tsx` skeletons matching detail layout.
- Provide `app/projects/[slug]/error.tsx` boundary with `reset()` retry + safe fallback CTA.

### Metadata quality bar

- Title + description specific to each project.
- Canonical URL `/projects/[slug]`.
- OpenGraph title/description/url aligned with project data.

---

## UI Requirements

### A) Professional grid layout

- Balanced top-level spacing and enterprise visual rhythm.
- Use shared card primitives consistently.

### B) Full-featured project card

- Image, status badge, sector, description, KPI chips, progress bar, CTA.

### C) Small bento grid

- 4–6 compact data-driven tiles with controlled visual hierarchy.

### D) Optimistic project list

- Client island only.
- Optimistic updates with pending state + rollback on failure.
- Wire actions through Server Actions (`lib/actions/projects.ts`).

---

## v0 Prompt (copy/paste)

Use this exact prompt in v0:

Build a new Projects feature for an existing Next.js App Router production codebase.

Hard constraints:

- SSR-first only. `app/projects/page.tsx` and `app/projects/[slug]/page.tsx` must be Server Components.
- Add slug detail route at `app/projects/[slug]/page.tsx`.
- Add route-level loading and error files:
  - `app/projects/loading.tsx`
  - `app/projects/error.tsx`
  - `app/projects/[slug]/loading.tsx`
  - `app/projects/[slug]/error.tsx`
- Implement metadata best practices:
  - list page metadata
  - `generateMetadata()` for slug page
  - canonical + OpenGraph URLs using slug
- Keep implementation purely data-driven: no hardcoded project card content in JSX.
- Build shared reusable project components and use them across list/detail pages.
- Use client components only for optimistic interactions and animations.

Create these files/components:

- `app/projects/page.tsx`
- `app/projects/loading.tsx`
- `app/projects/error.tsx` (must be `"use client"` for reset handler)
- `app/projects/[slug]/page.tsx`
- `app/projects/[slug]/loading.tsx`
- `app/projects/[slug]/error.tsx` (must be `"use client"` for reset handler)
- `components/projects/projects-hero.tsx`
- `components/projects/projects-featured-card.tsx`
- `components/projects/projects-bento-grid.tsx`
- `components/projects/projects-optimistic-list.tsx` (client)
- shared primitives: `project-card-shell.tsx`, `project-meta-row.tsx`, `project-status-badge.tsx`
- `types/projects.ts`
- `data/projects/index.ts`
- metadata helper for projects (`lib/metadata-projects.ts`)
- server actions for optimistic list (`lib/actions/projects.ts`)

UI requirements:

- Professional project grid layout
- One full-featured project card
- Small bento grid (4–6 tiles)
- Optimistic project list with pending + rollback
- Skeleton loading states for both list and slug routes
- Error boundaries for both list and slug routes with clear recovery actions
- Subtle Framer Motion animations only where useful
- Tailwind + existing tokenized theme style; no new color system

Output requirements:

- Strong typing for all project data and props
- Data-driven rendering for all project UI modules
- Shared components reused across list/detail
- Clean, production-ready folder structure

---

## Acceptance Checklist

- `/projects` is SSR and data-driven
- `/projects/[slug]` exists and resolves by slug
- `generateMetadata()` implemented on slug page
- Metadata canonical/OG is slug-specific
- List and slug routes each have `loading.tsx` skeleton states
- List and slug routes each have `error.tsx` boundaries with retry
- Featured card + bento + optimistic list all implemented
- Optimistic list has pending and rollback states
- Shared project components are reused (not duplicated)
- No page-level `"use client"` on SSR routes
