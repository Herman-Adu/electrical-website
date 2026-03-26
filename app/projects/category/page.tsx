import type { Metadata } from "next";
import Link from "next/link";
import { projectCategories } from "@/data/projects";
import { createProjectCategoriesMetadata } from "@/lib/metadata-projects";

export const metadata: Metadata = createProjectCategoriesMetadata();

export default function ProjectCategoriesPage() {
  return (
    <main className="relative">
      <section className="section-container section-safe-top section-safe-bottom bg-background">
        <div className="section-content max-w-5xl">
          {/* Breadcrumb */}
          <div className="mb-6">
            <Link
              href="/projects"
              className="font-mono text-[10px] uppercase tracking-[0.14em] text-electric-cyan/80 hover:text-electric-cyan"
            >
              ← All Projects
            </Link>
          </div>

          {/* Header */}
          <div className="mb-12">
            <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-electric-cyan mb-3">
              Browse by Sector
            </p>
            <h1 className="text-3xl sm:text-4xl font-bold text-foreground mb-4">
              Project Categories
            </h1>
            <p className="text-muted-foreground max-w-lg">
              Explore our portfolio organised by sector. Each category
              represents a distinct area of electrical expertise.
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
    </main>
  );
}
