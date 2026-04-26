# Project Detail Page Layout Restructure — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Restructure the project detail page so Related Projects moves out of the article content to a full-width section (news-hub style), Project Details moves into the sticky sidebar below the TOC, and "Related Projects" is removed from the TOC.

**Architecture:** Two files change. `project-article-content.tsx` loses the `ProjectRelatedCarousel` and the 3 props that fed it. `page.tsx` gains a new full-width Related section between the grid and the Social CTA, moves the Project Details card markup into the sticky `<aside>`, and drops the "Related Projects" TOC item.

**Tech Stack:** Next.js 15 App Router (server component page, client component article content), Tailwind CSS, TypeScript.

---

## TOC Impact Note

Removing Related Projects from the left column shortens it by ~500–600px. Moving Project Details from the left column supplemental div to the sidebar shortens it by another ~350px. The left column will be approximately ~4 600–4 800px tall. The sidebar (TOC + Project Details) will be ~750–850px. The CSS `sticky` rule stops the aside from sticking when its bottom reaches the bottom of the containing block:

```
unstick scroll offset ≈ left-column-height − sidebar-height
                       ≈ 4700px − 850px = 3850px
```

The 6 content sections (Overview → Testimonial) total roughly 4 200px. The TOC will therefore remain sticky throughout virtually all the content sections and may scroll out slightly near the very end of the last section. This is acceptable and unlikely to be noticeable. **The TOC will NOT break.**

---

## File Map

| File | Action |
|---|---|
| `components/projects/project-article-content.tsx` | Remove `ProjectRelatedCarousel` + 3 related props |
| `app/projects/category/[categorySlug]/[projectSlug]/page.tsx` | Remove Related from TOC; add full-width Related section; move Project Details into `<aside>`; trim supplemental div |

---

## Task 1 — Strip `ProjectRelatedCarousel` out of `ProjectArticleContent`

**Files:**
- Modify: `components/projects/project-article-content.tsx`

- [ ] **Step 1: Read the current file**

```bash
# confirm current state before editing
```

Open `components/projects/project-article-content.tsx` and note that it currently:
- Imports `ProjectRelatedCarousel` from `"./project-related-carousel"`
- Has props `relatedProjects: Project[]`, `categorySlug: string`, `categoryLabel: string`
- Renders `<ProjectRelatedCarousel … anchorId="related" />` at the bottom

- [ ] **Step 2: Write the updated file**

Replace the entire file with:

```tsx
"use client";

import type { ProjectDetailContent } from "@/types/projects";
import type { adaptProjectTimeline } from "@/lib/timeline/adapters";
import { ProjectDetailIntro } from "./project-detail-intro";
import { ProjectScopeGrid } from "./project-scope";
import { ProjectChallengeSolution } from "./project-challenge-solution";
import { ProjectTimeline } from "./project-timeline";
import { ProjectGallery } from "./project-gallery";
import { ProjectTestimonialCard } from "./project-testimonial";

interface ProjectArticleContentProps {
  detail: ProjectDetailContent;
  canonicalTimeline: ReturnType<typeof adaptProjectTimeline> | null;
}

export function ProjectArticleContent({
  detail,
  canonicalTimeline,
}: ProjectArticleContentProps) {
  return (
    <div className="mt-2">
      {detail.intro && (
        <ProjectDetailIntro data={detail.intro} anchorId="overview" />
      )}

      {detail.scope && detail.scope.length > 0 && (
        <ProjectScopeGrid items={detail.scope} anchorId="scope" />
      )}

      {detail.challenge && detail.solution && (
        <ProjectChallengeSolution
          challenge={detail.challenge}
          solution={detail.solution}
          anchorId="challenge"
        />
      )}

      {(canonicalTimeline?.items.length ?? 0) > 0 && (
        <ProjectTimeline
          items={canonicalTimeline!.items}
          anchorId="timeline"
        />
      )}

      {detail.gallery && detail.gallery.length > 0 && (
        <ProjectGallery images={detail.gallery} anchorId="gallery" />
      )}

      {detail.testimonial && (
        <ProjectTestimonialCard
          testimonial={detail.testimonial}
          anchorId="testimonial"
        />
      )}
    </div>
  );
}
```

- [ ] **Step 3: Run typecheck**

```bash
pnpm typecheck
```

Expected: errors only in `page.tsx` (it still passes the now-removed props) — fix in Task 2.

---

## Task 2 — Restructure `page.tsx`

**Files:**
- Modify: `app/projects/category/[categorySlug]/[projectSlug]/page.tsx`

