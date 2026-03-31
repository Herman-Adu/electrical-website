"use client";

import { useCallback, useMemo, useState, useTransition } from "react";

interface UsePaginationOptions<T> {
  /** Full list of items to paginate */
  items: T[];
  /** Number of items to show initially */
  initialCount?: number;
  /** Number of items to load per batch */
  batchSize?: number;
}

interface UsePaginationReturn<T> {
  /** Currently visible items */
  visibleItems: T[];
  /** Whether there are more items to load */
  hasMore: boolean;
  /** Number of remaining items */
  remainingCount: number;
  /** Loading state from useTransition */
  isLoading: boolean;
  /** Load the next batch of items */
  loadMore: () => void;
  /** Reset to initial count */
  reset: () => void;
  /** Total item count */
  totalCount: number;
  /** Currently visible count */
  visibleCount: number;
}

/**
 * Generic hook for managing paginated list state without race conditions.
 * Uses React 19's useTransition for proper loading semantics.
 * 
 * @example
 * const { visibleItems, hasMore, loadMore } = usePagination({
 *   items: articles,
 *   initialCount: 4,
 *   batchSize: 3,
 * });
 */
export function usePagination<T>({
  items,
  initialCount = 4,
  batchSize = 3,
}: UsePaginationOptions<T>): UsePaginationReturn<T> {
  const [visibleCount, setVisibleCount] = useState(initialCount);
  const [isPending, startTransition] = useTransition();

  const visibleItems = useMemo(
    () => items.slice(0, visibleCount),
    [items, visibleCount]
  );

  const hasMore = visibleCount < items.length;
  const remainingCount = Math.max(0, items.length - visibleCount);

  const loadMore = useCallback(() => {
    if (!hasMore) return;

    startTransition(() => {
      setVisibleCount((current) => Math.min(current + batchSize, items.length));
    });
  }, [hasMore, batchSize, items.length]);

  const reset = useCallback(() => {
    startTransition(() => {
      setVisibleCount(initialCount);
    });
  }, [initialCount]);

  return {
    visibleItems,
    hasMore,
    remainingCount,
    isLoading: isPending,
    loadMore,
    reset,
    totalCount: items.length,
    visibleCount,
  };
}
