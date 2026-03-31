import type { NewsHubMetricItem } from "@/types/news";
import { NewsArticleCardShell } from "@/components/news-hub/news-article-card-shell";

interface NewsHubBentoGridProps {
  items: NewsHubMetricItem[];
}

export function NewsHubBentoGrid({ items }: NewsHubBentoGridProps) {
  return (
    <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
      {items.map((item, index) => (
        <NewsArticleCardShell
          key={item.id}
          className={`h-full border-l-4 p-6 transition-all hover:border-l-electric-cyan hover:shadow-[0_0_30px_rgba(0,243,189,0.15)] ${
            index === 0 ? "border-l-electric-cyan shadow-[0_0_30px_rgba(0,243,189,0.12)]" : "border-l-electric-cyan/30"
          }`}
        >
          <div className="space-y-4">
            <div className="font-mono text-[10px] uppercase tracking-[0.2em] text-foreground/60">
              {item.title}
            </div>
            <div className="text-4xl font-black tracking-tight text-electric-cyan">
              {item.value}
            </div>
            <p className="text-sm leading-6 text-foreground/70">
              {item.description}
            </p>
          </div>
        </NewsArticleCardShell>
      ))}
    </div>
  );
}
