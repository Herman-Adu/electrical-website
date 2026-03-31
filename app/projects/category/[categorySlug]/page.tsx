import type { Metadata } from "next";
import { notFound } from "next/navigation";
import {
  getCategoryBySlug,
  getCategorySlugs,
  getProjectListItemsExtended,
} from "@/data/projects";
import { getProjectsSidebarCards } from "@/data/shared/sidebar-cards";
import { createProjectCategoryMetadata } from "@/lib/metadata-projects";
import { ProjectCategoryHero } from "@/components/projects";
import { ContentGridLayout } from "@/components/shared";
import { Footer } from "@/components/sections/footer";

export const revalidate = 86400; // 24 hours

export async function generateStaticParams(): Promise<
  { categorySlug: string }[]
> {
  return getCategorySlugs().map((categorySlug) => ({ categorySlug }));
}

export const dynamicParams = false;

export async function generateMetadata({
  params,
}: {
  params: Promise<{ categorySlug: string }>;
}): Promise<Metadata> {
  const { categorySlug } = await params;
  const category = getCategoryBySlug(categorySlug);

  if (!category) {
    return {
      title: "Category Not Found | Nexgen Electrical Innovations",
    };
  }

  return createProjectCategoryMetadata(category);
}

export default async function CategoryProjectsPage({
  params,
}: {
  params: Promise<{ categorySlug: string }>;
}) {
  const { categorySlug } = await params;

  const category = getCategoryBySlug(categorySlug);
  if (!category) notFound();

  const projectListItems = getProjectListItemsExtended(category.slug);
  const sidebarCards = getProjectsSidebarCards(category.slug);

  return (
    <main className="relative">
      {/* Hero Section */}
      <ProjectCategoryHero
        category={category}
        projectCount={projectListItems.length}
      />

      {/* Projects Grid Section */}
      <section
        id="category-projects"
        className="section-standard bg-background"
      >
        <div className="section-content max-w-7xl">
          <ContentGridLayout
            items={projectListItems}
            sidebarCards={sidebarCards}
            cardType="project"
            title={`${category.label} Projects`}
            itemLabel="project"
            itemLabelPlural="projects"
            emptyMessage={`No ${category.label.toLowerCase()} projects available yet.`}
            sidebarTitle={`${category.label} Resources`}
            sidebarDescription={`Guides, consultations, and resources for ${category.label.toLowerCase()} projects.`}
          />
        </div>
      </section>
      <Footer />
    </main>
  );
}
