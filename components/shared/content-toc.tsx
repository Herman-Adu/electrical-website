"use client";

import { useCallback, useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import { SCROLL_GAP, scrollToElementWithOffset } from "@/lib/scroll-to-section";
import type { TocItem } from "@/types/shared-content";

interface ContentTocProps {
  /** Table of contents items */
  items: TocItem[];
  /** Header title */
  title?: string;
  /** Show reading progress bar */
  showReadingProgress?: boolean;
}

/**
 * Shared table of contents component with IntersectionObserver-based
 * active section tracking and smooth scroll navigation.
 * Used in both News Hub articles and Project detail pages.
 */
export function ContentToc({
  items,
  title = "Contents",
  showReadingProgress = true,
}: ContentTocProps) {
  const [activeId, setActiveId] = useState<string | null>(null);
  const [isVisible, setIsVisible] = useState(false);
  const [clickedId, setClickedId] = useState<string | null>(null);

  useEffect(() => {
    // Show TOC after initial render with delay
    const showTimer = setTimeout(() => setIsVisible(true), 300);

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveId(entry.target.id);
          }
        });
      },
      {
        rootMargin: "-20% 0% -60% 0%",
        threshold: 0,
      },
    );

    // Observe all section elements
    items.forEach((item) => {
      const element = document.getElementById(item.id);
      if (element) {
        observer.observe(element);
      }
    });

    return () => {
      clearTimeout(showTimer);
      observer.disconnect();
    };
  }, [items]);

  const handleClick = useCallback((id: string) => {
    // Trigger click animation
    setClickedId(id);
    setTimeout(() => setClickedId(null), 300);

    const element = document.getElementById(id);
    if (element) {
      scrollToElementWithOffset(element, {
        baseGap: SCROLL_GAP.toc,
      });
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
          className="rounded-xl border border-[hsl(174_100%_35%)]/20 dark:border-electric-cyan/20 bg-gradient-to-br from-white/95 dark:from-background/90 to-[hsl(174_100%_35%)]/5 dark:to-background/70 p-5 backdrop-blur-sm"
          aria-label="Table of contents"
        >
          <div className="mb-4 flex items-center gap-2">
            <div className="h-1.5 w-1.5 animate-pulse rounded-full bg-[hsl(174_100%_35%)] dark:bg-electric-cyan" />
            <h3 className="font-mono text-[10px] uppercase tracking-[0.2em] text-[hsl(174_100%_35%)] dark:text-electric-cyan">
              {title}
            </h3>
          </div>

          <ul className="space-y-1">
            {items.map((item, index) => {
              const isActive = activeId === item.id;
              const isSubItem = item.level === 2;
              const isClicked = clickedId === item.id;

              return (
                <motion.li
                  key={item.id}
                  variants={itemVariants}
                  className={cn("relative", isSubItem && "ml-4")}
                >
                  {/* Sub-item left border indicator */}
                  {isSubItem && (
                    <motion.div
                      className={cn(
                        "absolute bottom-1 left-0 top-1 w-0.5 rounded-full transition-colors duration-200",
                        isActive ? "bg-[hsl(174_100%_35%)] dark:bg-electric-cyan" : "bg-[hsl(174_100%_35%)]/25 dark:bg-electric-cyan/20",
                      )}
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
                        ? "bg-[hsl(174_100%_35%)]/12 dark:bg-electric-cyan/15 text-[hsl(174_100%_35%)] dark:text-electric-cyan"
                        : "text-foreground/60 hover:bg-[hsl(174_100%_35%)]/5 dark:hover:bg-electric-cyan/5 hover:text-foreground/90",
                    )}
                  >
                    {/* Progress indicator */}
                    <span
                      className={cn(
                        "flex h-5 w-5 shrink-0 items-center justify-center rounded-md border font-mono text-[9px] transition-all",
                        isSubItem && "h-4 w-4 text-[8px]",
                        isActive
                          ? "border-[hsl(174_100%_35%)]/35 dark:border-electric-cyan/40 bg-[hsl(174_100%_35%)]/18 dark:bg-electric-cyan/20 text-[hsl(174_100%_35%)] dark:text-electric-cyan"
                          : "border-border/40 bg-background/50 text-foreground/40 group-hover:border-[hsl(174_100%_35%)]/20 dark:group-hover:border-electric-cyan/20",
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
                        className="h-1.5 w-1.5 rounded-full bg-[hsl(174_100%_35%)] dark:bg-white shadow-[0_0_8px_hsl(174_100%_35%_/_0.5)] dark:shadow-[0_0_8px_rgba(255,255,255,0.6)]"
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
          {showReadingProgress && (
            <div className="mt-4 border-t border-[hsl(174_100%_35%)]/10 dark:border-electric-cyan/10 pt-4">
              <ReadingProgress />
            </div>
          )}
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
        <span className="font-mono text-[10px] text-[hsl(174_100%_35%)] dark:text-electric-cyan">
          {Math.round(progress)}%
        </span>
      </div>
      <div className="h-1 w-full overflow-hidden rounded-full bg-[hsl(174_100%_35%)]/10 dark:bg-electric-cyan/10">
        <motion.div
          className="h-full bg-gradient-to-r from-[hsl(174_100%_35%)]/60 dark:from-electric-cyan/60 to-[hsl(174_100%_35%)] dark:to-electric-cyan"
          style={{ width: `${progress}%` }}
          transition={{ duration: 0.1 }}
        />
      </div>
    </div>
  );
}
