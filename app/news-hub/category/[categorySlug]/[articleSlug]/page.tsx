import type { Metadata } from "next";
import { notFound } from "next/navigation";
import {
  NewsDetailHero,
  NewsRelatedArticles,
  NewsArticleToc,
  NewsArticleContent,
  type TocItem,
} from "@/components/news-hub";
import { Footer } from "@/components/sections/footer";
import { ContentBreadcrumb } from "@/components/shared";
import {
  getNewsArticleByCategoryAndSlug,
  getNewsArticleSlugsByCategory,
  getNewsCategoryBySlug,
  getNewsCategorySlugs,
  getRelatedNewsArticles,
} from "@/data/news";
import { createNewsArticleMetadata } from "@/lib/metadata-news";
import {
  getBreadcrumbSchema,
  getNewsArticleSchema,
} from "@/lib/structured-data";
import { adaptNewsTimeline } from "@/lib/timeline/adapters";
import { TimelineAdapterError } from "@/lib/timeline/adapters";
import { siteConfig } from "@/lib/site-config";
import type { NewsArticle } from "@/types/news";

export const revalidate = 259200;
export const dynamicParams = false;

export async function generateStaticParams(): Promise<
  { categorySlug: string; articleSlug: string }[]
> {
  const params: { categorySlug: string; articleSlug: string }[] = [];

  for (const categorySlug of getNewsCategorySlugs()) {
    for (const articleSlug of getNewsArticleSlugsByCategory(categorySlug)) {
      params.push({ categorySlug, articleSlug });
    }
  }

  return params;
}

type NewsArticleRouteParams = Awaited<
  ReturnType<typeof generateStaticParams>
>[number];

export async function generateMetadata({
  params,
}: {
  params: Promise<NewsArticleRouteParams>;
}): Promise<Metadata> {
  const { categorySlug, articleSlug } = await params;
  const article = getNewsArticleByCategoryAndSlug(categorySlug, articleSlug);

  if (!article) {
    return {
      title: "News Article Not Found | Nexgen Electrical Innovations",
      description: "The requested news article could not be found.",
    };
  }

  return createNewsArticleMetadata(
    article,
    `/news-hub/category/${categorySlug}/${articleSlug}`,
  );
}

// Generate TOC items based on available content sections
function generateTocItems(
  article: NewsArticle,
  hasTimeline: boolean,
): TocItem[] {
  const items: TocItem[] = [{ id: "overview", label: "Overview" }];

  if (article.detail.body && article.detail.body.length > 0) {
    items.push({ id: "details", label: "Project Details" });
  }

  if (article.detail.scope && article.detail.scope.length > 0) {
    items.push({ id: "scope", label: "Project Scope" });
  }

  if (article.detail.methodology && article.detail.methodology.length > 0) {
    items.push({ id: "methodology", label: "Methodology" });
  }

  if (article.detail.challenges && article.detail.challenges.length > 0) {
    items.push({ id: "challenges", label: "Challenges & Solutions" });
  }

  if (hasTimeline) {
    items.push({ id: "timeline", label: "Project Timeline" });
  }

  if (
    article.detail.specifications &&
    article.detail.specifications.length > 0
  ) {
    items.push({ id: "specifications", label: "Technical Specs" });
  }

  items.push({ id: "takeaways", label: "Key Takeaways" });

  if (article.detail.results && article.detail.results.length > 0) {
    items.push({ id: "results", label: "Results" });
  }

  if (article.detail.gallery && article.detail.gallery.length > 0) {
    items.push({ id: "gallery", label: "Gallery" });
  }

  if (article.detail.conclusion && article.detail.conclusion.length > 0) {
    items.push({ id: "conclusion", label: "Conclusion" });
  }

  if (article.detail.quote) {
    items.push({ id: "testimonial", label: "Testimonial" });
  }

  return items;
}

