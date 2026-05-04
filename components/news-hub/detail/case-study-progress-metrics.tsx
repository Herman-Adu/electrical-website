"use client";

import { useRef, useEffect } from "react";
import { motion, useInView, useMotionValue, animate, type Variants } from "framer-motion";
import type { NewsSpotlightMetric } from "@/types/news";

interface CaseStudyProgressMetricsProps {
  metrics: NewsSpotlightMetric[];
}

const sectionVariants: Variants = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: "easeOut" },
  },
};

const staggerContainer: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.12 },
  },
};

const cardVariants: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.4 } },
};

/** Parse a metric value string into numeric + suffix (e.g. "95%" → { num: 95, suffix: "%" }) */
function parseMetricValue(value: string): { num: number; suffix: string; prefix: string; hasNumeric: boolean } {
  const cleaned = value.replace(/,/g, "");
  const match = cleaned.match(/^([^0-9]*)([0-9]+(?:\.[0-9]*)?)(.*)$/);
  if (!match) return { num: 0, suffix: value, prefix: "", hasNumeric: false };
  return {
    prefix: match[1] ?? "",
    num: parseFloat(match[2] ?? "0"),
    suffix: match[3] ?? "",
    hasNumeric: true,
  };
}

/** Calculate fill bar width percentage (0–100) from parsed numeric */
function calcFillPercent(num: number, suffix: string, hasNumeric: boolean): number {
  if (!hasNumeric) return 0;
  if (suffix.includes("%")) {
    return Math.min(100, Math.max(0, num));
  }
  // Large number — show 100% as visual indicator
  return 100;
}

function MetricCard({ metric }: { metric: NewsSpotlightMetric }) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, amount: 0.3 });
  const { num, suffix, prefix, hasNumeric } = parseMetricValue(metric.value);
  const fillPercent = calcFillPercent(num, suffix, hasNumeric);
  const motionVal = useMotionValue(0);
  const displayRef = useRef<HTMLSpanElement>(null);
  const fillRef = useRef<HTMLDivElement>(null);

  // Framer Motion animate drives the CountUp — no GSAP needed here
  useEffect(() => {
    if (!isInView || !hasNumeric) return;

    // Animate the numeric motionValue
    const controls = animate(motionVal, num, {
      duration: 1.6,
      ease: "easeOut",
      onUpdate: (latest) => {
        if (displayRef.current) {
          displayRef.current.textContent =
            prefix + Math.round(latest).toLocaleString() + suffix;
        }
      },
    });

    // Animate fill bar width
    if (fillRef.current) {
      animate(fillRef.current, { width: `${fillPercent}%` }, { duration: 1.6, ease: "easeOut" });
    }

    return () => controls?.stop();
  }, [isInView, hasNumeric, num, prefix, suffix, fillPercent, motionVal]);

  return (
    <motion.div
      ref={ref}
      variants={cardVariants}
      className="rounded-xl border border-electric-cyan/20 bg-linear-to-br from-electric-cyan/10 to-transparent p-5"
    >
      <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-electric-cyan/70 mb-3">
        {metric.label}
      </p>
      <div className="text-2xl font-bold text-electric-cyan mb-4">
        <span ref={displayRef}>{hasNumeric ? `${prefix}0${suffix}` : metric.value}</span>
      </div>
      <div className="w-full h-1 rounded-full bg-electric-cyan/20 overflow-hidden">
        <div
          ref={fillRef}
          className="h-full rounded-full bg-electric-cyan"
          style={{ width: "0%" }}
        />
      </div>
    </motion.div>
  );
}

export function CaseStudyProgressMetrics({
  metrics,
}: CaseStudyProgressMetricsProps) {
  return (
    <motion.section
      id="metrics"
      variants={sectionVariants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-50px" }}
      className="space-y-6"
    >
      <h2 className="text-2xl font-bold text-foreground">Performance Metrics</h2>
      <motion.div
        variants={staggerContainer}
        className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3"
      >
        {metrics.map((metric, index) => (
          <MetricCard key={`metric-${index}`} metric={metric} />
        ))}
      </motion.div>
    </motion.section>
  );
}
