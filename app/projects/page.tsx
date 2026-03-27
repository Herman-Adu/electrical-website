import type { Metadata } from "next";
import { Footer } from "@/components/sections/footer";
import {
  ProjectsHero,
  ProjectsFeaturedCard,
  ProjectsBentoGrid,
  ProjectsOptimisticList,
} from "@/components/projects";
import {
  getFeaturedProjectByCategory,
  getProjectListItemsByCategory,
  isProjectCategorySlug,
  projectBentoItems,
  projectCategories,
} from "@/data/projects";
import { createProjectsListMetadata } from "@/lib/metadata-projects";
import type { ProjectCategorySlug } from "@/types/projects";

export const metadata: Metadata = createProjectsListMetadata();

export default async function ProjectsPage({
  searchParams,
}: {
  searchParams?: Promise<{ category?: string | string[] }>;
}) {
  const resolvedSearchParams = await searchParams;
  const categoryParamValue = resolvedSearchParams?.category;
  const categoryParam = Array.isArray(categoryParamValue)
    ? categoryParamValue[0]
    : categoryParamValue;

  const activeCategory: ProjectCategorySlug =
    categoryParam && isProjectCategorySlug(categoryParam)
      ? categoryParam
      : "all";

  const featuredProject = getFeaturedProjectByCategory(activeCategory);
  const projectListItems = getProjectListItemsByCategory(activeCategory);

  return (
    <main className="relative">
      <ProjectsHero
        categories={projectCategories}
        activeCategory={activeCategory}
      />
      <section id="projects-grid" className="section-standard bg-background">
        <div className="section-content max-w-6xl">
          {featuredProject ? (
            <ProjectsFeaturedCard project={featuredProject} />
          ) : null}
        </div>
      </section>
      <section className="section-container section-padding-sm bg-background">
        <div className="section-content max-w-6xl">
          <ProjectsBentoGrid items={projectBentoItems} />
        </div>
      </section>
      <section className="section-container section-padding bg-background">
        <div className="section-content max-w-6xl">
          <ProjectsOptimisticList items={projectListItems} />
        </div>
      </section>
      <Footer />
    </main>
  );
}
