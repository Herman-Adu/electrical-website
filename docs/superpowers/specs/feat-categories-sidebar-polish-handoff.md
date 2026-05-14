# feat-categories-sidebar-polish — Handoff Spec

**Docker entity:** feat-categories-sidebar-polish  
**Branch:** feat/categories-sidebar-polish  
**Base:** main@337e835  

## Goal

Add `ContentSidebar` + two-column `CategoryPageLayout` to `/projects/category` and `/news-hub/category`.  
Upgrade `SectorCard` and `NewsChannelCard` with Framer Motion hover-reveal.  
Add new `NewsTopicCard` component for the "By Topics" section on `/news-hub/category`.

---

## Architecture

### New files
```
components/shared/category-page-layout.tsx
components/news-hub/news-topic-card.tsx
```

### Modified files
```
components/shared/index.ts                         ← export CategoryPageLayout
components/projects/sector-card.tsx                ← hover-reveal upgrade + description prop
components/news-hub/news-channel-card.tsx          ← hover-reveal upgrade + description prop
components/news-hub/index.ts                       ← export NewsTopicCard
app/projects/category/page.tsx                     ← wire CategoryPageLayout + sidebar
app/news-hub/category/page.tsx                     ← wire CategoryPageLayout + two-section left column
```

---

## T1 — `CategoryPageLayout` shared component

**File:** `components/shared/category-page-layout.tsx`

Server Component. Provides the two-column layout (8/4 split at lg) with `AnimatedBorders` and `ContentSidebar` on the right. Left slot accepts any ReactNode.

```tsx
"use client"; // needed for useAnimatedBorders + AnimatedBorders

import { type ReactNode } from "react";
import { useAnimatedBorders, AnimatedBorders } from "@/lib/use-animated-borders";
import { ContentSidebar } from "./content-sidebar";
import type { SidebarCard } from "@/types/shared-content";

interface CategoryPageLayoutProps {
  main: ReactNode;
  sidebarCards: SidebarCard[];
  sidebarTitle?: string;
  sidebarDescription?: string;
}

export function CategoryPageLayout({
  main,
  sidebarCards,
  sidebarTitle = "Resources",
  sidebarDescription = "Guides, consultations, and client testimonials.",
}: CategoryPageLayoutProps) {
  const { sectionRef, lineScale, lineScaleBottom, shouldReduce } = useAnimatedBorders();

  return (
    <section ref={sectionRef} className="relative section-padding bg-background">
      <AnimatedBorders
        shouldReduce={shouldReduce}
        lineScale={lineScale}
        lineScaleBottom={lineScaleBottom}
        showBottom={true}
      />
      <div className="section-content max-w-7xl">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12">
          <div className="lg:col-span-8">{main}</div>
          <div className="lg:col-span-4">
            <ContentSidebar
              cards={sidebarCards}
              title={sidebarTitle}
              description={sidebarDescription}
            />
          </div>
        </div>
      </div>
    </section>
  );
}
```

**Export:** add to `components/shared/index.ts`:
```ts
export { CategoryPageLayout } from "./category-page-layout";
```

---

## T2 — `SectorCard` hover-reveal upgrade

**File:** `components/projects/sector-card.tsx`

Add `"use client"`, Framer Motion `whileHover`, `useReducedMotion`. New `description` prop.

