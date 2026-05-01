import Link from "next/link";
import type { WorkType } from "@/data/projects/work-types";

interface WorkTypeFilterProps {
  workTypes: WorkType[];
  activeSlug?: string;
}

export function WorkTypeFilter({ workTypes, activeSlug }: WorkTypeFilterProps) {
  return (
    <div
      role="group"
      aria-label="Browse by work type"
      className="flex overflow-x-auto scrollbar-hide gap-2 pb-1 scroll-smooth"
    >
      {workTypes.map((wt) => (
        <Link
          key={wt.slug}
          href={`/projects/filter/${wt.slug}`}
          className={[
            "flex-none whitespace-nowrap scroll-mx-2 rounded-full px-4 py-1.5 text-sm font-medium transition-colors",
            activeSlug === wt.slug
              ? "bg-cyan-400 text-black"
              : "border border-border bg-card text-muted-foreground hover:border-cyan-400/50 hover:text-foreground",
          ].join(" ")}
        >
          {wt.label}
        </Link>
      ))}
    </div>
  );
}
