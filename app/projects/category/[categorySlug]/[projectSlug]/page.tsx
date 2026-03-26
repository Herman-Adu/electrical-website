import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  getCategoryBySlug,
  getCategorySlugs,
  getProjectByCategoryAndSlug,
  getProjectSlugsByCategory,
  allProjects,
} from "@/data/projects";
import { createProjectDetailMetadata } from "@/lib/metadata-projects";
import {
  ProjectCardShell,
  ProjectMetaRow,
  ProjectStatusBadge,
} from "@/components/projects";
import { Footer } from "@/components/sections/footer";

/**
 * Generate all [categorySlug] + [projectSlug] pairs at build time.
 * Using the flat approach: child generates full pairs in one call.
 */
export async function generateStaticParams() {
  const pairs: { categorySlug: string; projectSlug: string }[] = [];

  for (const categorySlug of getCategorySlugs()) {
    for (const projectSlug of getProjectSlugsByCategory(categorySlug)) {
      pairs.push({ categorySlug, projectSlug });
    }
  }

  return pairs;
}

export const dynamicParams = false;

export async function generateMetadata({
  params,
}: {
  params: Promise<{ categorySlug: string; projectSlug: string }>;
}): Promise<Metadata> {
  const { categorySlug, projectSlug } = await params;
  const project = getProjectByCategoryAndSlug(categorySlug, projectSlug);

  if (!project) {
    return {
      title: "Project Not Found | Nexgen Electrical Innovations",
      description: "The requested project could not be found.",
    };
  }

  return createProjectDetailMetadata(project);
}

export default async function CategoryProjectDetailPage({
  params,
}: {
  params: Promise<{ categorySlug: string; projectSlug: string }>;
}) {
  const { categorySlug, projectSlug } = await params;

  const category = getCategoryBySlug(categorySlug);
  if (!category) notFound();

  const project = getProjectByCategoryAndSlug(categorySlug, projectSlug);
  if (!project) notFound();

  const relatedProjects = allProjects
    .filter((p) => p.slug !== project.slug && p.category === categorySlug)
    .slice(0, 3);

  return (
    <main className="relative">
      <section className="section-container section-safe-top section-safe-bottom bg-background">
        <div className="section-content max-w-6xl">
          {/* Breadcrumb */}
          <nav
            aria-label="Breadcrumb"
            className="mb-6 flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.14em] text-muted-foreground flex-wrap"
          >
            <Link
              href="/projects"
              className="hover:text-electric-cyan transition-colors"
            >
              Projects
            </Link>
            <span className="text-muted-foreground/40">/</span>
            <Link
              href="/projects/category"
              className="hover:text-electric-cyan transition-colors"
            >
              Categories
            </Link>
            <span className="text-muted-foreground/40">/</span>
            <Link
              href={`/projects/category/${categorySlug}`}
              className="hover:text-electric-cyan transition-colors"
            >
              {category.label}
            </Link>
            <span className="text-muted-foreground/40">/</span>
            <span className="text-electric-cyan truncate max-w-[200px]">
              {project.title}
            </span>
          </nav>

          {/* Project Detail */}
          <ProjectCardShell className="overflow-hidden p-0">
            {/* Cover Image */}
            <div className="relative min-h-[280px] sm:min-h-[360px]">
              <Image
                src={project.coverImage.src}
                alt={project.coverImage.alt}
                fill
                className="object-cover"
                sizes="100vw"
                priority
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/20 to-transparent" />
              <div className="absolute bottom-5 left-5 flex flex-wrap items-center gap-3">
                <ProjectStatusBadge status={project.status} />
                <span className="font-mono text-[9px] uppercase tracking-[0.18em] text-white/70 border border-white/20 bg-black/30 px-2 py-0.5 rounded-sm">
                  {project.categoryLabel}
                </span>
                {project.isFeatured && (
                  <span className="font-mono text-[9px] uppercase tracking-[0.18em] text-electric-cyan border border-electric-cyan/30 bg-electric-cyan/10 px-2 py-0.5 rounded-sm">
                    Featured
                  </span>
                )}
              </div>
            </div>

            {/* Body */}
            <div className="p-6 sm:p-8">
              <h1 className="text-2xl sm:text-3xl font-bold text-foreground mb-4 leading-snug">
                {project.title}
              </h1>

              <p className="text-muted-foreground leading-relaxed mb-8 max-w-2xl">
                {project.description}
              </p>

              {/* KPI Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8 p-4 rounded-lg bg-muted/20 border border-border/50">
                <ProjectMetaRow label="Budget" value={project.kpis.budget} />
                <ProjectMetaRow
                  label="Timeline"
                  value={project.kpis.timeline}
                />
                <ProjectMetaRow
                  label="Capacity"
                  value={project.kpis.capacity}
                />
                <ProjectMetaRow
                  label="Location"
                  value={project.kpis.location}
                />
              </div>

              {/* Progress */}
              {project.progress < 100 && (
                <div className="mb-8">
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-mono text-[9px] uppercase tracking-[0.14em] text-muted-foreground">
                      Completion
                    </span>
                    <span className="font-mono text-[9px] text-electric-cyan">
                      {project.progress}%
                    </span>
                  </div>
                  <div className="h-1 w-full rounded-full bg-border/60">
                    <div
                      className="h-1 rounded-full bg-electric-cyan transition-all"
                      style={{ width: `${project.progress}%` }}
                    />
                  </div>
                </div>
              )}

              {/* Tags */}
              <div className="flex flex-wrap gap-2 mb-8">
                {project.tags.map((tag) => (
                  <span
                    key={tag}
                    className="font-mono text-[9px] uppercase tracking-[0.14em] text-muted-foreground border border-border/60 px-2 py-0.5 rounded-sm"
                  >
                    {tag}
                  </span>
                ))}
              </div>

              {/* CTAs */}
              <div className="flex flex-wrap gap-3">
                <Link
                  href={`/projects/category/${categorySlug}`}
                  className="px-5 py-2.5 border border-border text-muted-foreground text-sm font-medium hover:text-foreground hover:border-border/80 transition-all"
                >
                  ← {category.label} Projects
                </Link>
                <Link
                  href="/contact"
                  className="px-5 py-2.5 bg-electric-cyan/10 border border-electric-cyan/30 text-electric-cyan text-sm font-medium tracking-wide hover:bg-electric-cyan/20 hover:border-electric-cyan/50 transition-all"
                >
                  Discuss This Project
                </Link>
              </div>
            </div>
          </ProjectCardShell>

          {/* Related Projects in same category */}
          {relatedProjects.length > 0 && (
            <div className="mt-16">
              <h2 className="font-mono text-[10px] uppercase tracking-[0.2em] text-electric-cyan mb-6">
                More {category.label} Projects
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {relatedProjects.map((related) => (
                  <Link
                    key={related.slug}
                    href={`/projects/category/${categorySlug}/${related.slug}`}
                    className="group block"
                  >
                    <ProjectCardShell className="h-full p-4 group-hover:border-electric-cyan/40 group-hover:bg-electric-cyan/5 transition-all duration-200">
                      <div className="flex items-start justify-between gap-2 mb-2">
                        <h3 className="text-sm font-semibold text-foreground group-hover:text-electric-cyan transition-colors leading-snug">
                          {related.title}
                        </h3>
                        <ProjectStatusBadge status={related.status} />
                      </div>
                      <p className="text-xs text-muted-foreground line-clamp-2">
                        {related.description}
                      </p>
                    </ProjectCardShell>
                  </Link>
                ))}
              </div>
            </div>
          )}
        </div>
      </section>
      <Footer />
    </main>
  );
}
