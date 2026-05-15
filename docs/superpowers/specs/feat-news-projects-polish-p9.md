---
title: News Hub & Projects Polish — Phase 9
description: Six-task UI polish sprint covering article TOC dark-mode, topic breadcrumbs, article layout restructure, list page CTAs, and mobile image order fix
category: specs
status: active
last-updated: 2026-05-14
---

# Spec: News Hub & Projects Polish — Phase 9

## Context

Main is clean. Phase 8 complete (scroll reveal, scroll indicators, emergency services page).
Three uncommitted changes live on `perf/startup-token-cleanup` from the current session —
these ship as the first commit of this feature's branch.

## Pending Uncommitted Changes (commit in new session)

| File | Change |
|------|--------|
| `data/home/index.ts` | New — `homeIntroData` (SectionIntroData for home page) |
| `app/page.tsx` | +2 lines — imports + `<SectionIntro data={homeIntroData} />` after breadcrumb |
| `components/shared/content-toc.tsx` | Dark mode active number `dark:text-white` (projects TOC, top-level + child items) |

---

## Scope of Work

### T1 — Articles TOC: white number + white dot in dark mode
**File:** `components/news-hub/news-article-toc.tsx`

`NewsArticleToc` is a separate component from `ContentToc` (used by projects).
It has no `dark:` prefix variants — active state is hardcoded cyan.

**Changes:**
- Line 163 active span: `text-electric-cyan` → `text-[hsl(174_100%_35%)] dark:text-white`
- Line 185 active dot: `bg-electric-cyan shadow-[0_0_8px_rgba(0,243,189,0.6)]`
  → `bg-[hsl(174_100%_35%)] dark:bg-white shadow-[0_0_8px_hsl(174_100%_35%/0.6)] dark:shadow-[0_0_8px_rgba(255,255,255,0.6)]`
- Also add `"Get Started"` as last TOC item from `autoGenerateTocItems` (see T3)

**Effort:** 30 min

---

### T2 — News topic filter pages: add ContentBreadcrumb
**File:** `app/news-hub/filter/[topicSlug]/page.tsx`

Currently: `NewsTopicHero` → `SectionIntro` → articles grid → Footer
Missing: `ContentBreadcrumb` between hero and SectionIntro

**Change:**
```tsx
import { SectionIntro, ContentBreadcrumb } from "@/components/shared";
// After <NewsTopicHero>:
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

**Effort:** 15 min

---

### T3 — Article details page: restructure layout
**File:** `app/news-hub/category/[categorySlug]/[articleSlug]/page.tsx`

**Current layout:**
```
main
  ReadingProgressBar
  NewsDetailHero
  ContentBreadcrumb
  section#article-content (grid)
    left col
      LayoutDispatcher (article body)
      div[mt-16] → NewsRelatedArticles  ← sticky TOC padding hack
    aside (sticky TOC sidebar)
      NewsArticleToc
      spotlight metrics
      article info
      tags
  Footer
```

**Target layout:**
```
main
  ReadingProgressBar
  NewsDetailHero
  ContentBreadcrumb
  section#article-content (grid)
    left col
      LayoutDispatcher (article body)
      ProjectSupplementalSection (id="get-started")  ← replaces related articles, pads TOC
    aside (sticky TOC sidebar)
      NewsArticleToc  ← with "Get Started" added as last item
      spotlight metrics
      article info
      tags
  section (full-width, outside grid)
    div.section-content.max-w-6xl
      NewsRelatedArticles  ← moved here
  section (full-width, outside grid)
    div.section-content.max-w-6xl
      NewsArticleClosingCTA  ← new component (editorial focus)
  Footer
```

**Sub-tasks:**

**T3a:** In `autoGenerateTocItems`, add `{ id: "get-started", label: "Get Started" }` as last item
(mirrors projects TOC which adds "Get Started" when `hasSidebarCards`)

**T3b:** Replace `<div className="mt-16" data-related-articles="true"><NewsRelatedArticles /></div>`
with `<ProjectSupplementalSection cards={getSidebarCardsByCategory("all").slice(0, 2)} />`
Import `getSidebarCardsByCategory` from `@/data/news` and `ProjectSupplementalSection`
from `@/components/projects`

**T3c:** After closing `</section>` of `#article-content`, add:
```tsx
<section className="section-container section-padding bg-background">
  <div className="section-content max-w-6xl">
    <NewsRelatedArticles articles={relatedArticles} />
  </div>
</section>

<section className="section-container section-padding bg-card/30">
  <div className="section-content max-w-6xl">
    <NewsArticleClosingCTA categorySlug={categorySlug} />
  </div>
</section>
```

