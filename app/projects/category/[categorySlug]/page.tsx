import { Suspense } from "react";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import {
  getCategoryBySlug,
  getCategorySlugs,
  getProjectListItemsExtended,
  categoryProjectsIntroData,
  allProjects,
  projectCategories,
} from "@/data/projects";
import { getProjectsSidebarCards } from "@/data/shared/sidebar-cards";
import { createProjectCategoryMetadata } from "@/lib/metadata-projects";
import { ProjectCategoryHero } from "@/components/projects";
import { ProjectCategoryListSection } from "@/components/projects/project-category-list-section";
import { ContentBreadcrumb, SectionIntro } from "@/components/shared";
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

  const sectors = projectCategories.filter((c) => c.isSector);
  const counts: Record<string, number> = {
    all: allProjects.length,
    ...Object.fromEntries(
      sectors.map((s) => [
        s.slug,
        allProjects.filter((p) => p.category === s.slug).length,
      ]),
    ),
  };

  return (
    <main className="relative">
      {/* Hero Section */}
      <ProjectCategoryHero
        category={category}
        projectCount={projectListItems.length}
      />

      <ContentBreadcrumb
        items={[
          { label: "Home", href: "/" },
          { label: "Projects", href: "/projects" },
          { label: "Categories", href: "/projects/category" },
          { label: category.label, href: `/projects/category/${categorySlug}`, isCurrent: true },
        ]}
        section="projects"
      />

      <SectionIntro data={categoryProjectsIntroData} />

      {/* Projects Grid Section */}
      <Suspense fallback={null}>
        <ProjectCategoryListSection
          items={projectListItems}
          sidebarCards={sidebarCards}
          counts={counts}
          category={category}
          categorySlug={categorySlug}
        />
      </Suspense>
      <Footer />
    </main>
  );
}
