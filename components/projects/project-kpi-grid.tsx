"use client";

import { useRef, useEffect, useState } from "react";
import {
  motion,
  useInView,
  useReducedMotion,
  type Variants,
} from "framer-motion";
import { DollarSign, Clock, Zap, MapPin } from "lucide-react";
import type { ProjectKpis } from "@/types/projects";

// Extract numeric value and prefix/suffix from a string
function parseNumericValue(value: string): {
  prefix: string;
  number: number | null;
  suffix: string;
} {
  const match = value.match(/^(\D*)([\d.]+)(\D*)$/);
  if (match) {
    return {
      prefix: match[1],
      number: parseFloat(match[2]),
      suffix: match[3],
    };
  }
  return { prefix: "", number: null, suffix: value };
}

// Count-up animation hook
function useCountUp(
  target: number | null,
  duration: number,
  isInView: boolean,
  shouldReduce: boolean | null
) {
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (!isInView || target === null || shouldReduce) {
      if (target !== null) setCount(target);
      return;
    }

    const startTime = Date.now();
    const animate = () => {
      const elapsed = Date.now() - startTime;
      const progress = Math.min(elapsed / duration, 1);
      // Ease out cubic
      const eased = 1 - Math.pow(1 - progress, 3);
      setCount(target * eased);

      if (progress < 1) {
        requestAnimationFrame(animate);
      } else {
        setCount(target);
      }
    };

    requestAnimationFrame(animate);
  }, [target, duration, isInView, shouldReduce]);

  return count;
}

const tileVariants: Variants = {
  hidden: { opacity: 0, y: 16 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: {
      delay: i * 0.1,
      duration: 0.4,
      ease: "easeOut",
    },
  }),
};

const kpiConfig: Record<
  keyof ProjectKpis,
  { label: string; icon: typeof DollarSign }
> = {
  budget: { label: "Budget", icon: DollarSign },
  timeline: { label: "Timeline", icon: Clock },
  capacity: { label: "Capacity", icon: Zap },
  location: { label: "Location", icon: MapPin },
};

function KpiTile({
  label,
  value,
  index,
  isInView,
}: {
  label: string;
  value: string;
  icon: typeof DollarSign;
  index: number;
  isInView: boolean;
}) {
  const shouldReduce = useReducedMotion();
  const { prefix, number, suffix } = parseNumericValue(value);
  const animatedNumber = useCountUp(number, 1400, isInView, shouldReduce);

  const displayValue =
    number !== null
      ? `${prefix}${Number.isInteger(number) ? Math.round(animatedNumber) : animatedNumber.toFixed(1)}${suffix}`
      : value;

  return (
    <motion.div
      custom={index}
      variants={shouldReduce ? {} : tileVariants}
      initial="hidden"
      animate={isInView ? "visible" : "hidden"}
      className="flex flex-col items-center gap-1 px-4 py-3 rounded-lg border border-white/10 bg-black/30 backdrop-blur-sm"
    >
      {/* Value */}
      <motion.p
        className="text-lg sm:text-2xl font-black text-electric-cyan tracking-tight"
        initial={shouldReduce ? {} : { opacity: 0 }}
        animate={isInView ? { opacity: 1 } : { opacity: 0 }}
        transition={{ delay: 0.4 + index * 0.1, duration: 0.3 }}
      >
        {displayValue}
      </motion.p>

      {/* Label */}
      <p className="font-mono text-[9px] uppercase tracking-[0.16em] text-white/60">
        {label}
      </p>
    </motion.div>
  );
}

export function ProjectKpiGrid({ kpis }: { kpis: ProjectKpis }) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, amount: 0.3 });

  const kpiEntries = Object.entries(kpis) as [keyof ProjectKpis, string][];

  return (
    <div
      ref={ref}
      className="grid grid-cols-2 sm:grid-cols-4 gap-4"
      role="list"
      aria-label="Project KPIs"
    >
      {kpiEntries.map(([key, value], index) => {
        const config = kpiConfig[key];
        return (
          <KpiTile
            key={key}
            label={config.label}
            value={value}
            icon={config.icon}
            index={index}
            isInView={isInView}
          />
        );
      })}
    </div>
  );
}
