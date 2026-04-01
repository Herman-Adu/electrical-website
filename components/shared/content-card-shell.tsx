import type { PropsWithChildren } from "react";
import { cn } from "@/lib/utils";

interface ContentCardShellProps extends PropsWithChildren {
  /** Additional CSS classes */
  className?: string;
  /** HTML element to render (defaults to article) */
  as?: "article" | "div";
}

/**
 * Shared card shell component for consistent styling across
 * News Hub articles and Projects cards.
 */
export function ContentCardShell({
  children,
  className,
  as: Component = "article",
}: ContentCardShellProps) {
  return (
    <Component
      className={cn(
        "rounded-2xl border border-electric-cyan/20",
        "bg-gradient-to-br from-background/80 to-background/60",
        "backdrop-blur-sm",
        "shadow-[0_20px_60px_-40px_rgba(0,242,255,0.2)]",
        className
      )}
    >
      {children}
    </Component>
  );
}
