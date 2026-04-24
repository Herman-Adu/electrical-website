"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import type { SidebarCard } from "@/types/shared-content";
import { ContentCardShell } from "./content-card-shell";
import { ContentPulseIndicator } from "./content-pulse-indicator";

interface ContentSidebarProps {
  /** Sidebar cards to display */
  cards: SidebarCard[];
  /** Header title */
  title?: string;
  /** Header description */
  description?: string;
  /** Show live indicator */
  showLiveIndicator?: boolean;
}

const typeIcons: Record<string, string> = {
  campaign: "📢",
  social: "💬",
  partner: "🤝",
  review: "⭐",
  cta: "🎯",
};

/**
 * Shared sidebar component for displaying data-driven cards.
 * Used in both News Hub and Projects sections.
 */
export function ContentSidebar({
  cards,
  title = "Strategic Modules",
  description = "Campaigns, social proof, partnerships, and customer reviews.",
  showLiveIndicator = true,
}: ContentSidebarProps) {
  return (
    <aside className="space-y-4">
      <div className="space-y-2 px-1">
        {showLiveIndicator && (
          <div className="flex items-center gap-3">
            <ContentPulseIndicator label="Live Feed" variant="live" />
          </div>
        )}
        <h3 className="text-lg font-bold text-foreground dark:text-white">
          {title}
        </h3>
        <p className="text-xs leading-5 text-foreground dark:text-foreground/80">
          {description}
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
          <ContentCardShell
            as="div"
            className={`p-5 border-l-4 transition-all ${
              card.type === "campaign"
                ? "border-l-electric-cyan dark:border-l-electric-cyan/60 hover:shadow-[0_0_25px_hsl(174_100%_35%/0.15)] dark:hover:shadow-[0_0_25px_rgba(0,243,189,0.15)]"
                : card.type === "review"
                  ? "border-l-amber-warning dark:border-l-amber-warning/60 hover:shadow-[0_0_20px_hsl(174_100%_35%/0.1)] dark:hover:shadow-[0_0_20px_rgba(0,243,189,0.1)]"
                  : card.type === "cta"
                    ? "border-l-cyan-500 dark:border-l-cyan-500/60 hover:shadow-[0_0_25px_hsl(174_100%_35%/0.15)] dark:hover:shadow-[0_0_25px_rgba(0,243,189,0.15)]"
                    : "border-l-[hsl(174_100%_35%)]/40 dark:border-l-electric-cyan/40"
            }`}
          >
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <span className="text-sm">{typeIcons[card.type] || "📰"}</span>
                <p className="font-mono text-[9px] uppercase font-bold tracking-[0.2em] text-electric-cyan dark:text-electric-cyan/70">
                  {card.eyebrow}
                </p>
              </div>
              <div className="space-y-2">
                <h4 className="line-clamp-1 text-md font-bold leading-snug tracking-tight text-foreground">
                  {card.title}
                </h4>
                <p className="text-xs leading-5 text-foreground/70">
                  {card.description}
                </p>
              </div>
              <div className="flex items-center justify-between gap-3 border-t border-[hsl(174_100%_35%)]/10 dark:border-electric-cyan/10 pt-2">
                <span
                  className={`transition-all ${
                    card.type === "campaign"
                      ? "rounded-md border border-[hsl(174_100%_35%)]/20 dark:border-electric-cyan/20 bg-[hsl(174_100%_35%)]/10 dark:bg-electric-cyan/10 px-2 py-1 font-mono text-[9px] uppercase tracking-[0.16em] text-[hsl(174_100%_35%)]/70 dark:text-electric-cyan"
                      : card.type === "review"
                        ? "rounded-md border border-amber-warning/50 dark:border-amber-warning/50 bg-amber-warning/10 dark:bg-amber-warning/20 px-2 py-1 font-mono text-[9px] uppercase tracking-[0.16em] text-amber-warning "
                        : card.type === "cta"
                          ? "rounded-md border border-cyan-500/50 dark:border-cyan-500/50 bg-cyan-500/10 dark:bg-cyan-500/20 px-2 py-1 font-mono text-[9px] uppercase tracking-[0.16em] text-cyan-500"
                          : "rounded-md border border-[hsl(174_100%_35%)]/20 dark:border-electric-cyan/20 bg-[hsl(174_100%_35%)]/10 dark:bg-electric-cyan/10 px-2 py-1 font-mono text-[9px] uppercase tracking-[0.16em] text-[hsl(174_100%_35%)]/70 dark:text-electric-cyan"
                  }`}
                >
                  {card.type}
                </span>
                <Link
                  href={card.href}
                  className="inline-flex items-center gap-1 font-mono font-bold text-[9px] uppercase tracking-[0.16em] text-[hsl(174_100%_35%)]/80 dark:text-electric-cyan/80 transition-all hover:text-[hsl(174_100%_35%)] dark:hover:text-electric-cyan"
                >
                  {card.ctaLabel} →
                </Link>
              </div>
            </div>
          </ContentCardShell>
        </motion.div>
      ))}
    </aside>
  );
}