Four independent changes in one file:
1. Remove "Related Projects" from `generateTocItems`
2. Update `<ProjectArticleContent>` call (remove 3 props)
3. Move Project Details card from left-column supplemental div into `<aside>`
4. Add full-width Related Projects section between grid section and Social CTA

- [ ] **Step 1: Update `generateTocItems` — remove the hardcoded Related item**

Find lines 114–115 (currently):
```typescript
  items.push({ id: "related", label: "Related Projects" });

  return items;
```

Replace with:
```typescript
  return items;
```

- [ ] **Step 2: Update the `<ProjectArticleContent>` call — drop the 3 removed props**

Find (currently lines 222–229):
```tsx
            {detail && (
              <ProjectArticleContent
                detail={detail}
                canonicalTimeline={canonicalTimeline}
                relatedProjects={relatedProjects}
                categorySlug={categorySlug}
                categoryLabel={category.label}
              />
            )}
```

Replace with:
```tsx
            {detail && (
              <ProjectArticleContent
                detail={detail}
                canonicalTimeline={canonicalTimeline}
              />
            )}
```

- [ ] **Step 3: Move Project Details card into the sticky `<aside>` — and remove it from the supplemental div**

Find the current `<aside>` block (currently lines 314–320):
```tsx
          {/* Sticky Sidebar — TOC only */}
          <aside
            data-sticky-toc="true"
            className="hidden xl:flex xl:flex-col xl:gap-6 sticky top-[150px] self-start mt-2"
          >
            <ContentToc items={tocItems} title="Project Contents" />
          </aside>
```

Replace with:
```tsx
          {/* Sticky Sidebar — TOC + Project Details */}
          <aside
            data-sticky-toc="true"
            className="hidden xl:flex xl:flex-col xl:gap-6 sticky top-[150px] self-start mt-2"
          >
            <ContentToc items={tocItems} title="Project Contents" />

            {/* Project Details card */}
            <div className="rounded-xl border border-[hsl(174_100%_35%)]/20 dark:border-electric-cyan/20 bg-gradient-to-br from-white/95 dark:from-background/90 to-[hsl(174_100%_35%)]/5 dark:to-background/70 p-5 space-y-4">
              <h3 className="font-mono text-[10px] uppercase tracking-[0.2em] text-[hsl(174_100%_35%)]/70 dark:text-electric-cyan/70">
                Project Details
              </h3>
              <dl className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <dt className="text-foreground/50">Status</dt>
                  <dd className="font-medium text-[hsl(174_100%_35%)] dark:text-electric-cyan capitalize">
                    {project.status.replace("-", " ")}
                  </dd>
                </div>
                <div className="flex justify-between">
                  <dt className="text-foreground/50">Budget</dt>
                  <dd className="font-medium text-foreground">{project.kpis.budget}</dd>
                </div>
                <div className="flex justify-between">
                  <dt className="text-foreground/50">Timeline</dt>
                  <dd className="font-medium text-foreground">{project.kpis.timeline}</dd>
                </div>
                <div className="flex justify-between">
                  <dt className="text-foreground/50">Location</dt>
                  <dd className="font-medium text-foreground">{project.kpis.location}</dd>
                </div>
                <div className="flex justify-between">
                  <dt className="text-foreground/50">Capacity</dt>
                  <dd className="font-medium text-foreground">{project.kpis.capacity}</dd>
                </div>
                <div className="flex justify-between">
                  <dt className="text-foreground/50">Sector</dt>
                  <dd className="font-medium text-foreground">{project.clientSector}</dd>
                </div>
              </dl>
              {project.status === "in-progress" && (
                <div className="pt-2 border-t border-[hsl(174_100%_35%)]/10 dark:border-electric-cyan/10">
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-mono text-[9px] uppercase tracking-[0.14em] text-foreground/50">
                      Progress
                    </span>
                    <span className="font-mono text-[10px] text-[hsl(174_100%_35%)] dark:text-electric-cyan">
                      {project.progress}%
                    </span>
                  </div>
                  <div className="h-1.5 w-full overflow-hidden rounded-full bg-[hsl(174_100%_35%)]/10 dark:bg-electric-cyan/10">
                    <div
                      className="h-full bg-gradient-to-r from-[hsl(174_100%_35%)]/60 dark:from-electric-cyan/60 to-[hsl(174_100%_35%)] dark:to-electric-cyan transition-all"
                      style={{ width: `${project.progress}%` }}
                    />
                  </div>
                </div>
              )}
            </div>
          </aside>
```