```tsx
"use client";

import Link from "next/link";
import Image from "next/image";
import { motion, useReducedMotion } from "framer-motion";
import type { ProjectCategory } from "@/types/projects";

interface SectorCardProps {
  category: ProjectCategory;
  projectCount: number;
  recentProjectTitle: string;
  coverImageSrc: string;
  coverImageAlt: string;
  description?: string;
}

export function SectorCard({
  category,
  projectCount,
  recentProjectTitle,
  coverImageSrc,
  coverImageAlt,
  description,
}: SectorCardProps) {
  const shouldReduce = useReducedMotion();

  return (
    <motion.div
      whileHover={shouldReduce ? undefined : { y: -4 }}
      transition={{ duration: 0.2, ease: "easeOut" }}
      className="group relative flex h-64 flex-col justify-end overflow-hidden rounded-xl sm:h-72 border border-transparent hover:border-electric-cyan/40 hover:shadow-[0_0_30px_rgba(0,243,189,0.12)] transition-all duration-300"
    >
      <Link href={`/projects/category/${category.slug}`} className="absolute inset-0 z-20" aria-label={`Browse ${category.label} projects`} />
      <Image
        src={coverImageSrc}
        alt={coverImageAlt}
        fill
        className="object-cover transition-transform duration-500 group-hover:scale-105"
        sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
      />
      {/* Base gradient */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />
      {/* Hover tint */}
      <div className="absolute inset-0 bg-electric-cyan/0 group-hover:bg-electric-cyan/5 transition-colors duration-300" />

      {/* Always-visible bottom bar */}
      <div className="relative z-10 p-5">
        <div className="flex items-center gap-2">
          <h2 className="text-xl font-bold text-white">{category.label}</h2>
          <span className="rounded-full bg-cyan-400 px-2 py-0.5 text-xs font-semibold text-black">
            {projectCount}
          </span>
        </div>
        <p className="mt-1 text-sm text-white/70 line-clamp-1">{recentProjectTitle}</p>

        {/* Hover-reveal panel */}
        <motion.div
          initial={false}
          animate={shouldReduce ? { opacity: 1, y: 0 } : undefined}
          className="overflow-hidden"
          variants={{
            rest: { opacity: 0, y: 12, height: 0 },
            hover: { opacity: 1, y: 0, height: "auto" },
          }}
        >
          {description && (
            <p className="mt-2 text-xs text-white/60 leading-relaxed line-clamp-2">{description}</p>
          )}
          <p className="mt-2 text-xs font-semibold text-electric-cyan">
            Browse {projectCount} project{projectCount !== 1 ? "s" : ""} →
          </p>
        </motion.div>

        {/* Default CTA (hidden on hover) */}
        <motion.p
          variants={{ rest: { opacity: 1 }, hover: { opacity: 0 } }}
          className="mt-2 text-xs font-medium text-cyan-400"
        >
          View {projectCount} project{projectCount !== 1 ? "s" : ""} →
        </motion.p>
      </div>
    </motion.div>
  );
}
```

> **Note:** Wrap the parent `div` or `Link` with `<motion.div whileHover="hover" initial="rest">` to drive the child variants. See T4 for the clean pattern to follow.

**Simplified clean pattern (use this):**
```tsx
<motion.div
  whileHover="hover"
  initial="rest"
  animate="rest"
  className="group relative ..."
>
  {/* image, gradients */}
  <div className="relative z-10 p-5">
    <div className="flex items-center gap-2">
      <h2>{category.label}</h2>
      <span>{projectCount}</span>
    </div>
    <p className="line-clamp-1 text-white/70">{recentProjectTitle}</p>

    {/* reveal */}
    <motion.div variants={{ rest: { opacity: 0, y: 10 }, hover: { opacity: 1, y: 0 } }}
      transition={{ duration: 0.22 }}>
      {description && <p className="mt-2 text-xs text-white/60 line-clamp-2">{description}</p>}
      <p className="mt-2 text-xs font-semibold text-electric-cyan">
        Browse {projectCount} project{projectCount !== 1 ? "s" : ""} →
      </p>
    </motion.div>
  </div>
</motion.div>
```

The `<Link>` sits as `absolute inset-0 z-20` inside so the whole card is clickable.

---

## T3 — `NewsChannelCard` hover-reveal upgrade

**File:** `components/news-hub/news-channel-card.tsx`

Same pattern as T2. Add `description?: string` prop. Add `"use client"` + Framer Motion.

