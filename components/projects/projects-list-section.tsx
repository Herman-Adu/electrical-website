"use client";

import { useAnimatedBorders, AnimatedBorders } from "@/lib/use-animated-borders";
import type { ProjectListItemExtended } from "@/types/shared-content";
import type { SidebarCard } from "@/types/shared-content";
import { ContentGridLayout } from "@/components/shared";

interface ProjectsListSectionProps {
  items: ProjectListItemExtended[];
  sidebarCards: SidebarCard[];
  activeCategoryLabel: string;
}

export function ProjectsListSection({
  items,
  sidebarCards,
  activeCategoryLabel,
}: ProjectsListSectionProps) {
  const { sectionRef, lineScale, lineScaleBottom, shouldReduce } = useAnimatedBorders();

  return (
    <section
      ref={sectionRef}
      className="relative overflow-hidden section-container section-padding bg-background"
    >
      <AnimatedBorders
        shouldReduce={shouldReduce}
        lineScale={lineScale}
        lineScaleBottom={lineScaleBottom}
        showBottom={true}
      />
      <div className="section-content max-w-7xl">
        <div className="flex items-center gap-3 mb-8">
          <div className="h-px w-8 bg-[hsl(174_100%_35%)] dark:bg-electric-cyan" />
          <span className="font-mono text-xs tracking-widest uppercase font-bold text-[hsl(174_100%_35%)] dark:text-electric-cyan">
            {activeCategoryLabel} Projects
          </span>
          <div className="w-1.5 h-1.5 rounded-full bg-[hsl(174_100%_35%)] dark:bg-electric-cyan animate-pulse" />
        </div>
        <ContentGridLayout
          items={items}
          sidebarCards={sidebarCards}
          cardType="project"
          title="All Projects"
          itemLabel="project"
          itemLabelPlural="projects"
          emptyMessage="No projects available in this category yet."
          sidebarTitle="Project Resources"
          sidebarDescription="Consultations, guides, and client testimonials for your project needs."
        />
      </div>
    </section>
  );
}
