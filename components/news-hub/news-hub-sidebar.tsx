import Link from "next/link";
import type { NewsSidebarCard } from "@/types/news";
import { NewsArticleCardShell } from "@/components/news-hub/news-article-card-shell";

interface NewsHubSidebarProps {
  cards: NewsSidebarCard[];
}

export function NewsHubSidebar({ cards }: NewsHubSidebarProps) {
  return (
    <aside className="space-y-4 lg:sticky lg:top-24">
      <div className="space-y-2 px-1">
        <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-electric-cyan">
          🎯 Strategic Modules
        </p>
        <h3 className="text-lg font-bold text-white">
          Campaigns & Partners
        </h3>
        <p className="text-xs leading-5 text-foreground/60">
          Data-driven right rail for campaigns, social, partnerships, and proof.
        </p>
      </div>

      {cards.map((card) => (
        <NewsArticleCardShell
          key={card.id}
          className={`p-5 border-l-4 transition-all ${
            card.type === "campaign"
              ? "border-l-electric-cyan hover:shadow-[0_0_25px_rgba(0,243,189,0.15)]"
              : card.type === "review"
              ? "border-l-electric-cyan/70 hover:shadow-[0_0_20px_rgba(0,243,189,0.1)]"
              : "border-l-electric-cyan/40"
          }`}
        >
          <div className="space-y-3">
            <p className="font-mono text-[9px] uppercase tracking-[0.2em] text-electric-cyan/70">
              {card.eyebrow}
            </p>
            <div className="space-y-2">
              <h4 className="text-base font-semibold text-white leading-snug">
                {card.title}
              </h4>
              <p className="text-xs leading-5 text-foreground/65">
                {card.description}
              </p>
            </div>
            <div className="flex items-center justify-between gap-3 pt-2">
              <span className="rounded-md border border-electric-cyan/20 bg-electric-cyan/10 px-2 py-1 font-mono text-[9px] uppercase tracking-[0.16em] text-electric-cyan/70">
                {card.type}
              </span>
              <Link
                href={card.href}
                className="font-mono text-[9px] uppercase tracking-[0.16em] text-electric-cyan/80 transition-all hover:text-electric-cyan hover:gap-1 inline-flex gap-0.5"
              >
                {card.ctaLabel} →
              </Link>
            </div>
          </div>
        </NewsArticleCardShell>
      ))}
    </aside>
  );
}
