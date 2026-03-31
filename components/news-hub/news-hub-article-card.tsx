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
      className={`p-5 transition-all ${
        isPending ? "opacity-60" : "hover:border-electric-cyan/50 hover:shadow-[0_0_25px_rgba(0,243,189,0.1)]"
      }`}
    >
      <div className="flex h-full flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">
        <div className="space-y-4 flex-1">
          <div className="flex flex-wrap items-center gap-2 font-mono text-[10px] uppercase tracking-[0.18em] text-foreground/60">
            <span className="rounded-md border border-electric-cyan/30 bg-electric-cyan/10 px-2.5 py-1 text-electric-cyan">
              {item.categoryLabel}
            </span>
            {item.isFeatured ? (
              <span className="rounded-md border border-electric-cyan/40 bg-electric-cyan/15 px-2.5 py-1 text-electric-cyan font-semibold">
                ⚡ Featured
              </span>
            ) : null}
            <span className="text-foreground/50">{formatDate(item.publishedAt)}</span>
            <span className="text-foreground/50">{item.readTime}</span>
          </div>

          <div className="space-y-2">
            <h3 className="text-lg font-bold tracking-tight text-white leading-snug">
              {item.title}
            </h3>
            <p className="max-w-2xl text-sm leading-6 text-foreground/70">
              {item.excerpt}
            </p>
          </div>

          {item.partnerLabel ? (
            <div className="font-mono text-[10px] uppercase tracking-[0.18em] text-electric-cyan/70">
              → {item.partnerLabel}
            </div>
          ) : null}
        </div>

        <div className="flex shrink-0 flex-row gap-2 lg:flex-col lg:items-end">
          <button
            type="button"
            onClick={onToggleSave}
            aria-disabled={isPending}
            aria-pressed={isSaved}
            disabled={isPending}
            className={`rounded-lg border px-3 py-2 font-mono text-[10px] uppercase tracking-[0.18em] transition-all ${
              isSaved
                ? "border-electric-cyan/40 bg-electric-cyan/15 text-electric-cyan shadow-[0_0_15px_rgba(0,243,189,0.2)]"
                : "border-border/40 bg-background/60 text-foreground/70 hover:border-electric-cyan/30 hover:text-electric-cyan"
            } ${isPending ? "cursor-not-allowed opacity-60" : ""}`}
          >
            {isSaved ? "💾 Saved" : "Save"}
          </button>
          <Link
            href={`/news-hub/category/${item.category}/${item.slug}`}
            className="inline-flex items-center gap-1 rounded-lg border border-border/40 bg-background/60 px-3 py-2 font-mono text-[10px] uppercase tracking-[0.18em] text-foreground/70 transition-all hover:border-electric-cyan/40 hover:text-electric-cyan"
          >
            Read
            <span aria-hidden>→</span>
          </Link>
        </div>
      </div>
    </NewsArticleCardShell>
  );
}
