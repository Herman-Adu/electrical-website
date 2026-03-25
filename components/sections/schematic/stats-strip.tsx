"use client";

import { motion } from "framer-motion";

type Stat = {
  value: string;
  label: string;
};

type StatsStripProps = {
  stats: Stat[];
  isInView: boolean;
};

export function StatsStrip({ stats, isInView }: StatsStripProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
      transition={{ delay: 0.6 }}
      className="mt-20 pt-16 border-t border-border"
    >
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
        {stats.map((stat, index) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
            transition={{ delay: 0.8 + index * 0.1 }}
            className="text-center"
          >
            <div className="text-3xl lg:text-4xl font-black text-electric-cyan mb-2">
              {stat.value}
            </div>
            <div className="font-mono text-[10px] text-muted-foreground tracking-widest uppercase">
              {stat.label}
            </div>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
}
