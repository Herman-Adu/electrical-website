"use client";

import { motion, type Variants } from "framer-motion";
import { getIcon } from "@/components/shared/icon-map";
import type { IconName } from "@/types/sections";
import type { TrustIndicatorItem } from "@/types/sections";

export type { TrustIndicatorItem };

interface HeroTrustIndicatorsProps {
  items: readonly TrustIndicatorItem[];
  variants?: Variants;
  className?: string;
  variant?: "default" | "image-overlay";
}

const STYLES = {
  default: {
    article:
      "relative p-5 rounded-xl border border-foreground/50 dark:border-foreground/30 bg-foreground/3 dark:bg-white/15 backdrop-blur-md hover:bg-electric-cyan/2 hover:border-[hsl(174_100%_35%)] dark:hover:border-electric-cyan transition-all duration-300 group",
    cornerTR:
      "absolute top-2 right-2 w-3 h-3 border-t border-r border-electric-cyan/50 rounded-tr group-hover:border-foreground dark:group-hover:border-foreground/60 transition-colors",
    cornerBL:
      "absolute bottom-2 left-2 w-3 h-3 border-b border-l border-electric-cyan/50 rounded-bl group-hover:border-foreground dark:group-hover:border-foreground/60 transition-colors",
    icon: "mx-auto mb-2 h-6 w-6 text-foreground/70 group-hover:text-electric-cyan/70 transition-colors",
    title: "text-sm font-medium text-electric-cyan group-hover:text-foreground transition-colors",
    description: "mt-1 hidden text-xs text-foreground/90 dark:text-foreground/70 sm:block",
  },
  "image-overlay": {
    article:
      "relative p-5 rounded-xl border border-white/50 bg-black/35 backdrop-blur-md hover:bg-electric-cyan/10 hover:border-electric-cyan transition-all duration-300 group",
    cornerTR:
      "absolute top-2 right-2 w-3 h-3 border-t border-r border-white/40 rounded-tr group-hover:border-electric-cyan transition-colors",
    cornerBL:
      "absolute bottom-2 left-2 w-3 h-3 border-b border-l border-white/40 rounded-bl group-hover:border-electric-cyan transition-colors",
    icon: "mx-auto mb-2 h-6 w-6 text-white/80 group-hover:text-electric-cyan transition-colors",
    title: "text-sm font-medium text-electric-cyan group-hover:text-white transition-colors",
    description: "mt-1 hidden text-xs text-white/75 sm:block",
  },
} as const;

export function HeroTrustIndicators({
  items,
  variants,
  className,
  variant = "default",
}: HeroTrustIndicatorsProps): React.JSX.Element {
  const s = STYLES[variant];
  return (
    <motion.div
      variants={variants}
      className={`mx-auto mt-8 grid w-full max-w-4xl grid-cols-2 gap-4 sm:grid-cols-4${className ? ` ${className}` : ""}`}
    >
      {items.map((item) => {
        const Icon = getIcon(item.icon);
        return (
          <article key={item.title} className={s.article}>
            <div aria-hidden="true" className={s.cornerTR} />
            <div aria-hidden="true" className={s.cornerBL} />
            <Icon className={s.icon} />
            <p className={s.title}>{item.title}</p>
            <p className={s.description}>{item.description}</p>
          </article>
        );
      })}
    </motion.div>
  );
}