```tsx
"use client";

import Link from "next/link";
import Image from "next/image";
import { motion, useReducedMotion } from "framer-motion";
import type { NewsCategory } from "@/types/news";

interface NewsChannelCardProps {
  category: NewsCategory;
  articleCount: number;
  recentArticleTitle: string;
  coverImageSrc: string;
  coverImageAlt: string;
  description?: string;
}

export function NewsChannelCard({
  category, articleCount, recentArticleTitle, coverImageSrc, coverImageAlt, description,
}: NewsChannelCardProps) {
  const shouldReduce = useReducedMotion();

  return (
    <motion.div
      whileHover="hover"
      initial="rest"
      animate="rest"
      className="group relative flex h-64 flex-col justify-end overflow-hidden rounded-xl sm:h-72 border border-transparent hover:border-electric-cyan/40 hover:shadow-[0_0_30px_rgba(0,243,189,0.12)] transition-all duration-300"
    >
      <Link href={`/news-hub/category/${category.slug}`} className="absolute inset-0 z-20" aria-label={`Browse ${category.label} articles`} />
      <Image src={coverImageSrc} alt={coverImageAlt} fill
        className="object-cover transition-transform duration-500 group-hover:scale-105"
        sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw" />
      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />
      <div className="absolute inset-0 bg-electric-cyan/0 group-hover:bg-electric-cyan/5 transition-colors duration-300" />

      <div className="relative z-10 p-5">
        <div className="flex items-center gap-2">
          <h2 className="text-xl font-bold text-white">{category.label}</h2>
          <span className="rounded-full bg-cyan-400 px-2 py-0.5 text-xs font-semibold text-black">{articleCount}</span>
        </div>
        <p className="mt-1 text-sm text-white/70 line-clamp-1">{recentArticleTitle}</p>

        <motion.div
          variants={{ rest: { opacity: 0, y: 10 }, hover: { opacity: 1, y: 0 } }}
          transition={{ duration: 0.22 }}
        >
          {description && <p className="mt-2 text-xs text-white/60 line-clamp-2">{description}</p>}
          <p className="mt-2 text-xs font-semibold text-electric-cyan">
            Browse {articleCount} article{articleCount !== 1 ? "s" : ""} →
          </p>
        </motion.div>
      </div>
    </motion.div>
  );
}
```

Pass `description={cat.description}` from the page (already on `NewsCategory` type).

---

## T4 — `NewsTopicCard` new component

**File:** `components/news-hub/news-topic-card.tsx`

Same hover-reveal pattern. Reveal shows first 3 tag chips + article count CTA.

```tsx
"use client";

import Link from "next/link";
import Image from "next/image";
import { motion, useReducedMotion } from "framer-motion";
import type { NewsTopic } from "@/data/news/topics";

interface NewsTopicCardProps {
  topic: NewsTopic;
  articleCount: number;
  coverImageSrc: string;
  coverImageAlt: string;
}

export function NewsTopicCard({ topic, articleCount, coverImageSrc, coverImageAlt }: NewsTopicCardProps) {
  const shouldReduce = useReducedMotion();
  const previewTags = topic.tags.slice(0, 3);

  return (
    <motion.div
      whileHover="hover"
      initial="rest"
      animate="rest"
      className="group relative flex h-64 flex-col justify-end overflow-hidden rounded-xl sm:h-72 border border-transparent hover:border-electric-cyan/40 hover:shadow-[0_0_30px_rgba(0,243,189,0.12)] transition-all duration-300"
    >
      <Link href={`/news-hub/filter/${topic.slug}`} className="absolute inset-0 z-20" aria-label={`Browse ${topic.label} articles`} />
      <Image src={coverImageSrc} alt={coverImageAlt} fill
        className="object-cover transition-transform duration-500 group-hover:scale-105"
        sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw" />
      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />
      <div className="absolute inset-0 bg-electric-cyan/0 group-hover:bg-electric-cyan/5 transition-colors duration-300" />

      <div className="relative z-10 p-5">
        <div className="flex items-center gap-2">
          <h2 className="text-xl font-bold text-white">{topic.label}</h2>
          <span className="rounded-full bg-cyan-400 px-2 py-0.5 text-xs font-semibold text-black">{articleCount}</span>
        </div>

        <motion.div
          variants={{ rest: { opacity: 0, y: 10 }, hover: { opacity: 1, y: 0 } }}
          transition={{ duration: 0.22 }}
          className="mt-2 space-y-2"
        >
          <div className="flex flex-wrap gap-1.5">
            {previewTags.map((tag) => (
              <span key={tag} className="rounded-full border border-electric-cyan/30 bg-electric-cyan/10 px-2 py-0.5 font-mono text-[9px] uppercase tracking-[0.12em] text-electric-cyan">
                {tag}
              </span>
            ))}
          </div>
          <p className="text-xs font-semibold text-electric-cyan">
            Browse {articleCount} article{articleCount !== 1 ? "s" : ""} →
          </p>
        </motion.div>

        <motion.p
          variants={{ rest: { opacity: 1 }, hover: { opacity: 0 } }}
          className="mt-2 text-xs font-medium text-cyan-400"
        >
          {articleCount} article{articleCount !== 1 ? "s" : ""} →
        </motion.p>
      </div>
    </motion.div>
  );
}
```

