"use client";

import { useSearchParams } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import { newsCategories } from "@/data/news";
import type { NewsCategorySlug } from "@/types/news";

interface NewsHubCategoryTitleProps {
  className?: string;
}

// Build label map from existing data + synthetic "all". newsCategories already carries
// human-readable labels (e.g. "Case Studies"), so reuse them; "all" surfaces as
// "Articles" for the title format ("Latest Articles").
const TITLE_LABELS: Record<NewsCategorySlug, string> = {
  all: "Articles",
  ...Object.fromEntries(newsCategories.map((c) => [c.slug, c.label])),
} as Record<NewsCategorySlug, string>;

const VALID_SLUGS = new Set<NewsCategorySlug>(
  Object.keys(TITLE_LABELS) as NewsCategorySlug[],
);

function isValidSlug(value: string | null): value is NewsCategorySlug {
  return value !== null && VALID_SLUGS.has(value as NewsCategorySlug);
}

export function NewsHubCategoryTitle({ className }: NewsHubCategoryTitleProps) {
  const searchParams = useSearchParams();
  const rawCategory = searchParams?.get("category") ?? null;
  const active: NewsCategorySlug = isValidSlug(rawCategory) ? rawCategory : "all";
  const label = TITLE_LABELS[active];

  const wrapperClassName = ["relative", className].filter(Boolean).join(" ");

  return (
    <div className={wrapperClassName}>
      <AnimatePresence mode="wait">
        <motion.h2
          key={active}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -8 }}
          transition={{ duration: 0.25, ease: "easeOut" }}
          className="text-3xl lg:text-4xl font-bold tracking-tight text-foreground"
        >
          Latest <span className="text-electric-cyan">{label}</span>
        </motion.h2>
      </AnimatePresence>
    </div>
  );
}
