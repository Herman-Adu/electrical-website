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

export interface NewsTimelineItem {
  phase: string;
  title: string;
  description: string;
  duration?: string;
}

export interface NewsChallengeItem {
  title: string;
  description: string;
  solution: string;
}

export interface NewsSpecification {
  category: string;
  items: { label: string; value: string }[];
}

export interface NewsGalleryImage {
  src: string;
  alt: string;
  caption?: string;
}

export interface NewsDetailContent {
  intro: string[];
  body?: string[];
  takeaways: string[];
  spotlight?: NewsSpotlightMetric[];
  quote?: NewsQuote;
  scope?: string[];
  methodology?: string[];
  challenges?: NewsChallengeItem[];
  timeline?: NewsTimelineItem[];
  specifications?: NewsSpecification[];
  results?: string[];
  gallery?: NewsGalleryImage[];
  conclusion?: string[];
  additionalQuotes?: NewsQuote[];
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
  featuredImage?: NewsImage;
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
  /** Categories this card should appear on. If undefined/empty, shows on all pages including main hub */
  targetCategories?: NewsCategorySlug[];
}
