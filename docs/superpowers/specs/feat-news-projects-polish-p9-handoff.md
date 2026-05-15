---
title: Handoff — News Hub & Projects Polish Phase 9
description: Self-contained session handoff. No file-reading required. Rehydrate from Docker then go straight to executing the plan.
category: specs
status: active
last-updated: 2026-05-14
---

# Session Handoff — feat/news-projects-polish-p9

## What to do on session start

1. Invoke orchestrator skill (rule 1)
2. Run docker-preflight — rehydrate from Docker entity `feat-news-projects-polish-p9`
3. Run `git status` — confirm 3 uncommitted files on `perf/startup-token-cleanup`
4. Create and switch to `feat/news-projects-polish-p9` branch
5. Commit the 3 pending changes as commit #0 (see sequence below)
6. Execute T1 through T6 in order, running the build gate after each commit

---

## Branch

`feat/news-projects-polish-p9` — branch from `perf/startup-token-cleanup` (or main if merged)

---

## Uncommitted files to commit first (commit #0)

```
data/home/index.ts                    (new) home intro section data
app/page.tsx                          (+2 lines) SectionIntro wired to home
components/shared/content-toc.tsx    (dark:text-white for projects TOC active number)
```

Commit message: `feat: home intro section + projects TOC active number white in dark mode`

---

## Task List

### T1 — Articles TOC dark mode: white number + white dot
**File:** `components/news-hub/news-article-toc.tsx`
- Active number span (~line 163): `text-electric-cyan` → `text-[hsl(174_100%_35%)] dark:text-white`
- Active dot span (~line 185): `bg-electric-cyan shadow-[0_0_8px_rgba(0,243,189,0.6)]`
  → `bg-[hsl(174_100%_35%)] dark:bg-white shadow-[0_0_8px_hsl(174_100%_35%/0.6)] dark:shadow-[0_0_8px_rgba(255,255,255,0.6)]`

### T2 — News topic filter page: add ContentBreadcrumb
**File:** `app/news-hub/filter/[topicSlug]/page.tsx`
- Import `ContentBreadcrumb` from `@/components/shared`
- Add after `<NewsTopicHero topic={topic} articleCount={items.length} />`:
```tsx
<ContentBreadcrumb
  items={[
    { label: "Home", href: "/" },
    { label: "News Hub", href: "/news-hub" },
    { label: "Topics", href: "/news-hub/category" },
    { label: topic.label, href: "#", isCurrent: true },
  ]}
  section="news"
/>
```

Commit T1+T2 together: `fix: article TOC dark mode white active state + topic filter page breadcrumb`

### T3 — SectionProfile: mobile image order
**File:** `components/shared/section-profile.tsx`
- Find the image outer `motion.div` with `className="w-full md:w-5/12 shrink-0"` → add `order-2 md:order-none`
- Find the text wrapper `<div` with `className="w-full md:w-7/12 ..."` → add `order-1 md:order-none`

Commit: `fix: SectionProfile text-before-image on mobile — order utilities`

### T4 — Article details page restructure
**File:** `app/news-hub/category/[categorySlug]/[articleSlug]/page.tsx`

**Step 1:** In `autoGenerateTocItems`, add before `return items`:
```ts
items.push({ id: "get-started", label: "Get Started" });
```

**Step 2:** Replace the `<div className="mt-16" data-related-articles="true">...</div>` block
with:
```tsx
<ProjectSupplementalSection cards={articleSidebarCards.slice(0, 2)} />
```
Where `articleSidebarCards = getSidebarCardsByCategory("all")` (add to page data fetching).
Import `ProjectSupplementalSection` from `@/components/projects`.
Import `getSidebarCardsByCategory` from `@/data/news`.

**Step 3:** Move `NewsRelatedArticles` + add closing CTA AFTER closing `</section>` of `#article-content`:
```tsx
{/* Continue Reading — full-width, outside sticky grid */}
{relatedArticles.length > 0 && (
  <section className="section-container section-padding bg-background">
    <div className="section-content max-w-6xl">
      <NewsRelatedArticles articles={relatedArticles} />
    </div>
  </section>
)}

{/* Editorial CTA */}
<section className="section-container section-padding bg-card/30">
  <div className="section-content max-w-6xl">
    <NewsArticleClosingCTA categorySlug={categorySlug} />
  </div>
</section>
```

**Step 4:** Create `components/news-hub/news-article-closing-cta.tsx`
- Model on `components/projects/project-social-cta.tsx` exactly
- Left: social links + "Follow our editorial coverage" copy
- Right: CTA card — "Turn Knowledge Into Action" / "Ready to Start Your Project?"
  - Primary: Link to /quotation — "Get a Quote" + ArrowRight
  - Secondary: Link to /news-hub — "Browse All Articles"
- Props: `{ categorySlug: string }`
- Same animation pattern (motion + useInView)
- Add to `components/news-hub/index.ts` exports

Commit: `feat: article details — getting started CTA replaces related articles as TOC anchor, related articles moved above footer`

### T5 — Projects list page: closing CTA
**File:** `app/projects/page.tsx`
**New component:** `components/projects/projects-list-cta.tsx`
- Props: none (or optional className)
- Left: headline "Start Your Next Project" + 2-line sub-copy + 3 stats (500+ Projects, 15+ Years, NICEIC Approved)
- Right: CTA card with corner brackets — "Get a Free Quote" (primary) + "View All Projects" (secondary) + phone/email contact
- Same pattern as `ProjectSocialCTA`
- Add to page: `<ProjectsListCTA />` in a section wrapper before `<Footer />`
- Export from `components/projects/index.ts`

### T6 — News Hub list page: closing CTA
**File:** `app/news-hub/page.tsx`
**New component:** `components/news-hub/news-hub-list-cta.tsx`
- Props: none
- Label: "EDITORIAL COMMAND CENTRE"
- Left: "Turn Knowledge Into Action" headline + "Our articles cover every aspect of electrical engineering — from compliance to innovation" + social links
- Right: CTA card — "Ready to Start?" + Get Quote (primary) + Explore Projects (secondary) + phone/email
- Same pattern, add to index.ts

Commit: `feat: projects + news hub list page closing CTAs — projects-list-cta + news-hub-list-cta`

---

## Build Gate

After every commit:
```
pnpm typecheck && pnpm build && pnpm test
```

---

## Docker Entity to Read on Rehydration

```
feat-news-projects-polish-p9
plan-news-projects-polish-p9
task-T1-articles-toc-dark-mode
task-T2-topic-breadcrumb
task-T3-article-layout-restructure
task-T4-projects-list-cta
task-T5-newshub-list-cta
task-T6-section-profile-image-order
```

---

## Obsidian Note

`Projects/Nexgen Electrical Innovations/Features/feat-news-projects-polish-p9.md`

---

## Key Decisions Already Made

1. Reuse `ProjectSupplementalSection` in articles (not a new component)
2. `NewsRelatedArticles` stays as a grid — no carousel conversion
3. New CTAs as dedicated components (not generic `SectionCTA`) — page-specific copy
4. Topic filter breadcrumb: `Topics` links to `/news-hub/category` (same as category landing)