**Export:** add to `components/news-hub/index.ts`:
```ts
export { NewsTopicCard } from "./news-topic-card";
```

---

## T5 — Wire `/projects/category/page.tsx`

Replace the current `section#categories-grid` block with `CategoryPageLayout`.  
Add `getProjectsSidebarCards` import.  
Pass `description` prop to each `SectorCard`.

```tsx
import { CategoryPageLayout } from "@/components/shared";
import { getProjectsSidebarCards } from "@/data/shared/sidebar-cards";

// In the component:
const sidebarCards = getProjectsSidebarCards();

// Replace the section#categories-grid block with:
<CategoryPageLayout
  sidebarCards={sidebarCards}
  sidebarTitle="Project Resources"
  sidebarDescription="Consultations, guides, and client testimonials for your project needs."
  main={
    <div>
      <div className="flex items-center gap-3 mb-8">
        <div className="h-px w-8 bg-[hsl(174_100%_35%)] dark:bg-electric-cyan" />
        <span className="font-mono text-xs tracking-widest uppercase font-bold text-[hsl(174_100%_35%)] dark:text-electric-cyan">
          Specialist Sectors
        </span>
        <div className="w-1.5 h-1.5 rounded-full bg-[hsl(174_100%_35%)] dark:bg-electric-cyan animate-pulse" />
      </div>
      <div className="grid gap-5 sm:grid-cols-2">
        {projectCategories
          .filter((c) => c.isSector)
          .map((category) => {
            const catProjects = allProjects
              .filter((p) => p.category === category.slug)
              .sort((a, b) => b.publishedAt.localeCompare(a.publishedAt));
            const mostRecent = catProjects[0];
            return (
              <SectorCard
                key={category.slug}
                category={category}
                projectCount={catProjects.length}
                recentProjectTitle={mostRecent?.title ?? "Coming soon"}
                coverImageSrc={mostRecent?.coverImage.src ?? "/images/services-industrial.jpg"}
                coverImageAlt={mostRecent?.coverImage.alt ?? category.label}
                description={category.description}
              />
            );
          })}
      </div>
    </div>
  }
/>
```

Remove the outer `section-standard` wrapper — `CategoryPageLayout` provides it.  
`ProjectsListCTA` section stays below unchanged.  
Page remains a Server Component — `CategoryPageLayout` is `"use client"` internally (for `useAnimatedBorders`) but that is fine at the leaf boundary.

---

## T6 — Wire `/news-hub/category/page.tsx`

Replace `section#categories-grid` with `CategoryPageLayout`. Left column has two sections.  
Add `getNewsSidebarCards`, `NewsTopicCard`, `getNewsArticlesByTopic` imports.

