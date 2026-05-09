"use client";

import { motion, type Variants } from "framer-motion";
import { getIcon } from "@/components/shared/icon-map";
import type { IconName } from "@/types/sections";

export interface TrustIndicatorItem {
  icon: IconName;
  title: string;
  description: string;
}

interface HeroTrustIndicatorsProps {
  items: readonly TrustIndicatorItem[];
  variants?: Variants;
  className?: string;
}

export function HeroTrustIndicators({
  items,
  variants,
  className,
}: HeroTrustIndicatorsProps): React.JSX.Element {
  return (
    <motion.div
      variants={variants}
      className={`mx-auto mt-8 grid w-full max-w-4xl grid-cols-2 gap-4 sm:grid-cols-4${className ? ` ${className}` : ""}`}
    >
      {items.map((item) => {
        const Icon = getIcon(item.icon);
        return (
          <article
            key={item.title}
            className="relative p-5 rounded-xl border border-foreground/50 dark:border-foreground/30 bg-foreground/3 dark:bg-white/15 backdrop-blur-md hover:bg-electric-cyan/2 hover:border-[hsl(174_100%_35%)] dark:hover:border-electric-cyan transition-all duration-300 group"
          >
            <div
              aria-hidden="true"
              className="absolute top-2 right-2 w-3 h-3 border-t border-r border-electric-cyan/50 rounded-tr group-hover:border-foreground dark:group-hover:border-foreground/60 transition-colors"
            />
            <div
              aria-hidden="true"
              className="absolute bottom-2 left-2 w-3 h-3 border-b border-l border-electric-cyan/50 rounded-bl group-hover:border-foreground dark:group-hover:border-foreground/60 transition-colors"
            />
            <Icon className="mx-auto mb-2 h-6 w-6 text-foreground/70 group-hover:text-electric-cyan/70 transition-colors" />
            <p className="text-sm font-medium text-electric-cyan group-hover:text-foreground transition-colors">
              {item.title}
            </p>
            <p className="mt-1 hidden text-xs text-foreground/90 dark:text-foreground/70 sm:block">
              {item.description}
            </p>
          </article>
        );
      })}
    </motion.div>
  );
}
