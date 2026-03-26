"use client";

import Link from "next/link";
import { useOptimistic, useState, useTransition, useEffect, useRef } from "react";
import { motion, useReducedMotion, type Variants } from "framer-motion";
import { Star, MapPin } from "lucide-react";
import { updateProjectListItem } from "@/lib/actions/projects";
import type { ProjectListItem, ProjectStatus } from "@/types/projects";
import { ProjectStatusBadge } from "@/components/projects/project-status-badge";

type OptimisticUpdate = {
  projectId: string;
  status?: ProjectStatus;
  isFeatured?: boolean;
};

function applyUpdate(
  items: ProjectListItem[],
  update: OptimisticUpdate
): ProjectListItem[] {
  return items.map((item) => {
    if (item.id !== update.projectId) return item;
    return {
      ...item,
      ...(update.status !== undefined ? { status: update.status } : {}),
      ...(update.isFeatured !== undefined
        ? { isFeatured: update.isFeatured }
        : {}),
      updatedAt: new Date().toISOString(),
    };
  });
}

const rowVariants: Variants = {
  hidden: { opacity: 0, x: -8 },
  visible: (i: number) => ({
    opacity: 1,
    x: 0,
    transition: {
      delay: i * 0.08,
      duration: 0.35,
      ease: "easeOut",
    },
  }),
};

// Skeleton row for loading state
function SkeletonRow() {
  return (
    <div className="grid grid-cols-[4px_1fr_auto] gap-4 rounded-lg border border-border/40 bg-card/40 p-4">
      <div className="w-1 rounded-full bg-muted/50" />
      <div className="space-y-2">
        <div className="h-4 w-48 rounded bg-muted/40 animate-pulse" />
        <div className="h-3 w-32 rounded bg-muted/30 animate-pulse" />
      </div>
      <div className="flex items-center gap-2">
        <div className="h-6 w-20 rounded-full bg-muted/40 animate-pulse" />
        <div className="h-8 w-24 rounded bg-muted/30 animate-pulse" />
      </div>
    </div>
  );
}

