"use client";

import {
  useAnimatedBorders,
  AnimatedBorders,
} from "@/lib/use-animated-borders";
import type { NewsArticleListItem, NewsSidebarCard } from "@/types/news";
import { NewsGridLayout } from "./news-grid-layout";
import { NewsHubCategoryTitle } from "./news-hub-category-title";

interface NewsHubGridSectionProps {
  items: NewsArticleListItem[];
  sidebarCards: NewsSidebarCard[];
  counts: Record<string, number>;
}

export function NewsHubGridSection({
  items,
  sidebarCards,
  counts,
}: NewsHubGridSectionProps) {
  const { sectionRef, lineScale, lineScaleBottom, shouldReduce } =
    useAnimatedBorders();

  // Sticky chip rail (NewsHubCategorySlider, rendered inside <NewsGridLayout>)
  // requires NO `overflow: hidden` ancestor between itself and the viewport.
  // The conventional `overflow-hidden` is intentionally OMITTED here:
  //   - AnimatedBorders self-clips: each border has its own `overflow-hidden`
  //     wrapper around its gradient (see lib/use-animated-borders.tsx), so the
  //     section does not need to clip them.
  //   - `section-container` is also dropped (it injects `overflow: hidden`).
  //   - Horizontal motion entrances on children (e.g. sidebar `x: 20 → 0`)
  //     are still backstopped by `<body className="overflow-x-hidden">` in
  //     app/layout.tsx, so removing section-level clip cannot create page-wide
  //     horizontal scroll.
  return (
    <section
      id="news-hub-feed"
      ref={sectionRef}
      className="relative section-padding bg-background"
    >
      <AnimatedBorders
        shouldReduce={shouldReduce}
        lineScale={lineScale}
        lineScaleBottom={lineScaleBottom}
        showBottom={true}
      />
      <div className="section-content max-w-6xl">
        <NewsGridLayout
          items={items}
          sidebarCards={sidebarCards}
          counts={counts}
          title={<NewsHubCategoryTitle />}
          initialCount={4}
          batchSize={3}
        />
      </div>
    </section>
  );
}
