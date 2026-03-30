import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { NewsHubArticleCard } from "@/components/news-hub";
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
      <section className="section-standard border-b border-border/40 bg-background">
        <div className="section-content max-w-6xl space-y-5">
          <div className="font-mono text-[10px] uppercase tracking-[0.2em] text-electric-cyan">
            {category.label} news
          </div>
          <h1 className="text-4xl font-black tracking-tight text-foreground sm:text-5xl">
            {category.label} stories and updates.
          </h1>
          <p className="max-w-3xl text-base leading-7 text-muted-foreground sm:text-lg">
            {category.description}
          </p>
          <div className="flex flex-wrap items-center gap-4 font-mono text-[10px] uppercase tracking-[0.18em] text-muted-foreground">
            <Link href="/news-hub" className="hover:text-electric-cyan">
              Back to hub
            </Link>
            <Link
              href="/news-hub/category"
              className="hover:text-electric-cyan"
            >
              All categories
            </Link>
          </div>
        </div>
      </section>

      <section className="section-container bg-background pb-24">
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
