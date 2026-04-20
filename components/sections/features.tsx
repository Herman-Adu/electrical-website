"use client";
/* v10 - New scheduler-card module */

import React, { useRef, useState, useEffect } from "react";
import { motion } from "framer-motion";
import Image from "next/image";
import { useReducedMotion } from "@/lib/hooks/use-reduced-motion";
import { ScrollReveal } from "@/components/ui/scroll-reveal";
import { SchedulerCard } from "./scheduler-card";

const monitorData = [
  { id: 1, zone: "Zone A", status: "Optimal", capacity: "98.5%" },
  { id: 2, zone: "Zone B", status: "Stable", capacity: "76.2%" },
  { id: 3, zone: "Zone C", status: "Balanced", capacity: "84.1%" },
];

const diagnosticsMessages = [
  "> Scanning distribution bus...",
  "> Voltage: NOMINAL (240V)",
  "> Thermal: Within tolerance",
];

function LoadMonitorCard() {
  const [cards, setCards] = useState(monitorData);
  const prefersReducedMotion = useReducedMotion();

  useEffect(() => {
    if (prefersReducedMotion) return;

    const interval = setInterval(() => {
      setCards((prev) => {
        const newCards = [...prev];
        const last = newCards.pop();
        if (last) newCards.unshift(last);
        return newCards;
      });
    }, 3000);
    return () => clearInterval(interval);
  }, [prefersReducedMotion]);

  return (
    <motion.div className="group relative h-full flex flex-col overflow-hidden rounded-2xl bg-transparent border transition-all duration-500 hover:border-electric-cyan/40 hover:shadow-xl hover:shadow-(--electric-cyan)/10">
      <div className="absolute inset-0 pointer-events-none z-10">
        <div className="absolute top-4 left-4 w-6 h-6 border-t-2 border-l-2 border-muted-foreground/40 dark:border-electric-cyan rounded-tl-lg" />
        <div className="absolute bottom-4 right-4 w-6 h-6 border-b-2 border-r-2 border-muted-foreground/40 dark:border-electric-cyan rounded-br-lg" />
      </div>

      <div className="absolute top-4 right-4 text-6xl font-bold text-slate-700/20 font-mono z-0">
        01
      </div>

      <div className="relative w-full h-40 overflow-hidden">
        <Image
          src="/images/power-distribution.jpg"
          alt="Power Distribution"
          fill
          className="object-cover group-hover:scale-105 transition-transform duration-700"
        />
      </div>

      <div className="p-6 py-6 flex flex-col flex-1">
        <div className="flex items-center gap-2 mb-2">
          <span className="text-[10px] font-mono tracking-widest uppercase dark:text-electric-cyan/60">
            Grid Intelligence
          </span>
          <div className="w-2 h-2 rounded-full bg-electric-cyan animate-pulse" />
        </div>
        <h3 className="text-xl font-bold text-card-foreground mb-2">
          Power Distribution Monitor
        </h3>
        <p className="text-sm text-foreground/70 mb-6">
          Real-time load balancing across multi-zone distribution networks
        </p>

        <div className="relative flex items-center justify-center h-20 mb-6 overflow-hidden">
          {cards.map((card, i) => {
            const isTop = i === 0;
            const isMiddle = i === 1;

            return (
              <div
                key={card.id}
                className={`absolute inset-x-0 top-0 flex items-center justify-between p-4 rounded-lg border backdrop-blur-md transition-all duration-700  ${
                  isTop
                    ? "z-30 translate-y-0 scale-100 opacity-100  bg-background/90 border-electric-cyan/60 shadow-md"
                    : isMiddle
                      ? "z-20 translate-y-2 scale-[0.96] opacity-60 bg-electric-cyan/10 dark:bg-electric-cyan/10 border-slate-300/40 dark:border-slate-700/40"
                      : "z-10 translate-y-4 scale-[0.92] opacity-30 bg-electric-cyan/10 dark:bg-electric-cyan/10 border-slate-300/40 dark:border-slate-700/40"
                } ${
                  isTop
                    ? "border-muted-foreground/10"
                    : "border-muted-foreground/10"
                }`}
                style={{
                  transitionTimingFunction: "cubic-bezier(0.34, 1.56, 0.64, 1)",
                }}
              >
                <div>
                  <p className="text-xs font-mono dark:text-electric-cyan font-bold">
                    {card.zone}
                  </p>
                  <p className="text-sm font-bold text-foreground">
                    {card.status}
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-lg font-bold dark:text-electric-cyan">
                    {card.capacity}
                  </p>
                  <p className="text-[10px] dark:text-foreground/80 uppercase tracking-wider font-bold">
                    Capacity
                  </p>
                </div>
              </div>
            );
          })}
        </div>

        <button className="mt-auto w-full py-3 px-4 rounded-lg bg-transparent border text-sm font-mono tracking-widest uppercase dark:text-electric-cyan/80 hover:border-electric-cyan/80 hover:shadow-lg hover:shadow-(--electric-cyan)/10 transition-all duration-300">
          Monitor Zones
        </button>
      </div>
    </motion.div>
  );
}

