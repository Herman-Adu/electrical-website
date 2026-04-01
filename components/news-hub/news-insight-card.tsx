"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import type { NewsArticle } from "@/types/news";
import { NewsArticleCardShell } from "./news-article-card-shell";

interface NewsInsightCardProps {
  article: NewsArticle;
}

function formatDate(dateString: string): string {
  return new Date(dateString).toLocaleDateString("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

export function NewsInsightCard({ article }: NewsInsightCardProps) {
  return (
    <Link
      href={`/news-hub/category/${article.category}/${article.slug}`}
      className="group block h-full"
    >
      <NewsArticleCardShell className="h-full p-6 transition-all border-l-4 border-l-electric-cyan/30 hover:border-l-electric-cyan hover:shadow-[0_0_30px_rgba(0,243,189,0.15)]">
        <div className="flex h-full flex-col justify-between gap-5">
          <div className="space-y-4">
            {/* Icon + category badge */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="text-2xl">💡</span>
                <span className="font-mono text-[9px] uppercase tracking-[0.2em] text-electric-cyan/70">
                  Insight
                </span>
              </div>
              <span className="font-mono text-[9px] uppercase tracking-[0.16em] text-foreground/40">
                {formatDate(article.publishedAt)}
              </span>
            </div>

            {/* Title */}
            <h3 className="text-lg font-bold text-white leading-snug group-hover:text-electric-cyan transition-colors">
              {article.title}
            </h3>

            {/* Excerpt */}
            <p className="text-sm leading-6 text-foreground/65 line-clamp-3">
              {article.excerpt}
            </p>

            {/* Tags */}
            {article.tags.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {article.tags.slice(0, 3).map((tag) => (
                  <span
                    key={tag}
                    className="rounded-md bg-electric-cyan/10 px-2 py-1 font-mono text-[8px] uppercase tracking-[0.14em] text-electric-cyan/60"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            )}
          </div>

          {/* Bottom */}
          <div className="flex items-center justify-between pt-3 border-t border-electric-cyan/10">
            <div className="flex items-center gap-2">
              <span className="font-mono text-[9px] uppercase tracking-[0.16em] text-foreground/50">
                {article.readTime}
              </span>
            </div>
            <motion.span
              className="font-mono text-[9px] uppercase tracking-[0.16em] text-electric-cyan/80"
              whileHover={{ x: 3 }}
            >
              Read Insight →
            </motion.span>
          </div>
        </div>
      </NewsArticleCardShell>
    </Link>
  );
}
