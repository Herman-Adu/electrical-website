"use client";

import { useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import type { BreadcrumbItem } from "@/types/shared-content";

interface BreadcrumbMobileToggleProps {
  items: BreadcrumbItem[];
}

/**
 * Minimal client component for mobile breadcrumb expand/collapse.
 * Only handles the interactive toggle - no sticky logic needed.
 */
export function BreadcrumbMobileToggle({ items }: BreadcrumbMobileToggleProps) {
  const [expanded, setExpanded] = useState(false);

  // If no middle items, render nothing
  if (items.length === 0) return null;

  return (
    <div className="sm:hidden flex items-center gap-2">
      <AnimatePresence mode="wait">
        {!expanded ? (
          <motion.button
            key="collapsed"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            transition={{ duration: 0.15 }}
            onClick={() => setExpanded(true)}
            className="shrink-0 px-2.5 py-1.5 rounded-md bg-electric-cyan/10 border border-electric-cyan/30 text-electric-cyan hover:bg-electric-cyan/20 transition-colors min-h-[32px] flex items-center"
            aria-label="Show full breadcrumb path"
          >
            <span className="text-[10px] tracking-wider">...</span>
          </motion.button>
        ) : (
          <motion.div
            key="expanded"
            initial={{ opacity: 0, width: 0 }}
            animate={{ opacity: 1, width: "auto" }}
            exit={{ opacity: 0, width: 0 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
            className="flex items-center gap-2 overflow-hidden"
          >
            {items.map((item) => (
              <div key={item.href} className="contents">
                <Link
                  href={item.href}
                  className="shrink-0 hover:text-electric-cyan transition-colors"
                >
                  {item.label}
                </Link>
                <span className="shrink-0 text-muted-foreground/40">/</span>
              </div>
            ))}
            <button
              onClick={() => setExpanded(false)}
              className="shrink-0 ml-1 p-1 rounded text-muted-foreground/60 hover:text-electric-cyan transition-colors"
              aria-label="Collapse breadcrumb"
            >
              <svg className="w-3 h-3" viewBox="0 0 12 12" fill="none">
                <path
                  d="M9 3L3 9M3 3l6 6"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                />
              </svg>
            </button>
          </motion.div>
        )}
      </AnimatePresence>
      <span className="shrink-0 text-muted-foreground/40">/</span>
    </div>
  );
}
