/**
 * Structured data (JSON-LD) builders for SEO and rich snippets
 * Used in layout, pages, and components to provide Schema.org compliant data
 */

import { siteConfig } from "@/lib/site-config";
import type { NewsArticle } from "@/types/news";
import type { Project } from "@/types/projects";

/**
 * Article schema for project detail pages
 */
export function getArticleSchema(project: Project) {
  return {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: project.title,
    description: project.description,
    image: project.coverImage?.src || undefined,
    url: siteConfig.getUrl(
      `/projects/category/${project.category}/${project.slug}`,
    ),
    author: {
      "@type": "Organization",
      name: siteConfig.org.name,
    },
    publisher: {
      "@type": "Organization",
      name: siteConfig.org.name,
      url: siteConfig.getUrl(siteConfig.routes.home),
    },
    datePublished: project.publishedAt || new Date().toISOString(),
    dateModified: project.updatedAt || new Date().toISOString(),
    keywords: project.tags?.join(", "),
  };
}

/**
 * Article schema for news hub detail pages
 */
export function getNewsArticleSchema(article: NewsArticle) {
  return {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: article.title,
    description: article.excerpt,
    image: article.featuredImage?.src || undefined,
    url: siteConfig.getUrl(
      `/news-hub/category/${article.category}/${article.slug}`,
    ),
    author: {
      "@type": "Person",
      name: article.author.name,
    },
    publisher: {
      "@type": "Organization",
      name: siteConfig.org.name,
      url: siteConfig.getUrl(siteConfig.routes.home),
    },
    datePublished: article.publishedAt,
    dateModified: article.updatedAt,
    keywords: article.tags.join(", "),
  };
}

/**
 * Breadcrumb schema helper
 * Use for navigation chains like: Home > Projects > Category > Project
 */
export function getBreadcrumbSchema(
  items: Array<{ name: string; url: string }>,
) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: item.url,
    })),
  };
}

/**
 * WebPage schema for category and project listing pages
 */
export function getWebPageSchema(options: {
  name: string;
  description: string;
  url: string;
}) {
  return {
    "@context": "https://schema.org",
    "@type": "WebPage",
    name: options.name,
    description: options.description,
    url: options.url,
    publisher: {
      "@type": "Organization",
      name: siteConfig.org.name,
      url: siteConfig.getUrl(siteConfig.routes.home),
    },
  };
}

/**
 * ItemList schema for collections (projects in a category, etc.)
 */
export function getItemListSchema(options: {
  name: string;
  url: string;
  items: Array<{ name: string; url: string; image?: string }>;
}) {
  return {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: options.name,
    url: options.url,
    numberOfItems: options.items.length,
    itemListElement: options.items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      url: item.url,
      image: item.image || undefined,
    })),
  };
}

/**
 * Render JSON-LD as a script tag
 * Usage: <script dangerouslySetInnerHTML={{ __html: JSON.stringify(getArticleSchema(...)) }} type="application/ld+json" />
 */
export function JsonLdScriptTag(schema: object) {
  return `<script type="application/ld+json">${JSON.stringify(schema)}</script>`;
}
