"use client";

import { useAnimatedBorders, AnimatedBorders } from "@/lib/use-animated-borders";
import type { NewsArticleListItem, NewsSidebarCard } from "@/types/news";
import { NewsGridLayout } from "./news-grid-layout";

interface NewsHubGridSectionProps {
  items: NewsArticleListItem[];
  sidebarCards: NewsSidebarCard[];
}

export function NewsHubGridSection({ items, sidebarCards }: NewsHubGridSectionProps) {
  const { sectionRef, lineScale, lineScaleBottom, shouldReduce } = useAnimatedBorders();

  return (
    <section
      id="news-hub-feed"
      ref={sectionRef}
      className="relative overflow-hidden section-container section-padding bg-background"
    >
      <AnimatedBorders
        shouldReduce={shouldReduce}
        lineScale={lineScale}
        lineScaleBottom={lineScaleBottom}
        showBottom={true}
      />
      <div className="section-content max-w-6xl">
        <div className="flex items-center gap-3 mb-8">
          <div className="h-px w-8 bg-[hsl(174_100%_35%)] dark:bg-electric-cyan" />
          <span className="font-mono text-xs tracking-widest uppercase font-bold text-[hsl(174_100%_35%)] dark:text-electric-cyan">
            Latest Articles
          </span>
          <div className="w-1.5 h-1.5 rounded-full bg-[hsl(174_100%_35%)] dark:bg-electric-cyan animate-pulse" />
        </div>
        <NewsGridLayout
          items={items}
          sidebarCards={sidebarCards}
          title="Latest Articles"
          initialCount={4}
          batchSize={3}
        />
      </div>
    </section>
  );
}
