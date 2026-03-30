import Link from "next/link";
import type { NewsCategory } from "@/types/news";
import { NewsArticleCardShell } from "@/components/news-hub/news-article-card-shell";

interface NewsCategoryCardProps {
  category: NewsCategory;
  articleCount: number;
}

export function NewsCategoryCard({
  category,
  articleCount,
}: NewsCategoryCardProps) {
  return (
    <Link
      href={`/news-hub/category/${category.slug}`}
      className="group block h-full"
    >
      <NewsArticleCardShell className="flex h-full flex-col justify-between gap-6 p-6 transition-colors group-hover:border-electric-cyan/40">
        <div className="space-y-4">
          <div className="font-mono text-[10px] uppercase tracking-[0.2em] text-electric-cyan/80">
            {category.slug}
          </div>
          <div className="space-y-2">
            <h2 className="text-2xl font-bold text-foreground">
              {category.label}
            </h2>
            <p className="text-sm leading-6 text-muted-foreground">
              {category.description}
            </p>
          </div>
        </div>

        <div className="flex items-center justify-between gap-4">
          <span className="rounded-full border border-border/60 px-3 py-1 font-mono text-[10px] uppercase tracking-[0.18em] text-muted-foreground">
            {articleCount} stories
          </span>
          <span className="font-mono text-[10px] uppercase tracking-[0.18em] text-electric-cyan transition-transform group-hover:translate-x-1">
            View category →
          </span>
        </div>
      </NewsArticleCardShell>
    </Link>
  );
}
