"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";

export interface TocItem {
  id: string;
  label: string;
  level?: 1 | 2;
}

interface NewsArticleTocProps {
  items: TocItem[];
  title?: string;
}

export function NewsArticleToc({ items, title = "Contents" }: NewsArticleTocProps) {
  const [activeId, setActiveId] = useState<string | null>(null);
  const [isVisible, setIsVisible] = useState(false);

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
      }
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

  const handleClick = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      const offset = 100;
      const elementPosition = element.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.scrollY - offset;

      window.scrollTo({
        top: offsetPosition,
        behavior: "smooth",
      });
    }
  };

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

          <ul className="space-y-1">
            {items.map((item, index) => {
              const isActive = activeId === item.id;
              const isSubItem = item.level === 2;

              return (
                <motion.li key={item.id} variants={itemVariants}>
                  <button
                    type="button"
                    onClick={() => handleClick(item.id)}
                    className={cn(
                      "group flex w-full items-center gap-2 rounded-lg px-3 py-2 text-left text-sm transition-all",
                      isSubItem && "ml-3 pl-3",
                      isActive
                        ? "bg-electric-cyan/15 text-electric-cyan"
                        : "text-foreground/60 hover:bg-electric-cyan/5 hover:text-foreground/90"
                    )}
                  >
                    {/* Progress indicator */}
                    <span
                      className={cn(
                        "flex h-5 w-5 shrink-0 items-center justify-center rounded-md border font-mono text-[9px] transition-all",
                        isActive
                          ? "border-electric-cyan/40 bg-electric-cyan/20 text-electric-cyan"
                          : "border-border/40 bg-background/50 text-foreground/40 group-hover:border-electric-cyan/20"
                      )}
                    >
                      {String(index + 1).padStart(2, "0")}
                    </span>

                    {/* Label */}
                    <span
                      className={cn(
                        "flex-1 truncate transition-all",
                        isActive && "font-medium"
                      )}
                    >
                      {item.label}
                    </span>

                    {/* Active indicator */}
                    {isActive && (
                      <motion.span
                        layoutId="toc-active"
                        className="h-1 w-1 rounded-full bg-electric-cyan shadow-[0_0_8px_rgba(0,243,189,0.6)]"
                        transition={{ type: "spring", stiffness: 300, damping: 30 }}
                      />
                    )}
                  </button>
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
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
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