**Topic image fallback map** (define at module scope):
```ts
const topicCoverImages: Record<string, string> = {
  residential: "/images/smart-living-interior.jpg",
  commercial: "/images/services-commercial.jpg",
  industrial: "/images/services-industrial.jpg",
  community: "/images/power-distribution.jpg",
  campaigns: "/images/warehouse-lighting.jpg",
  marketing: "/images/system-diagnostics.jpg",
  "social-media": "/images/services-commercial.jpg",
};
```

**Left column JSX:**
```tsx
<div className="space-y-12">
  {/* By Topics */}
  <div>
    <div className="flex items-center gap-3 mb-8">
      <div className="h-px w-8 bg-[hsl(174_100%_35%)] dark:bg-electric-cyan" />
      <span className="font-mono text-xs tracking-widest uppercase font-bold text-[hsl(174_100%_35%)] dark:text-electric-cyan">
        By Topics
      </span>
      <div className="w-1.5 h-1.5 rounded-full bg-[hsl(174_100%_35%)] dark:bg-electric-cyan animate-pulse" />
    </div>
    <div className="grid gap-5 sm:grid-cols-2">
      {newsTopics.map((topic) => {
        const topicArticles = getNewsArticlesByTopic(topic.slug, allNewsArticles);
        const recentImage = [...topicArticles]
          .sort((a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime())[0]
          ?.featuredImage?.src;
        return (
          <NewsTopicCard
            key={topic.slug}
            topic={topic}
            articleCount={topicArticles.length}
            coverImageSrc={recentImage ?? topicCoverImages[topic.slug] ?? "/images/services-commercial.jpg"}
            coverImageAlt={`${topic.label} articles`}
          />
        );
      })}
    </div>
  </div>

  {/* Divider */}
  <div className="border-t border-border/30" />

  {/* By Channels */}
  <div>
    <div className="flex items-center gap-3 mb-8">
      <div className="h-px w-8 bg-[hsl(174_100%_35%)] dark:bg-electric-cyan" />
      <span className="font-mono text-xs tracking-widest uppercase font-bold text-[hsl(174_100%_35%)] dark:text-electric-cyan">
        By Channels
      </span>
      <div className="w-1.5 h-1.5 rounded-full bg-[hsl(174_100%_35%)] dark:bg-electric-cyan animate-pulse" />
    </div>
    <div className="grid gap-5 sm:grid-cols-2">
      {newsCategories.map((cat) => {
        const catArticles = allNewsArticles.filter((a) => a.category === cat.slug);
        const sortedArticles = [...catArticles].sort(
          (a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime(),
        );
        const recentImage = sortedArticles[0]?.featuredImage?.src;
        return (
          <NewsChannelCard
            key={cat.slug}
            category={cat}
            articleCount={catArticles.length}
            recentArticleTitle={sortedArticles[0]?.title ?? "Coming soon"}
            coverImageSrc={recentImage ?? coverImageFallbacks[cat.slug] ?? "/images/services-commercial.jpg"}
            coverImageAlt={`${cat.label} channel`}
            description={cat.description}
          />
        );
      })}
    </div>
  </div>
</div>
```

**Full page imports to add:**
```ts
import { NewsTopicCard } from "@/components/news-hub";
import { getNewsSidebarCards } from "@/data/shared/sidebar-cards";
import { newsTopics, getNewsArticlesByTopic } from "@/data/news/topics";
import { CategoryPageLayout } from "@/components/shared";
```

Remove the commented-out `NewsTopicFilter` block entirely.  
`NewsHubListCTA` section stays below unchanged.

---

## Build gate

After T1+T2+T3+T4 (components done):
```bash
pnpm typecheck && pnpm build && pnpm test
```

After T5+T6 (pages wired):
```bash
pnpm typecheck && pnpm build && pnpm test
```

---

## ProjectCategory type — verify `description` field exists

Before T5, confirm `ProjectCategory` in `@/types/projects` has a `description: string` field.  
If missing, add it and update `data/projects/index.ts` category entries.

Check:
```bash
grep -n "description" types/projects.ts
grep -n "description" data/projects/index.ts | head -10
```
