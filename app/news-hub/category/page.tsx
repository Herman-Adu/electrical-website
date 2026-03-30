import type { Metadata } from "next";
import { NewsCategoryCard } from "@/components/news-hub";
import { Footer } from "@/components/sections/footer";
import { getNewsArticlesByCategory, newsCategories } from "@/data/news";
import { createNewsHubCategoriesMetadata } from "@/lib/metadata-news";

export const metadata: Metadata = createNewsHubCategoriesMetadata();
export const revalidate = 86400;

export default function NewsHubCategoriesPage() {
  return (
    <main className="relative bg-background">
      <section className="section-standard border-b border-border/40 bg-background">
        <div className="section-content max-w-6xl space-y-6">
          <div className="inline-flex items-center gap-3 rounded-full border border-electric-cyan/20 bg-electric-cyan/10 px-4 py-2 font-mono text-[10px] uppercase tracking-[0.2em] text-electric-cyan">
            Category index
          </div>
          <div className="space-y-4 max-w-3xl">
            <h1 className="text-4xl font-black tracking-tight text-foreground sm:text-5xl">
              Browse the news hub by content lane.
            </h1>
            <p className="text-base leading-7 text-muted-foreground sm:text-lg">
              Each category is treated as a first-class route so the structure
              stays stable when content eventually moves into Strapi-backed
              collections.
            </p>
          </div>
        </div>
      </section>

      <section className="section-container bg-background pb-24">
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
