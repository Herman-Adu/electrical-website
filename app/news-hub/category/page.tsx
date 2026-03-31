import type { Metadata } from "next";
import { NewsCategoryCard, NewsHubCategoriesHero } from "@/components/news-hub";
import { Footer } from "@/components/sections/footer";
import { ContentBreadcrumb } from "@/components/shared";
import { getNewsArticlesByCategory, newsCategories } from "@/data/news";
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

      <section id="categories-grid" className="section-standard bg-background">
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
