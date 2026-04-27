"use client";

import { useRef, useEffect, useState } from "react";
import {
  motion,
  useInView,
  useReducedMotion,
  type Variants,
} from "framer-motion";
import { ProjectCardShell } from "@/components/projects/project-card-shell";
import type { ProjectBentoItem } from "@/types/projects";

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
  shouldReduce: boolean | null,
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
  hidden: { opacity: 0, y: 20 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: {
      delay: i * 0.12,
      duration: 0.5,
      ease: "easeOut",
    },
  }),
};

function BentoTile({ item, index }: { item: ProjectBentoItem; index: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, amount: 0.5 });
  const shouldReduce = useReducedMotion();

  const { prefix, number, suffix } = parseNumericValue(item.value);
  const animatedNumber = useCountUp(number, 1200, isInView, shouldReduce);

  const displayValue =
    number !== null
      ? `${prefix}${Number.isInteger(number) ? Math.round(animatedNumber) : animatedNumber.toFixed(1)}${suffix}`
      : item.value;

  return (
    <motion.div
      ref={ref}
      custom={index}
      variants={shouldReduce ? {} : tileVariants}
      initial="hidden"
      animate={isInView ? "visible" : "hidden"}
      whileHover={shouldReduce ? {} : { scale: 1.02 }}
      transition={{ duration: 0.2 }}
      className="group"
    >
      {/*
       * Bento tile with responsive sizing
       * Mobile: min-h-[160px], compact padding
       * Tablet: min-h-[180px], increased padding
       * Desktop: min-h-[200px], generous spacing
       */}
      <ProjectCardShell className="relative min-h-40 sm:min-h-45 md:min-h-50 border-l-2 border-l-electric-cyan transition-all duration-300 group-hover:shadow-[0_0_20px_rgba(0,243,189,0.08)] group-hover:border-electric-cyan/50">
        {/* Corner bracket - responsive sizing */}
        <div className="absolute top-2 sm:top-3 right-2 sm:right-3 w-3 sm:w-4 h-3 sm:h-4 border-t border-r border-electric-cyan/20 rounded-tr transition-colors duration-300 group-hover:border-electric-cyan/50" />

        {/* Title - responsive text sizing */}
        <p className="font-mono text-[8px] sm:text-[9px] uppercase tracking-[0.14em] sm:tracking-[0.16em] text-muted-foreground">
          {item.title}
        </p>

        {/* Metric value - full responsive scaling */}
        <motion.p
          className="mt-3 sm:mt-4 text-2xl sm:text-3xl md:text-4xl font-black tracking-tight text-electric-cyan"
          initial={shouldReduce ? {} : { opacity: 0 }}
          animate={isInView ? { opacity: 1 } : { opacity: 0 }}
          transition={{ delay: 0.8, duration: 0.3 }}
        >
          {displayValue}
        </motion.p>

        {/* Description - responsive sizing */}
        <p className="mt-3 sm:mt-4 text-xs sm:text-sm leading-relaxed text-muted-foreground">
          {item.description}
        </p>

        {/* Subtle glow effect on hover */}
        <motion.div
          className="absolute inset-0 rounded-xl bg-electric-cyan/5 opacity-0 transition-opacity duration-300 pointer-events-none group-hover:opacity-100"
          aria-hidden="true"
        />
      </ProjectCardShell>
    </motion.div>
  );
}

export function ProjectsBentoGrid({ items }: { items: ProjectBentoItem[] }) {
  const shouldReduce = useReducedMotion();

  return (
    <section
      className="lg:pb-16 md:pb-12 sm:pb-8"
      aria-label="Project highlights"
    >
      <div className="section-content max-w-6xl">
        {/* Section header - responsive spacing */}
        <motion.div
          className="mb-6 sm:mb-7 md:mb-8 flex items-center gap-3 sm:gap-4"
          initial={shouldReduce ? {} : { opacity: 0, x: -10 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.4 }}
        >
          <div className="h-px w-6 sm:w-8 bg-electric-cyan/50" />
          <p className="font-mono text-[9px] sm:text-[10px] uppercase font-bold tracking-[0.18em] sm:tracking-[0.2em] text-electric-cyan/80">
            Performance Snapshot
          </p>
        </motion.div>

        {/* Grid - responsive column layout */}
        <div className="grid grid-cols-1 gap-3 sm:gap-4 2xl:gap-6 sm:grid-cols-2 lg:grid-cols-4 2xl:grid-cols-4">
          {items.map((item, index) => (
            <BentoTile key={item.id} item={item} index={index} />
          ))}
        </div>
      </div>
    </section>
  );
}
