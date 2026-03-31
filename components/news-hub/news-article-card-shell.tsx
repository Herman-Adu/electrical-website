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
        "rounded-2xl border border-electric-cyan/20 bg-gradient-to-br from-background/80 to-background/60 backdrop-blur-sm shadow-[0_20px_60px_-40px_rgba(0,242,255,0.2)]",
        className,
      )}
    >
      {children}
    </article>
  );
}