**T3d:** Create `components/news-hub/news-article-closing-cta.tsx` — new component.
Model: `ProjectSocialCTA` but editorial-focused.
- Left: Social links + "Follow Our Editorial" copy
- Right: CTA card — "Ready to Start Your Project?" with Get Quote + Browse Articles buttons
- Props: `{ categorySlug: string }`
- Export via `components/news-hub/index.ts`

**Effort:** 2.5 hours total

---

### T4 — Projects list page: full-width closing CTA
**File:** `app/projects/page.tsx`

**Change:** Add before `<Footer />`:
```tsx
<section className="section-container section-padding bg-background">
  <div className="section-content max-w-6xl">
    <ProjectsListCTA />
  </div>
</section>
```

**New component:** `components/projects/projects-list-cta.tsx`
- Full-width, projects-oriented
- Left: "Start Your Next Project" headline + sub-copy + stats strip
- Right: Get Quote + View All Projects CTAs + contact info
- Model on `ProjectSocialCTA` layout but with projects-list framing
- Export via `components/projects/index.ts`

**Effort:** 1 hour

---

### T5 — News Hub list page: full-width closing CTA
**File:** `app/news-hub/page.tsx`

**Change:** Add before `<Footer />`:
```tsx
<section className="section-container section-padding bg-card/30">
  <div className="section-content max-w-6xl">
    <NewsHubListCTA />
  </div>
</section>
```

**New component:** `components/news-hub/news-hub-list-cta.tsx`
- "Editorial Command Centre" framing
- Left: "Stay Informed" + newsletter/social copy
- Right: "Turn Knowledge Into Action" CTA card — Get Quote + Explore Projects
- Export via `components/news-hub/index.ts`

**Effort:** 1 hour

---

### T6 — SectionProfile: mobile image order fix
**File:** `components/shared/section-profile.tsx`

**Problem:** Image div is DOM-first. On `flex-col` (mobile/tablet), image renders on top.
User wants: text (title + copy) first, image below — on mobile/tablet only.
Desktop (`md:flex-row` / `md:flex-row-reverse`) is correct — do not touch.

**Change:** Add Tailwind order utilities:
```tsx
// Image motion.div wrapper (currently line 102):
className="w-full md:w-5/12 shrink-0 order-2 md:order-none"

// Text wrapper div (currently line 192):
className="w-full md:w-7/12 relative z-20 bg-background/40 backdrop-blur-sm rounded-xl p-8 lg:p-12 order-1 md:order-none"
```

Works for both `reversed` and non-reversed because `md:order-none` restores DOM order
on desktop where `flex-row` / `flex-row-reverse` handles visual order correctly.

**Effort:** 15 min

---

## Commit Sequence

| # | Commit | Files |
|---|--------|-------|
| 0 | `feat: home intro section + projects TOC dark mode white number` | data/home/index.ts, app/page.tsx, content-toc.tsx |
| 1 | `fix: article TOC active state white number/dot + topic page breadcrumb` | news-article-toc.tsx, filter/[topicSlug]/page.tsx |
| 2 | `fix: SectionProfile mobile image order — text before image on mobile` | section-profile.tsx |
| 3 | `feat: article details layout — getting started replaces related, CTA below continue reading` | article page.tsx, news-article-closing-cta.tsx |
| 4 | `feat: projects + news hub list page closing CTAs` | projects-list-cta.tsx, news-hub-list-cta.tsx, page.tsx × 2 |

**Gate before each commit:** `pnpm typecheck && pnpm build && pnpm test`

---

## Reuse Map

| Task | Reuse |
|------|-------|
| T3b (getting started in articles) | `ProjectSupplementalSection` — already has `id="get-started"`, `ContentSidebar`, tags |
| T3 sidebar cards | `getSidebarCardsByCategory("all")` from `@/data/news` |
| T3d new CTA | Copy `ProjectSocialCTA` layout, change copy + links |
| T4 new CTA | Copy `ProjectSocialCTA` layout, project-list framing |
| T5 new CTA | Copy `ProjectSocialCTA` layout, editorial/hub framing |
| T6 image order | Pure Tailwind order utilities, no new components |

---

## Decisions

- **Reuse `ProjectSupplementalSection` in articles** — avoids duplicating `ContentSidebar` + card logic.
  The component is not project-specific (it's in `components/projects/` but has no project types in its interface).
  Alternative was a new `NewsArticleGetStarted` — rejected to reduce duplication.

- **`NewsRelatedArticles` stays a simple grid** — no carousel. The related articles were a grid of 3.
  Moving it outside the sticky layout restores proper full-width rendering.

- **List CTAs as new components** — not reusing `SectionCTA` (shared) because the content is
  page-specific (projects vs editorial) and both need meaningful copy, not a generic shell.

---

## Session Handoff Prompt (paste into new session)

See: `docs/superpowers/specs/feat-news-projects-polish-p9-handoff.md`
