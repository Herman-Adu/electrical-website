import type { PropsWithChildren } from "react";
import { cn } from "@/lib/utils";

interface NewsArticleCardShellProps extends PropsWithChildren {
  className?: string;
}

export function NewsArticleCardShell({
  children,
  className,
}: NewsArticleCardShellProps) {
  return (
    <article
      className={cn(
        "rounded-2xl border border-[hsl(174_100%_35%)]/20 dark:border-electric-cyan/20",
        "bg-gradient-to-br from-white/95 dark:from-background/90 to-[hsl(174_100%_35%)]/5 dark:to-background/70",
        "backdrop-blur-sm",
        "shadow-[0_20px_60px_-40px_hsl(174_100%_35%_/_0.15)] dark:shadow-[0_20px_60px_-40px_rgba(0,243,189,0.2)]",
        className,
      )}
    >
      {children}
    </article>
  );
}
