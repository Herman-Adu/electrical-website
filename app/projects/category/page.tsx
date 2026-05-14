import type { Metadata } from "next";
import {
  projectCategories,
  categoriesIntroData,
  allProjects,
} from "@/data/projects";
import { createProjectCategoriesMetadata } from "@/lib/metadata-projects";
import { ProjectsCategoriesHero } from "@/components/projects/projects-categories-hero";
import { CategoryPageLayout, ContentBreadcrumb, SectionIntro } from "@/components/shared";
import { Footer } from "@/components/sections/footer";
import { SectorCard } from "@/components/projects/sector-card";
import { ProjectsListCTA } from "@/components/projects";
import { getProjectsSidebarCards } from "@/data/shared/sidebar-cards";

export const metadata: Metadata = createProjectCategoriesMetadata();

export const revalidate = 86400; // 24 hours

export default function ProjectCategoriesPage() {
  const sidebarCards = getProjectsSidebarCards();

  return (
    <main className="relative">
      {/* Hero */}
      <ProjectsCategoriesHero categoryCount={projectCategories.length} />

      <ContentBreadcrumb
        items={[
          { label: "Home", href: "/" },
          { label: "Projects", href: "/projects" },
          { label: "Categories", href: "/projects/category", isCurrent: true },
        ]}
        section="projects"
      />

      <SectionIntro data={categoriesIntroData} />

      <CategoryPageLayout
        sidebarCards={sidebarCards}
        sidebarTitle="Project Resources"
        sidebarDescription="Consultations, guides, and client testimonials for your project needs."
        main={
          <div>
            <div className="flex items-center gap-3 mb-8">
              <div className="h-px w-8 bg-[hsl(174_100%_35%)] dark:bg-electric-cyan" />
              <span className="font-mono text-xs tracking-widest uppercase font-bold text-[hsl(174_100%_35%)] dark:text-electric-cyan">
                Specialist Sectors
              </span>
              <div className="w-1.5 h-1.5 rounded-full bg-[hsl(174_100%_35%)] dark:bg-electric-cyan animate-pulse" />
            </div>
            <div className="grid gap-5 sm:grid-cols-2">
              {projectCategories
                .filter((c) => c.isSector)
                .map((category) => {
                  const catProjects = allProjects
                    .filter((p) => p.category === category.slug)
                    .sort((a, b) => b.publishedAt.localeCompare(a.publishedAt));
                  const mostRecent = catProjects[0];
                  return (
                    <SectorCard
                      key={category.slug}
                      category={category}
                      projectCount={catProjects.length}
                      recentProjectTitle={mostRecent?.title ?? "Coming soon"}
                      coverImageSrc={mostRecent?.coverImage.src ?? "/images/services-industrial.jpg"}
                      coverImageAlt={mostRecent?.coverImage.alt ?? category.label}
                      description={category.description}
                    />
                  );
                })}
            </div>
          </div>
        }
      />

      <section className="section-container section-padding bg-background">
        <div className="section-content max-w-6xl">
          <ProjectsListCTA />
        </div>
      </section>

      <Footer />
    </main>
  );
}
