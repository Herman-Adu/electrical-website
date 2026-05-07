"use client";

import {
  useAnimatedBorders,
  AnimatedBorders,
} from "@/lib/use-animated-borders";
import type { ProjectListItemExtended } from "@/types/shared-content";
import type { SidebarCard } from "@/types/shared-content";
import { ContentGridLayout } from "@/components/shared";
import { ProjectCategoryTitle } from "./project-category-title";
import { ProjectCategorySlider } from "./project-category-slider";

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
  const { sectionRef, lineScale, lineScaleBottom, shouldReduce } =
    useAnimatedBorders();

  return (
    <section
      ref={sectionRef}
      className="relative section-padding bg-background"
    >
      <AnimatedBorders
        shouldReduce={shouldReduce}
        lineScale={lineScale}
        lineScaleBottom={lineScaleBottom}
        showBottom={true}
      />
      <div className="section-content max-w-7xl">
        <ContentGridLayout
          items={items}
          sidebarCards={sidebarCards}
          cardType="project"
          title={<ProjectCategoryTitle />}
          slider={<ProjectCategorySlider counts={counts} />}
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
