import Image from "next/image";
import Link from "next/link";
import type { NewsArticle } from "@/types/news";
import { NewsArticleCardShell } from "@/components/news-hub/news-article-card-shell";
import { newsCategoryColors } from "@/data/news";

interface NewsHubFeaturedCardProps {
  article: NewsArticle;
}

function formatDate(value: string) {
  return new Intl.DateTimeFormat("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  }).format(new Date(value));
}

export function NewsHubFeaturedCard({ article }: NewsHubFeaturedCardProps) {
  return (
    <NewsArticleCardShell className="overflow-hidden border-electric-cyan/30 shadow-[0_0_40px_rgba(0,243,189,0.15)]">
      <div className="grid gap-0 lg:grid-cols-2">
        <div className="relative min-h-72 border-b border-electric-cyan/20 lg:min-h-96 lg:border-b-0 lg:border-r">
          <Image
            src={article.featuredImage.src}
            alt={article.featuredImage.alt}
            fill
            sizes="(max-width: 1024px) 100vw, 50vw"
            className="object-cover"
            priority
          />
          <div className="absolute inset-0 bg-linear-to-t from-background via-background/40 to-transparent" />
          <div className="absolute left-5 top-5 rounded-lg border border-electric-cyan/40 bg-electric-cyan/20 px-3 py-1.5 font-mono text-[10px] uppercase tracking-[0.2em] text-electric-cyan shadow-[0_0_12px_rgba(0,243,189,0.2)]">
            ⚡ Featured
          </div>
          <div className="absolute bottom-5 left-5 right-5 flex flex-wrap items-center gap-3">
            <span className={`rounded-lg border px-3 py-1.5 font-mono text-[10px] uppercase tracking-[0.2em] ${newsCategoryColors[article.category].featuredBadge}`}>
              {article.categoryLabel}
            </span>
            {article.spotlightMetric ? (
              <span className="rounded-lg border border-border/40 bg-background/90 px-3 py-1.5 font-mono text-[10px] uppercase tracking-[0.2em] text-foreground/70">
                {article.spotlightMetric.label}: {article.spotlightMetric.value}
              </span>
            ) : null}
          </div>
        </div>

        <div className="flex flex-col justify-between gap-8 p-6 sm:p-8 bg-gradient-to-br from-background to-background/80">
          <div className="space-y-5">
            <div className="flex flex-wrap items-center gap-3 font-mono text-[10px] uppercase tracking-[0.2em] text-foreground/60">
              <span>{formatDate(article.publishedAt)}</span>
              <span className="h-1 w-1 rounded-full bg-electric-cyan/40" />
              <span>{article.readTime}</span>
              {article.partnerLabel ? (
                <>
                  <span className="h-1 w-1 rounded-full bg-electric-cyan/40" />
                  <span className="text-electric-cyan/80">{article.partnerLabel}</span>
                </>
              ) : null}
            </div>
            <div className="space-y-3">
              <h2 className="text-3xl font-black tracking-tight text-foreground sm:text-4xl leading-tight">
                {article.title}
              </h2>
              <p className="text-base leading-7 text-foreground/75">
                {article.excerpt}
              </p>
            </div>
          </div>

          <div className="grid gap-3 sm:grid-cols-3">
            <div className="rounded-lg border border-electric-cyan/20 bg-electric-cyan/5 p-4 backdrop-blur-sm">
              <div className="font-mono text-[10px] uppercase tracking-[0.18em] text-foreground/60">
                Author
              </div>
              <div className="mt-2 font-semibold text-foreground">
                {article.author.name}
              </div>
            </div>
            <div className="rounded-lg border border-electric-cyan/20 bg-electric-cyan/5 p-4 backdrop-blur-sm">
              <div className="font-mono text-[10px] uppercase tracking-[0.18em] text-foreground/60">
                Format
              </div>
              <div className="mt-2 font-semibold text-foreground">
                Editorial Brief
              </div>
            </div>
            <div className="rounded-lg border border-electric-cyan/20 bg-electric-cyan/5 p-4 backdrop-blur-sm">
              <div className="font-mono text-[10px] uppercase tracking-[0.18em] text-foreground/60">
                Status
              </div>
              <div className="mt-2 font-semibold text-electric-cyan">
                Live Now
              </div>
            </div>
          </div>

          <Link
            href={`/news-hub/category/${article.category}/${article.slug}`}
            className="inline-flex items-center gap-2 font-mono text-[11px] uppercase tracking-[0.18em] text-electric-cyan transition-all hover:gap-3 hover:text-electric-cyan/80"
          >
            Read Feature
            <span aria-hidden className="inline-block transition-transform group-hover:translate-x-1">→</span>
          </Link>
        </div>
      </div>
    </NewsArticleCardShell>
  );
}
