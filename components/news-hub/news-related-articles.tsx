import Link from "next/link";
import type { NewsArticle } from "@/types/news";
import { NewsArticleCardShell } from "@/components/news-hub/news-article-card-shell";

interface NewsRelatedArticlesProps {
  articles: NewsArticle[];
}

export function NewsRelatedArticles({ articles }: NewsRelatedArticlesProps) {
  if (articles.length === 0) {
    return null;
  }

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-electric-cyan">
          📚 Related Articles
        </p>
        <h2 className="text-3xl font-bold text-foreground">
          Continue Reading
        </h2>
      </div>

      <div className="grid gap-4 lg:grid-cols-3">
        {articles.map((article) => (
          <Link
            key={article.id}
            href={`/news-hub/category/${article.category}/${article.slug}`}
            className="group block h-full"
          >
            <NewsArticleCardShell className="flex h-full flex-col justify-between gap-5 p-5 transition-all border-electric-cyan/20 hover:border-electric-cyan/50 hover:shadow-[0_0_30px_rgba(0,243,189,0.15)]">
              <div className="space-y-3">
                <div className="font-mono text-[10px] uppercase tracking-[0.18em] text-foreground/60">
                  {article.categoryLabel}
                </div>
                <h3 className="text-lg font-bold text-foreground group-hover:text-electric-cyan transition-colors">
                  {article.title}
                </h3>
                <p className="text-sm leading-6 text-foreground/70">
                  {article.excerpt}
                </p>
              </div>
              <span className="font-mono text-[10px] uppercase tracking-[0.18em] text-electric-cyan/80 transition-all group-hover:text-electric-cyan group-hover:translate-x-1">
                Read Article →
              </span>
            </NewsArticleCardShell>
          </Link>
        ))}
      </div>
    </div>
  );
}
