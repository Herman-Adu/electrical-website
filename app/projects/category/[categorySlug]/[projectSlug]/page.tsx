import type { Metadata } from "next";
import { notFound } from "next/navigation";
import {
  getCategoryBySlug,
  getCategorySlugs,
  getProjectByCategoryAndSlug,
  getProjectSlugsByCategory,
  allProjects,
} from "@/data/projects";
import { getProjectsSidebarCards } from "@/data/shared/sidebar-cards";
import { createProjectDetailMetadata } from "@/lib/metadata-projects";
import { getArticleSchema, getBreadcrumbSchema } from "@/lib/structured-data";
import {
  ProjectDetailHero,
  ProjectArticleContent,
  ProjectRelatedCarousel,
  ProjectSocialCTA,
  ProjectSupplementalSection,
} from "@/components/projects";
import {
  ContentToc,
  ContentBreadcrumb,
} from "@/components/shared";
import { Footer } from "@/components/sections/footer";
import { siteConfig } from "@/lib/site-config";
import { adaptProjectTimeline } from "@/lib/timeline/adapters";
import { TimelineAdapterError } from "@/lib/timeline/adapters";
import type { Project } from "@/types/projects";
import type { TocItem } from "@/types/shared-content";

export const revalidate = 259200; // 72 hours

/**
 * Generate all [categorySlug] + [projectSlug] pairs at build time.
 */
export async function generateStaticParams(): Promise<
  { categorySlug: string; projectSlug: string }[]
> {
  const pairs: { categorySlug: string; projectSlug: string }[] = [];

  for (const categorySlug of getCategorySlugs()) {
    for (const projectSlug of getProjectSlugsByCategory(categorySlug)) {
      pairs.push({ categorySlug, projectSlug });
    }
  }

  return pairs;
}

export const dynamicParams = false;

type CategoryProjectParams = Awaited<
  ReturnType<typeof generateStaticParams>
>[number];

export async function generateMetadata({
  params,
}: {
  params: Promise<CategoryProjectParams>;
}): Promise<Metadata> {
  const { categorySlug, projectSlug } = await params;
  const category = getCategoryBySlug(categorySlug);

  if (!category) {
    return {
      title: "Category Not Found | Nexgen Electrical Innovations",
      description: "The requested project category could not be found.",
    };
  }

  const project = getProjectByCategoryAndSlug(category.slug, projectSlug);

  if (!project) {
    return {
      title: "Project Not Found | Nexgen Electrical Innovations",
      description: "The requested project could not be found.",
    };
  }

  return createProjectDetailMetadata(
    project,
    `/projects/category/${categorySlug}/${projectSlug}`,
  );
}

// Generate TOC items based on available content sections
function generateTocItems(project: Project, hasTimeline: boolean, hasSidebarCards: boolean): TocItem[] {
  const items: TocItem[] = [];
  const detail = project.detail;

  if (detail?.intro) {
    items.push({ id: "overview", label: "Overview" });
  }

  if (detail?.scope && detail.scope.length > 0) {
    items.push({ id: "scope", label: "Scope of Work" });
  }

  if (detail?.challenge && detail?.solution) {
    items.push({ id: "challenge", label: "Challenge & Solution" });
  }

  if (hasTimeline) {
    items.push({ id: "timeline", label: "Project Timeline" });
  }

  if (detail?.gallery && detail.gallery.length > 0) {
    items.push({ id: "gallery", label: "Gallery" });
  }

  if (detail?.testimonial) {
    items.push({ id: "testimonial", label: "Client Testimonial" });
  }

  if (hasSidebarCards) {
    items.push({ id: "get-started", label: "Get Started" });
  }

  return items;
}

