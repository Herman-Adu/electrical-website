"use client";

import { useAnimatedBorders, AnimatedBorders } from "@/lib/use-animated-borders";
import type { NewsArticle } from "@/types/news";
import { NewsHubFeaturedCard } from "./news-hub-featured-card";

interface NewsHubFeaturedSectionProps {
  article: NewsArticle;
}

export function NewsHubFeaturedSection({ article }: NewsHubFeaturedSectionProps) {
  const { sectionRef, lineScale, shouldReduce } = useAnimatedBorders();

  return (
    <section
      ref={sectionRef}
      className="relative overflow-hidden section-padding-top bg-background"
    >
      <AnimatedBorders
        shouldReduce={shouldReduce}
        lineScale={lineScale}
        showBottom={false}
      />
      <div className="section-content max-w-6xl">
        <div className="flex items-center gap-3 mb-8">
          <div className="h-px w-8 bg-[hsl(174_100%_35%)] dark:bg-electric-cyan" />
          <span className="font-mono text-xs tracking-widest uppercase font-bold text-[hsl(174_100%_35%)] dark:text-electric-cyan">
            Featured Story
          </span>
        </div>
        <NewsHubFeaturedCard article={article} />
      </div>
    </section>
  );
}
