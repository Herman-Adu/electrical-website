"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import type { NewsSidebarCard } from "@/types/news";
import { NewsArticleCardShell } from "@/components/news-hub/news-article-card-shell";
import { NewsPulseIndicator } from "./news-pulse-indicator";

interface NewsHubSidebarProps {
  cards: NewsSidebarCard[];
}

const typeIcons: Record<string, string> = {
  campaign: "📢",
  social: "💬",
  partner: "🤝",
  review: "⭐",
};

export function NewsHubSidebar({ cards }: NewsHubSidebarProps) {
  return (
    <aside className="space-y-4 lg:sticky lg:top-24">
      <div className="space-y-2 px-1">
        <div className="flex items-center gap-3">
          <NewsPulseIndicator label="Live Feed" variant="live" />
        </div>
        <h3 className="text-lg font-bold text-foreground">
          Strategic Modules
        </h3>
        <p className="text-xs leading-5 text-foreground/60">
          Campaigns, social proof, partnerships, and customer reviews.
        </p>
      </div>

      {cards.map((card, index) => (
        <motion.div
          key={card.id}
          initial={{ opacity: 0, x: 20 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ delay: index * 0.1, duration: 0.4 }}
        >
          <NewsArticleCardShell
            className={`p-5 border-l-4 transition-all ${
              card.type === "campaign"
                ? "border-l-electric-cyan hover:shadow-[0_0_25px_rgba(0,243,189,0.15)]"
                : card.type === "review"
                ? "border-l-electric-cyan/70 hover:shadow-[0_0_20px_rgba(0,243,189,0.1)]"
                : "border-l-electric-cyan/40"
            }`}
          >
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <span className="text-sm">{typeIcons[card.type] || "📰"}</span>
                <p className="font-mono text-[9px] uppercase tracking-[0.2em] text-electric-cyan/70">
                  {card.eyebrow}
                </p>
              </div>
              <div className="space-y-2">
                <h4 className="text-base font-semibold text-foreground leading-snug">
                  {card.title}
                </h4>
                <p className="text-xs leading-5 text-foreground/65">
                  {card.description}
                </p>
              </div>
              <div className="flex items-center justify-between gap-3 pt-2 border-t border-electric-cyan/10">
                <span className="rounded-md border border-electric-cyan/20 bg-electric-cyan/10 px-2 py-1 font-mono text-[9px] uppercase tracking-[0.16em] text-electric-cyan/70">
                  {card.type}
                </span>
                <Link
                  href={card.href}
                  className="font-mono text-[9px] uppercase tracking-[0.16em] text-electric-cyan/80 transition-all hover:text-electric-cyan inline-flex items-center gap-1"
                >
                  {card.ctaLabel} →
                </Link>
              </div>
            </div>
          </NewsArticleCardShell>
        </motion.div>
      ))}
    </aside>
  );
}
