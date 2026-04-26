"use client";

import {
  useAnimatedBorders,
  //AnimatedBorders,
} from "@/lib/use-animated-borders";
import { ContentSidebar } from "@/components/shared";
import type { SidebarCard } from "@/types/shared-content";

export interface ProjectSupplementalSectionProps {
  tags?: string[];
  cards: SidebarCard[];
}

export function ProjectSupplementalSection({
  tags,
  cards,
}: ProjectSupplementalSectionProps) {
  const hasTags = tags && tags.length > 0;
  const hasCards = cards.length > 0;

  const { sectionRef, lineScale, shouldReduce } = useAnimatedBorders();

  if (!hasTags && !hasCards) {
    return null;
  }

  return (
    <section
      id="get-started"
      ref={sectionRef}
      className="relative overflow-hidden mt-6"
    >
      {/* <AnimatedBorders
        shouldReduce={shouldReduce}
        lineScale={lineScale}
        showBottom={false}
      /> */}

      {/* Inner wrapper — pt-6 gives breathing room between the border line and
          content without shifting the scroll anchor position */}
      <div className="pt-6 flex flex-col gap-6">
        {/* Tags */}
        {hasTags && (
          <div className="space-y-3">
            <h3 className="font-mono text-[10px] uppercase font-bold tracking-[0.2em] text-electric-cyan/70 dark:text-electric-cyan/70">
              Project Tags
            </h3>
            <div className="flex flex-wrap gap-2">
              {tags.map((tag) => (
                <span
                  key={tag}
                  className="rounded-md border border-[hsl(174_100%_35%)]/20 dark:border-electric-cyan/20 bg-[hsl(174_100%_35%)]/5 dark:bg-electric-cyan/5 px-2 py-1 font-mono text-[9px] uppercase tracking-[0.12em] darktext-foreground/60"
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Sidebar Cards */}
        {hasCards && (
          <ContentSidebar
            cards={cards}
            title="Get Started"
            description="Ready to discuss your project requirements?"
            showLiveIndicator={false}
          />
        )}
      </div>
    </section>
  );
}
