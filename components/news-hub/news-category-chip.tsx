"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import type { NewsCategorySlug } from "@/types/news";

interface NewsCategoryChipProps {
  slug: NewsCategorySlug;
  label: string;
  isActive?: boolean;
  count?: number;
  href?: string;
  onClick?: () => void;
}

const categoryIcons: Record<NewsCategorySlug, string> = {
  all: "📰",
  residential: "🏠",
  industrial: "🏭",
  partners: "🤝",
  "case-studies": "📊",
  insights: "💡",
  reviews: "⭐",
};

export function NewsCategoryChip({
  slug,
  label,
  isActive = false,
  count,
  href,
  onClick,
}: NewsCategoryChipProps) {
  const icon = categoryIcons[slug];

  const chipContent = (
    <motion.span
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      className={`inline-flex items-center gap-2 rounded-lg border px-3 py-2 font-mono text-[10px] uppercase tracking-[0.16em] transition-all ${
        isActive
          ? "border-electric-cyan/60 bg-electric-cyan/15 text-electric-cyan shadow-[0_0_20px_rgba(0,243,189,0.2)]"
          : "border-border/40 bg-background/60 text-foreground/70 hover:border-electric-cyan/40 hover:text-electric-cyan"
      }`}
    >
      <span>{icon}</span>
      <span>{label}</span>
      {count !== undefined && (
        <span
          className={`rounded-md px-1.5 py-0.5 text-[9px] ${
            isActive
              ? "bg-electric-cyan/20 text-electric-cyan"
              : "bg-foreground/10 text-foreground/50"
          }`}
        >
          {count}
        </span>
      )}
    </motion.span>
  );

  if (href) {
    return (
      <Link href={href} className="focus:outline-none focus-visible:ring-2 focus-visible:ring-electric-cyan">
        {chipContent}
      </Link>
    );
  }

  if (onClick) {
    return (
      <button
        type="button"
        onClick={onClick}
        className="focus:outline-none focus-visible:ring-2 focus-visible:ring-electric-cyan"
      >
        {chipContent}
      </button>
    );
  }

  return chipContent;
}
