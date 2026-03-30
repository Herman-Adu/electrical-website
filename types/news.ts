export type NewsCategorySlug =
  | "all"
  | "residential"
  | "industrial"
  | "partners"
  | "case-studies"
  | "insights"
  | "reviews";

export interface NewsCategory {
  slug: Exclude<NewsCategorySlug, "all">;
  label: string;
  description: string;
}

export interface NewsImage {
  src: string;
  alt: string;
}

export interface NewsAuthor {
  name: string;
  role: string;
}

export interface NewsSpotlightMetric {
  label: string;
  value: string;
}

export interface NewsQuote {
  quote: string;
  author: string;
  role: string;
}

export interface NewsDetailContent {
  intro: string[];
  takeaways: string[];
  spotlight?: NewsSpotlightMetric[];
  quote?: NewsQuote;
}

export interface NewsArticle {
  id: string;
  slug: string;
  category: Exclude<NewsCategorySlug, "all">;
  categoryLabel: NewsCategory["label"];
  title: string;
  excerpt: string;
  description: string;
  featuredImage: NewsImage;
  author: NewsAuthor;
  partnerLabel?: string;
  location?: string;
  readTime: string;
  tags: string[];
  isFeatured: boolean;
  publishedAt: string;
  updatedAt: string;
  spotlightMetric?: NewsSpotlightMetric;
  detail: NewsDetailContent;
}

export interface NewsArticleListItem {
  id: string;
  slug: string;
  category: Exclude<NewsCategorySlug, "all">;
  categoryLabel: NewsCategory["label"];
  title: string;
  excerpt: string;
  publishedAt: string;
  readTime: string;
  isFeatured: boolean;
  partnerLabel?: string;
}

export interface NewsHubMetricItem {
  id: string;
  title: string;
  value: string;
  description: string;
}

export type NewsSidebarCardType = "campaign" | "social" | "partner" | "review";

export interface NewsSidebarCard {
  id: string;
  type: NewsSidebarCardType;
  eyebrow: string;
  title: string;
  description: string;
  ctaLabel: string;
  href: string;
}
