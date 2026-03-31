"use client";

import { useOptimistic, useTransition } from "react";
import { motion } from "framer-motion";
import type { NewsArticleListItem, NewsSidebarCard } from "@/types/news";
import { NewsHubArticleCard } from "@/components/news-hub/news-hub-article-card";
import { NewsHubSidebar } from "@/components/news-hub/news-hub-sidebar";
import { NewsPulseIndicator } from "./news-pulse-indicator";
import { LoadMoreButton } from "./load-more-button";
import { useNewsPagination } from "@/hooks/use-news-pagination";

interface NewsGridLayoutProps {
  /** Article items to display in the feed */
  items: NewsArticleListItem[];
  /** Sidebar cards - filtered by category from data layer */
  sidebarCards: NewsSidebarCard[];
  /** Initial number of visible items (default: 4) */
  initialCount?: number;
  /** Number of items to load per batch (default: 3) */
  batchSize?: number;
  /** Header title (default: "Latest Articles") */
  title?: string;
  /** Show live feed indicator (default: true) */
  showLiveIndicator?: boolean;
  /** Custom empty state message */
  emptyMessage?: string;
}

export function NewsGridLayout({
  items,
  sidebarCards,
  initialCount = 4,
  batchSize = 3,
  title = "Latest Articles",
  showLiveIndicator = true,
  emptyMessage = "No stories available in this category yet.",
}: NewsGridLayoutProps) {
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
      : [...current, articleId]
  );

  // Empty state
  if (items.length === 0) {
    return (
      <div className="grid gap-12 lg:grid-cols-[minmax(0,3fr)_minmax(280px,320px)] lg:items-start">
        <div className="rounded-3xl border border-border/50 bg-card/60 p-8 text-sm text-muted-foreground">
          {emptyMessage}
        </div>
        <NewsHubSidebar cards={sidebarCards} />
      </div>
    );
  }

  return (
    <div className="grid gap-12 lg:grid-cols-[minmax(0,3fr)_minmax(280px,320px)] lg:items-start">
      {/* Main Feed Column */}
      <div className="space-y-4">
        {/* Header */}
        <div className="flex items-center justify-between gap-4 px-1">
          <div>
            {showLiveIndicator && (
              <NewsPulseIndicator label="Live Feed" variant="live" />
            )}
            <h2 className="mt-2 text-2xl font-bold text-white sm:text-3xl">
              {title}
            </h2>
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

        {/* Article List */}
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

        {/* Load More / End State */}
        {hasMore ? (
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
        ) : null}
      </div>

      {/* Sidebar */}
      <NewsHubSidebar cards={sidebarCards} />
    </div>
  );
}
