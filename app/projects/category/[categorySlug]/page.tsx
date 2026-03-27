import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  getCategoryBySlug,
  getCategorySlugs,
  getProjectsByCategory,
} from "@/data/projects";
import { createProjectCategoryMetadata } from "@/lib/metadata-projects";

export const revalidate = 86400; // 24 hours
import {
  ProjectCategoryHero,
  ProjectCardShell,
  ProjectStatusBadge,
  ProjectMetaRow,
} from "@/components/projects";

export async function generateStaticParams(): Promise<
  { categorySlug: string }[]
> {
  return getCategorySlugs().map((categorySlug) => ({ categorySlug }));
}

export const dynamicParams = false;

export async function generateMetadata({
  params,
}: {
  params: Promise<{ categorySlug: string }>;
}): Promise<Metadata> {
  const { categorySlug } = await params;
  const category = getCategoryBySlug(categorySlug);

  if (!category) {
    return {
      title: "Category Not Found | Nexgen Electrical Innovations",
    };
  }

  return createProjectCategoryMetadata(category);
}

export default async function CategoryProjectsPage({
  params,
}: {
  params: Promise<{ categorySlug: string }>;
}) {
  const { categorySlug } = await params;

  const category = getCategoryBySlug(categorySlug);
  if (!category) notFound();

  const projects = getProjectsByCategory(category.slug);

  return (
    <main className="relative">
      {/* Hero Section */}
      <ProjectCategoryHero category={category} projectCount={projects.length} />

      {/* Projects Section */}
      <section
        id="category-projects"
        className="section-standard bg-background"
      >
        <div className="section-content max-w-5xl">
          {/* Section Header */}
          <div className="mb-10">
            <div className="flex items-center gap-4 mb-4">
              <span className="h-px w-10 bg-electric-cyan/50" />
              <span className="font-mono text-[10px] tracking-[0.2em] uppercase text-electric-cyan/70">
                Project Catalogue
              </span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold text-foreground mb-2">
              {category.label} Projects
            </h2>
            <p className="text-muted-foreground max-w-lg">
              Browse our portfolio of {category.label.toLowerCase()} electrical
              projects delivered to the highest standards.
            </p>
          </div>

          {/* Project Grid */}
          {projects.length === 0 ? (
            <div className="rounded-lg border border-border/50 bg-card p-10 text-center">
              <p className="text-muted-foreground text-sm">
                No projects in this category yet.
              </p>
              <Link
                href="/projects"
                className="mt-4 inline-block font-mono text-[10px] uppercase tracking-[0.14em] text-electric-cyan hover:text-electric-cyan/80 transition-colors"
              >
                View All Projects
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {projects.map((project) => (
                <Link
                  key={project.slug}
                  href={`/projects/category/${categorySlug}/${project.slug}`}
                  className="group block"
                >
                  <ProjectCardShell className="h-full p-5 group-hover:border-electric-cyan/40 group-hover:bg-electric-cyan/5 transition-all duration-200">
                    <div className="flex items-start justify-between gap-3 mb-3">
                      <h2 className="text-base font-bold text-foreground group-hover:text-electric-cyan transition-colors leading-snug">
                        {project.title}
                      </h2>
                      <ProjectStatusBadge status={project.status} />
                    </div>

                    <p className="text-sm text-muted-foreground leading-relaxed mb-4 line-clamp-2">
                      {project.description}
                    </p>

                    <div className="space-y-1">
                      <ProjectMetaRow
                        label="Sector"
                        value={project.clientSector}
                      />
                      <ProjectMetaRow
                        label="Location"
                        value={project.kpis.location}
                      />
                      <ProjectMetaRow
                        label="Budget"
                        value={project.kpis.budget}
                      />
                    </div>

                    {project.progress < 100 && (
                      <div className="mt-4">
                        <div className="flex items-center justify-between mb-1">
                          <span className="font-mono text-[9px] uppercase tracking-[0.14em] text-muted-foreground">
                            Progress
                          </span>
                          <span className="font-mono text-[9px] text-electric-cyan">
                            {project.progress}%
                          </span>
                        </div>
                        <div className="h-px w-full bg-border/60">
                          <div
                            className="h-px bg-electric-cyan transition-all"
                            style={{ width: `${project.progress}%` }}
                          />
                        </div>
                      </div>
                    )}

                    <div className="mt-4 font-mono text-[10px] uppercase tracking-[0.14em] text-electric-cyan/60 group-hover:text-electric-cyan transition-colors">
                      View Details →
                    </div>
                  </ProjectCardShell>
                </Link>
              ))}
            </div>
          )}
        </div>
      </section>
    </main>
  );
}
