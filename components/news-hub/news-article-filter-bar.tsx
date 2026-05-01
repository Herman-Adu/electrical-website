"use client";
import type { NewsCategory, NewsCategorySlug } from "@/types/news";

interface NewsArticleFilterBarProps {
  categories: NewsCategory[];
  activeSlug: NewsCategorySlug;
  counts: Record<string, number>;
  onSelect: (slug: NewsCategorySlug) => void;
}

export function NewsArticleFilterBar({ categories, activeSlug, counts, onSelect }: NewsArticleFilterBarProps) {
  return (
    <div className="sticky top-0 z-40 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div role="group" aria-label="Filter articles by channel" className="flex overflow-x-auto scrollbar-hide gap-2 py-3 scroll-smooth">
          <button aria-pressed={activeSlug === "all"} onClick={() => onSelect("all")}
            className={["flex-none whitespace-nowrap scroll-mx-2 rounded-full px-4 py-1.5 text-sm font-medium transition-colors",
              activeSlug === "all" ? "bg-cyan-400 text-black ring-2 ring-cyan-400" : "bg-muted text-muted-foreground hover:bg-muted/80",
            ].join(" ")}>
            All Articles
            {counts.all != null && (<><span className="ml-1.5 text-xs opacity-70" aria-hidden="true">{counts.all}</span><span className="sr-only">{counts.all} articles</span></>)}
          </button>
          {categories.map((cat) => (
            <button key={cat.slug} aria-pressed={activeSlug === cat.slug} onClick={() => onSelect(cat.slug)}
              className={["flex-none whitespace-nowrap scroll-mx-2 rounded-full px-4 py-1.5 text-sm font-medium transition-colors",
                activeSlug === cat.slug ? "bg-cyan-400 text-black ring-2 ring-cyan-400" : "bg-muted text-muted-foreground hover:bg-muted/80",
              ].join(" ")}>
              {cat.label}
              {counts[cat.slug] != null && (<><span className="ml-1.5 text-xs opacity-70" aria-hidden="true">{counts[cat.slug]}</span><span className="sr-only">{counts[cat.slug]} articles</span></>)}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
