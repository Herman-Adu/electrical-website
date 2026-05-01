import type { Metadata } from "next";
import { projectCategories, categoriesIntroData, allProjects } from "@/data/projects";
import { workTypes } from "@/data/projects/work-types";
import { createProjectCategoriesMetadata } from "@/lib/metadata-projects";
import { ProjectsCategoriesHero } from "@/components/projects/projects-categories-hero";
import { ContentBreadcrumb, SectionIntro } from "@/components/shared";
import { Footer } from "@/components/sections/footer";
import { SectorCard } from "@/components/projects/sector-card";
import { WorkTypeFilter } from "@/components/projects/work-type-filter";

export const metadata: Metadata = createProjectCategoriesMetadata();

export const revalidate = 86400; // 24 hours

export default function ProjectCategoriesPage() {
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

      {/* Zone 1 — Specialist Sectors */}
      <section id="categories-grid" className="section-standard bg-background">
        <div className="section-content max-w-5xl">
          {/* Eyebrow */}
          <div className="flex items-center gap-3 mb-8">
            <div className="h-px w-8 bg-[hsl(174_100%_35%)] dark:bg-electric-cyan" />
            <span className="font-mono text-xs tracking-widest uppercase font-bold text-[hsl(174_100%_35%)] dark:text-electric-cyan">
              Specialist Sectors
            </span>
            <div className="w-1.5 h-1.5 rounded-full bg-[hsl(174_100%_35%)] dark:bg-electric-cyan animate-pulse" />
          </div>

          {/* Sector Cards 2x2 grid */}
          <div className="grid gap-5 sm:grid-cols-2">
            {projectCategories
              .filter((c) => c.isSector)
              .map((category) => {
                const catProjects = allProjects
                  .filter((p) => p.category === category.slug)
                  .sort((a, b) =>
                    b.publishedAt.localeCompare(a.publishedAt)
                  );
                const mostRecent = catProjects[0];
                return (
                  <SectorCard
                    key={category.slug}
                    category={category}
                    projectCount={catProjects.length}
                    recentProjectTitle={mostRecent?.title ?? "Coming soon"}
                    coverImageSrc={
                      mostRecent?.coverImage.src ?? "/images/services-industrial.jpg"
                    }
                    coverImageAlt={
                      mostRecent?.coverImage.alt ?? category.label
                    }
                  />
                );
              })}
          </div>
        </div>
      </section>

      {/* Zone 2 — Work Types */}
      <section className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 pb-16">
        <h2 className="text-xl font-semibold mb-2 text-foreground">Browse by Work Type</h2>
        <p className="text-sm text-muted-foreground mb-4">
          Filter across all sectors by the type of electrical work
        </p>
        <WorkTypeFilter workTypes={workTypes} />
      </section>
      <Footer />
    </main>
  );
}
