"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import {
  SCROLL_GAP,
  getStickyAnchorOffset,
  getStickyHeaderHeight,
  scrollToElementWithOffset,
} from "@/lib/scroll-to-section";

export interface TocItem {
  id: string;
  label: string;
  level?: 1 | 2;
}

interface NewsArticleTocProps {
  items: TocItem[];
  title?: string;
}

export function NewsArticleToc({
  items,
  title = "Contents",
}: NewsArticleTocProps) {
  const [activeId, setActiveId] = useState<string | null>(null);
  const [isVisible, setIsVisible] = useState(false);
  const [clickedId, setClickedId] = useState<string | null>(null);
  const isScrollingRef = useRef(false);
  const tocListRef = useRef<HTMLUListElement>(null);

  useEffect(() => {
    const showTimer = setTimeout(() => setIsVisible(true), 300);
    let rafId: number;

    const findActive = () => {
      if (isScrollingRef.current) return;
      const threshold = getStickyAnchorOffset() || getStickyHeaderHeight() || 160;
      let active: string | null = null;
      for (const item of items) {
        const el = document.getElementById(item.id);
        if (!el) continue;
        if (el.getBoundingClientRect().top <= threshold) active = item.id;
      }
      setActiveId(active);
    };

    const onScroll = () => {
      cancelAnimationFrame(rafId);
      rafId = requestAnimationFrame(findActive);
    };

    findActive();
    window.addEventListener("scroll", onScroll, { passive: true });

    return () => {
      clearTimeout(showTimer);
      window.removeEventListener("scroll", onScroll);
      cancelAnimationFrame(rafId);
    };
  }, [items]);

  useEffect(() => {
    if (process.env.NODE_ENV !== "development") return;
    const missing = items.filter((i) => !document.getElementById(i.id));
    if (missing.length)
      console.warn("[TOC] Missing section IDs:", missing.map((i) => i.id));
  }, [items]);

  // Scroll the active TOC item into view within the list when it changes
  useEffect(() => {
    if (!activeId || !tocListRef.current) return;
    const el = tocListRef.current.querySelector<HTMLElement>(
      `[data-toc-id="${activeId}"]`,
    );
    el?.scrollIntoView({ block: "nearest", behavior: "smooth" });
  }, [activeId]);

  const handleClick = useCallback((id: string) => {
    setActiveId(id);
    isScrollingRef.current = true;
    setClickedId(id);
    setTimeout(() => setClickedId(null), 300);

    const element = document.getElementById(id);
    if (element) {
      scrollToElementWithOffset(element, {
        baseGap: SCROLL_GAP.toc,
      }).then(() => {
        isScrollingRef.current = false;
      });
    } else {
      isScrollingRef.current = false;
    }
  }, []);

  const containerVariants = {
    hidden: { opacity: 0, x: 20 },
    visible: {
      opacity: 1,
      x: 0,
      transition: {
        duration: 0.4,
        staggerChildren: 0.05,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, x: 10 },
    visible: { opacity: 1, x: 0 },
  };

  // Visibility controlled by parent container
  return (
    <AnimatePresence>
      {isVisible && (
        <motion.nav
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          exit="hidden"
          className="rounded-xl border border-electric-cyan/20 bg-gradient-to-br from-background/90 to-background/70 p-5 backdrop-blur-sm"
          aria-label="Table of contents"
        >
          <div className="mb-4 flex items-center gap-2">
            <div className="h-1.5 w-1.5 rounded-full bg-electric-cyan animate-pulse" />
            <h3 className="font-mono text-[10px] uppercase tracking-[0.2em] text-electric-cyan">
              {title}
            </h3>
          </div>

          <ul
            ref={tocListRef}
            className="space-y-1 overflow-y-auto max-h-[calc(100vh-320px)] scrollbar-thin scrollbar-track-transparent scrollbar-thumb-electric-cyan/20 pr-0.5"
          >
            {items.map((item, index) => {
              const isActive = activeId === item.id;
              const isSubItem = item.level === 2;
              const isClicked = clickedId === item.id;

              return (
                <motion.li
                  key={item.id}
                  data-toc-id={item.id}
                  variants={itemVariants}
                  className={cn("relative", isSubItem && "ml-4")}
                >
                  {/* Sub-item left border indicator */}
                  {isSubItem && (
                    <motion.div
                      className={cn(
                        "absolute left-0 top-1 bottom-1 w-0.5 rounded-full transition-colors duration-200",
                        isActive ? "bg-electric-cyan" : "bg-electric-cyan/20",
                      )}
                      animate={{
                        backgroundColor: isActive
                          ? "rgba(0, 243, 189, 1)"
                          : "rgba(0, 243, 189, 0.2)",
                      }}
                      transition={{ duration: 0.2 }}
                    />
                  )}

                  <motion.button
                    type="button"
                    onClick={() => handleClick(item.id)}
                    animate={isClicked ? { scale: [1, 0.97, 1] } : {}}
                    transition={{ duration: 0.2 }}
                    className={cn(
                      "group flex w-full items-center gap-2 rounded-lg px-3 py-2 text-left text-sm transition-all",
                      isSubItem && "pl-4",
                      isActive
                        ? "bg-electric-cyan/15 text-electric-cyan"
                        : "text-foreground/60 hover:bg-electric-cyan/5 hover:text-foreground/90",
                    )}
                  >
                    {/* Progress indicator */}
                    <span
                      className={cn(
                        "flex h-5 w-5 shrink-0 items-center justify-center rounded-md border font-mono text-[9px] transition-all",
                        isSubItem && "h-4 w-4 text-[8px]",
                        isActive
                          ? "border-electric-cyan/40 bg-electric-cyan/20 text-[hsl(174_100%_35%)] dark:text-white"
                          : "border-border/40 bg-background/50 text-foreground/40 group-hover:border-electric-cyan/20",
                      )}
                    >
                      {String(index + 1).padStart(2, "0")}
                    </span>

                    {/* Label */}
                    <span
                      className={cn(
                        "flex-1 truncate transition-all",
                        isActive && "font-medium",
                        isSubItem && "text-xs",
                      )}
                    >
                      {item.label}
                    </span>

                    {/* Active indicator */}
                    {isActive && (
                      <motion.span
                        layoutId="toc-active"
                        className="h-1.5 w-1.5 rounded-full bg-[hsl(174_100%_35%)] dark:bg-white shadow-[0_0_8px_hsl(174_100%_35%/0.6)] dark:shadow-[0_0_8px_rgba(255,255,255,0.6)]"
                        transition={{
                          type: "spring",
                          stiffness: 300,
                          damping: 30,
                        }}
                      />
                    )}
                  </motion.button>
                </motion.li>
              );
            })}
          </ul>

          {/* Reading progress */}
          <div className="mt-4 pt-4 border-t border-electric-cyan/10">
            <ReadingProgress />
          </div>
        </motion.nav>
      )}
    </AnimatePresence>
  );
}

function ReadingProgress() {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const updateProgress = () => {
      const scrollTop = window.scrollY;
      const docHeight =
        document.documentElement.scrollHeight - window.innerHeight;
      const scrollPercent = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
      setProgress(Math.min(100, Math.max(0, scrollPercent)));
    };

    window.addEventListener("scroll", updateProgress, { passive: true });
    updateProgress();

    return () => window.removeEventListener("scroll", updateProgress);
  }, []);

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <span className="font-mono text-[9px] uppercase tracking-[0.16em] text-foreground/50">
          Reading Progress
        </span>
        <span className="font-mono text-[10px] text-electric-cyan">
          {Math.round(progress)}%
        </span>
      </div>
      <div className="h-1 w-full overflow-hidden rounded-full bg-electric-cyan/10">
        <motion.div
          className="h-full bg-gradient-to-r from-electric-cyan/60 to-electric-cyan"
          style={{ width: `${progress}%` }}
          transition={{ duration: 0.1 }}
        />
      </div>
    </div>
  );
}
