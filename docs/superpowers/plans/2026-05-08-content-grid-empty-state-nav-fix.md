# ContentGridLayout Empty-State Navigation Fix — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Fix the category slider and full navigation context disappearing when a category has zero items — always render the slider, eyebrow, animated title, and count badge regardless of item count; replace the bare empty message with an enhanced card that includes a "View all" CTA link.

**Architecture:** Remove the early-return empty guard in `ContentGridLayout` (projects) and `NewsGridLayout` (news hub) — both files have the identical pattern. The header/slider shell renders unconditionally; only the content feed area is gated on `items.length`. An enhanced empty-state card (h3 headline + description + CTA `<Link>`) replaces the feed list when empty. CTA uses `usePathname()` to strip the `?category` param without hard-coding any route — works for both `/projects` and `/news-hub`.

**Tech Stack:** Next.js 16, React 19, TypeScript strict, `next/link` (`Link`), `next/navigation` (`usePathname`), Framer Motion (already in files), Playwright (e2e tests)

---

## File Map

| File | Action | Responsibility |
|------|--------|---------------|
| `e2e/projects-category-slider.spec.ts` | Modify | 4 new failing tests for Community (0 projects) empty-state regression |
| `components/shared/content-grid-layout.tsx` | Modify | Remove early-return (lines 114–129); inline enhanced empty-state card; add `usePathname` + `Link` |
| `components/news-hub/news-grid-layout.tsx` | Modify | Same early-return removal + enhanced card (defensive — no empty News Hub category today) |

---

## Task 1: Write failing Playwright tests for the empty-category regression

**Files:**
- Modify: `e2e/projects-category-slider.spec.ts`

- [ ] **Step 1.1: Append 4 new tests inside the existing describe block**

