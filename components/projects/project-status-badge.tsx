"use client";

import { motion, useReducedMotion } from "framer-motion";
import { Clock, CheckCircle2 } from "lucide-react";
import type { ProjectStatus } from "@/types/projects";
import { cn } from "@/lib/utils";

const statusConfig: Record<
  ProjectStatus,
  {
    label: string;
    classes: string;
    icon: "clock" | "pulse" | "check";
  }
> = {
  planned: {
    label: "Planned",
    classes: "border-amber-warning/40 text-amber-warning",
    icon: "clock",
  },
  "in-progress": {
    label: "In Progress",
    classes: "border-electric-cyan/40 text-electric-cyan",
    icon: "pulse",
  },
  completed: {
    label: "Completed",
    classes: "border-emerald-500/40 text-emerald-500",
    icon: "check",
  },
};

export function ProjectStatusBadge({ status }: { status: ProjectStatus }) {
  const shouldReduce = useReducedMotion();
  const config = statusConfig[status];

  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 font-mono text-[9px] tracking-[0.16em] uppercase",
        config.classes
      )}
    >
      {config.icon === "clock" && <Clock className="h-3 w-3" />}
      {config.icon === "check" && <CheckCircle2 className="h-3 w-3" />}
      {config.icon === "pulse" && (
        <span className="relative flex h-2 w-2">
          {!shouldReduce && (
            <motion.span
              className="absolute inline-flex h-full w-full rounded-full bg-electric-cyan"
              animate={{ scale: [1, 1.8, 1], opacity: [0.8, 0, 0.8] }}
              transition={{ duration: 1.5, repeat: Infinity, ease: "easeOut" }}
            />
          )}
          <span className="relative inline-flex h-2 w-2 rounded-full bg-electric-cyan" />
        </span>
      )}
      {config.label}
    </span>
  );
}
