"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import type { NewsArticle } from "@/types/news";
import { NewsArticleCardShell } from "./news-article-card-shell";

interface NewsReviewCardProps {
  article: NewsArticle;
}

function formatDate(dateString: string): string {
  return new Date(dateString).toLocaleDateString("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

export function NewsReviewCard({ article }: NewsReviewCardProps) {
  // Generate stars based on if there's a rating in spotlight metric
  const hasRating = article.spotlightMetric?.label.toLowerCase().includes("rating");
  const ratingValue = hasRating ? parseFloat(article.spotlightMetric?.value || "5") : 5;
  const fullStars = Math.floor(ratingValue);
  const hasHalfStar = ratingValue % 1 >= 0.5;

  return (
    <Link
      href={`/news-hub/category/${article.category}/${article.slug}`}
      className="group block h-full"
    >
      <NewsArticleCardShell className="h-full p-6 transition-all bg-gradient-to-br from-electric-cyan/5 to-transparent hover:from-electric-cyan/10 hover:border-electric-cyan/50 hover:shadow-[0_0_30px_rgba(0,243,189,0.15)]">
        <div className="flex h-full flex-col justify-between gap-5">
          <div className="space-y-4">
            {/* Review header */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="text-xl">⭐</span>
                <span className="font-mono text-[9px] uppercase tracking-[0.2em] text-electric-cyan/70">
                  Customer Review
                </span>
              </div>
              {/* Star rating */}
              <div className="flex items-center gap-0.5">
                {Array.from({ length: 5 }).map((_, i) => (
                  <span
                    key={i}
                    className={`text-sm ${
                      i < fullStars
                        ? "text-electric-cyan"
                        : i === fullStars && hasHalfStar
                        ? "text-electric-cyan/50"
                        : "text-foreground/20"
                    }`}
                  >
                    ★
                  </span>
                ))}
              </div>
            </div>

            {/* Quote-style title */}
            <div className="relative">
              <span className="absolute -left-2 -top-2 text-4xl text-electric-cyan/20">"</span>
              <h3 className="text-lg font-bold text-white leading-snug pl-4 group-hover:text-electric-cyan transition-colors">
                {article.title}
              </h3>
            </div>

            {/* Excerpt */}
            <p className="text-sm leading-6 text-foreground/65 line-clamp-3 italic">
              {article.excerpt}
            </p>

            {/* Reviewer info */}
            <div className="flex items-center gap-3">
              <div className="h-8 w-8 rounded-full bg-electric-cyan/20 flex items-center justify-center">
                <span className="font-mono text-xs text-electric-cyan">
                  {article.author.name.charAt(0)}
                </span>
              </div>
              <div>
                <div className="text-sm font-medium text-white">
                  {article.author.name}
                </div>
                <div className="font-mono text-[9px] uppercase tracking-[0.14em] text-foreground/50">
                  {article.author.role}
                </div>
              </div>
            </div>
          </div>

          {/* Bottom */}
          <div className="flex items-center justify-between pt-3 border-t border-electric-cyan/10">
            <span className="font-mono text-[9px] uppercase tracking-[0.16em] text-foreground/40">
              {formatDate(article.publishedAt)}
            </span>
            <motion.span
              className="font-mono text-[9px] uppercase tracking-[0.16em] text-electric-cyan/80"
              whileHover={{ x: 3 }}
            >
              Read Full Review →
            </motion.span>
          </div>
        </div>
      </NewsArticleCardShell>
    </Link>
  );
}
