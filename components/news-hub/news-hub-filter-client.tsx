"use client";

import { useState, useTransition } from "react";
import { NewsArticleFilterBar } from "@/components/news-hub/news-article-filter-bar";
import { NewsHubGridSection } from "@/components/news-hub/news-hub-grid-section";
import type { NewsCategory, NewsArticleListItem, NewsSidebarCard, NewsCategorySlug } from "@/types/news";

interface NewsHubFilterClientProps {
  categories: NewsCategory[];
  items: NewsArticleListItem[];
  sidebarCards: NewsSidebarCard[];
  counts: Record<string, number>;
}

export function NewsHubFilterClient({ categories, items, sidebarCards, counts }: NewsHubFilterClientProps) {
  const [activeSlug, setActiveSlug] = useState<NewsCategorySlug>("all");
  const [isPending, startTransition] = useTransition();

  const handleSelect = (slug: NewsCategorySlug) => {
    startTransition(() => {
      setActiveSlug(slug);
    });
  };

  const filtered = activeSlug === "all" ? items : items.filter((a) => a.category === activeSlug);

  return (
    <>
      <NewsArticleFilterBar
        categories={categories}
        activeSlug={activeSlug}
        counts={counts}
        onSelect={handleSelect}
      />
      <div className={isPending ? "opacity-60 transition-opacity" : "transition-opacity"}>
        <NewsHubGridSection items={filtered} sidebarCards={sidebarCards} />
      </div>
    </>
  );
}