export function ProjectsOptimisticList({
  items,
}: {
  items: ProjectListItem[];
}) {
  const [sourceItems, setSourceItems] = useState(items);
  const [isPending, startTransition] = useTransition();
  const [feedback, setFeedback] = useState<string>("");
  const shouldReduce = useReducedMotion();

  // Infinite scroll state
  const [visibleCount, setVisibleCount] = useState(3);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const sentinelRef = useRef<HTMLDivElement>(null);

  const [optimisticItems, addOptimistic] = useOptimistic(
    sourceItems,
    (current, update: OptimisticUpdate) => applyUpdate(current, update)
  );

  // Infinite scroll observer
  useEffect(() => {
    if (visibleCount >= sourceItems.length) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && !isLoadingMore) {
          setIsLoadingMore(true);
          setTimeout(() => {
            setVisibleCount((prev) =>
              Math.min(prev + 3, sourceItems.length)
            );
            setIsLoadingMore(false);
          }, 200);
        }
      },
      { rootMargin: "100px" }
    );

    const sentinel = sentinelRef.current;
    if (sentinel) observer.observe(sentinel);

    return () => {
      if (sentinel) observer.unobserve(sentinel);
    };
  }, [visibleCount, sourceItems.length, isLoadingMore]);

  const markAsFeatured = (projectId: string, nextValue: boolean) => {
    const update: OptimisticUpdate = { projectId, isFeatured: nextValue };

    startTransition(async () => {
      setFeedback("");
      addOptimistic(update);

      const result = await updateProjectListItem(update);
      if (result.success) {
        setSourceItems((previous) => applyUpdate(previous, update));
      } else {
        setFeedback(result.message);
      }
    });
  };

  const cycleStatus = (status: ProjectStatus): ProjectStatus => {
    if (status === "planned") return "in-progress";
    if (status === "in-progress") return "completed";
    return "planned";
  };

  const updateStatus = (projectId: string, currentStatus: ProjectStatus) => {
    const nextStatus = cycleStatus(currentStatus);
    const update: OptimisticUpdate = { projectId, status: nextStatus };

    startTransition(async () => {
      setFeedback("");
      addOptimistic(update);

      const result = await updateProjectListItem(update);
      if (result.success) {
        setSourceItems((previous) => applyUpdate(previous, update));
      } else {
        setFeedback(result.message);
      }
    });
  };

  const getStatusBarColor = (status: ProjectStatus) => {
    switch (status) {
      case "in-progress":
        return "bg-electric-cyan";
      case "planned":
        return "bg-amber-warning/60";
      case "completed":
        return "bg-emerald-500/60";
    }
  };

  const visibleItems = optimisticItems.slice(0, visibleCount);
  const allLoaded = visibleCount >= sourceItems.length;

  return (
    <section
      className="section-container py-10"
      aria-label="Optimistic project list"
    >
      <div className="section-content max-w-6xl">
        {/* Section header */}
        <div className="mb-6 flex items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="h-px w-8 bg-electric-cyan/50" />
            <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-electric-cyan/80">
              Delivery Queue
            </p>
          </div>
          {isPending && (
            <motion.span
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="font-mono text-[9px] uppercase tracking-[0.14em] text-muted-foreground flex items-center gap-2"
            >
              <span className="h-1.5 w-1.5 rounded-full bg-electric-cyan animate-pulse" />
              Syncing...
            </motion.span>
          )}
        </div>

        {/* Error feedback */}
        {feedback && (
          <motion.div
            role="alert"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            className="mb-4 rounded-lg border border-destructive/30 bg-destructive/10 px-4 py-3 text-sm text-destructive"
          >
            {feedback}
          </motion.div>
        )}

        {/* Project rows */}
        <div className="space-y-3">
          {visibleItems.map((item, index) => (
            <motion.div
              key={item.id}
              custom={index}
              variants={shouldReduce ? {} : rowVariants}
              initial="hidden"
              animate="visible"
              className={`grid grid-cols-[4px_1fr_auto] gap-4 rounded-lg border border-border/40 bg-card/60 backdrop-blur-sm p-4 transition-all duration-300 hover:border-electric-cyan/30 hover:bg-card/80 ${
                isPending ? "opacity-60" : ""
              }`}
            >
              {/* Status bar indicator */}
              <div
                className={`w-1 rounded-full ${getStatusBarColor(item.status)} ${
                  item.status === "in-progress" && !shouldReduce
                    ? "animate-pulse"
                    : ""
                }`}
              />

              {/* Content column */}
              <div className="min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <Link
                    href={`/projects/category/${item.category}/${item.slug}`}
                    className="text-base font-semibold text-foreground hover:text-electric-cyan transition-colors truncate"
                  >
                    {item.title}
                  </Link>
                  {item.isFeatured && (
                    <span className="shrink-0 inline-flex items-center gap-1 rounded-full border border-electric-cyan/30 bg-electric-cyan/10 px-2 py-0.5 font-mono text-[8px] uppercase tracking-[0.12em] text-electric-cyan">
                      <Star className="h-2.5 w-2.5" />
                      Featured
                    </span>
                  )}
                </div>
                <div className="mt-1.5 flex items-center gap-3 flex-wrap">
                  <span className="font-mono text-[9px] uppercase tracking-[0.12em] text-electric-cyan/70 border border-electric-cyan/20 bg-electric-cyan/5 px-1.5 py-0.5 rounded">
                    {item.categoryLabel}
                  </span>
                  <span className="flex items-center gap-1 text-xs text-muted-foreground">
                    <MapPin className="h-3 w-3" />
                    {item.location}
                  </span>
                  <span className="text-[10px] text-muted-foreground/60">
                    Updated {new Date(item.updatedAt).toLocaleDateString("en-GB", { day: "numeric", month: "short" })}
                  </span>
                </div>
              </div>

              {/* Actions column */}
              <div className="flex items-center gap-2 shrink-0">
                <ProjectStatusBadge status={item.status} />

                <button
                  type="button"
                  disabled={isPending}
                  onClick={() => updateStatus(item.id, item.status)}
                  className="hidden sm:block rounded-md border border-border px-3 py-1.5 font-mono text-[9px] font-semibold uppercase tracking-[0.12em] text-foreground transition-all duration-200 hover:border-electric-cyan/30 hover:text-electric-cyan disabled:cursor-not-allowed disabled:opacity-50"
                >
                  Cycle
                </button>

                <button
                  type="button"
                  disabled={isPending}
                  onClick={() => markAsFeatured(item.id, !item.isFeatured)}
                  className="rounded-md border border-border p-1.5 transition-all duration-200 hover:border-electric-cyan/30 hover:text-electric-cyan disabled:cursor-not-allowed disabled:opacity-50"
                  aria-label={item.isFeatured ? "Remove from featured" : "Add to featured"}
                >
                  <Star
                    className={`h-4 w-4 ${
                      item.isFeatured
                        ? "fill-electric-cyan text-electric-cyan"
                        : "text-muted-foreground"
                    }`}
                  />
                </button>
              </div>
            </motion.div>
          ))}

          {/* Loading skeleton rows */}
          {isLoadingMore && (
            <>
              <SkeletonRow />
              <SkeletonRow />
              <SkeletonRow />
            </>
          )}
        </div>

        {/* Sentinel for infinite scroll */}
        {!allLoaded && <div ref={sentinelRef} className="h-4" />}

        {/* All loaded indicator */}
        {allLoaded && sourceItems.length > 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="mt-6 flex items-center justify-center gap-3"
          >
            <div className="h-px w-12 bg-border/40" />
            <span className="font-mono text-[9px] uppercase tracking-[0.2em] text-muted-foreground/60">
              All Projects Loaded
            </span>
            <div className="h-px w-12 bg-border/40" />
          </motion.div>
        )}
      </div>
    </section>
  );
}