function SystemDiagnosticsCard() {
  const [displayText, setDisplayText] = useState("");
  const [isComplete, setIsComplete] = useState(false);
  const [isMounted, setIsMounted] = useState(false);
  const prefersReducedMotion = useReducedMotion();

  useEffect(() => {
    setIsMounted(true);
  }, []);

  useEffect(() => {
    if (!isMounted || prefersReducedMotion) return;

    let charIdx = 0;
    const fullText = diagnosticsMessages.join("\n");

    const interval = setInterval(() => {
      if (charIdx < fullText.length) {
        setDisplayText(fullText.substring(0, charIdx + 1));
        charIdx++;
      } else if (!isComplete) {
        setIsComplete(true);
        setTimeout(() => {
          setDisplayText("");
          charIdx = 0;
          setIsComplete(false);
        }, 2000);
      }
    }, 35);

    return () => clearInterval(interval);
  }, [isMounted, isComplete, prefersReducedMotion]);

  return (
    <motion.div className="group relative h-full flex flex-col overflow-hidden rounded-2xl bg-transparent border border-slate-700/50 transition-all duration-500 hover:border-electric-cyan/40 hover:shadow-xl hover:shadow-(--electric-cyan)/10">
      <div className="absolute inset-0 pointer-events-none z-10">
        <div className="absolute top-4 left-4 w-6 h-6 border-t-2 border-l-2 border-muted-foreground/40 dark:border-electric-cyan rounded-tl-lg" />
        <div className="absolute bottom-4 right-4 w-6 h-6 border-b-2 border-r-2 border-muted-foreground/40 dark:border-electric-cyan rounded-br-lg" />
      </div>

      <div className="absolute top-4 right-4 text-6xl font-bold text-slate-700/20 font-mono z-0">
        02
      </div>

      <div className="relative w-full h-40 overflow-hidden">
        <Image
          src="/images/system-diagnostics.jpg"
          alt="System Diagnostics"
          fill
          className="object-cover group-hover:scale-105 transition-transform duration-700"
        />
      </div>

      <div className="p-6 flex flex-col flex-1">
        <div className="flex items-center gap-2 mb-2">
          <span className="text-[10px] font-mono tracking-widest uppercase dark:text-electric-cyan/60">
            Live Diagnostics
          </span>
          <div className="w-2 h-2 rounded-full bg-electric-cyan animate-pulse" />
        </div>
        <h3 className="text-xl font-bold text-card-foreground mb-2">
          System Diagnostics Feed
        </h3>
        <p className="text-sm text-foreground/70 mb-6">
          Continuous system health monitoring with predictive fault detection
        </p>

        <div className="h-20 mb-6 p-4 rounded-lg border-muted-foreground/10 bg-electric-cyan/10  font-mono text-[11px] leading-5 overflow-hidden hover:border-electric-cyan/40 transition-colors duration-300 flex flex-col justify-center">
          <div className="dark:text-electric-cyan/80 whitespace-pre-line">
            {displayText}
          </div>
          {isComplete && (
            <span className="inline-block w-2 h-3 bg-muted-foreground dark:bg-electric-cyan animate-pulse" />
          )}
        </div>

        <button className="mt-auto w-full py-3 px-4 rounded-lg bg-transparent border text-sm font-mono tracking-widest uppercase dark:text-electric-cyan/80 hover:border-electric-cyan/80 hover:shadow-lg hover:shadow-(--electric-cyan)/10 transition-all duration-300">
          View Full Report
        </button>
      </div>
    </motion.div>
  );
}

export function Features() {
  const sectionRef = useRef<HTMLElement>(null);

  return (
    <section
      id="features"
      ref={sectionRef}
      className="section-container section-padding bg-background"
    >
      <div className="section-content">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="mb-16 text-center"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-xl border dark:border-electric-cyan/20 mb-6">
            <span className="font-mono text-[10px] tracking-[0.3em] dark:text-electric-cyan/80 uppercase">
              Core Capabilities
            </span>
            <div className="w-2 h-2 rounded-full bg-electric-cyan animate-pulse" />
          </div>

          <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
            Intelligent Systems
          </h2>
          <p className="text-foreground dark:text-foreground/80 max-w-2xl mx-auto">
            Real-time monitoring, diagnostics, and preventive maintenance for
            modern electrical infrastructure.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8 items-stretch">
          <ScrollReveal
            direction="up"
            blur
            delay={0}
            duration={0.65}
            distance={40}
            once
            margin="0px 0px -80px 0px"
          >
            <LoadMonitorCard />
          </ScrollReveal>
          <ScrollReveal
            direction="up"
            blur
            delay={0.07}
            duration={0.65}
            distance={40}
            once
            margin="0px 0px -80px 0px"
          >
            <SystemDiagnosticsCard />
          </ScrollReveal>
          <ScrollReveal
            direction="up"
            blur
            delay={0.14}
            duration={0.65}
            distance={40}
            once
            margin="0px 0px -80px 0px"
          >
            <SchedulerCard />
          </ScrollReveal>
        </div>
      </div>
    </section>
  );
}
