import type { TimelineItem } from "@/types/timeline";
import { DetailSectionHeading } from "./detail-section-heading";

interface DetailTimelineBlockProps {
  items: readonly TimelineItem[];
  title?: string;
}

export function DetailTimelineBlock({ items, title = 'Timeline' }: DetailTimelineBlockProps) {
  if (!items.length) return null;

  return (
    <section id="timeline" className="space-y-6">
      <DetailSectionHeading title={title} />
      <ol className="relative m-0 list-none space-y-6 p-0">
        {items.map((item) => (
          <li
            key={item.id}
            data-timeline-node={item.id}
            className="flex gap-4"
          >
            <div className="flex flex-col items-center">
              <span className="mt-1 flex h-6 w-6 shrink-0 items-center justify-center rounded-full border border-electric-cyan/60 bg-electric-cyan/10">
                <span className="h-2 w-2 rounded-full bg-electric-cyan" />
              </span>
              <span
                aria-hidden="true"
                className="mt-2 w-px flex-1 bg-electric-cyan/20"
              />
            </div>
            <div className="pb-6">
              <p className="font-mono text-[9px] uppercase tracking-[0.16em] text-electric-cyan/70">
                {item.label}
              </p>
              <h3 className="mt-1 font-semibold text-foreground">{item.title}</h3>
              {item.duration && (
                <span className="mt-1 inline-block rounded-md border border-electric-cyan/30 bg-electric-cyan/10 px-2 py-0.5 font-mono text-[9px] uppercase tracking-[0.12em] text-electric-cyan">
                  {item.duration}
                </span>
              )}
              <p className="mt-2 text-sm leading-6 text-foreground/75">
                {item.description}
              </p>
            </div>
          </li>
        ))}
      </ol>
    </section>
  );
}
