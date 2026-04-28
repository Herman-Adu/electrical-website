import Image from "next/image";
import Link from "next/link";
import type { NewsArticleListItem } from "@/types/news";
import { NewsArticleCardShell } from "@/components/news-hub/news-article-card-shell";
import { newsCategoryColors } from "@/data/news";

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
      className={`overflow-hidden transition-all ${
        isPending ? "opacity-60" : "hover:border-electric-cyan/50 hover:shadow-[0_0_25px_rgba(0,243,189,0.1)]"
      }`}
    >
      {/* Mobile/Tablet: Column layout (image top, content below) */}
      {/* Desktop: Row layout (image left, content right) */}
      <div className="flex flex-col md:flex-row">
        {/* Image Section */}
        <div className="relative h-48 w-full shrink-0 md:h-auto md:min-h-[180px] md:w-56 lg:w-64">
          {item.featuredImage ? (
            <Image
              src={item.featuredImage.src}
              alt={item.featuredImage.alt}
              fill
              sizes="(max-width: 768px) 100vw, 256px"
              className="object-cover"
            />
          ) : (
            <div className="absolute inset-0 bg-gradient-to-br from-electric-cyan/20 via-electric-cyan/10 to-background flex items-center justify-center">
              <div className="text-electric-cyan/40 font-mono text-[10px] uppercase tracking-widest">
                {item.categoryLabel}
              </div>
            </div>
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-background/60 via-transparent to-transparent md:bg-gradient-to-r md:from-transparent md:via-transparent md:to-background/40" />
          {item.isFeatured && (
            <div className="absolute left-3 top-3 rounded-md border border-electric-cyan/40 bg-electric-cyan/20 px-2 py-1 font-mono text-[9px] uppercase tracking-[0.16em] text-electric-cyan backdrop-blur-sm">
              Featured
            </div>
          )}
        </div>

        {/* Content Section */}
        <div className="flex flex-1 flex-col justify-between gap-4 p-5">
          <div className="space-y-3">
            {/* Meta info row */}
            <div className="flex flex-wrap items-center gap-2 font-mono text-[10px] uppercase tracking-[0.18em] text-foreground/60">
              <span className={`rounded-md border px-2.5 py-1 ${newsCategoryColors[item.category].badge}`}>
                {item.categoryLabel}
              </span>
              <span className="text-foreground/50">{formatDate(item.publishedAt)}</span>
              <span className="text-foreground/50">{item.readTime}</span>
            </div>

            {/* Title and excerpt */}
            <div className="space-y-2">
              <h3 className="text-lg font-bold tracking-tight text-foreground leading-snug line-clamp-2">
                {item.title}
              </h3>
              <p className="text-sm leading-6 text-foreground/70 line-clamp-2">
                {item.excerpt}
              </p>
            </div>

            {item.partnerLabel && (
              <div className="font-mono text-[10px] uppercase tracking-[0.18em] text-electric-cyan/70">
                Partner: {item.partnerLabel}
              </div>
            )}
          </div>

          {/* Actions row */}
          <div className="flex items-center justify-between gap-3 pt-2 border-t border-electric-cyan/10">
            <div className="flex gap-2">
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
                {isSaved ? "Saved" : "Save"}
              </button>
            </div>
            <Link
              href={`/news-hub/category/${item.category}/${item.slug}`}
              className="inline-flex items-center gap-1.5 rounded-lg border border-electric-cyan/30 bg-electric-cyan/10 px-4 py-2 font-mono text-[10px] uppercase tracking-[0.18em] text-electric-cyan transition-all hover:bg-electric-cyan/20 hover:shadow-[0_0_15px_rgba(0,243,189,0.15)]"
            >
              Read Article
              <span aria-hidden>→</span>
            </Link>
          </div>
        </div>
      </div>
    </NewsArticleCardShell>
  );
}