export default async function NewsArticlePage({
  params,
}: {
  params: Promise<NewsArticleRouteParams>;
}) {
  const { categorySlug, articleSlug } = await params;
  const category = getNewsCategoryBySlug(categorySlug);
  const article = getNewsArticleByCategoryAndSlug(categorySlug, articleSlug);

  if (!category || !article) {
    notFound();
  }

  const relatedArticles = getRelatedNewsArticles(article);
  const articleSchema = getNewsArticleSchema(article);
  const breadcrumbSchema = getBreadcrumbSchema([
    { name: "Home", url: siteConfig.getUrl(siteConfig.routes.home) },
    { name: "News Hub", url: siteConfig.getUrl(siteConfig.routes.newsHub) },
    {
      name: "Categories",
      url: siteConfig.getUrl(siteConfig.routes.newsHubCategory),
    },
    {
      name: category.label,
      url: siteConfig.getUrl(
        `${siteConfig.routes.newsHubCategory}/${category.slug}`,
      ),
    },
    {
      name: article.title,
      url: siteConfig.getUrl(
        `/news-hub/category/${category.slug}/${article.slug}`,
      ),
    },
  ]);

  let canonicalTimeline: ReturnType<typeof adaptNewsTimeline> | null = null;

  if (article.detail.timeline?.length) {
    try {
      canonicalTimeline = adaptNewsTimeline(article.detail.timeline);
    } catch (error) {
      if (error instanceof TimelineAdapterError) {
        console.warn(
          `News timeline omitted for article ${article.slug} (${category.slug}): ${error.message}`,
        );
      } else {
        throw error;
      }
    }
  }

  const tocItems = generateTocItems(
    article,
    (canonicalTimeline?.items.length ?? 0) > 0,
  );

  return (
    <main className="relative bg-background">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />

      <NewsDetailHero article={article} />

      {/* Sticky Breadcrumb - CSS sticky below navbar */}
      <ContentBreadcrumb
        items={[
          { label: "News Hub", href: "/news-hub" },
          { label: "Categories", href: "/news-hub/category" },
          { label: category.label, href: `/news-hub/category/${categorySlug}` },
          { label: article.title, href: "#", isCurrent: true },
        ]}
        section="news"
      />

      <section
        id="article-content"
        className="section-padding bg-background !overflow-visible"
      >
        <div className="section-content grid max-w-6xl gap-8 xl:grid-cols-[minmax(0,1fr)_minmax(280px,320px)]">
          {/* Main Content */}
          <NewsArticleContent
            detail={article.detail}
            timelineItems={canonicalTimeline?.items}
          />

          {/* Sticky Sidebar */}
          <aside
            data-sticky-toc="true"
            className="hidden xl:flex xl:flex-col xl:gap-6 sticky top-[132px] self-start min-h-[calc(100vh-132px)]"
          >
            {/* Table of Contents */}
            <NewsArticleToc items={tocItems} />

            {/* Spotlight Metrics */}
            {article.detail.spotlight &&
              article.detail.spotlight.length > 0 && (
                <div className="space-y-3">
                  <h3 className="font-mono text-[10px] uppercase tracking-[0.2em] text-electric-cyan/70">
                    Key Metrics
                  </h3>
                  {article.detail.spotlight.map((metric) => (
                    <div
                      key={metric.label}
                      className="rounded-xl border border-electric-cyan/20 bg-gradient-to-br from-electric-cyan/10 to-transparent p-4"
                    >
                      <div className="font-mono text-[9px] uppercase tracking-[0.18em] text-foreground/50">
                        {metric.label}
                      </div>
                      <div className="mt-1 text-2xl font-bold text-electric-cyan">
                        {metric.value}
                      </div>
                    </div>
                  ))}
                </div>
              )}

            {/* Article Info Card */}
            <div className="rounded-xl border border-electric-cyan/20 bg-gradient-to-br from-background/90 to-background/70 p-5 space-y-4">
              <h3 className="font-mono text-[10px] uppercase tracking-[0.2em] text-electric-cyan/70">
                Article Info
              </h3>
              <dl className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <dt className="text-foreground/50">Author</dt>
                  <dd className="font-medium text-white">
                    {article.author.name}
                  </dd>
                </div>
                <div className="flex justify-between">
                  <dt className="text-foreground/50">Read Time</dt>
                  <dd className="font-medium text-white">{article.readTime}</dd>
                </div>
                <div className="flex justify-between">
                  <dt className="text-foreground/50">Category</dt>
                  <dd className="font-medium text-electric-cyan">
                    {article.categoryLabel}
                  </dd>
                </div>
                {article.location && (
                  <div className="flex justify-between">
                    <dt className="text-foreground/50">Location</dt>
                    <dd className="font-medium text-white">
                      {article.location}
                    </dd>
                  </div>
                )}
              </dl>
            </div>

            {/* Tags */}
            {article.tags && article.tags.length > 0 && (
              <div className="space-y-3">
                <h3 className="font-mono text-[10px] uppercase tracking-[0.2em] text-electric-cyan/70">
                  Topics
                </h3>
                <div className="flex flex-wrap gap-2">
                  {article.tags.map((tag) => (
                    <span
                      key={tag}
                      className="rounded-md border border-electric-cyan/20 bg-electric-cyan/5 px-2 py-1 font-mono text-[9px] uppercase tracking-[0.12em] text-foreground/60"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </aside>
        </div>
      </section>

      <section className="section-container section-padding bg-background">
        <div className="section-content max-w-6xl">
          <NewsRelatedArticles articles={relatedArticles} />
        </div>
      </section>

      <Footer />
    </main>
  );
}
