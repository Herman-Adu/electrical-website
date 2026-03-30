import Image from "next/image";
import Link from "next/link";
import type { NewsArticle } from "@/types/news";
import { NewsArticleCardShell } from "@/components/news-hub/news-article-card-shell";

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
    <NewsArticleCardShell className="overflow-hidden">
      <div className="grid gap-0 lg:grid-cols-[1.15fr_0.85fr]">
        <div className="relative min-h-72 border-b border-border/40 lg:min-h-96 lg:border-b-0 lg:border-r">
          <Image
            src={article.featuredImage.src}
            alt={article.featuredImage.alt}
            fill
            sizes="(max-width: 1024px) 100vw, 60vw"
            className="object-cover"
            priority
          />
          <div className="absolute inset-0 bg-linear-to-t from-background via-background/35 to-transparent" />
          <div className="absolute left-5 top-5 rounded-full border border-electric-cyan/30 bg-electric-cyan/15 px-3 py-1 font-mono text-[10px] uppercase tracking-[0.2em] text-electric-cyan">
            Featured story
          </div>
          <div className="absolute bottom-5 left-5 right-5 flex flex-wrap items-center gap-3">
            <span className="rounded-full border border-border/60 bg-background/80 px-3 py-1 font-mono text-[10px] uppercase tracking-[0.2em] text-foreground">
              {article.categoryLabel}
            </span>
            {article.spotlightMetric ? (
              <span className="rounded-full border border-border/60 bg-background/80 px-3 py-1 font-mono text-[10px] uppercase tracking-[0.2em] text-muted-foreground">
                {article.spotlightMetric.label}: {article.spotlightMetric.value}
              </span>
            ) : null}
          </div>
        </div>

        <div className="flex flex-col justify-between gap-8 p-6 sm:p-8">
          <div className="space-y-5">
            <div className="flex flex-wrap items-center gap-3 font-mono text-[10px] uppercase tracking-[0.2em] text-muted-foreground">
              <span>{formatDate(article.publishedAt)}</span>
              <span className="h-1 w-1 rounded-full bg-border" />
              <span>{article.readTime}</span>
              {article.partnerLabel ? (
                <>
                  <span className="h-1 w-1 rounded-full bg-border" />
                  <span>{article.partnerLabel}</span>
                </>
              ) : null}
            </div>
            <div className="space-y-3">
              <h2 className="text-3xl font-black tracking-tight text-foreground sm:text-4xl">
                {article.title}
              </h2>
              <p className="text-base leading-7 text-muted-foreground">
                {article.excerpt}
              </p>
            </div>
          </div>

          <div className="grid gap-3 sm:grid-cols-3">
            <div className="rounded-2xl border border-border/40 bg-background/50 p-4">
              <div className="font-mono text-[10px] uppercase tracking-[0.18em] text-muted-foreground">
                Author
              </div>
              <div className="mt-2 font-semibold text-foreground">
                {article.author.name}
              </div>
            </div>
            <div className="rounded-2xl border border-border/40 bg-background/50 p-4">
              <div className="font-mono text-[10px] uppercase tracking-[0.18em] text-muted-foreground">
                Format
              </div>
              <div className="mt-2 font-semibold text-foreground">
                Editorial story
              </div>
            </div>
            <div className="rounded-2xl border border-border/40 bg-background/50 p-4">
              <div className="font-mono text-[10px] uppercase tracking-[0.18em] text-muted-foreground">
                CMS mode
              </div>
              <div className="mt-2 font-semibold text-foreground">
                Schema ready
              </div>
            </div>
          </div>

          <Link
            href={`/news-hub/category/${article.category}/${article.slug}`}
            className="inline-flex items-center gap-2 font-mono text-[11px] uppercase tracking-[0.18em] text-electric-cyan transition-transform hover:translate-x-1"
          >
            Read featured article
            <span aria-hidden>→</span>
          </Link>
        </div>
      </div>
    </NewsArticleCardShell>
  );
}
