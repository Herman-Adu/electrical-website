import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { NewsDetailHero, NewsRelatedArticles } from "@/components/news-hub";
import { Footer } from "@/components/sections/footer";
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
import { siteConfig } from "@/lib/site-config";

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

      <section id="article-content" className="section-standard bg-background">
        <div className="section-content grid max-w-6xl gap-8 lg:grid-cols-[minmax(0,1.1fr)_minmax(260px,0.55fr)]">
          <div className="space-y-10">
            <div className="space-y-4">
              <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-electric-cyan">
                Story overview
              </p>
              {article.detail.intro.map((paragraph) => (
                <p
                  key={paragraph}
                  className="text-base leading-8 text-muted-foreground"
                >
                  {paragraph}
                </p>
              ))}
            </div>

            <div className="space-y-4">
              <h2 className="text-2xl font-bold text-foreground">
                Key takeaways
              </h2>
              <ul className="space-y-3">
                {article.detail.takeaways.map((takeaway) => (
                  <li
                    key={takeaway}
                    className="rounded-2xl border border-border/50 bg-card/60 px-4 py-4 text-sm leading-6 text-muted-foreground"
                  >
                    {takeaway}
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <aside className="space-y-4 lg:sticky lg:top-24 lg:self-start">
            {article.detail.spotlight?.map((metric) => (
              <div
                key={metric.label}
                className="rounded-3xl border border-border/50 bg-card/60 p-5"
              >
                <div className="font-mono text-[10px] uppercase tracking-[0.2em] text-muted-foreground">
                  {metric.label}
                </div>
                <div className="mt-2 text-2xl font-bold text-foreground">
                  {metric.value}
                </div>
              </div>
            ))}

            {article.detail.quote ? (
              <blockquote className="rounded-3xl border border-electric-cyan/20 bg-electric-cyan/10 p-5">
                <p className="text-base leading-7 text-foreground">
                  “{article.detail.quote.quote}”
                </p>
                <footer className="mt-4 font-mono text-[10px] uppercase tracking-[0.18em] text-electric-cyan/80">
                  {article.detail.quote.author} · {article.detail.quote.role}
                </footer>
              </blockquote>
            ) : null}
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
