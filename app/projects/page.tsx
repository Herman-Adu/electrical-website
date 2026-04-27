import type { Metadata } from "next";
import { Footer } from "@/components/sections/footer";
import {
  ProjectsHero,
  ProjectsFeaturedCard,
  ProjectsBentoGrid,
} from "@/components/projects";
import { ContentGridLayout, ContentBreadcrumb, SectionIntro } from "@/components/shared";
import {
  getFeaturedProjectByCategory,
  getProjectListItemsExtended,
  isProjectCategorySlug,
  projectBentoItems,
  projectCategories,
  projectsIntroData,
} from "@/data/projects";
import { getProjectsSidebarCards } from "@/data/shared/sidebar-cards";
import { createProjectsListMetadata } from "@/lib/metadata-projects";
import { safeValidateProjectsParams } from "@/lib/actions/validate-search-params";
import type { ProjectCategorySlug } from "@/types/projects";

export const metadata: Metadata = createProjectsListMetadata();

export default async function ProjectsPage({
  searchParams,
}: {
  searchParams?: Promise<{ category?: string | string[] }>;
}) {
  const resolvedSearchParams = await searchParams;

  // Validate search params with Zod schema
  const validatedParams = await safeValidateProjectsParams(
    resolvedSearchParams || {},
  );

  const categoryParam = validatedParams.category;

  const activeCategory: ProjectCategorySlug =
    categoryParam && isProjectCategorySlug(categoryParam)
      ? categoryParam
      : "all";

  const featuredProject = getFeaturedProjectByCategory(activeCategory);
  const projectListItems = getProjectListItemsExtended(activeCategory);
  const sidebarCards = getProjectsSidebarCards(activeCategory);

  return (
    <main className="relative">
      <ProjectsHero
        categories={projectCategories}
        activeCategory={activeCategory}
      />

      <ContentBreadcrumb
        items={[
          { label: "Home", href: "/" },
          { label: "Projects", href: "/projects", isCurrent: true },
        ]}
        section="projects"
      />

      <SectionIntro data={projectsIntroData} />

      <section id="projects-grid" className="section-padding bg-background">
        <div className="section-content max-w-xl">
          {featuredProject ? (
            <>
              <div className="flex items-center gap-3 mb-8">
                <div className="h-px w-8 bg-[hsl(174_100%_35%)] dark:bg-electric-cyan" />
                <span className="font-mono text-xs tracking-widest uppercase font-bold text-[hsl(174_100%_35%)] dark:text-electric-cyan">
                  Featured Project
                </span>
                <div className="w-1.5 h-1.5 rounded-full bg-[hsl(174_100%_35%)] dark:bg-electric-cyan animate-pulse" />
              </div>
              <ProjectsFeaturedCard project={featuredProject} />
            </>
          ) : null}
        </div>
      </section>
      <section className="section-container bg-background">
        <div className="section-content max-w-6xl">
          <ProjectsBentoGrid items={projectBentoItems} />
        </div>
      </section>
      <section className="section-container section-padding bg-background">
        <div className="section-content max-w-7xl">
          <ContentGridLayout
            items={projectListItems}
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
      <Footer />
    </main>
  );
}
