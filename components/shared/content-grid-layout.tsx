"use client";

import type { ReactNode } from "react";
import { motion } from "framer-motion";
import type { ContentListItem, SidebarCard } from "@/types/shared-content";
import { usePagination } from "@/hooks/use-pagination";
import { ContentSidebar } from "./content-sidebar";
import { ContentPulseIndicator } from "./content-pulse-indicator";
import { LoadMoreButton } from "./load-more-button";

interface ContentGridLayoutProps<T extends ContentListItem> {
  /** Items to display in the feed */
  items: T[];
  /** Sidebar cards - filtered by section/category from data layer */
  sidebarCards: SidebarCard[];
  /** Render function for each card */
  renderCard: (item: T, index: number) => ReactNode;
  /** Header title */
  title: string;
  /** Initial number of visible items */
  initialCount?: number;
  /** Number of items to load per batch */
  batchSize?: number;
  /** Show live feed indicator */
  showLiveIndicator?: boolean;
  /** Label for single item count */
  itemLabel?: string;
  /** Label for plural item count */
  itemLabelPlural?: string;
  /** Custom empty state message */
  emptyMessage?: string;
  /** Sidebar header title */
  sidebarTitle?: string;
  /** Sidebar header description */
  sidebarDescription?: string;
}

/**
 * Generic two-column grid layout with pagination, sidebar, and Load More.
 * Used for both News Hub and Projects list pages.
 * 
 * @example
 * <ContentGridLayout
 *   items={articles}
 *   sidebarCards={sidebarCards}
 *   renderCard={(item) => <ArticleCard item={item} />}
 *   title="Latest Articles"
 *   itemLabel="story"
 *   itemLabelPlural="stories"
 * />
 */
export function ContentGridLayout<T extends ContentListItem>({
  items,
  sidebarCards,
  renderCard,
  title,
  initialCount = 4,
  batchSize = 3,
  showLiveIndicator = true,
  itemLabel = "item",
  itemLabelPlural = "items",
  emptyMessage = "No content available yet.",
  sidebarTitle = "Strategic Modules",
  sidebarDescription = "Campaigns, social proof, partnerships, and customer reviews.",
}: ContentGridLayoutProps<T>) {
  // Pagination state - clean separation of concerns
  const {
    visibleItems,
    hasMore,
    remainingCount,
    isLoading: isPaginationLoading,
    loadMore,
    totalCount,
  } = usePagination({
    items,
    initialCount,
    batchSize,
  });

  // Empty state
  if (items.length === 0) {
    return (
      <div className="grid gap-12 xl:grid-cols-[minmax(0,3fr)_minmax(280px,320px)] xl:items-start">
        <div className="rounded-3xl border border-border/50 bg-card/60 p-8 text-sm text-muted-foreground">
          {emptyMessage}
        </div>
        <ContentSidebar
          cards={sidebarCards}
          title={sidebarTitle}
          description={sidebarDescription}
          showLiveIndicator={showLiveIndicator}
        />
      </div>
    );
  }

  return (
    <div className="grid gap-12 xl:grid-cols-[minmax(0,3fr)_minmax(280px,320px)] xl:items-start">
      {/* Main Feed Column */}
      <div className="space-y-4">
        {/* Header */}
        <div className="flex items-center justify-between gap-4 px-1">
          <div>
            {showLiveIndicator && (
              <ContentPulseIndicator label="Live Feed" variant="live" />
            )}
            <h2 className="mt-2 text-2xl font-bold text-white sm:text-3xl">
              {title}
            </h2>
          </div>
          <div className="flex flex-col items-end gap-1">
            <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-foreground/50">
              {totalCount} {totalCount === 1 ? itemLabel : itemLabelPlural}
            </span>
          </div>
        </div>

        {/* Content List */}
        <div className="space-y-4" role="feed" aria-busy={isPaginationLoading}>
          {visibleItems.map((item, index) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05, duration: 0.3 }}
            >
              {renderCard(item, index)}
            </motion.div>
          ))}
        </div>

        {/* Load More / End State */}
        {hasMore ? (
          <LoadMoreButton
            onLoadMore={loadMore}
            remainingCount={remainingCount}
            isLoading={isPaginationLoading}
            itemLabel={itemLabel}
            itemLabelPlural={itemLabelPlural}
          />
        ) : totalCount > initialCount ? (
          <div
            className="py-6 text-center font-mono text-[10px] uppercase tracking-[0.2em] text-foreground/50"
            role="status"
            aria-live="polite"
          >
            All {totalCount} {itemLabelPlural} loaded
          </div>
        ) : null}
      </div>

      {/* Sidebar */}
      <ContentSidebar
        cards={sidebarCards}
        title={sidebarTitle}
        description={sidebarDescription}
        showLiveIndicator={showLiveIndicator}
      />
    </div>
  );
}
