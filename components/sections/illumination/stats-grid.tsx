"use client";

import { motion } from "framer-motion";
import { AnimatedCounter } from "./animated-counter";

export interface IlluminationStat {
  value: number;
  suffix: string;
  label: string;
}

interface StatsGridProps {
  stats: IlluminationStat[];
  inView: boolean;
}

export function StatsGrid({ stats, inView }: StatsGridProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: 0.4 }}
      viewport={{ once: true }}
      className="mt-auto pt-12 md:pt-16 grid grid-cols-2 md:grid-cols-4 gap-4 lg:gap-6"
    >
      {stats.map((stat) => (
        <div
          key={stat.label}
          className="group relative p-4 sm:p-6 rounded-2xl bg-(--deep-black)/60 backdrop-blur-md border border-slate-700/50 hover:border-electric-cyan/40 transition-all duration-300"
        >
          <div className="absolute top-2 right-2 w-4 h-4 border-t border-r border-electric-cyan/30 rounded-tr-lg group-hover:border-electric-cyan/60 transition-colors" />

          <div className="text-xl sm:text-2xl lg:text-4xl font-bold text-white mb-1 font-mono leading-tight">
            <AnimatedCounter
              value={stat.value}
              suffix={stat.suffix}
              inView={inView}
            />
          </div>
          <div className="text-xs sm:text-sm text-white/70 font-medium leading-snug">
            {stat.label}
          </div>

          <div className="absolute inset-0 rounded-2xl bg-electric-cyan/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300 -z-10" />
        </div>
      ))}
    </motion.div>
  );
}
