"use client";

import { type ReactNode } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";
import type {
  ContentListItem,
  SidebarCard,
  ProjectListItemExtended,
} from "@/types/shared-content";
import type { NewsArticleListItem } from "@/types/news";
import { usePagination } from "@/hooks/use-pagination";
import { ContentSidebar } from "./content-sidebar";
import { ContentPulseIndicator } from "./content-pulse-indicator";
import { LoadMoreButton } from "./load-more-button";
import { NewsHubArticleCard } from "@/components/news-hub/news-hub-article-card";
import { ProjectListCard } from "@/components/projects/project-list-card";
/** Supported card types */
type CardType = "article" | "project";

interface ContentGridLayoutProps<T extends ContentListItem> {
  /** Items to display in the feed */
  items: T[];
  /** Sidebar cards - filtered by section/category from data layer */
  sidebarCards: SidebarCard[];
  /** Card type to render - determines which card component to use */
  cardType: CardType;
  /** Header title — string or ReactNode (e.g. animated <ProjectCategoryTitle />) */
  title: ReactNode;
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
  /** Optional slider rendered as first item in the feed column, above the eyebrow */
  slider?: ReactNode;
}

/**
 * Render the appropriate card component based on cardType.
 * Type-safe rendering with proper item casting.
 */
function renderCardByType(
  item: ContentListItem,
  cardType: CardType,
): React.ReactNode {
  switch (cardType) {
    case "article":
      return (
        <NewsHubArticleCard item={item as unknown as NewsArticleListItem} />
      );
    case "project":
      return <ProjectListCard item={item as ProjectListItemExtended} />;
    default:
      return null;
  }
}

/**
 * Generic two-column grid layout with pagination, sidebar, and Load More.
 * Used for both News Hub and Projects list pages.
 *
 * @example
 * <ContentGridLayout
 *   items={articles}
 *   sidebarCards={sidebarCards}
 *   cardType="article"
 *   title="Latest Articles"
 *   itemLabel="story"
 *   itemLabelPlural="stories"
 * />
 */
export function ContentGridLayout<T extends ContentListItem>({
  items,
  sidebarCards,
  cardType,
  title,
  initialCount = 4,
  batchSize = 3,
  showLiveIndicator = true,
  itemLabel = "item",
  itemLabelPlural = "items",
  emptyMessage = "No content available yet.",
  sidebarTitle = "Strategic Modules",
  sidebarDescription = "Campaigns, social proof, partnerships, and customer reviews.",
  slider,
}: ContentGridLayoutProps<T>) {
  const pathname = usePathname();

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

  return (
    <div className="grid gap-12 xl:grid-cols-[minmax(0,3fr)_minmax(280px,320px)] xl:items-start">
      {/* Main Feed Column */}
      <div className="min-w-0 space-y-2">
        {/* Slider — direct child of space-y-2, above eyebrow */}
        {slider}

        <div className="space-y-4">
          {/* Header */}
          <div className="flex items-center justify-between gap-4 px-1">
            <div>
              {showLiveIndicator && (
                <ContentPulseIndicator label="Live Feed" variant="live" />
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
              <span className="font-mono text-[10px] uppercase font-bold tracking-[0.2em] text-electric-cyan">
                {totalCount} {totalCount === 1 ? itemLabel : itemLabelPlural}
              </span>
            </div>
          </div>

          {/* Content List or Enhanced Empty State */}
          {items.length === 0 ? (
            <div className="rounded-3xl border border-border/50 bg-card/60 p-8 space-y-3">
              <h3 className="text-base font-semibold text-foreground">
                No {itemLabelPlural} yet
              </h3>
              <p className="text-sm text-foreground/70">{emptyMessage}</p>
              {slider && (
                <Link
                  href={pathname}
                  scroll={false}
                  className="mt-2 inline-flex items-center gap-1.5 rounded-lg border border-electric-cyan/30 bg-electric-cyan/10 px-4 py-2 font-mono text-[10px] uppercase tracking-[0.18em] text-electric-cyan transition-all hover:bg-electric-cyan/20"
                >
                  View all {itemLabelPlural} →
                </Link>
              )}
            </div>
          ) : (
            <div
              className="space-y-4"
              role="feed"
              aria-busy={isPaginationLoading}
            >
              {visibleItems.map((item, index) => (
                <motion.div
                  key={item.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05, duration: 0.3 }}
                >
                  {renderCardByType(item, cardType)}
                </motion.div>
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
                itemLabel={itemLabel}
                itemLabelPlural={itemLabelPlural}
              />
            ) : totalCount > initialCount ? (
              <div
                className="py-6 text-center font-mono text-[10px] uppercase tracking-[0.2em] text-foreground"
                role="status"
                aria-live="polite"
              >
                All {totalCount} {itemLabelPlural} loaded
              </div>
            ) : null)}
        </div>
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
