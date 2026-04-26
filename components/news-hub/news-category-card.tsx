"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import type { NewsCategory } from "@/types/news";
import { NewsArticleCardShell } from "@/components/news-hub/news-article-card-shell";

interface NewsCategoryCardProps {
  category: NewsCategory;
  articleCount: number;
}

const categoryIcons: Record<string, string> = {
  residential: "🏠",
  industrial: "🏭",
  partners: "🤝",
  "case-studies": "📊",
  insights: "💡",
  reviews: "⭐",
};

export function NewsCategoryCard({
  category,
  articleCount,
}: NewsCategoryCardProps) {
  const icon = categoryIcons[category.slug] || "📰";

  return (
    <Link
      href={`/news-hub/category/${category.slug}`}
      className="group block h-full"
    >
      <motion.div
        whileHover={{ y: -4 }}
        transition={{ type: "spring", stiffness: 300, damping: 20 }}
        className="h-full"
      >
        <NewsArticleCardShell className="flex h-full flex-col justify-between gap-6 p-6 transition-all border-electric-cyan/30 hover:border-electric-cyan/60 hover:shadow-[0_0_35px_rgba(0,243,189,0.2)]">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="font-mono text-[10px] uppercase tracking-[0.2em] text-electric-cyan/70">
                → {category.slug}
              </div>
              <span className="text-2xl">{icon}</span>
            </div>
            <div className="space-y-3">
              <h2 className="text-2xl font-bold text-foreground group-hover:text-electric-cyan transition-colors">
                {category.label}
              </h2>
              <p className="text-sm leading-6 text-foreground/70">
                {category.description}
              </p>
            </div>
          </div>

          <div className="flex items-center justify-between gap-4 pt-2 border-t border-electric-cyan/10">
            <span className="rounded-lg border border-electric-cyan/30 bg-electric-cyan/10 px-3 py-1 font-mono text-[10px] uppercase tracking-[0.18em] text-electric-cyan">
              {articleCount} Stories
            </span>
            <span className="font-mono text-[10px] uppercase tracking-[0.18em] text-electric-cyan transition-all group-hover:translate-x-1">
              Explore →
            </span>
          </div>
        </NewsArticleCardShell>
      </motion.div>
    </Link>
  );
}
