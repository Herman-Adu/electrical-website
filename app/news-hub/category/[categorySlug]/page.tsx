import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { NewsCategoryHero, NewsHubArticleCard } from "@/components/news-hub";
import { Footer } from "@/components/sections/footer";
import {
  getNewsArticleListItemsByCategory,
  getNewsCategoryBySlug,
  getNewsCategorySlugs,
} from "@/data/news";
import { createNewsHubCategoryMetadata } from "@/lib/metadata-news";

export const revalidate = 86400;
export const dynamicParams = false;

export async function generateStaticParams(): Promise<
  { categorySlug: string }[]
> {
  return getNewsCategorySlugs().map((categorySlug) => ({ categorySlug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ categorySlug: string }>;
}): Promise<Metadata> {
  const { categorySlug } = await params;
  const category = getNewsCategoryBySlug(categorySlug);

  if (!category) {
    return { title: "News Category Not Found | Nexgen Electrical Innovations" };
  }

  return createNewsHubCategoryMetadata(category);
}

export default async function NewsCategoryPage({
  params,
}: {
  params: Promise<{ categorySlug: string }>;
}) {
  const { categorySlug } = await params;
  const category = getNewsCategoryBySlug(categorySlug);

  if (!category) {
    notFound();
  }

  const items = getNewsArticleListItemsByCategory(category.slug);

  return (
    <main className="relative bg-background">
      <NewsCategoryHero category={category} articleCount={items.length} />

      <section
        id="category-articles"
        className="section-standard bg-background"
      >
        <div className="section-content max-w-6xl space-y-4">
          {items.length === 0 ? (
            <div className="rounded-3xl border border-border/50 bg-card/60 p-8 text-sm text-muted-foreground">
              No stories are seeded in this category yet.
            </div>
          ) : (
            items.map((item) => (
              <NewsHubArticleCard key={item.id} item={item} />
            ))
          )}
        </div>
      </section>

      <Footer />
    </main>
  );
}
