import { Suspense } from "react";
import type { Metadata } from "next";
import { Footer } from "@/components/sections/footer";
import { NewsHubBentoGrid, NewsHubFeaturedSection, NewsHubHero } from "@/components/news-hub";
import { NewsListSkeleton } from "@/components/news-hub/news-list-skeleton";
import { NewsHubFilterClient } from "@/components/news-hub/news-hub-filter-client";
import { ContentBreadcrumb, SectionIntro } from "@/components/shared";
import {
  getFeaturedNewsArticleByCategory,
  getNewsArticleListItemsByCategory,
  getSidebarCardsByCategory,
  newsCategories,
  newsHubMetricItems,
  newsHubIntroData,
  allNewsArticles,
} from "@/data/news";
import { createNewsHubListMetadata } from "@/lib/metadata-news";

export const experimental_ppr = true;
export const metadata: Metadata = createNewsHubListMetadata();

export default async function NewsHubPage() {
  const allItems = getNewsArticleListItemsByCategory("all");
  const sidebarCards = getSidebarCardsByCategory("all");
  const featuredArticle = getFeaturedNewsArticleByCategory("all");
  const counts: Record<string, number> = {
    all: allNewsArticles.length,
    ...Object.fromEntries(
      newsCategories.map((c) => [c.slug, allNewsArticles.filter((a) => a.category === c.slug).length])
    ),
  };

  return (
    <main className="relative bg-background">
      <NewsHubHero
        categories={newsCategories}
        activeCategory="all"
        totalArticles={allNewsArticles.length}
      />

      <ContentBreadcrumb
        items={[
          { label: "Home", href: "/" },
          { label: "News Hub", href: "/news-hub", isCurrent: true },
        ]}
        section="news"
      />

      <SectionIntro data={newsHubIntroData} />

      {featuredArticle ? <NewsHubFeaturedSection article={featuredArticle} /> : null}

      <section className="section-container section-padding bg-background">
        <div className="section-content max-w-6xl">
          <div className="flex items-center gap-3 mb-8">
            <div className="h-px w-8 bg-[hsl(174_100%_35%)] dark:bg-electric-cyan" />
            <span className="font-mono text-xs tracking-widest uppercase font-bold text-[hsl(174_100%_35%)] dark:text-electric-cyan">Hub Performance</span>
            <div className="w-1.5 h-1.5 rounded-full bg-[hsl(174_100%_35%)] dark:bg-electric-cyan animate-pulse" />
          </div>
          <NewsHubBentoGrid items={newsHubMetricItems} />
        </div>
      </section>

      <Suspense fallback={<NewsListSkeleton />}>
        <NewsHubFilterClient
          categories={newsCategories}
          items={allItems}
          sidebarCards={sidebarCards}
          counts={counts}
        />
      </Suspense>

      <Footer />
    </main>
  );
}
