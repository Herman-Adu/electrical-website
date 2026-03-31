import type { Metadata } from "next";
import { Footer } from "@/components/sections/footer";
import {
  NewsHubBentoGrid,
  NewsHubFeaturedCard,
  NewsHubHero,
} from "@/components/news-hub";
import { NewsGridLayout } from "@/components/news-hub/news-grid-layout";
import {
  getFeaturedNewsArticleByCategory,
  getNewsArticleListItemsByCategory,
  getSidebarCardsByCategory,
  isNewsCategorySlug,
  newsCategories,
  newsHubMetricItems,
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

      {featuredArticle ? (
        <section className="section-standard bg-background">
          <div className="section-content max-w-6xl">
            <NewsHubFeaturedCard article={featuredArticle} />
          </div>
        </section>
      ) : null}

      <section className="section-container section-padding-sm bg-background">
        <div className="section-content max-w-6xl">
          <NewsHubBentoGrid items={newsHubMetricItems} />
        </div>
      </section>

      <section
        id="news-hub-feed"
        className="section-container section-padding bg-background"
      >
        <div className="section-content max-w-6xl">
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
