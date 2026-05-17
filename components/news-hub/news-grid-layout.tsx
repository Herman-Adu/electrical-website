"use client";

import { useOptimistic, useTransition, type ReactNode } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";
import type { NewsArticleListItem, NewsSidebarCard } from "@/types/news";
import { NewsHubArticleCard } from "@/components/news-hub/news-hub-article-card";
import { NewsHubSidebar } from "@/components/news-hub/news-hub-sidebar";
import { NewsPulseIndicator } from "./news-pulse-indicator";
import { LoadMoreButton } from "./load-more-button";
import { NewsHubCategorySlider } from "./news-hub-category-slider";
import { useNewsPagination } from "@/hooks/use-news-pagination";

interface NewsGridLayoutProps {
  /** Article items to display in the feed */
  items: NewsArticleListItem[];
  /** Sidebar cards - filtered by category from data layer */
  sidebarCards: NewsSidebarCard[];
  /** Article counts per category slug (including "all"), calculated server-side */
  counts?: Record<string, number>;
  /** Initial number of visible items (default: 4) */
  initialCount?: number;
  /** Number of items to load per batch (default: 3) */
  batchSize?: number;
  /**
   * Header title — accepts a string (rendered as <h2>) or a ReactNode (rendered as-is).
   * ReactNode form lets callers pass in a client component like
   * `<NewsHubCategoryTitle />` that reads the URL and animates between labels.
   * Default: "Latest Articles".
   */
  title?: ReactNode;
  /** Show live feed indicator (default: true) */
  showLiveIndicator?: boolean;
  /** Custom empty state message */
  emptyMessage?: string;
  showSlider?: boolean;
}

export function NewsGridLayout({
  items,
  sidebarCards,
  counts,
  initialCount = 4,
  batchSize = 3,
  title = "Latest Articles",
  showLiveIndicator = true,
  emptyMessage = "No stories available in this category yet.",
  showSlider,
}: NewsGridLayoutProps) {
  const pathname = usePathname();

  // Pagination state - clean separation of concerns
  const {
    visibleItems,
    hasMore,
    remainingCount,
    isLoading: isPaginationLoading,
    loadMore,
    totalCount,
  } = useNewsPagination({
    items,
    initialCount,
    batchSize,
  });

  // Optimistic save state - separate from pagination
  const [isSavePending, startSaveTransition] = useTransition();
  const [optimisticSavedIds, toggleSavedOptimistically] = useOptimistic<
    string[],
    string
  >([], (current, articleId) =>
    current.includes(articleId)
      ? current.filter((id) => id !== articleId)
      : [...current, articleId],
  );

  return (
    <div className="grid gap-12 lg:grid-cols-[minmax(0,3fr)_minmax(280px,320px)] lg:items-start">
      {/* Main Feed Column */}
      <div className="min-w-0 space-y-2">
        {/* category buttons - left aligned */}
        {showSlider !== false && <NewsHubCategorySlider counts={counts} />}

        {/* Header */}
        <div className="flex items-center justify-between gap-4 px-1">
          <div>
            {showLiveIndicator && (
              <NewsPulseIndicator label="Live Feed" variant="live" />
            )}
            {typeof title === "string" ? (
              <h2 className="mt-2 text-2xl font-bold text-foreground sm:text-3xl">
                {title}
              </h2>
            ) : (
              <div className="mt-2">{title}</div>
            )}
          </div>
          <div className="flex flex-col items-end gap-1">
            <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-foreground/50">
              {totalCount} {totalCount === 1 ? "Story" : "Stories"}
            </span>
            <span className="font-mono text-[9px] uppercase tracking-[0.16em] text-electric-cyan/60">
              Save enabled
            </span>
          </div>
        </div>

        {/* Content List or Enhanced Empty State */}
        {items.length === 0 ? (
          <div className="rounded-3xl border border-border/50 bg-card/60 p-8 space-y-3">
            <h3 className="text-base font-semibold text-foreground">
              No stories yet
            </h3>
            <p className="text-sm text-foreground/70">{emptyMessage}</p>
            {showSlider !== false && (
              <Link
                href={pathname}
                scroll={false}
                className="mt-2 inline-flex items-center gap-1.5 rounded-lg border border-electric-cyan/30 bg-electric-cyan/10 px-4 py-2 font-mono text-[10px] uppercase tracking-[0.18em] text-electric-cyan transition-all hover:bg-electric-cyan/20"
              >
                View all stories →
              </Link>
            )}
          </div>
        ) : (
          <div className="space-y-4" role="feed" aria-busy={isPaginationLoading}>
            {visibleItems.map((item, index) => (
              <motion.article
                key={item.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05, duration: 0.3 }}
              >
                <NewsHubArticleCard
                  item={item}
                  isPending={isSavePending}
                  isSaved={optimisticSavedIds.includes(item.id)}
                  onToggleSave={() => {
                    startSaveTransition(() => {
                      toggleSavedOptimistically(item.id);
                    });
                  }}
                />
              </motion.article>
            ))}
          </div>
        )}

        {/* Load More / End State — only when items exist */}
        {items.length > 0 &&
          (hasMore ? (
            <LoadMoreButton
              onLoadMore={loadMore}
              remainingCount={remainingCount}
              isLoading={isPaginationLoading}
            />
          ) : totalCount > initialCount ? (
            <div
              className="py-6 text-center font-mono text-[10px] uppercase tracking-[0.2em] text-foreground/50"
              role="status"
              aria-live="polite"
            >
              All {totalCount} stories loaded
            </div>
          ) : null)}
      </div>

      {/* Sidebar */}
      <NewsHubSidebar cards={sidebarCards} />
    </div>
  );
}
