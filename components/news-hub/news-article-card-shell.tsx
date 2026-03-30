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
        "rounded-3xl border border-border/50 bg-card/70 backdrop-blur-sm shadow-[0_20px_80px_-40px_rgba(0,242,255,0.25)]",
        className,
      )}
    >
      {children}
    </article>
  );
}
