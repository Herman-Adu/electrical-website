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
        "rounded-xl border border-border/40 bg-card/60 backdrop-blur-sm p-5",
        "transition-all duration-300",
        className
      )}
    >
      {children}
    </article>
  );
}
