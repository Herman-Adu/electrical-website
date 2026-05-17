"use client";

import {
  useAnimatedBorders,
  AnimatedBorders,
} from "@/lib/use-animated-borders";
import type { ProjectListItemExtended, SidebarCard } from "@/types/shared-content";
import type { ProjectCategory } from "@/types/projects";
import { ContentGridLayout } from "@/components/shared";
import { ProjectCategoryTitle } from "./project-category-title";
import { ProjectCategorySlider } from "./project-category-slider";

interface ProjectCategoryListSectionProps {
  items: ProjectListItemExtended[];
  sidebarCards: SidebarCard[];
  counts: Record<string, number>;
  category: ProjectCategory;
  categorySlug: string;
}

export function ProjectCategoryListSection({
  items,
  sidebarCards,
  counts,
  category,
  categorySlug,
}: ProjectCategoryListSectionProps) {
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
          title={<ProjectCategoryTitle label={category.label} />}
          slider={
            <ProjectCategorySlider
              counts={counts}
              activeSlug={categorySlug}
              categoryBasePath="/projects/category"
            />
          }
          itemLabel="project"
          itemLabelPlural="projects"
          emptyMessage={`Nexgen ${category.label} projects coming soon — this section is actively growing.`}
          sidebarTitle={`${category.label} Resources`}
          sidebarDescription={`Guides, consultations, and resources for ${category.label.toLowerCase()} projects.`}
        />
      </div>
    </section>
  );
}
