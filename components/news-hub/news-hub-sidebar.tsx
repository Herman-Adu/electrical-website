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
        <h3 className="text-lg font-bold text-foreground">Strategic Modules</h3>
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
                ? "border-l-electric-cyan dark:border-l-electric-cyan/70 hover:shadow-[0_0_25px_hsl(174_100%_35%/0.15)] dark:hover:shadow-[0_0_25px_rgba(0,243,189,0.15)]"
                : card.type === "review"
                  ? "border-l-amber-warning dark:border-l-amber-warning/70 hover:shadow-[0_0_20px_hsl(174_100%_35%/0.1)] dark:hover:shadow-[0_0_20px_rgba(0,243,189,0.1)]"
                  : card.type === "social"
                    ? "border-l-cyan-500 dark:border-l-cyan-500/70 hover:shadow-[0_0_25px_hsl(174_100%_35%/0.15)] dark:hover:shadow-[0_0_25px_rgba(0,243,189,0.15)]"
                    : card.type === "partner"
                      ? "border-l-cyan-500 dark:border-l-cyan-500/70 hover:shadow-[0_0_25px_hsl(174_100%_35%/0.15)] dark:hover:shadow-[0_0_25px_rgba(0,243,189,0.15)]"
                      : "border-l-[hsl(174_100%_35%)]/40 dark:border-l-electric-cyan/40"
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
                <span
                  className={`transition-all ${
                    card.type === "campaign"
                      ? "rounded-md border border-[hsl(174_100%_35%)]/20 dark:border-electric-cyan/20 bg-[hsl(174_100%_35%)]/10 dark:bg-electric-cyan/10 px-2 py-1 font-mono text-[9px] uppercase tracking-[0.16em] text-[hsl(174_100%_35%)]/70 dark:text-electric-cyan"
                      : card.type === "review"
                        ? "rounded-md border border-amber-warning/50 dark:border-amber-warning/50 bg-amber-warning/10 dark:bg-amber-warning/20 px-2 py-1 font-mono text-[9px] uppercase tracking-[0.16em] text-amber-warning "
                        : card.type === "social"
                          ? "rounded-md border border-cyan-500/50 dark:border-cyan-500/50 bg-cyan-500/10 dark:bg-cyan-500/20 px-2 py-1 font-mono text-[9px] uppercase tracking-[0.16em] text-cyan-500"
                          : card.type === "partner"
                            ? "rounded-md border border-cyan-500/50 dark:border-cyan-500/50 bg-cyan-500/10 dark:bg-cyan-500/20 px-2 py-1 font-mono text-[9px] uppercase tracking-[0.16em] text-cyan-500"
                            : "rounded-md border border-[hsl(174_100%_35%)]/20 dark:border-electric-cyan/20 bg-[hsl(174_100%_35%)]/10 dark:bg-electric-cyan/10 px-2 py-1 font-mono text-[9px] uppercase tracking-[0.16em] text-[hsl(174_100%_35%)]/70 dark:text-electric-cyan"
                  }`}
                >
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
