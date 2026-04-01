import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { NewsCategoryHero } from "@/components/news-hub";
import { NewsGridLayout } from "@/components/news-hub/news-grid-layout";
import { ContentBreadcrumb } from "@/components/shared";
import { Footer } from "@/components/sections/footer";
import {
  getNewsArticleListItemsByCategory,
  getNewsCategoryBySlug,
  getNewsCategorySlugs,
  getSidebarCardsByCategory,
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
  const sidebarCards = getSidebarCardsByCategory(category.slug);

  return (
    <main className="relative bg-background">
      <NewsCategoryHero category={category} articleCount={items.length} />

      <ContentBreadcrumb
        items={[
          { label: "Home", href: "/" },
          { label: "News Hub", href: "/news-hub" },
          { label: "Categories", href: "/news-hub/category" },
          { label: category.label, href: `/news-hub/category/${categorySlug}`, isCurrent: true },
        ]}
        section="news"
      />

      <section
        id="category-articles"
        className="section-standard bg-background"
      >
        <div className="section-content max-w-6xl">
          <NewsGridLayout
            items={items}
            sidebarCards={sidebarCards}
            title={category.label}
            initialCount={4}
            batchSize={3}
            emptyMessage={`No stories are available in the ${category.label} category yet.`}
          />
        </div>
      </section>

      <Footer />
    </main>
  );
}
