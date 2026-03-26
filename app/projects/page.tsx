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
  searchParams?: Promise<{ category?: string }>;
}) {
  const resolvedSearchParams = await searchParams;
  const categoryParam = resolvedSearchParams?.category;

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
      <section className="section-container py-8">
        <div className="section-content max-w-6xl">
          {featuredProject ? (
            <ProjectsFeaturedCard project={featuredProject} />
          ) : null}
        </div>
      </section>
      <ProjectsBentoGrid items={projectBentoItems} />
      <ProjectsOptimisticList items={projectListItems} />
      <Footer />
    </main>
  );
}
