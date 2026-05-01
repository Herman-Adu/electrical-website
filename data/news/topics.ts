import type { NewsArticle } from "@/types/news";

export interface NewsTopic {
  slug: string;
  label: string;
  tags: string[];
}

export const newsTopics: NewsTopic[] = [
  { slug: "residential", label: "Residential", tags: ["Residential", "Smart Living", "Smart Home", "Rewiring", "Heritage", "KNX", "EV Charging", "Automation", "DNO", "Load Assessment"] },
  { slug: "commercial", label: "Commercial", tags: ["Commercial", "Property Management", "Hospitality", "Retail", "FM", "Upgrades", "Standardisation", "Multi-Site"] },
  { slug: "industrial", label: "Industrial", tags: ["Industrial", "Switchgear", "Data Centre", "Critical Power", "Tier III", "Power Factor", "Energy Efficiency", "Motors", "LED Lighting", "ROI"] },
  { slug: "community", label: "Community", tags: ["Community", "Education", "Healthcare", "HTM 06-01", "Summer Works", "Resilience"] },
  { slug: "campaigns", label: "Campaigns", tags: ["Campaign", "Partners", "Coordination", "Schneider", "Technical Excellence", "Framework"] },
  { slug: "marketing", label: "Marketing", tags: ["Trust", "Insurance", "Business", "Compliance", "Net Zero", "Heat Pumps", "Electrification"] },
  { slug: "social-media", label: "Social Media", tags: ["Reviews"] },
];

export function getNewsArticlesByTopic(slug: string, articles: NewsArticle[]): NewsArticle[] {
  const topic = newsTopics.find((t) => t.slug === slug);
  if (!topic) return [];
  return articles.filter((a) => a.tags.some((tag) => topic.tags.includes(tag)));
}

export function getNewsTopicBySlug(slug: string): NewsTopic | undefined {
  return newsTopics.find((t) => t.slug === slug);
}
