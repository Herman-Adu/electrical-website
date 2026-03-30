import type { MetadataRoute } from "next";
import { siteConfig } from "@/lib/site-config";
import {
  getNewsArticleSlugsByCategory,
  getNewsCategorySlugs,
} from "@/data/news";
import { getCategorySlugs, getProjectSlugsByCategory } from "@/data/projects";

export const dynamic = "force-static";
export const revalidate = 3600; // Revalidate every hour

/**
 * Dynamic sitemap generation for all routes including projects and categories
 * Submitted via robots.txt: Sitemap: https://example.com/sitemap.xml
 */
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  // Static routes
  const staticRoutes: MetadataRoute.Sitemap = [
    {
      url: siteConfig.getUrl(siteConfig.routes.home),
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 1,
    },
    {
      url: siteConfig.getUrl(siteConfig.routes.about),
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.8,
    },
    {
      url: siteConfig.getUrl(siteConfig.routes.services),
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.8,
    },
    {
      url: siteConfig.getUrl(siteConfig.routes.projects),
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.9,
    },
    {
      url: siteConfig.getUrl(siteConfig.routes.projectsCategory),
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.8,
    },
    {
      url: siteConfig.getUrl(siteConfig.routes.newsHub),
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.85,
    },
    {
      url: siteConfig.getUrl(siteConfig.routes.newsHubCategory),
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.75,
    },
    {
      url: siteConfig.getUrl(siteConfig.routes.contact),
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.7,
    },
  ];

  // Dynamic category routes
  const categorySlugs = await getCategorySlugs();
  const categoryRoutes: MetadataRoute.Sitemap = categorySlugs.map(
    (categorySlug) => ({
      url: siteConfig.getUrl(
        `${siteConfig.routes.projectsCategory}/${categorySlug}`,
      ),
      lastModified: new Date(),
      changeFrequency: "weekly" as const,
      priority: 0.8,
    }),
  );

  // Dynamic project routes (all projects across all categories)
  const projectRoutes: MetadataRoute.Sitemap[] = await Promise.all(
    categorySlugs.map(async (categorySlug) => {
      const projectSlugs = await getProjectSlugsByCategory(categorySlug);
      return projectSlugs.map((projectSlug) => ({
        url: siteConfig.getUrl(
          `${siteConfig.routes.projectsCategory}/${categorySlug}/${projectSlug}`,
        ),
        lastModified: new Date(),
        changeFrequency: "monthly" as const,
        priority: 0.7,
      }));
    }),
  );

  // Flatten project routes array
  const flatProjectRoutes = projectRoutes.flat();

  const newsCategorySlugs = await getNewsCategorySlugs();
  const newsCategoryRoutes: MetadataRoute.Sitemap = newsCategorySlugs.map(
    (categorySlug) => ({
      url: siteConfig.getUrl(
        `${siteConfig.routes.newsHubCategory}/${categorySlug}`,
      ),
      lastModified: new Date(),
      changeFrequency: "weekly" as const,
      priority: 0.7,
    }),
  );

  const newsArticleRoutes: MetadataRoute.Sitemap[] = await Promise.all(
    newsCategorySlugs.map(async (categorySlug) => {
      const articleSlugs = await getNewsArticleSlugsByCategory(categorySlug);
      return articleSlugs.map((articleSlug) => ({
        url: siteConfig.getUrl(
          `${siteConfig.routes.newsHubCategory}/${categorySlug}/${articleSlug}`,
        ),
        lastModified: new Date(),
        changeFrequency: "monthly" as const,
        priority: 0.65,
      }));
    }),
  );

  const flatNewsArticleRoutes = newsArticleRoutes.flat();

  // Combine all routes
  return [
    ...staticRoutes,
    ...categoryRoutes,
    ...flatProjectRoutes,
    ...newsCategoryRoutes,
    ...flatNewsArticleRoutes,
  ];
}
