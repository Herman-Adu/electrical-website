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
    badge: "border-electric-cyan/30 bg-electric-cyan/10 text-electric-cyan",
    featuredBadge: "border-electric-cyan/30 bg-background/90 text-electric-cyan",
  },
  industrial: {
    badge: "border-amber-warning/30 bg-amber-warning/10 text-amber-warning",
    featuredBadge: "border-amber-warning/30 bg-background/90 text-amber-warning",
  },
  partners: {
    badge: "border-emerald-500/30 bg-emerald-500/10 text-emerald-500",
    featuredBadge: "border-emerald-500/30 bg-background/90 text-emerald-500",
  },
  "case-studies": {
    badge: "border-violet-500/30 bg-violet-500/10 text-violet-500",
    featuredBadge: "border-violet-500/30 bg-background/90 text-violet-500",
  },
  insights: {
    badge: "border-electric-cyan/30 bg-electric-cyan/10 text-electric-cyan",
    featuredBadge: "border-electric-cyan/30 bg-background/90 text-electric-cyan",
  },
  reviews: {
    badge: "border-amber-warning/30 bg-amber-warning/10 text-amber-warning",
    featuredBadge: "border-amber-warning/30 bg-background/90 text-amber-warning",
  },
};
