import type { PropsWithChildren } from "react";
import { cn } from "@/lib/utils";

interface ProjectCardShellProps extends PropsWithChildren {
  className?: string;
}

export function ProjectCardShell({
  className,
  children,
}: ProjectCardShellProps) {
  return (
    <article
      className={cn(
        "rounded-2xl border border-border/60 bg-card/50 p-5 shadow-sm backdrop-blur-sm",
        "transition-colors hover:border-electric-cyan/30",
        className,
      )}
    >
      {children}
    </article>
  );
}
