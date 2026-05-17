"use client";

import { useSearchParams } from "next/navigation";
import { NewsHubGridSection } from "@/components/news-hub/news-hub-grid-section";
import type { NewsArticleListItem, NewsCategorySlug, NewsSidebarCard } from "@/types/news";

interface NewsHubFilterClientProps {
  items: NewsArticleListItem[];
  sidebarCards: NewsSidebarCard[];
  counts: Record<string, number>;
}

// Defensive validation — keep this list in sync with the literal union in
// `types/news.ts`. We intentionally do not import the slider's helper to keep
// the filter client independent of slider internals.
const VALID_SLUGS = new Set<NewsCategorySlug>([
  "all",
  "residential",
  "industrial",
  "partners",
  "case-studies",
  "insights",
  "reviews",
]);

function isValidCategorySlug(value: string | null): value is NewsCategorySlug {
  return value !== null && VALID_SLUGS.has(value as NewsCategorySlug);
}

export function NewsHubFilterClient({ items, sidebarCards, counts }: NewsHubFilterClientProps) {
  // Single source of truth: the URL. The slider mutates `?category=<slug>` (or
  // clears it for "all"); this component reads it. No local state, no props
  // for the active category — if the URL says it, that's the truth.
  const searchParams = useSearchParams();
  const rawCategory = searchParams?.get("category") ?? null;
  const activeSlug: NewsCategorySlug = isValidCategorySlug(rawCategory) ? rawCategory : "all";

  const filtered = activeSlug === "all" ? items : items.filter((a) => a.category === activeSlug);

  return <NewsHubGridSection items={filtered} sidebarCards={sidebarCards} counts={counts} />;
}
