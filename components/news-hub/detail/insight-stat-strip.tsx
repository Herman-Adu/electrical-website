import type { NewsSpotlightMetric } from "@/types/news";

interface InsightStatStripProps {
  spotlight: NewsSpotlightMetric[];
}

export function InsightStatStrip({ spotlight }: InsightStatStripProps) {
  return (
    <section id="spotlight" className="w-full rounded-lg bg-border/10 px-6 py-8">
      <div className="flex flex-wrap items-center justify-around gap-8">
        {spotlight.map((metric, index) => (
          <div key={`stat-${index}`} className="flex flex-col items-center gap-1">
            <span className="text-3xl font-black text-electric-cyan">
              {metric.value}
            </span>
            <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-foreground/50">
              {metric.label}
            </span>
          </div>
        ))}
      </div>
    </section>
  );
}
