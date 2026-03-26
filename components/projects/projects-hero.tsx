import Link from "next/link";
import { cn } from "@/lib/utils";
import type { ProjectCategory, ProjectCategorySlug } from "@/types/projects";

interface ProjectsHeroProps {
  categories: ProjectCategory[];
  activeCategory: ProjectCategorySlug;
}

export function ProjectsHero({
  categories,
  activeCategory,
}: ProjectsHeroProps) {
  return (
    <section className="section-container section-safe-top section-safe-bottom bg-background">
      <div className="section-content max-w-6xl">
        <div className="mb-5 inline-flex items-center gap-3">
          <span className="h-px w-8 bg-electric-cyan/70" />
          <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-electric-cyan/80">
            Projects Portfolio
          </span>
        </div>

        <h1 className="max-w-4xl text-4xl font-black uppercase tracking-tight text-foreground sm:text-5xl lg:text-6xl">
          Engineered Delivery,
          <span className="text-electric-cyan"> Measurable Outcomes</span>
        </h1>

        <p className="mt-5 max-w-3xl text-base leading-relaxed text-muted-foreground sm:text-lg">
          A data-driven portfolio of industrial, commercial, and critical
          infrastructure electrical projects delivered with strict safety,
          quality, and performance standards.
        </p>

        <div className="mt-8 flex flex-wrap items-center gap-3">
          <Link
            href="/projects"
            className={cn(
              "rounded-lg border px-3 py-1.5 font-mono text-[10px] font-semibold uppercase tracking-[0.12em] transition-colors",
              activeCategory === "all"
                ? "border-electric-cyan/40 bg-electric-cyan/12 text-electric-cyan"
                : "border-border text-muted-foreground hover:border-electric-cyan/30 hover:text-electric-cyan",
            )}
          >
            All
          </Link>
          {categories.map((category) => (
            <Link
              key={category.slug}
              href={`/projects?category=${category.slug}`}
              className={cn(
                "rounded-lg border px-3 py-1.5 font-mono text-[10px] font-semibold uppercase tracking-[0.12em] transition-colors",
                activeCategory === category.slug
                  ? "border-electric-cyan/40 bg-electric-cyan/12 text-electric-cyan"
                  : "border-border text-muted-foreground hover:border-electric-cyan/30 hover:text-electric-cyan",
              )}
            >
              {category.label}
            </Link>
          ))}
        </div>

        <div className="mt-5 flex flex-wrap items-center gap-3">
          <Link
            href="#projects-grid"
            className="rounded-lg border border-electric-cyan/30 bg-electric-cyan/10 px-4 py-2 text-xs font-bold uppercase tracking-[0.14em] text-electric-cyan transition-colors hover:bg-electric-cyan/20"
          >
            Explore Grid
          </Link>
          <Link
            href="/contact"
            className="rounded-lg border border-border px-4 py-2 text-xs font-bold uppercase tracking-[0.14em] text-foreground transition-colors hover:border-electric-cyan/30"
          >
            Start a Project
          </Link>
        </div>
      </div>
    </section>
  );
}
