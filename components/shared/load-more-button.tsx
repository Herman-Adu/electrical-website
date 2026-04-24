"use client";

import { ChevronDown, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "../ui/button";

interface LoadMoreButtonProps {
  /** Click handler to load more items */
  onLoadMore: () => void;
  /** Number of remaining items to load */
  remainingCount: number;
  /** Whether loading is in progress */
  isLoading?: boolean;
  /** Label for single item (e.g., "story", "project") */
  itemLabel?: string;
  /** Label for plural items (e.g., "stories", "projects") */
  itemLabelPlural?: string;
  /** Additional CSS classes */
  className?: string;
}

/**
 * Accessible button for loading more items in paginated lists.
 * Displays remaining count and loading state.
 * Shared across News Hub and Projects sections.
 */
export function LoadMoreButton({
  onLoadMore,
  remainingCount,
  isLoading = false,
  itemLabel = "item",
  itemLabelPlural = "items",
  className,
}: LoadMoreButtonProps) {
  const label = isLoading
    ? `Loading ${itemLabelPlural}...`
    : `Load more ${itemLabelPlural} (${remainingCount} remaining)`;

  return (
    <div className={cn("flex flex-col items-center gap-3 py-6", className)}>
      <Button
        type="button"
        onClick={onLoadMore}
        disabled={isLoading}
        aria-label={label}
        aria-busy={isLoading}
        className={cn(
          "group relative flex items-center gap-2 rounded-xl",
          "border border-electric-cyan/30 bg-electric-cyan/5",
          "px-16 py-3 font-mono text-xs uppercase tracking-wider",
          "text-electric-cyan/80 transition-all duration-300",
          "hover:border-electric-cyan/50 hover:bg-electric-cyan/10",
          "hover:text-electric-cyan hover:shadow-[0_0_20px_rgba(0,255,255,0.15)]",
          "focus-visible:outline-none focus-visible:ring-2",
          "focus-visible:ring-electric-cyan/50 focus-visible:ring-offset-2",
          "focus-visible:ring-offset-background",
          "disabled:cursor-not-allowed disabled:opacity-50",
          "disabled:hover:border-electric-cyan/30 disabled:hover:bg-electric-cyan/5",
        )}
      >
        {isLoading ? (
          <>
            <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />
            <span>Loading...</span>
          </>
        ) : (
          <>
            <span>Load More</span>
            <ChevronDown
              className="h-4 w-4 transition-transform group-hover:translate-y-0.5"
              aria-hidden="true"
            />
          </>
        )}
      </Button>

      <span
        className="mt-2 font-mono text-[10px] uppercase font-bold tracking-[0.2em] text-foreground"
        aria-live="polite"
      >
        {remainingCount} more{" "}
        {remainingCount === 1 ? itemLabel : itemLabelPlural}
      </span>
    </div>
  );
}
