"use client";

import {
  useEffect,
  useOptimistic,
  useRef,
  useState,
  useTransition,
} from "react";
import type { NewsArticleListItem, NewsSidebarCard } from "@/types/news";
import { NewsHubArticleCard } from "@/components/news-hub/news-hub-article-card";
import { NewsHubSidebar } from "@/components/news-hub/news-hub-sidebar";

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
  const [visibleCount, setVisibleCount] = useState(initialCount);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [isPending, startTransition] = useTransition();
  const [optimisticSavedIds, toggleSavedOptimistically] = useOptimistic<
    string[],
    string
  >([], (current, articleId) =>
    current.includes(articleId)
      ? current.filter((id) => id !== articleId)
      : [...current, articleId],
  );
  const sentinelRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    setVisibleCount(initialCount);
  }, [initialCount, items]);

  useEffect(() => {
    const node = sentinelRef.current;
    let timeoutId: number | undefined;

    if (!node || visibleCount >= items.length) {
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        const firstEntry = entries[0];

        if (!firstEntry?.isIntersecting || isLoadingMore) {
          return;
        }

        setIsLoadingMore(true);

        timeoutId = window.setTimeout(() => {
          setVisibleCount((current) => Math.min(current + 3, items.length));
          setIsLoadingMore(false);
        }, 200);
      },
      { rootMargin: "160px 0px" },
    );

    observer.observe(node);

    return () => {
      observer.disconnect();

      if (timeoutId) {
        window.clearTimeout(timeoutId);
      }
    };
  }, [isLoadingMore, items.length, visibleCount]);

  const visibleItems = items.slice(0, visibleCount);

  return (
    <div className="grid gap-8 lg:grid-cols-[minmax(0,2fr)_minmax(280px,1fr)] lg:items-start">
      <div className="space-y-4">
        <div className="flex items-center justify-between gap-4 px-1">
          <div>
            <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-electric-cyan">
              Latest stories
            </p>
            <h2 className="mt-2 text-2xl font-bold text-foreground sm:text-3xl">
              Article cards with optimistic save interactions
            </h2>
          </div>
          <div className="font-mono text-[10px] uppercase tracking-[0.2em] text-muted-foreground">
            {items.length} seeded stories
          </div>
        </div>

        <div className="space-y-4">
          {visibleItems.map((item) => (
            <NewsHubArticleCard
              key={item.id}
              item={item}
              isPending={isPending}
              isSaved={optimisticSavedIds.includes(item.id)}
              onToggleSave={() => {
                startTransition(() => {
                  toggleSavedOptimistically(item.id);
                });
              }}
            />
          ))}
        </div>

        {isLoadingMore ? (
          <div className="grid gap-4">
            {Array.from({ length: 3 }).map((_, index) => (
              <div
                key={`news-skeleton-${index}`}
                className="h-32 animate-pulse rounded-3xl border border-border/40 bg-card/50"
              />
            ))}
          </div>
        ) : null}

        <div ref={sentinelRef} className="h-4" />

        {visibleCount >= items.length ? (
          <div className="py-4 text-center font-mono text-[10px] uppercase tracking-[0.2em] text-muted-foreground">
            All stories loaded
          </div>
        ) : null}
      </div>

      <NewsHubSidebar cards={sidebarCards} />
    </div>
  );
}
