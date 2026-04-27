import type { Metadata } from "next";
import { Footer } from "@/components/sections/footer";
import {
  NewsHubBentoGrid,
  NewsHubFeaturedCard,
  NewsHubHero,
} from "@/components/news-hub";
import { NewsGridLayout } from "@/components/news-hub/news-grid-layout";
import { ContentBreadcrumb, SectionIntro } from "@/components/shared";
import {
  getFeaturedNewsArticleByCategory,
  getNewsArticleListItemsByCategory,
  getSidebarCardsByCategory,
  isNewsCategorySlug,
  newsCategories,
  newsHubMetricItems,
  newsHubIntroData,
} from "@/data/news";
import { safeValidateNewsHubParams } from "@/lib/actions/validate-search-params";
import { createNewsHubListMetadata } from "@/lib/metadata-news";
import type { NewsCategorySlug } from "@/types/news";

export const metadata: Metadata = createNewsHubListMetadata();
export const revalidate = 3600;

export default async function NewsHubPage({
  searchParams,
}: {
  searchParams?: Promise<{ category?: string | string[] }>;
}) {
  const resolvedSearchParams = await searchParams;
  const validatedParams = await safeValidateNewsHubParams(
    resolvedSearchParams || {},
  );

  const categoryParam = validatedParams.category;
  const activeCategory: NewsCategorySlug =
    categoryParam && isNewsCategorySlug(categoryParam) ? categoryParam : "all";

  const featuredArticle = getFeaturedNewsArticleByCategory(activeCategory);
  const listItems = getNewsArticleListItemsByCategory(activeCategory);
  const sidebarCards = getSidebarCardsByCategory(activeCategory);

  return (
    <main className="relative bg-background">
      <NewsHubHero
        categories={newsCategories}
        activeCategory={activeCategory}
        totalArticles={listItems.length}
      />

      <ContentBreadcrumb
        items={[
          { label: "Home", href: "/" },
          { label: "News Hub", href: "/news-hub", isCurrent: true },
        ]}
        section="news"
      />

      <SectionIntro data={newsHubIntroData} />

      {featuredArticle ? (
        <section className="section-standard bg-background">
          <div className="section-content max-w-6xl">
            <div className="flex items-center gap-3 mb-8">
              <div className="h-px w-8 bg-[hsl(174_100%_35%)] dark:bg-electric-cyan" />
              <span className="font-mono text-xs tracking-widest uppercase font-bold text-[hsl(174_100%_35%)] dark:text-electric-cyan">
                Featured Story
              </span>
            </div>
            <NewsHubFeaturedCard article={featuredArticle} />
          </div>
        </section>
      ) : null}

      <section className="section-container section-padding-sm bg-background">
        <div className="section-content max-w-6xl">
          <div className="flex items-center gap-3 mb-8">
            <div className="h-px w-8 bg-[hsl(174_100%_35%)] dark:bg-electric-cyan" />
            <span className="font-mono text-xs tracking-widest uppercase font-bold text-[hsl(174_100%_35%)] dark:text-electric-cyan">
              Hub Performance
            </span>
            <div className="w-1.5 h-1.5 rounded-full bg-[hsl(174_100%_35%)] dark:bg-electric-cyan animate-pulse" />
          </div>
          <NewsHubBentoGrid items={newsHubMetricItems} />
        </div>
      </section>

      <section
        id="news-hub-feed"
        className="section-container section-padding bg-background"
      >
        <div className="section-content max-w-6xl">
          <div className="flex items-center gap-3 mb-8">
            <div className="h-px w-8 bg-[hsl(174_100%_35%)] dark:bg-electric-cyan" />
            <span className="font-mono text-xs tracking-widest uppercase font-bold text-[hsl(174_100%_35%)] dark:text-electric-cyan">
              Latest Articles
            </span>
            <div className="w-1.5 h-1.5 rounded-full bg-[hsl(174_100%_35%)] dark:bg-electric-cyan animate-pulse" />
          </div>
          <NewsGridLayout
            items={listItems}
            sidebarCards={sidebarCards}
            title="Latest Articles"
            initialCount={4}
            batchSize={3}
          />
        </div>
      </section>

      <Footer />
    </main>
  );
}
