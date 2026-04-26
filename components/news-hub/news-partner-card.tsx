"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import type { NewsArticle } from "@/types/news";
import { NewsArticleCardShell } from "./news-article-card-shell";

interface NewsPartnerCardProps {
  article: NewsArticle;
}

function formatDate(dateString: string): string {
  return new Date(dateString).toLocaleDateString("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

export function NewsPartnerCard({ article }: NewsPartnerCardProps) {
  return (
    <Link
      href={`/news-hub/category/${article.category}/${article.slug}`}
      className="group block h-full"
    >
      <NewsArticleCardShell className="relative h-full overflow-hidden p-6 transition-all hover:border-electric-cyan/50 hover:shadow-[0_0_35px_rgba(0,243,189,0.18)]">
        {/* Partner highlight stripe */}
        <div className="absolute left-0 top-0 h-full w-1 bg-gradient-to-b from-electric-cyan via-electric-cyan/50 to-transparent" />
        
        <div className="flex h-full flex-col justify-between gap-5 pl-4">
          <div className="space-y-4">
            {/* Partner badge */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 rounded-lg border border-electric-cyan/30 bg-electric-cyan/10 px-3 py-1.5">
                <span className="text-sm">🤝</span>
                <span className="font-mono text-[9px] uppercase tracking-[0.18em] text-electric-cyan">
                  {article.partnerLabel || "Partner Story"}
                </span>
              </div>
            </div>

            {/* Title */}
            <h3 className="text-lg font-bold text-foreground leading-snug group-hover:text-electric-cyan transition-colors">
              {article.title}
            </h3>

            {/* Excerpt */}
            <p className="text-sm leading-6 text-foreground/65 line-clamp-3">
              {article.excerpt}
            </p>
          </div>

          {/* Meta + CTA */}
          <div className="flex items-center justify-between pt-3 border-t border-electric-cyan/10">
            <div className="flex items-center gap-3 font-mono text-[9px] uppercase tracking-[0.16em] text-foreground/50">
              <span>{formatDate(article.publishedAt)}</span>
              <span className="h-1 w-1 rounded-full bg-electric-cyan/30" />
              <span>{article.readTime}</span>
            </div>
            <motion.span
              className="font-mono text-[9px] uppercase tracking-[0.16em] text-electric-cyan/80"
              whileHover={{ x: 3 }}
            >
              Read More →
            </motion.span>
          </div>
        </div>
      </NewsArticleCardShell>
    </Link>
  );
}
