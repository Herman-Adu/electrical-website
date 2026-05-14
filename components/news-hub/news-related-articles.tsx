import Image from "next/image";
import Link from "next/link";
import type { NewsArticle } from "@/types/news";
import { NewsArticleCardShell } from "@/components/news-hub/news-article-card-shell";
import { newsCategoryColors } from "@/data/news";

interface NewsRelatedArticlesProps {
  articles: NewsArticle[];
}

function formatDate(value: string) {
  return new Intl.DateTimeFormat("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  })
    .format(new Date(value))
    .toUpperCase();
}

export function NewsRelatedArticles({ articles }: NewsRelatedArticlesProps) {
  if (articles.length === 0) return null;

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <p className="flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.2em] text-electric-cyan">
          <span className="h-1 w-1 rounded-full bg-electric-cyan animate-pulse" />
          Related Articles
        </p>
        <h2 className="text-3xl font-bold text-foreground">Continue Reading</h2>
      </div>

      <div className="grid gap-4 lg:grid-cols-3">
        {articles.map((article) => (
          <NewsArticleCardShell
            key={article.id}
            className="group overflow-hidden flex flex-col hover:border-electric-cyan/50 hover:shadow-[0_0_30px_rgba(0,243,189,0.15)] transition-all"
          >
            {/* Image */}
            <div className="relative h-44 w-full shrink-0 overflow-hidden">
              {article.featuredImage ? (
                <Image
                  src={article.featuredImage.src}
                  alt={article.featuredImage.alt}
                  fill
                  sizes="(max-width: 768px) 100vw, 33vw"
                  className="object-cover transition-transform duration-500 group-hover:scale-105"
                />
              ) : (
                <div className="absolute inset-0 bg-gradient-to-br from-electric-cyan/20 via-electric-cyan/10 to-background flex items-center justify-center">
                  <div className="text-electric-cyan/40 font-mono text-[10px] uppercase tracking-widest">
                    {article.categoryLabel}
                  </div>
                </div>
              )}
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
            </div>

            {/* Content */}
            <div className="flex flex-1 flex-col justify-between gap-4 p-5">
              <div className="space-y-3">
                {/* Category badge + meta */}
                <div className="flex flex-wrap items-center gap-2 font-mono text-[10px] uppercase tracking-[0.18em]">
                  <span
                    className={`rounded-md border px-2.5 py-1 ${newsCategoryColors[article.category].badge}`}
                  >
                    {article.categoryLabel}
                  </span>
                  <span className="text-foreground/50">
                    {formatDate(article.publishedAt)}&nbsp;&nbsp;{article.readTime}
                  </span>
                </div>

                <h3 className="text-base font-bold text-foreground leading-snug line-clamp-2 group-hover:text-electric-cyan transition-colors">
                  {article.title}
                </h3>

                <p className="text-sm leading-6 text-foreground/70 line-clamp-2">
                  {article.excerpt}
                </p>

                {article.partnerLabel && (
                  <div className="font-mono text-[10px] uppercase tracking-[0.18em] text-electric-cyan/70">
                    Partner: {article.partnerLabel}
                  </div>
                )}
              </div>

              {/* Actions */}
              <div className="flex items-center justify-between gap-3 pt-2 border-t border-electric-cyan/10">
                <button
                  type="button"
                  className="rounded-lg border border-border/40 bg-background/60 px-3 py-2 font-mono text-[10px] uppercase tracking-[0.18em] text-foreground/70 hover:border-electric-cyan/30 hover:text-electric-cyan transition-all"
                >
                  Save
                </button>
                <Link
                  href={`/news-hub/category/${article.category}/${article.slug}`}
                  className="inline-flex items-center gap-1.5 rounded-lg border border-electric-cyan/30 bg-electric-cyan/10 px-4 py-2 font-mono text-[10px] uppercase tracking-[0.18em] text-electric-cyan transition-all hover:bg-electric-cyan/20 hover:shadow-[0_0_15px_rgba(0,243,189,0.15)]"
                >
                  Read Article <span aria-hidden>→</span>
                </Link>
              </div>
            </div>
          </NewsArticleCardShell>
        ))}
      </div>
    </div>
  );
}
