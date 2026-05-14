import type { Metadata } from "next";
import {
  NewsChannelCard,
  NewsHubCategoriesHero,
  NewsHubListCTA,
  NewsTopicCard,
} from "@/components/news-hub";
import { Footer } from "@/components/sections/footer";
import { CategoryPageLayout, ContentBreadcrumb, SectionIntro } from "@/components/shared";
import {
  allNewsArticles,
  newsCategories,
  newsCategoriesIntroData,
} from "@/data/news";
import { newsTopics, getNewsArticlesByTopic } from "@/data/news/topics";
import { createNewsHubCategoriesMetadata } from "@/lib/metadata-news";
import { getNewsSidebarCards } from "@/data/shared/sidebar-cards";

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

const topicCoverImages: Record<string, string> = {
  residential: "/images/smart-living-interior.jpg",
  commercial: "/images/services-commercial.jpg",
  industrial: "/images/services-industrial.jpg",
  community: "/images/power-distribution.jpg",
  campaigns: "/images/warehouse-lighting.jpg",
  marketing: "/images/system-diagnostics.jpg",
  "social-media": "/images/services-commercial.jpg",
};

export default function NewsHubCategoriesPage() {
  const sidebarCards = getNewsSidebarCards();

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

      <CategoryPageLayout
        sidebarCards={sidebarCards}
        main={
          <div className="space-y-12">
            {/* By Topics */}
            <div>
              <div className="flex items-center gap-3 mb-8">
                <div className="h-px w-8 bg-[hsl(174_100%_35%)] dark:bg-electric-cyan" />
                <span className="font-mono text-xs tracking-widest uppercase font-bold text-[hsl(174_100%_35%)] dark:text-electric-cyan">
                  By Topics
                </span>
                <div className="w-1.5 h-1.5 rounded-full bg-[hsl(174_100%_35%)] dark:bg-electric-cyan animate-pulse" />
              </div>
              <div className="grid gap-5 sm:grid-cols-2">
                {newsTopics.map((topic) => {
                  const topicArticles = getNewsArticlesByTopic(topic.slug, allNewsArticles);
                  const recentImage = [...topicArticles]
                    .sort((a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime())[0]
                    ?.featuredImage?.src;
                  return (
                    <NewsTopicCard
                      key={topic.slug}
                      topic={topic}
                      articleCount={topicArticles.length}
                      coverImageSrc={recentImage ?? topicCoverImages[topic.slug] ?? "/images/services-commercial.jpg"}
                      coverImageAlt={`${topic.label} articles`}
                    />
                  );
                })}
              </div>
            </div>

            <div className="border-t border-border/30" />

            {/* By Channels */}
            <div>
              <div className="flex items-center gap-3 mb-8">
                <div className="h-px w-8 bg-[hsl(174_100%_35%)] dark:bg-electric-cyan" />
                <span className="font-mono text-xs tracking-widest uppercase font-bold text-[hsl(174_100%_35%)] dark:text-electric-cyan">
                  By Channels
                </span>
                <div className="w-1.5 h-1.5 rounded-full bg-[hsl(174_100%_35%)] dark:bg-electric-cyan animate-pulse" />
              </div>
              <div className="grid gap-5 sm:grid-cols-2">
                {newsCategories.map((cat) => {
                  const catArticles = allNewsArticles.filter((a) => a.category === cat.slug);
                  const sortedArticles = [...catArticles].sort(
                    (a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime(),
                  );
                  const recentImage = sortedArticles[0]?.featuredImage?.src;
                  return (
                    <NewsChannelCard
                      key={cat.slug}
                      category={cat}
                      articleCount={catArticles.length}
                      recentArticleTitle={sortedArticles[0]?.title ?? "Coming soon"}
                      coverImageSrc={recentImage ?? coverImageFallbacks[cat.slug] ?? "/images/services-commercial.jpg"}
                      coverImageAlt={`${cat.label} channel`}
                      description={cat.description}
                    />
                  );
                })}
              </div>
            </div>
          </div>
        }
      />

      <section className="section-container section-padding bg-card/30">
        <div className="section-content max-w-6xl">
          <NewsHubListCTA />
        </div>
      </section>

      <Footer />
    </main>
  );
}
