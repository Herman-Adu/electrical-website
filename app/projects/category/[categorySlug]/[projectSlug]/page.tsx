import type { Metadata } from "next";
import { notFound } from "next/navigation";
import {
  getCategoryBySlug,
  getCategorySlugs,
  getProjectByCategoryAndSlug,
  getProjectSlugsByCategory,
  allProjects,
} from "@/data/projects";
import { createProjectDetailMetadata } from "@/lib/metadata-projects";
import { getArticleSchema, getBreadcrumbSchema } from "@/lib/structured-data";
import {
  ProjectDetailHero,
  ProjectDetailIntro,
  ProjectTimeline,
  ProjectScopeGrid,
  ProjectChallengeSolution,
  ProjectGallery,
  ProjectTestimonialCard,
  ProjectRelatedCarousel,
  ProjectSocialCTA,
} from "@/components/projects";
import { Footer } from "@/components/sections/footer";
import { siteConfig } from "@/lib/site-config";

/**
 * Generate all [categorySlug] + [projectSlug] pairs at build time.
 * Using the flat approach: child generates full pairs in one call.
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

  const detail = project.detail;

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
      <ProjectDetailHero project={project} categorySlug={categorySlug} />

      {detail?.intro && (
        <section className="section-container py-2 bg-background">
          <div className="section-content max-w-6xl">
            <ProjectDetailIntro data={detail.intro} />
          </div>
        </section>
      )}

      {detail?.scope && detail.scope.length > 0 && (
        <section className="section-container py-12 bg-background">
          <div className="section-content max-w-6xl">
            <ProjectScopeGrid items={detail.scope} />
          </div>
        </section>
      )}

      {detail?.challenge && detail?.solution && (
        <section className="section-container section-padding-sm bg-background">
          <div className="section-content max-w-6xl">
            <ProjectChallengeSolution
              challenge={detail.challenge}
              solution={detail.solution}
            />
          </div>
        </section>
      )}

      {detail?.timeline && detail.timeline.length > 0 && (
        <section className="section-container section-padding-sm bg-background">
          <div className="section-content max-w-6xl">
            <ProjectTimeline phases={detail.timeline} />
          </div>
        </section>
      )}

      {detail?.gallery && detail.gallery.length > 0 && (
        <section className="section-container section-padding-sm bg-background">
          <div className="section-content max-w-6xl">
            <ProjectGallery images={detail.gallery} />
          </div>
        </section>
      )}

      {detail?.testimonial && (
        <section className="section-container section-padding-sm bg-background">
          <div className="section-content max-w-6xl">
            <ProjectTestimonialCard testimonial={detail.testimonial} />
          </div>
        </section>
      )}

      {relatedProjects.length > 0 && (
        <section className="section-container section-padding-sm bg-background">
          <div className="section-content max-w-6xl">
            <ProjectRelatedCarousel
              projects={relatedProjects}
              categorySlug={categorySlug}
              heading={`More ${category.label} Projects`}
            />
          </div>
        </section>
      )}

      <section className="section-container section-padding-sm bg-background">
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