export default async function CategoryProjectDetailPage({
  params,
}: {
  params: Promise<CategoryProjectParams>;
}) {
  const { categorySlug, projectSlug } = await params;

  const category = getCategoryBySlug(categorySlug);
  if (!category) notFound();

  const project = getProjectByCategoryAndSlug(category.slug, projectSlug);
  if (!project) notFound();

  const relatedProjects = allProjects
    .filter((p) => p.slug !== project.slug && p.category === categorySlug)
    .slice(0, 4);

  const sidebarCards = getProjectsSidebarCards(category.slug);
  const detail = project.detail;

  let canonicalTimeline: ReturnType<typeof adaptProjectTimeline> | null = null;

  if (detail?.timeline?.length) {
    try {
      canonicalTimeline = adaptProjectTimeline(detail.timeline);
    } catch (error) {
      if (error instanceof TimelineAdapterError) {
        console.warn(
          `Project timeline omitted for project ${project.slug} (${category.slug}): ${error.message}`,
        );
      } else {
        throw error;
      }
    }
  }

  const tocItems = generateTocItems(
    project,
    (canonicalTimeline?.items.length ?? 0) > 0,
    sidebarCards.length > 0,
  );

  // Build breadcrumb for JSON-LD
  const breadcrumbItems = [
    { name: "Home", url: siteConfig.getUrl(siteConfig.routes.home) },
    { name: "Projects", url: siteConfig.getUrl(siteConfig.routes.projects) },
    {
      name: "Categories",
      url: siteConfig.getUrl(siteConfig.routes.projectsCategory),
    },
    {
      name: category.label,
      url: siteConfig.getUrl(
        `${siteConfig.routes.projectsCategory}/${categorySlug}`,
      ),
    },
    {
      name: project.title,
      url: siteConfig.getUrl(
        `/projects/category/${categorySlug}/${projectSlug}`,
      ),
    },
  ];

  const articleSchema = getArticleSchema(project);
  const breadcrumbSchema = getBreadcrumbSchema(breadcrumbItems);

  return (
    <main className="relative">
      {/* JSON-LD Schema */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(breadcrumbSchema),
        }}
      />

      {/* Hero Section with Parallax Image + KPIs */}
      <ProjectDetailHero project={project} />

      {/* Sticky Breadcrumb - CSS sticky below navbar */}
      <ContentBreadcrumb
        items={[
          { label: "Projects", href: "/projects" },
          { label: "Categories", href: "/projects/category" },
          { label: category.label, href: `/projects/category/${categorySlug}` },
          { label: project.title, href: "#", isCurrent: true },
        ]}
        section="projects"
      />

      {/* Main Content with Sticky Sidebar */}
      <section
        id="project-content"
        className="section-padding bg-background overflow-visible!"
      >
        <div className="section-content grid max-w-7xl gap-8 xl:grid-cols-[minmax(0,1fr)_minmax(280px,320px)]">
          {/* Left column: article content + supplemental project info (inside grid to extend gridHeight for sticky TOC) */}
          <div>
            {detail && (
              <ProjectArticleContent
                detail={detail}
                canonicalTimeline={canonicalTimeline}
              />
            )}
            {/* Supplemental project info */}
            <ProjectSupplementalSection
              tags={project.tags}
              cards={sidebarCards.slice(0, 2)}
            />
          </div>

          {/* Sticky Sidebar — TOC + Project Details */}
          <aside
            data-sticky-toc="true"
            className="hidden xl:flex xl:flex-col xl:gap-6 sticky top-[150px] self-start mt-2"
          >
            <ContentToc items={tocItems} title="Project Contents" />

            {/* Project Details card */}
            <div className="rounded-xl border border-[hsl(174_100%_35%)]/20 dark:border-electric-cyan/20 bg-gradient-to-br from-white/95 dark:from-background/90 to-[hsl(174_100%_35%)]/5 dark:to-background/70 p-5 space-y-4">
              <h3 className="font-mono text-[10px] uppercase tracking-[0.2em] text-[hsl(174_100%_35%)]/70 dark:text-electric-cyan/70">
                Project Details
              </h3>
              <dl className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <dt className="text-foreground/50">Status</dt>
                  <dd className="font-medium text-[hsl(174_100%_35%)] dark:text-electric-cyan capitalize">
                    {project.status.replace("-", " ")}
                  </dd>
                </div>
                <div className="flex justify-between">
                  <dt className="text-foreground/50">Budget</dt>
                  <dd className="font-medium text-foreground">{project.kpis.budget}</dd>
                </div>
                <div className="flex justify-between">
                  <dt className="text-foreground/50">Timeline</dt>
                  <dd className="font-medium text-foreground">{project.kpis.timeline}</dd>
                </div>
                <div className="flex justify-between">
                  <dt className="text-foreground/50">Location</dt>
                  <dd className="font-medium text-foreground">{project.kpis.location}</dd>
                </div>
                <div className="flex justify-between">
                  <dt className="text-foreground/50">Capacity</dt>
                  <dd className="font-medium text-foreground">{project.kpis.capacity}</dd>
                </div>
                <div className="flex justify-between">
                  <dt className="text-foreground/50">Sector</dt>
                  <dd className="font-medium text-foreground">{project.clientSector}</dd>
                </div>
              </dl>
              {project.status === "in-progress" && (
                <div className="pt-2 border-t border-[hsl(174_100%_35%)]/10 dark:border-electric-cyan/10">
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-mono text-[9px] uppercase tracking-[0.14em] text-foreground/50">
                      Progress
                    </span>
                    <span className="font-mono text-[10px] text-[hsl(174_100%_35%)] dark:text-electric-cyan">
                      {project.progress}%
                    </span>
                  </div>
                  <div className="h-1.5 w-full overflow-hidden rounded-full bg-[hsl(174_100%_35%)]/10 dark:bg-electric-cyan/10">
                    <div
                      className="h-full bg-gradient-to-r from-[hsl(174_100%_35%)]/60 dark:from-electric-cyan/60 to-[hsl(174_100%_35%)] dark:to-electric-cyan transition-all"
                      style={{ width: `${project.progress}%` }}
                    />
                  </div>
                </div>
              )}
            </div>
          </aside>
        </div>
      </section>

      {/* Related Projects - Full Width */}
      {relatedProjects.length > 0 && (
        <section className="section-container section-padding bg-background">
          <div className="section-content max-w-6xl">
            <ProjectRelatedCarousel
              projects={relatedProjects}
              categorySlug={categorySlug}
              heading={`More ${category.label} Projects`}
            />
          </div>
        </section>
      )}

      {/* Social CTA - Full Width */}
      <section className="section-container section-padding  bg-background">
        <div className="section-content max-w-6xl">
          <ProjectSocialCTA
            projectTitle={project.title}
            categorySlug={categorySlug}
          />
        </div>
      </section>

      <Footer />
    </main>
  );
}
