import type { Metadata } from "next";
import Link from "next/link";
import { projectCategories } from "@/data/projects";
import { createProjectCategoriesMetadata } from "@/lib/metadata-projects";
import { ProjectsCategoriesHero } from "@/components/projects/projects-categories-hero";
import { ContentBreadcrumb } from "@/components/shared";
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

      {/* Categories grid */}
      <section id="categories-grid" className="section-standard bg-background">
        <div className="section-content max-w-5xl">
          {/* Section header */}
          <div className="mb-10">
            <div className="flex items-center gap-4 mb-4">
              <span className="h-px w-10 bg-electric-cyan/50" />
              <span className="font-mono text-[10px] tracking-[0.2em] uppercase text-electric-cyan/70">
                Specialist Sectors
              </span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold text-foreground mb-2">
              Choose a Category
            </h2>
            <p className="text-muted-foreground max-w-lg">
              Each sector represents a distinct area of electrical expertise.
              Select a category to explore the projects we&apos;ve delivered.
            </p>
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
