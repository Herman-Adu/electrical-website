import type { ProjectStatus } from "@/types/projects";
import { cn } from "@/lib/utils";

const statusClasses: Record<ProjectStatus, string> = {
  planned: "border-amber-warning/35 bg-amber-warning/10 text-amber-warning",
  "in-progress":
    "border-electric-cyan/35 bg-electric-cyan/10 text-electric-cyan",
  completed: "border-emerald-500/35 bg-emerald-500/10 text-emerald-500",
};

const statusLabel: Record<ProjectStatus, string> = {
  planned: "Planned",
  "in-progress": "In Progress",
  completed: "Completed",
};

export function ProjectStatusBadge({ status }: { status: ProjectStatus }) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full border px-2.5 py-1 font-mono text-[10px] tracking-[0.18em] uppercase",
        statusClasses[status],
      )}
    >
      {statusLabel[status]}
    </span>
  );
}
