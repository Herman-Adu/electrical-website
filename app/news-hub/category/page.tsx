import type { Metadata } from "next";
import { NewsCategoryCard, NewsHubCategoriesHero } from "@/components/news-hub";
import { Footer } from "@/components/sections/footer";
import { ContentBreadcrumb, SectionIntro } from "@/components/shared";
import { getNewsArticlesByCategory, newsCategories, newsCategoriesIntroData } from "@/data/news";
import { createNewsHubCategoriesMetadata } from "@/lib/metadata-news";

export const metadata: Metadata = createNewsHubCategoriesMetadata();
export const revalidate = 86400;

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
              Browse Channels
            </span>
            <div className="w-1.5 h-1.5 rounded-full bg-[hsl(174_100%_35%)] dark:bg-electric-cyan animate-pulse" />
          </div>
        </div>
        <div className="section-content grid max-w-6xl gap-4 md:grid-cols-2 xl:grid-cols-3">
          {newsCategories.map((category) => (
            <NewsCategoryCard
              key={category.slug}
              category={category}
              articleCount={getNewsArticlesByCategory(category.slug).length}
            />
          ))}
        </div>
      </section>

      <Footer />
    </main>
  );
}
