"use client";

import React, { useRef, useEffect, useState } from "react";
import { motion, useInView } from "framer-motion";
import { Zap, Gauge, History, Share2, Activity, Shield } from "lucide-react";
import { ScrollReveal } from "@/components/ui/scroll-reveal";
import {
  EnergyMetric,
  type EnergyMetricProps,
} from "./dashboard/energy-metric";
import { SystemTerminal } from "./dashboard/system-terminal";
import { LiveConnections } from "./dashboard/live-connections";
import { SectionShell } from "./dashboard/section-shell";

const metrics: Omit<EnergyMetricProps, "delay">[] = [
  { label: "Active Load", targetValue: 482, unit: "kW", icon: Zap },
  { label: "Grid Stability", targetValue: 99, unit: "%", icon: Gauge },
  { label: "Reactive Power", targetValue: 12, unit: "kVAR", icon: History },
  { label: "Assets Online", targetValue: 142, unit: "Nodes", icon: Share2 },
] satisfies Omit<EnergyMetricProps, "delay">[];

export function Dashboard() {
  const sectionRef = useRef<HTMLElement>(null);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const isInView = useInView(sectionRef, { once: false, amount: 0.2 });

  // Ensure animation matches on server/client by using mounted state
  const shouldAnimate = isMounted && isInView;

  return (
    <SectionShell sectionRef={sectionRef}>
      {/* Section Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={shouldAnimate ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
        transition={{ duration: 0.6 }}
        className="mb-16"
      >
        <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-6">
          <div>
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-xl border border-foreground/20 dark:border-electric-cyan/20 mb-6">
              <Activity
                size={12}
                className="text-foreground/70 dark:text-foreground animate-pulse"
              />
              <span className="font-mono font-bold text-[10px] tracking-[0.3em] text-foreground/80 dark:text-electric-cyan/80 uppercase">
                Live Monitoring
              </span>
            </div>

            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-foreground uppercase tracking-tight mb-4">
              Grid <span className="text-[hsl(174_100%_35%)] dark:text-electric-cyan">Intelligence</span>
            </h2>

            <p className="text-foreground/70 max-w-xl text-base lg:text-lg font-light">
              Real-time monitoring of installed assets across the industrial
              sector. Efficiency is not a goal; it is a constant variable.
            </p>
          </div>

          {/* Status indicators */}
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 px-3 py-2 rounded-xl border border-foreground/20 dark:border-electric-cyan/20">
              <Shield
                size={14}
                className="text-foreground/70 dark:text-foreground animate-pulse"
              />
              <span className="font-mono text-[10px] text-foreground/80 dark:text-electric-cyan/80 tracking-widest font-bold">
                ALL SYSTEMS NOMINAL
              </span>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Metrics Grid */}
      <ScrollReveal
        direction="left"
        blur
        delay={0}
        duration={0.65}
        distance={40}
        once
      >
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6 mb-8">
          {metrics.map((metric, index) => (
            <EnergyMetric
              key={metric.label}
              {...metric}
              delay={index * 0.1}
              isInView={shouldAnimate}
            />
          ))}
        </div>
      </ScrollReveal>

      {/* Terminal Section */}
      <SystemTerminal isInView={shouldAnimate} />

      {/* Footer Stats */}
      <LiveConnections isInView={isInView} />
    </SectionShell>
  );
}
