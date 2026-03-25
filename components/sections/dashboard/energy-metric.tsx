"use client";

import React, { useEffect, useRef } from "react";
import { motion, useInView } from "framer-motion";
import gsap from "gsap";
import type { LucideIcon } from "lucide-react";

export interface EnergyMetricProps {
  label: string;
  targetValue: number;
  unit: string;
  icon: LucideIcon;
  delay?: number;
}

export function EnergyMetric({
  label,
  targetValue,
  unit,
  icon: Icon,
  delay = 0,
}: EnergyMetricProps) {
  const countRef = useRef<HTMLSpanElement>(null);
  const cardRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(cardRef, { once: false, amount: 0.3 });

  useEffect(() => {
    if (!countRef.current) return;

    if (!isInView) {
      countRef.current.textContent = "0";
      return;
    }

    const target = { value: 0 };
    gsap.to(target, {
      value: targetValue,
      duration: 2,
      delay: delay,
      ease: "power2.out",
      onUpdate: () => {
        if (countRef.current) {
          countRef.current.textContent = Math.round(target.value).toString();
        }
      },
    });
  }, [isInView, targetValue, delay]);

  return (
    <motion.div
      ref={cardRef}
      initial={{ opacity: 0, y: 20 }}
      animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
      transition={{ delay: delay, duration: 0.5 }}
      className="group bg-card border border-border p-6 hover:border-electric-cyan/30 transition-all duration-300"
    >
      <div className="flex items-center gap-3 mb-4">
        <Icon
          size={18}
          className="text-electric-cyan/60 group-hover:text-electric-cyan transition-colors"
        />
        <span className="font-mono text-[10px] tracking-[0.2em] text-muted-foreground uppercase">
          {label}
        </span>
      </div>

      <div className="flex items-baseline gap-2 mb-4">
        <span
          ref={countRef}
          className="text-4xl lg:text-5xl font-black text-foreground"
        >
          0
        </span>
        <span className="text-electric-cyan font-mono text-sm uppercase">
          {unit}
        </span>
      </div>

      <div className="h-1 w-full bg-slate-800 overflow-hidden">
        <motion.div
          animate={{ x: ["-100%", "100%"] }}
          transition={{ duration: 2.5, repeat: Infinity, ease: "linear" }}
          className="h-full w-1/2 bg-linear-to-r from-transparent via-electric-cyan to-transparent"
        />
      </div>
    </motion.div>
  );
}
