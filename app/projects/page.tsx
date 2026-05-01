import { Suspense } from "react";
import type { Metadata } from "next";
import { Footer } from "@/components/sections/footer";
import {
  ProjectsHero,
  ProjectsFeaturedSection,
  ProjectsBentoGrid,
} from "@/components/projects";
import { ContentBreadcrumb, SectionIntro } from "@/components/shared";
import {
  getFeaturedProjectByCategory,
  getProjectListItemsExtended,
  projectBentoItems,
  projectCategories,
  projectsIntroData,
  allProjects,
} from "@/data/projects";
import { getProjectsSidebarCards } from "@/data/shared/sidebar-cards";
import { createProjectsListMetadata } from "@/lib/metadata-projects";
import { ProjectListSkeleton } from "@/components/projects/project-list-skeleton";
import { ProjectsFilterClient } from "@/components/projects/projects-filter-client";

export const experimental_ppr = true;

export const metadata: Metadata = createProjectsListMetadata();

export default async function ProjectsPage() {
  const allItems = getProjectListItemsExtended();
  const sidebarCards = getProjectsSidebarCards();
  const featuredProject = getFeaturedProjectByCategory("all");
  const sectors = projectCategories.filter((c) => c.isSector);
  const counts: Record<string, number> = {
    all: allProjects.length,
    ...Object.fromEntries(
      sectors.map((s) => [
        s.slug,
        allProjects.filter((p) => p.category === s.slug).length,
      ]),
    ),
  };

  return (
    <main className="relative">
      <ProjectsHero />

      <ContentBreadcrumb
        items={[
          { label: "Home", href: "/" },
          { label: "Projects", href: "/projects", isCurrent: true },
        ]}
        section="projects"
      />

      <SectionIntro data={projectsIntroData} />

      {featuredProject ? (
        <ProjectsFeaturedSection project={featuredProject} />
      ) : null}

      <section className="section-container bg-background">
        <div className="section-content max-w-6xl">
          <ProjectsBentoGrid items={projectBentoItems} />
        </div>
      </section>

      <Suspense fallback={<ProjectListSkeleton />}>
        <ProjectsFilterClient
          sectors={sectors}
          items={allItems}
          sidebarCards={sidebarCards}
          counts={counts}
        />
      </Suspense>

      <Footer />
    </main>
  );
}
