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
        <div className="section-content grid max-w-6xl gap-8 lg:grid-cols-[minmax(0,1.1fr)_minmax(280px,0.55fr)]">
          <div className="space-y-10">
            <div className="space-y-5">
              <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-electric-cyan">
                Story Overview
              </p>
              {article.detail.intro.map((paragraph) => (
                <p
                  key={paragraph}
                  className="text-base leading-8 text-foreground/80"
                >
                  {paragraph}
                </p>
              ))}
            </div>

            <div className="space-y-5">
              <h2 className="text-2xl font-bold text-white">
                Key Takeaways
              </h2>
              <ul className="space-y-3">
                {article.detail.takeaways.map((takeaway, index) => (
                  <li
                    key={takeaway}
                    className="rounded-xl border-l-4 border-l-electric-cyan/40 border border-electric-cyan/20 bg-electric-cyan/5 px-5 py-4 text-sm leading-7 text-foreground/80 hover:border-l-electric-cyan/60 hover:bg-electric-cyan/10 transition-all"
                  >
                    <span className="font-mono text-[10px] text-electric-cyan/60 mr-3">
                      0{index + 1}
                    </span>
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
                className="rounded-xl border border-electric-cyan/20 bg-gradient-to-br from-electric-cyan/10 to-transparent p-5"
              >
                <div className="font-mono text-[10px] uppercase tracking-[0.2em] text-foreground/60">
                  {metric.label}
                </div>
                <div className="mt-2 text-2xl font-bold text-electric-cyan">
                  {metric.value}
                </div>
              </div>
            ))}

            {article.detail.quote ? (
              <blockquote className="rounded-xl border border-electric-cyan/30 bg-electric-cyan/10 p-5 shadow-[0_0_25px_rgba(0,243,189,0.1)]">
                <p className="text-base leading-7 text-white italic">
                  &ldquo;{article.detail.quote.quote}&rdquo;
                </p>
                <footer className="mt-4 font-mono text-[10px] uppercase tracking-[0.18em] text-electric-cyan/80">
                  {article.detail.quote.author} &middot; {article.detail.quote.role}
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
