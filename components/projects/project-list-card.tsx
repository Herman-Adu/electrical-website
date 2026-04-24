import Image from "next/image";
import Link from "next/link";
import type { ProjectListItemExtended } from "@/types/shared-content";
import { ContentCardShell } from "@/components/shared/content-card-shell";

interface ProjectListCardProps {
  item: ProjectListItemExtended;
}

function formatDate(value: string): string {
  return new Intl.DateTimeFormat("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  }).format(new Date(value));
}

const statusConfig: Record<
  ProjectListItemExtended["status"],
  { label: string; className: string }
> = {
  planned: {
    label: "Planned",
    className: "border-amber-warning/30 bg-amber-warning/10 text-amber-warning",
  },
  "in-progress": {
    label: "In Progress",
    className: "border-cyan-500 bg-cyan-500/10 text-cyan-500",
  },
  completed: {
    label: "Completed",
    className: "border-green-500/30 bg-green-500/10 text-green-500",
  },
};

/**
 * Project card for list pages matching article card design.
 * Features image, category badge, status badge, location, and CTA.
 */
export function ProjectListCard({ item }: ProjectListCardProps) {
  const status = statusConfig[item.status];

  return (
    <ContentCardShell className="overflow-hidden text-cyan-400 transition-all border border-foreground/30 hover:border-electric-cyan/50 dark:hover:border-electric-cyan/60 hover:shadow-[0_0_25px_rgba(0,243,189,0.1)]">
      {/* Mobile/Tablet: Column layout (image top, content below) */}
      {/* Desktop: Row layout (image left, content right) */}
      <div className="flex flex-col md:flex-row">
        {/* Image Section */}
        <div className="relative h-48 w-full shrink-0 md:h-auto md:min-h-45 md:w-56 lg:w-64">
          {item.featuredImage ? (
            <Image
              src={item.featuredImage.src}
              alt={item.featuredImage.alt}
              fill
              sizes="(max-width: 768px) 100vw, 256px"
              className="object-cover"
            />
          ) : (
            <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-electric-cyan/20 via-electric-cyan/10 to-background">
              <div className="font-mono text-[10px] uppercase tracking-widest text-electric-cyan/40">
                {item.categoryLabel}
              </div>
            </div>
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-background/60 via-transparent to-transparent md:bg-gradient-to-r md:from-transparent md:via-transparent md:to-background/40" />
          {item.isFeatured && (
            <div className="absolute left-3 top-3 rounded-lg border border-electric-cyan/40 bg-electric-cyan/20 px-2 py-1 font-mono text-[9px] uppercase tracking-[0.16em] text-white backdrop-blur-sm">
              Featured
            </div>
          )}
        </div>

        {/* Content Section */}
        <div className="flex flex-1 flex-col justify-between gap-4 p-5">
          <div className="space-y-3">
            {/* Meta info row */}
            <div className="flex flex-wrap items-center gap-2 font-mono text-[10px] uppercase tracking-[0.18em] text-foreground/60">
              <span className="rounded-lg border border-electric-cyan/30 bg-electric-cyan/10 px-2.5 py-1 text-electric-cyan">
                {item.categoryLabel}
              </span>
              <span
                className={`rounded-lg border px-2.5 py-1 ${status.className}`}
              >
                {status.label}
              </span>
              <span className="text-foreground dark:text-foreground/70 font-bold">
                {formatDate(item.publishedAt)}
              </span>
            </div>

            {/* Title and excerpt */}
            <div className="space-y-2">
              <h3 className="line-clamp-2 text-lg font-bold leading-snug tracking-tight text-foreground">
                {item.title}
              </h3>
              <p className="line-clamp-2 text-sm leading-6 text-foreground dark:text-foreground/70">
                {item.excerpt}
              </p>
            </div>

            {/* Location and sector */}
            <div className="flex flex-wrap gap-3 font-mono text-[10px] uppercase font-bold tracking-[0.18em] text-foreground dark:text-foreground/70">
              {item.location && (
                <span className="flex items-center gap-1">
                  <svg
                    className="h-3 w-3"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={2}
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                    />
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                    />
                  </svg>
                  {item.location}
                </span>
              )}
              {item.clientSector && (
                <span className="text-electric-cyan/70">
                  {item.clientSector}
                </span>
              )}
            </div>
          </div>

          {/* Actions row */}
          <div className="flex items-center justify-end gap-3 border-t border-electric-cyan/10 pt-2">
            <Link
              href={`/projects/category/${item.category}/${item.slug}`}
              className="inline-flex items-center gap-1.5 rounded-lg border border-electric-cyan/30 bg-electric-cyan/10 px-4 py-2 font-mono text-[10px] uppercase tracking-[0.18em] text-electric-cyan transition-all hover:bg-electric-cyan/20 shadow-md shadow-electric-cyan/30 dark:shadow-electric-cyan/30 hover:shadow-[0_0_20px_rgba(0,211,165,0.4)]"
            >
              View Project
              <span aria-hidden>→</span>
            </Link>
          </div>
        </div>
      </div>
    </ContentCardShell>
  );
}
