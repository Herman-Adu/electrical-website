"use client";

import { motion } from "framer-motion";
import type { NewsHubMetricItem } from "@/types/news";
import { NewsArticleCardShell } from "@/components/news-hub/news-article-card-shell";
import { NewsStatCounter } from "./news-stat-counter";

interface NewsHubBentoGridProps {
  items: NewsHubMetricItem[];
}

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { type: "spring", damping: 25, stiffness: 120 },
  },
};

export function NewsHubBentoGrid({ items }: NewsHubBentoGridProps) {
  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-50px" }}
      className="grid gap-4 md:grid-cols-2 xl:grid-cols-4"
    >
      {items.map((item, index) => (
        <motion.div key={item.id} variants={itemVariants}>
          <NewsArticleCardShell
            className={`h-full border-l-4 p-6 transition-all hover:border-l-electric-cyan hover:shadow-[0_0_30px_rgba(0,243,189,0.15)] ${
              index === 0
                ? "border-l-electric-cyan shadow-[0_0_30px_rgba(0,243,189,0.12)]"
                : "border-l-electric-cyan/30"
            }`}
          >
            <div className="space-y-4">
              <div className="font-mono text-[10px] uppercase tracking-[0.2em] text-foreground/60">
                {item.title}
              </div>
              <NewsStatCounter value={item.value} label="" duration={1.5 + index * 0.3} />
              <p className="text-sm leading-6 text-foreground/70">
                {item.description}
              </p>
            </div>
          </NewsArticleCardShell>
        </motion.div>
      ))}
    </motion.div>
  );
}
