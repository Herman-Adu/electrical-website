import type { Metadata } from "next";
import { Footer } from "@/components/sections/footer";
import {
  ProjectsHero,
  ProjectsFeaturedSection,
  ProjectsBentoGrid,
} from "@/components/projects";
import { ContentBreadcrumb, SectionIntro } from "@/components/shared";
import {
  projectBentoItems,
  projectCategories,
  projectsIntroData,
  allProjects,
  getFeaturedProjectByCategory,
} from "@/data/projects";
import { createProjectsListMetadata } from "@/lib/metadata-projects";
import { ProjectsListWithFilter } from "@/components/projects/projects-list-with-filter";

export const metadata: Metadata = createProjectsListMetadata();

export default async function ProjectsPage() {
  const featuredProject = getFeaturedProjectByCategory("all");

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

      <ProjectsListWithFilter
        sectors={projectCategories.filter((c) => c.isSector)}
        allProjects={allProjects}
      />

      <Footer />
    </main>
  );
}