Now remove the Project Details card from the supplemental div. Find (currently in the supplemental div, lines 231–283):
```tsx
            {/* Supplemental project info — inside left column so it contributes to gridHeight */}
            <div className="mt-6 flex flex-col gap-6">
              {/* Project KPIs Card */}
              <div className="rounded-xl border border-[hsl(174_100%_35%)]/20 dark:border-electric-cyan/20 bg-gradient-to-br from-white/95 dark:from-background/90 to-[hsl(174_100%_35%)]/5 dark:to-background/70 p-5 space-y-4">
                ...all the KPI card markup...
              </div>
              {/* Tags */}
              ...
              {/* Sidebar Cards */}
              ...
            </div>
```

Replace that supplemental div with (keeping only Tags and Sidebar, removing the KPI card):
```tsx
            {/* Supplemental project info */}
            <div className="mt-6 flex flex-col gap-6">
              {/* Tags */}
              {project.tags && project.tags.length > 0 && (
                <div className="space-y-3">
                  <h3 className="font-mono text-[10px] uppercase tracking-[0.2em] text-[hsl(174_100%_35%)]/70 dark:text-electric-cyan/70">
                    Project Tags
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {project.tags.map((tag) => (
                      <span
                        key={tag}
                        className="rounded-md border border-[hsl(174_100%_35%)]/20 dark:border-electric-cyan/20 bg-[hsl(174_100%_35%)]/5 dark:bg-electric-cyan/5 px-2 py-1 font-mono text-[9px] uppercase tracking-[0.12em] text-foreground/60"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              )}
              {/* Sidebar Cards */}
              {sidebarCards.length > 0 && (
                <ContentSidebar
                  cards={sidebarCards.slice(0, 2)}
                  title="Get Started"
                  description="Ready to discuss your project requirements?"
                  showLiveIndicator={false}
                />
              )}
            </div>
```

- [ ] **Step 4: Add the full-width Related Projects section**

Add `ProjectRelatedCarousel` to the existing barrel import at the top of the file:
```typescript
import {
  ProjectDetailHero,
  ProjectArticleContent,
  ProjectRelatedCarousel,
  ProjectSocialCTA,
} from "@/components/projects";
```

Find the Social CTA section (currently lines 324–332):
```tsx
      {/* Social CTA - Full Width */}
      <section className="section-container section-padding  bg-background">
        <div className="section-content max-w-6xl">
          <ProjectSocialCTA
            projectTitle={project.title}
            categorySlug={categorySlug}
          />
        </div>
      </section>
```

Insert a new Related Projects section **immediately before** the Social CTA section:
```tsx
      {/* Related Projects - Full Width (below content grid, above CTA) */}
      {relatedProjects.length > 0 && (
        <section className="section-container section-padding bg-background">
          <div className="section-content max-w-6xl">
            <ProjectRelatedCarousel
              projects={relatedProjects}
              categorySlug={categorySlug}
              heading={`More ${category.label} Projects`}
            />
          </div>
        </section>
      )}

      {/* Social CTA - Full Width */}
      <section className="section-container section-padding  bg-background">
        ...
```

Note: `anchorId="related"` is intentionally omitted — the component is no longer in the TOC.

- [ ] **Step 5: Run typecheck**

```bash
pnpm typecheck
```

Expected: 0 errors.

- [ ] **Step 6: Run build**

```bash
pnpm build
```

Expected: 58/58 pages pass.

- [ ] **Step 7: Run tests**

```bash
pnpm test
```

Expected: all tests pass (no regressions — these changes are layout-only, no logic changes).

- [ ] **Step 8: Commit**

```bash
git add components/projects/project-article-content.tsx
git add "app/projects/category/[categorySlug]/[projectSlug]/page.tsx"
git commit -m "refactor: move RelatedProjects to full-width section, Project Details to sidebar"
```

---

## Verification (Browser)

1. Start dev server: `pnpm dev`
2. Navigate to any project detail page e.g. `/projects/category/power-boards/west-dock-industrial-upgrade`
3. Confirm:
   - **TOC (right sidebar):** Shows items Overview → Client Testimonial only. "Related Projects" is gone.
   - **Project Details card:** Appears in the sticky right sidebar, below the TOC list. Shows Status, Budget, Timeline, Location, Capacity, Sector, and Progress bar (for in-progress projects).
   - **Left column content:** Flows Overview → Scope → Challenge → Timeline → Gallery → Testimonial. Supplemental Tags + Sidebar Cards below.
   - **Below the grid section:** Full-width Related Projects carousel appears.
   - **Then:** Social CTA section.
   - **Light + dark mode:** Project Details card colours correct in both themes.
   - **Scroll TOC sticky behaviour:** TOC remains sticky throughout all content sections; may start to scroll at very end of Testimonial — acceptable.
4. Test all 3 categories (power-boards, residential, commercial-lighting) since related project counts differ.
