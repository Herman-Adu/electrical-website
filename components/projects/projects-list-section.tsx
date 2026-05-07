"use client";

import { useAnimatedBorders, AnimatedBorders } from "@/lib/use-animated-borders";
import type { ProjectListItemExtended } from "@/types/shared-content";
import type { SidebarCard } from "@/types/shared-content";
import { ContentGridLayout } from "@/components/shared";
import { ProjectCategorySlider } from "./project-category-slider";
import { ProjectCategoryTitle } from "./project-category-title";

interface ProjectsListSectionProps {
  items: ProjectListItemExtended[];
  sidebarCards: SidebarCard[];
  counts: Record<string, number>;
}

export function ProjectsListSection({
  items,
  sidebarCards,
  counts,
}: ProjectsListSectionProps) {
  const { sectionRef, lineScale, lineScaleBottom, shouldReduce } = useAnimatedBorders();

  return (
    <section
      ref={sectionRef}
      className="relative section-container section-padding bg-background"
    >
      <AnimatedBorders
        shouldReduce={shouldReduce}
        lineScale={lineScale}
        lineScaleBottom={lineScaleBottom}
        showBottom={true}
      />
      <ProjectCategorySlider counts={counts} />
      <div className="section-content max-w-7xl">
        <div className="mb-8">
          <ProjectCategoryTitle />
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
