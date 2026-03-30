import type { NewsHubMetricItem } from "@/types/news";
import { NewsArticleCardShell } from "@/components/news-hub/news-article-card-shell";

interface NewsHubBentoGridProps {
  items: NewsHubMetricItem[];
}

export function NewsHubBentoGrid({ items }: NewsHubBentoGridProps) {
  return (
    <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
      {items.map((item) => (
        <NewsArticleCardShell
          key={item.id}
          className="h-full border-l-2 border-l-electric-cyan p-5"
        >
          <div className="space-y-3">
            <div className="font-mono text-[10px] uppercase tracking-[0.2em] text-muted-foreground">
              {item.title}
            </div>
            <div className="text-3xl font-black tracking-tight text-foreground">
              {item.value}
            </div>
            <p className="text-sm leading-6 text-muted-foreground">
              {item.description}
            </p>
          </div>
        </NewsArticleCardShell>
      ))}
    </div>
  );
}