Open `e2e/projects-category-slider.spec.ts`. Inside the `"projects category slider — URL-driven filtering"` describe block, **append the following 4 tests after the last existing test** (after the closing `});` of the `"cold load with ?category=commercial…"` test, before the outer describe's closing `}`):

```ts
  test("community category shows slider, animated title, and 0-count badge", async ({
    page,
  }) => {
    await page.goto("/projects?category=community", {
      waitUntil: "domcontentloaded",
    });

    // Slider must still be present when category has 0 items
    const sliderNav = page.getByRole("navigation", {
      name: /filter projects by category/i,
    });
    await expect(sliderNav).toBeVisible({ timeout: 10000 });

    // Community chip is active
    const communityChip = sliderNav.getByRole("button", { name: /^Community/ });
    await expect(communityChip).toHaveAttribute("aria-current", "page");

    // Animated title "Community Projects" is visible
    const title = page.getByRole("heading", {
      level: 2,
      name: /community\s+projects/i,
    });
    await expect(title).toBeVisible({ timeout: 5000 });

    // Count badge shows "0 projects" (DOM text is lowercase; CSS uppercases it)
    await expect(page.getByText(/^0 projects$/i)).toBeVisible();
  });

  test("empty category shows enhanced card with heading and CTA link", async ({
    page,
  }) => {
    await page.goto("/projects?category=community", {
      waitUntil: "domcontentloaded",
    });

    const sliderNav = page.getByRole("navigation", {
      name: /filter projects by category/i,
    });
    await expect(sliderNav).toBeVisible({ timeout: 10000 });

    // Enhanced empty-state heading replaces the bare message
    await expect(
      page.getByRole("heading", { level: 3, name: /no projects yet/i }),
    ).toBeVisible({ timeout: 5000 });

    // CTA <Link> (rendered as <a>) is present
    await expect(
      page.getByRole("link", { name: /view all projects/i }),
    ).toBeVisible();
  });

  test("empty category CTA link clears ?category and activates All chip", async ({
    page,
  }) => {
    await page.goto("/projects?category=community", {
      waitUntil: "domcontentloaded",
    });

    const ctaLink = page.getByRole("link", { name: /view all projects/i });
    await expect(ctaLink).toBeVisible({ timeout: 10000 });
    await ctaLink.click();

    // URL has no ?category param
    await expect(page).toHaveURL(/\/projects(?:\/?$|\?(?!category=).*)/, {
      timeout: 5000,
    });
    expect(page.url()).not.toContain("category=community");

    // All chip becomes active
    const sliderNav = page.getByRole("navigation", {
      name: /filter projects by category/i,
    });
    const allChip = sliderNav.getByRole("button", { name: /^All/ });
    await expect(allChip).toHaveAttribute("aria-current", "page");
  });

  test("slider remains usable from empty Community category — can navigate to Residential", async ({
    page,
  }) => {
    await page.goto("/projects?category=community", {
      waitUntil: "domcontentloaded",
    });

    const sliderNav = page.getByRole("navigation", {
      name: /filter projects by category/i,
    });
    await expect(sliderNav).toBeVisible({ timeout: 10000 });

    // Navigate away via the slider — must work from an empty category
    const residentialChip = sliderNav.getByRole("button", {
      name: /^Residential/,
    });
    await residentialChip.click();

    await expect(page).toHaveURL(/\?category=residential$/, { timeout: 5000 });
    await expect(residentialChip).toHaveAttribute("aria-current", "page");

    // Projects load (2 residential projects exist)
    await expect(
      page.getByRole("heading", { level: 2, name: /residential\s+projects/i }),
    ).toBeVisible({ timeout: 5000 });
  });
```

- [ ] **Step 1.2: Run the 4 new tests — confirm they FAIL before the fix**

```bash
PLAYWRIGHT_REUSE_SERVER=true pnpm test:e2e --reporter=list -- --grep "community category|empty category|slider remains usable"
```

Expected: 4 FAIL. The slider nav element is not found — tests timeout waiting for it to be visible. This confirms the regression is real and the tests are correctly written.

---

## Task 2: Fix `content-grid-layout.tsx` — remove early-return, add enhanced empty-state card

**Files:**
- Modify: `components/shared/content-grid-layout.tsx`

- [ ] **Step 2.1: Add `Link` and `usePathname` imports**

Replace the existing imports block (lines 1–19) with:

```tsx
"use client";

import { type ReactNode } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";
import type {
  ContentListItem,
  SidebarCard,
  ProjectListItemExtended,
} from "@/types/shared-content";
import type { NewsArticleListItem } from "@/types/news";
import { usePagination } from "@/hooks/use-pagination";
import { ContentSidebar } from "./content-sidebar";
import { ContentPulseIndicator } from "./content-pulse-indicator";
import { LoadMoreButton } from "./load-more-button";
import { NewsHubArticleCard } from "@/components/news-hub/news-hub-article-card";
import { ProjectListCard } from "@/components/projects/project-list-card";
```

- [ ] **Step 2.2: Add `usePathname` call inside the component function**

Directly after the function signature opening brace, before `usePagination`, add one line:

```tsx
export function ContentGridLayout<T extends ContentListItem>({
  items,
  sidebarCards,
  cardType,
  title,
  initialCount = 4,
  batchSize = 3,
  showLiveIndicator = true,
  itemLabel = "item",
  itemLabelPlural = "items",
  emptyMessage = "No content available yet.",
  sidebarTitle = "Strategic Modules",
  sidebarDescription = "Campaigns, social proof, partnerships, and customer reviews.",
  slider,
}: ContentGridLayoutProps<T>) {
  const pathname = usePathname();

  const {
    visibleItems,
    hasMore,
    remainingCount,
    isLoading: isPaginationLoading,
    loadMore,
    totalCount,
  } = usePagination({
    items,
    initialCount,
    batchSize,
  });
```

- [ ] **Step 2.3: Delete the early-return empty guard (lines 114–129)**

Remove this entire block:

```tsx
  // Empty state
  if (items.length === 0) {
    return (
      <div className="grid gap-12 xl:grid-cols-[minmax(0,3fr)_minmax(280px,320px)] xl:items-start">
        <div className="rounded-3xl border border-border/50 bg-card/60 p-8 text-sm text-foreground">
          {emptyMessage}
        </div>
        <ContentSidebar
          cards={sidebarCards}
          title={sidebarTitle}
          description={sidebarDescription}
          showLiveIndicator={showLiveIndicator}
        />
      </div>
    );
  }
```

- [ ] **Step 2.4: Replace the main return with the restructured version**

Replace the entire existing `return (...)` statement with:

```tsx
  return (
    <div className="grid gap-12 xl:grid-cols-[minmax(0,3fr)_minmax(280px,320px)] xl:items-start">
      {/* Main Feed Column */}
      <div className="min-w-0 space-y-2">
        {/* Slider — direct child of space-y-2, above eyebrow */}
        {slider}

        <div className="space-y-4">
          {/* Header */}
          <div className="flex items-center justify-between gap-4 px-1">
            <div>
              {showLiveIndicator && (
                <ContentPulseIndicator label="Live Feed" variant="live" />
              )}
              {typeof title === "string" ? (
                <h2 className="mt-2 text-2xl font-bold text-foreground sm:text-3xl">
                  {title}
                </h2>
              ) : (
                <div className="mt-2">{title}</div>
              )}
            </div>
            <div className="flex flex-col items-end gap-1">
              <span className="font-mono text-[10px] uppercase font-bold tracking-[0.2em] text-electric-cyan">
                {totalCount} {totalCount === 1 ? itemLabel : itemLabelPlural}
              </span>
            </div>
          </div>

          {/* Content List or Enhanced Empty State */}
          {items.length === 0 ? (
            <div className="rounded-3xl border border-border/50 bg-card/60 p-8 space-y-3">
              <h3 className="text-base font-semibold text-foreground">
                No {itemLabelPlural} yet
              </h3>
              <p className="text-sm text-foreground/70">{emptyMessage}</p>
              {slider && (
                <Link
                  href={pathname}
                  scroll={false}
                  className="mt-2 inline-flex items-center gap-1.5 rounded-lg border border-electric-cyan/30 bg-electric-cyan/10 px-4 py-2 font-mono text-[10px] uppercase tracking-[0.18em] text-electric-cyan transition-all hover:bg-electric-cyan/20"
                >
                  View all {itemLabelPlural} →
                </Link>
              )}
            </div>
          ) : (
            <div
              className="space-y-4"
              role="feed"
              aria-busy={isPaginationLoading}
            >
              {visibleItems.map((item, index) => (
                <motion.div
                  key={item.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05, duration: 0.3 }}
                >
                  {renderCardByType(item, cardType)}
                </motion.div>
              ))}
            </div>
          )}

          {/* Load More / End State — only when items exist */}
          {items.length > 0 &&
            (hasMore ? (
              <LoadMoreButton
                onLoadMore={loadMore}
                remainingCount={remainingCount}
                isLoading={isPaginationLoading}
                itemLabel={itemLabel}
                itemLabelPlural={itemLabelPlural}
              />
            ) : totalCount > initialCount ? (
              <div
                className="py-6 text-center font-mono text-[10px] uppercase tracking-[0.2em] text-foreground"
                role="status"
                aria-live="polite"
              >
                All {totalCount} {itemLabelPlural} loaded
              </div>
            ) : null)}
        </div>
      </div>

      {/* Sidebar */}
      <ContentSidebar
        cards={sidebarCards}
        title={sidebarTitle}
        description={sidebarDescription}
        showLiveIndicator={showLiveIndicator}
      />
    </div>
  );
```

- [ ] **Step 2.5: TypeScript check**

```bash
pnpm typecheck
```

Expected: 0 errors. If errors appear they will be in `content-grid-layout.tsx` — check that `Link` is imported from `"next/link"` and `usePathname` from `"next/navigation"`.

---

## Task 3: Fix `news-grid-layout.tsx` — defensive, same pattern

No empty News Hub category exists today — this is a forward-looking fix so the same regression cannot occur when content gaps appear.

**Files:**
- Modify: `components/news-hub/news-grid-layout.tsx`

- [ ] **Step 3.1: Add `Link` and `usePathname` imports**

In `components/news-hub/news-grid-layout.tsx`, add two new imports after the first import line:

```tsx
"use client";

import { useOptimistic, useTransition, type ReactNode } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";
import type { NewsArticleListItem, NewsSidebarCard } from "@/types/news";
import { NewsHubArticleCard } from "@/components/news-hub/news-hub-article-card";
import { NewsHubSidebar } from "@/components/news-hub/news-hub-sidebar";
import { NewsPulseIndicator } from "./news-pulse-indicator";
import { LoadMoreButton } from "./load-more-button";
import { NewsHubCategorySlider } from "./news-hub-category-slider";
import { useNewsPagination } from "@/hooks/use-news-pagination";
```

- [ ] **Step 3.2: Add `usePathname` call at the top of the function body**

Inside `NewsGridLayout`, add `const pathname = usePathname();` as the first line before the `useNewsPagination` call:

```tsx
export function NewsGridLayout({
  items,
  sidebarCards,
  initialCount = 4,
  batchSize = 3,
  title = "Latest Articles",
  showLiveIndicator = true,
  emptyMessage = "No stories available in this category yet.",
  showSlider,
}: NewsGridLayoutProps) {
  const pathname = usePathname();

  const {
    visibleItems,
    hasMore,
    remainingCount,
    isLoading: isPaginationLoading,
    loadMore,
    totalCount,
  } = useNewsPagination({
    items,
    initialCount,
    batchSize,
  });
```

- [ ] **Step 3.3: Delete the early-return empty guard (lines 72–81)**

Remove this entire block:

```tsx
  // Empty state
  if (items.length === 0) {
    return (
      <div className="grid gap-12 lg:grid-cols-[minmax(0,3fr)_minmax(280px,320px)] lg:items-start">
        <div className="min-w-0 rounded-3xl border border-border/50 bg-card/60 p-8 text-sm text-muted-foreground">
          {emptyMessage}
        </div>
        <NewsHubSidebar cards={sidebarCards} />
      </div>
    );
  }
```

- [ ] **Step 3.4: Replace the `{/* Article List */}` + `{/* Load More */}` blocks with the conditional form**

Find and replace from `{/* Article List */}` through the closing `{/* Load More / End State */}` block (lines 114–152). Replace with:

```tsx
        {/* Content List or Enhanced Empty State */}
        {items.length === 0 ? (
          <div className="rounded-3xl border border-border/50 bg-card/60 p-8 space-y-3">
            <h3 className="text-base font-semibold text-foreground">
              No stories yet
            </h3>
            <p className="text-sm text-foreground/70">{emptyMessage}</p>
            {showSlider !== false && (
              <Link
                href={pathname}
                scroll={false}
                className="mt-2 inline-flex items-center gap-1.5 rounded-lg border border-electric-cyan/30 bg-electric-cyan/10 px-4 py-2 font-mono text-[10px] uppercase tracking-[0.18em] text-electric-cyan transition-all hover:bg-electric-cyan/20"
              >
                View all stories →
              </Link>
            )}
          </div>
        ) : (
          <div className="space-y-4" role="feed" aria-busy={isPaginationLoading}>
            {visibleItems.map((item, index) => (
              <motion.article
                key={item.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05, duration: 0.3 }}
              >
                <NewsHubArticleCard
                  item={item}
                  isPending={isSavePending}
                  isSaved={optimisticSavedIds.includes(item.id)}
                  onToggleSave={() => {
                    startSaveTransition(() => {
                      toggleSavedOptimistically(item.id);
                    });
                  }}
                />
              </motion.article>
            ))}
          </div>
        )}

        {/* Load More / End State — only when items exist */}
        {items.length > 0 &&
          (hasMore ? (
            <LoadMoreButton
              onLoadMore={loadMore}
              remainingCount={remainingCount}
              isLoading={isPaginationLoading}
            />
          ) : totalCount > initialCount ? (
            <div
              className="py-6 text-center font-mono text-[10px] uppercase tracking-[0.2em] text-foreground/50"
              role="status"
              aria-live="polite"
            >
              All {totalCount} stories loaded
            </div>
          ) : null)}
```

- [ ] **Step 3.5: TypeScript check**

```bash
pnpm typecheck
```

Expected: 0 errors.

---

## Task 4: Build gate + full test suite

- [ ] **Step 4.1: Full build gate**

```bash
pnpm typecheck && pnpm build
```

Expected: 0 TypeScript errors, all pages build (same page count as before the change).

- [ ] **Step 4.2: Run the 4 new Playwright tests — expect all PASS**

```bash
PLAYWRIGHT_REUSE_SERVER=true pnpm test:e2e --reporter=list -- --grep "community category|empty category|slider remains usable"
```

Expected: 4 PASS.

- [ ] **Step 4.3: Run the full Playwright suite — check for regressions**

```bash
PLAYWRIGHT_REUSE_SERVER=true pnpm test:e2e --reporter=list
```

Expected: all previously passing tests still pass + 4 new tests pass, 0 failures.

- [ ] **Step 4.4: Run Vitest unit suite**

```bash
pnpm test
```

Expected: same count as before (no unit tests touch these files; confirm no regressions).

---

## Task 5: Commit

- [ ] **Step 5.1: Stage the three changed files and commit**

```bash
git add components/shared/content-grid-layout.tsx components/news-hub/news-grid-layout.tsx e2e/projects-category-slider.spec.ts
git commit -m "$(cat <<'EOF'
fix: retain category slider + header when category has zero items

ContentGridLayout and NewsGridLayout both had an early-return empty guard
that stripped the slider, eyebrow, animated title, and count badge when
items.length === 0. Community (0 projects) left users stranded with no
navigation. Header/slider shell now renders unconditionally; only the feed
area is gated on items.length. Enhanced empty-state card adds h3 headline,
description, and a View-all CTA link (suppressed on pages with no slider
prop). NewsGridLayout fix is defensive — no News Hub category is empty today.

Co-Authored-By: Claude Sonnet 4.6 <noreply@anthropic.com>
EOF
)"
```

---

## Task 6: Docker memory + Obsidian sync

Run these via the Docker MCP tools (`mcp__MCP_DOCKER__memory_reference__*` and `mcp__MCP_DOCKER__obsidian__*`).

- [ ] **Step 6.1: Search first — confirm no duplicate entities**

```bash
pnpm docker:mcp:memory:search "fix-content-grid-empty-state-nav"
pnpm docker:mcp:memory:search "learn-content-grid-empty-state-strips-nav"
```

Expected: empty results for both.

- [ ] **Step 6.2: Create `fix-content-grid-empty-state-nav` feature entity**

Via `mcp__MCP_DOCKER__memory_reference__create_entities`:

```json
{
  "entities": [{
    "name": "fix-content-grid-empty-state-nav",
    "entityType": "feature",
    "observations": [
      "Status: COMPLETE",
      "Branch: fix/content-grid-empty-state-nav",
      "Files: components/shared/content-grid-layout.tsx, components/news-hub/news-grid-layout.tsx, e2e/projects-category-slider.spec.ts",
      "Fix: removed early-return empty guard that stripped slider/header when items.length === 0",
      "Enhanced empty-state card: h3 + description + CTA Link chip (suppressed when no slider prop)",
      "CTA uses usePathname() + <Link scroll={false}> — strips ?category param, route-agnostic",
      "NewsGridLayout fix is defensive — no empty News Hub categories today",
      "Spec: docs/superpowers/specs/2026-05-08-content-grid-empty-state-nav-fix-design.md",
      "Plan: docs/superpowers/plans/2026-05-08-content-grid-empty-state-nav-fix.md",
      "Tests: 4 new Playwright tests in e2e/projects-category-slider.spec.ts — all passing"
    ]
  }]
}
```

- [ ] **Step 6.3: Create `learn-content-grid-empty-state-strips-nav` learning entity**

Via `mcp__MCP_DOCKER__memory_reference__create_entities`:

```json
{
  "entities": [{
    "name": "learn-content-grid-empty-state-strips-nav",
    "entityType": "learning",
    "observations": [
      "insight: ContentGridLayout and NewsGridLayout early-return empty guards strip navigation context — slider, eyebrow, animated title, and count badge all disappear when items.length === 0",
      "context: Early-return pre-dated the slider:ReactNode prop. Community (0 projects) left users stranded with no navigation.",
      "rule: Always render the full navigation shell (slider, eyebrow, title, count) unconditionally. Only gate the content feed area on items.length.",
      "how-to-apply: Any shared layout component that accepts a slider/nav prop must not early-return before rendering that prop. Move empty-state into the content area, not the outer wrapper.",
      "references: components/shared/content-grid-layout.tsx, components/news-hub/news-grid-layout.tsx, fix-content-grid-empty-state-nav, spec 2026-05-08"
    ]
  }]
}
```

- [ ] **Step 6.4: Add observation to `nexgen-electrical-innovations-state`**

Via `mcp__MCP_DOCKER__memory_reference__add_observations`:

```json
{
  "entityName": "nexgen-electrical-innovations-state",
  "observations": [
    "2026-05-08: fix/content-grid-empty-state-nav COMPLETE — Community (0 projects) now shows full slider + animated header + enhanced empty state with CTA",
    "Build status: passing. All e2e and vitest tests passing.",
    "Next tasks: PR review and merge, then Phase 8 Lighthouse audit"
  ]
}
```

- [ ] **Step 6.5: Create session entity**

Via `mcp__MCP_DOCKER__memory_reference__create_entities`:

```json
{
  "entities": [{
    "name": "session-2026-05-08-001",
    "entityType": "session",
    "observations": [
      "branch: main → fix/content-grid-empty-state-nav",
      "work_completed: Brainstormed + specced + planned + implemented ContentGridLayout + NewsGridLayout empty-state nav regression fix",
      "spec: docs/superpowers/specs/2026-05-08-content-grid-empty-state-nav-fix-design.md",
      "plan: docs/superpowers/plans/2026-05-08-content-grid-empty-state-nav-fix.md",
      "tests: 4 new Playwright tests — all passing",
      "build_status: passing",
      "docker_synced: true",
      "session_end_at: 2026-05-08"
    ]
  }]
}
```

- [ ] **Step 6.6: Wire relations**

Via `mcp__MCP_DOCKER__memory_reference__create_relations`:

```json
{
  "relations": [
    {
      "from": "fix-content-grid-empty-state-nav",
      "to": "feat-projects-category-slider",
      "relationType": "fixes_regression_from"
    },
    {
      "from": "learn-content-grid-empty-state-strips-nav",
      "to": "fix-content-grid-empty-state-nav",
      "relationType": "documents"
    },
    {
      "from": "session-2026-05-08-001",
      "to": "nexgen-electrical-innovations-state",
      "relationType": "updates"
    },
    {
      "from": "session-2026-05-08-001",
      "to": "fix-content-grid-empty-state-nav",
      "relationType": "implements"
    }
  ]
}
```

- [ ] **Step 6.7: Create Obsidian note**

Via `mcp__MCP_DOCKER__obsidian__*` — create note at path `Projects/Nexgen Electrical Innovations/Features/fix-content-grid-empty-state-nav.md`:

```markdown
# fix-content-grid-empty-state-nav

## Summary
Fixed category slider + header disappearing when a category has 0 items (Community on /projects).

## Root Cause
`ContentGridLayout` and `NewsGridLayout` had an early-return guard that stripped the slider,
eyebrow, animated title, and count when `items.length === 0`. The guard pre-dated the
`slider: ReactNode` prop — when added later, the empty path never received the slider.

## Fix
- Removed early-return in both components
- Header/slider shell renders unconditionally
- Enhanced empty-state card replaces the feed: `h3` headline + description + "View all" `<Link>`
- CTA uses `usePathname()` to strip `?category` — route-agnostic, works for Projects and News Hub

## References
- Spec: `docs/superpowers/specs/2026-05-08-content-grid-empty-state-nav-fix-design.md`
- Plan: `docs/superpowers/plans/2026-05-08-content-grid-empty-state-nav-fix.md`
- Docker entities: `fix-content-grid-empty-state-nav`, `learn-content-grid-empty-state-strips-nav`
- Tests: `e2e/projects-category-slider.spec.ts` (4 new tests)
- Related: `feat-projects-category-slider` (original slider implementation)
```
