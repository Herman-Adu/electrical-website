import Link from "next/link";
import type { NewsArticleListItem } from "@/types/news";
import { NewsArticleCardShell } from "@/components/news-hub/news-article-card-shell";

interface NewsHubArticleCardProps {
  item: NewsArticleListItem;
  isSaved?: boolean;
  isPending?: boolean;
  onToggleSave?: () => void;
}

function formatDate(value: string) {
  return new Intl.DateTimeFormat("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  }).format(new Date(value));
}

export function NewsHubArticleCard({
  item,
  isSaved = false,
  isPending = false,
  onToggleSave,
}: NewsHubArticleCardProps) {
  return (
    <NewsArticleCardShell
      className={`p-5 transition-colors ${isPending ? "opacity-70" : "hover:border-electric-cyan/40"}`}
    >
      <div className="flex h-full flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">
        <div className="space-y-4">
          <div className="flex flex-wrap items-center gap-3 font-mono text-[10px] uppercase tracking-[0.18em] text-muted-foreground">
            <span className="rounded-full border border-border/60 bg-background/60 px-2.5 py-1 text-foreground">
              {item.categoryLabel}
            </span>
            {item.isFeatured ? (
              <span className="rounded-full border border-electric-cyan/30 bg-electric-cyan/10 px-2.5 py-1 text-electric-cyan">
                Featured
              </span>
            ) : null}
            <span>{formatDate(item.publishedAt)}</span>
            <span>{item.readTime}</span>
          </div>

          <div className="space-y-2">
            <h3 className="text-xl font-semibold tracking-tight text-foreground">
              {item.title}
            </h3>
            <p className="max-w-2xl text-sm leading-6 text-muted-foreground">
              {item.excerpt}
            </p>
          </div>

          {item.partnerLabel ? (
            <div className="font-mono text-[10px] uppercase tracking-[0.18em] text-electric-cyan/80">
              Partner: {item.partnerLabel}
            </div>
          ) : null}
        </div>

        <div className="flex shrink-0 flex-row gap-3 lg:flex-col lg:items-end">
          <button
            type="button"
            onClick={onToggleSave}
            className={`rounded-full border px-3 py-2 font-mono text-[10px] uppercase tracking-[0.18em] transition-colors ${
              isSaved
                ? "border-electric-cyan/40 bg-electric-cyan/15 text-electric-cyan"
                : "border-border/60 bg-background/60 text-muted-foreground hover:text-foreground"
            }`}
          >
            {isSaved ? "Saved" : "Save story"}
          </button>
          <Link
            href={`/news-hub/category/${item.category}/${item.slug}`}
            className="inline-flex items-center gap-2 rounded-full border border-border/60 bg-background/60 px-3 py-2 font-mono text-[10px] uppercase tracking-[0.18em] text-foreground transition-colors hover:border-electric-cyan/30 hover:text-electric-cyan"
          >
            Open article
            <span aria-hidden>→</span>
          </Link>
        </div>
      </div>
    </NewsArticleCardShell>
  );
}
