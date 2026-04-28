import type { Metadata } from "next";
import Link from "next/link";
import { projectCategories, categoriesIntroData } from "@/data/projects";
import { createProjectCategoriesMetadata } from "@/lib/metadata-projects";
import { ProjectsCategoriesHero } from "@/components/projects/projects-categories-hero";
import { ContentBreadcrumb, SectionIntro } from "@/components/shared";
import { Footer } from "@/components/sections/footer";

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

      {/* Categories grid */}
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

          {/* Category Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            {projectCategories.map((category) => (
              <Link
                key={category.slug}
                href={`/projects/category/${category.slug}`}
                className="group block rounded-lg border border-border/60 bg-card p-6 hover:border-electric-cyan/40 hover:bg-electric-cyan/5 transition-all duration-200"
              >
                <div className="mb-3">
                  <span className="inline-block font-mono text-[9px] uppercase tracking-[0.2em] text-electric-cyan/70 border border-electric-cyan/20 bg-electric-cyan/5 px-2 py-0.5 rounded-sm">
                    Category
                  </span>
                </div>
                <h2 className="text-lg font-bold text-foreground mb-2 group-hover:text-electric-cyan transition-colors">
                  {category.label}
                </h2>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {category.description}
                </p>
                <div className="mt-4 font-mono text-[10px] uppercase tracking-[0.14em] text-electric-cyan/60 group-hover:text-electric-cyan transition-colors">
                  View Projects →
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>
      <Footer />
    </main>
  );
}
