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
          Sidebar modules
        </p>
        <h3 className="text-2xl font-bold text-foreground">
          Campaign, partner, and proof cards
        </h3>
        <p className="text-sm leading-6 text-muted-foreground">
          This right-rail is intentionally data-driven so marketing modules can
          later be mapped from Strapi collections without reworking the page
          layout.
        </p>
      </div>

      {cards.map((card) => (
        <NewsArticleCardShell key={card.id} className="p-5">
          <div className="space-y-4">
            <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-electric-cyan/80">
              {card.eyebrow}
            </p>
            <div className="space-y-2">
              <h4 className="text-lg font-semibold text-foreground">
                {card.title}
              </h4>
              <p className="text-sm leading-6 text-muted-foreground">
                {card.description}
              </p>
            </div>
            <div className="flex items-center justify-between gap-4">
              <span className="rounded-full border border-border/60 px-2.5 py-1 font-mono text-[10px] uppercase tracking-[0.18em] text-muted-foreground">
                {card.type}
              </span>
              <Link
                href={card.href}
                className="font-mono text-[10px] uppercase tracking-[0.18em] text-electric-cyan transition-transform hover:translate-x-1"
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
