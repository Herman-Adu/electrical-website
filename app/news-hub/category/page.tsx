import type { Metadata } from "next";
import { NewsChannelCard, NewsHubCategoriesHero, NewsTopicFilter } from "@/components/news-hub";
import { Footer } from "@/components/sections/footer";
import { ContentBreadcrumb, SectionIntro } from "@/components/shared";
import { allNewsArticles, newsCategories, newsCategoriesIntroData } from "@/data/news";
import { newsTopics } from "@/data/news/topics";
import { createNewsHubCategoriesMetadata } from "@/lib/metadata-news";

export const metadata: Metadata = createNewsHubCategoriesMetadata();
export const revalidate = 86400;

const coverImageFallbacks: Record<string, string> = {
  residential: "/images/smart-living-interior.jpg",
  industrial: "/images/services-industrial.jpg",
  partners: "/images/services-commercial.jpg",
  "case-studies": "/images/power-distribution.jpg",
  insights: "/images/system-diagnostics.jpg",
  reviews: "/images/warehouse-lighting.jpg",
};

export default function NewsHubCategoriesPage() {
  return (
    <main className="relative bg-background">
      <NewsHubCategoriesHero categoryCount={newsCategories.length} />

      <ContentBreadcrumb
        items={[
          { label: "Home", href: "/" },
          { label: "News Hub", href: "/news-hub" },
          { label: "Categories", href: "/news-hub/category", isCurrent: true },
        ]}
        section="news"
      />

      <SectionIntro data={newsCategoriesIntroData} />

      <section id="categories-grid" className="section-standard bg-background">
        <div className="section-content max-w-6xl">
          <div className="flex items-center gap-3 mb-8">
            <div className="h-px w-8 bg-[hsl(174_100%_35%)] dark:bg-electric-cyan" />
            <span className="font-mono text-xs tracking-widest uppercase font-bold text-[hsl(174_100%_35%)] dark:text-electric-cyan">
              Specialist Channels
            </span>
            <div className="w-1.5 h-1.5 rounded-full bg-[hsl(174_100%_35%)] dark:bg-electric-cyan animate-pulse" />
          </div>
        </div>
        <div className="section-content grid max-w-6xl gap-5 sm:grid-cols-2">
          {newsCategories.map((cat) => {
            const catArticles = allNewsArticles.filter((a) => a.category === cat.slug);
            const articleCount = catArticles.length;
            const sortedArticles = [...catArticles].sort(
              (a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime()
            );
            const recentArticleTitle = sortedArticles[0]?.title ?? "Coming soon";
            const recentImage = sortedArticles[0]?.featuredImage?.src;
            const coverImageSrc = recentImage ?? (coverImageFallbacks[cat.slug] ?? "/images/services-commercial.jpg");
            return (
              <NewsChannelCard
                key={cat.slug}
                category={cat}
                articleCount={articleCount}
                recentArticleTitle={recentArticleTitle}
                coverImageSrc={coverImageSrc}
                coverImageAlt={`${cat.label} channel`}
              />
            );
          })}
        </div>
      </section>

      <section className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 pb-16">
        <h2 className="text-xl font-semibold mb-2 text-foreground">Browse by Topic</h2>
        <p className="text-sm text-muted-foreground mb-4">Filter articles across all channels by topic</p>
        <NewsTopicFilter topics={newsTopics} />
      </section>

      <Footer />
    </main>
  );
}
