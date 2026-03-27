import type { PropsWithChildren } from "react";
import { cn } from "@/lib/utils";

interface ProjectCardShellProps extends PropsWithChildren {
  className?: string;
}

/**
 * ProjectCardShell - Responsive container for project cards
 *
 * Responsive breakpoints:
 * - Mobile (default): p-4 - comfortable padding on small screens
 * - sm (640px): p-4 - maintained for small devices
 * - md (768px): p-5 - increased padding for tablets
 * - lg (1024px): p-6 - comfortable spacing on desktops
 * - xl (1280px): p-8 - generous spacing on large screens
 *
 * Uses backdrop blur for modern glass-morphism effect
 * Smooth transitions on all interactive states
 */
export function ProjectCardShell({
  className,
  children,
}: ProjectCardShellProps) {
  return (
    <article
      className={cn(
        // Responsive padding: mobile-first approach
        "p-3 sm:p-4 md:p-5 lg:p-6 xl:p-8 2xl:p-10",
        "w-full",
        // Styling
        "rounded-xl border border-border/40 bg-card/60 backdrop-blur-sm",
        "transition-all duration-300",
        className,
      )}
    >
      {children}
    </article>
  );
}
