import type { Metadata } from "next";
import { createPageMetadata } from "@/lib/metadata";
import { SITE_URL } from "@/lib/site-config";
import type { NewsArticle, NewsCategory } from "@/types/news";

export function createNewsHubListMetadata(): Metadata {
  return createPageMetadata({
    title: "News Hub | Nexgen Electrical Innovations",
    description:
      "Explore the latest Nexgen updates across residential, industrial, partner, case-study, insight, and review content.",
    path: "/news-hub",
    keywords: [
      "electrical news",
      "industry insights",
      "partner stories",
      "case studies",
      "Nexgen updates",
    ],
    ogType: "website",
  });
}

export function createNewsHubCategoriesMetadata(): Metadata {
  return createPageMetadata({
    title: "News Hub Categories | Nexgen Electrical Innovations",
    description:
      "Browse the News Hub by category, including residential, industrial, partner, case-study, insight, and review content.",
    path: "/news-hub/category",
    ogType: "website",
  });
}

export function createNewsHubCategoryMetadata(
  category: NewsCategory,
): Metadata {
  return createPageMetadata({
    title: `${category.label} News | Nexgen Electrical Innovations`,
    description: category.description,
    path: `/news-hub/category/${category.slug}`,
    openGraphTitle: `${category.label} News | Nexgen Electrical Innovations`,
    openGraphDescription: category.description,
    ogType: "website",
  });
}

export function createNewsArticleMetadata(
  article: NewsArticle,
  canonicalPath = `/news-hub/category/${article.category}/${article.slug}`,
): Metadata {
  const title = `${article.title} | News Hub | Nexgen Electrical Innovations`;
  const description =
    `${article.excerpt} ${article.partnerLabel ? `Partner: ${article.partnerLabel}. ` : ""}${article.location ? `Location: ${article.location}.` : ""}`.trim();
  const ogImageUrl = `${SITE_URL}/api/og?title=${encodeURIComponent(article.title)}&category=${encodeURIComponent(article.categoryLabel)}${article.location ? `&location=${encodeURIComponent(article.location)}` : ""}`;

  return createPageMetadata({
    title,
    description,
    path: canonicalPath,
    keywords: [...article.tags, article.categoryLabel, "news article"],
    openGraphTitle: title,
    openGraphDescription: description,
    ogImage: ogImageUrl,
    ogType: "article",
  });
}
