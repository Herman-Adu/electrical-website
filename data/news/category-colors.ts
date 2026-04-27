import type { NewsCategorySlug } from "@/types/news";

type CategoryColorConfig = {
  badge: string;
  featuredBadge: string;
};

export const newsCategoryColors: Record<
  Exclude<NewsCategorySlug, "all">,
  CategoryColorConfig
> = {
  residential: {
    badge:
      "border-[hsl(174_100%_35%)]/30 dark:border-electric-cyan/30 bg-[hsl(174_100%_35%)]/10 dark:bg-electric-cyan/10 text-[hsl(174_100%_35%)] dark:text-electric-cyan",
    featuredBadge:
      "border-[hsl(174_100%_35%)]/30 dark:border-electric-cyan/30 bg-background/90 text-[hsl(174_100%_35%)] dark:text-electric-cyan",
  },
  industrial: {
    badge:
      "border-amber-warning/30 bg-amber-warning/10 dark:bg-amber-warning/20 text-amber-warning",
    featuredBadge:
      "border-amber-warning/30 bg-background/90 text-amber-warning",
  },
  partners: {
    badge:
      "border-emerald-500/30 bg-emerald-500/10 dark:bg-emerald-500/20 text-emerald-500",
    featuredBadge:
      "border-emerald-500/30 bg-background/90 text-emerald-500",
  },
  "case-studies": {
    badge:
      "border-violet-500/30 bg-violet-500/10 dark:bg-violet-500/20 text-violet-500",
    featuredBadge:
      "border-violet-500/30 bg-background/90 text-violet-500",
  },
  insights: {
    badge:
      "border-[hsl(174_100%_35%)]/30 dark:border-electric-cyan/30 bg-[hsl(174_100%_35%)]/10 dark:bg-electric-cyan/10 text-[hsl(174_100%_35%)] dark:text-electric-cyan",
    featuredBadge:
      "border-[hsl(174_100%_35%)]/30 dark:border-electric-cyan/30 bg-background/90 text-[hsl(174_100%_35%)] dark:text-electric-cyan",
  },
  reviews: {
    badge:
      "border-amber-warning/30 bg-amber-warning/10 dark:bg-amber-warning/20 text-amber-warning",
    featuredBadge:
      "border-amber-warning/30 bg-background/90 text-amber-warning",
  },
};
