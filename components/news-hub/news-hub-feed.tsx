"use client";

import { useOptimistic, useTransition } from "react";
import { motion } from "framer-motion";
import type { NewsArticleListItem, NewsSidebarCard } from "@/types/news";
import { NewsHubArticleCard } from "@/components/news-hub/news-hub-article-card";
import { NewsHubSidebar } from "@/components/news-hub/news-hub-sidebar";
import { NewsPulseIndicator } from "./news-pulse-indicator";
import { LoadMoreButton } from "./load-more-button";
import { useNewsPagination } from "@/hooks/use-news-pagination";

interface NewsHubFeedProps {
  items: NewsArticleListItem[];
  sidebarCards: NewsSidebarCard[];
  initialCount?: number;
}

export function NewsHubFeed({
  items,
  sidebarCards,
  initialCount = 4,
}: NewsHubFeedProps) {
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
    batchSize: 3,
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

  return (
    <div className="grid gap-8 lg:grid-cols-[minmax(0,2fr)_minmax(280px,1fr)] lg:items-start">
      {/* Main Feed Column */}
      <div className="space-y-4">
        {/* Header */}
        <div className="flex items-center justify-between gap-4 px-1">
          <div>
            <NewsPulseIndicator label="Live Feed" variant="live" />
            <h2 className="mt-2 text-2xl font-bold text-white sm:text-3xl">
              Latest Articles
            </h2>
          </div>
          <div className="flex flex-col items-end gap-1">
            <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-foreground/50">
              {totalCount} Stories
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
        ) : (
          <div
            className="py-6 text-center font-mono text-[10px] uppercase tracking-[0.2em] text-foreground/50"
            role="status"
            aria-live="polite"
          >
            All {totalCount} stories loaded
          </div>
        )}
      </div>

      {/* Sidebar */}
      <NewsHubSidebar cards={sidebarCards} />
    </div>
  );
}
