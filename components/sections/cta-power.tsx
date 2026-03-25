"use client";

import { useRef, useEffect, useState } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { Home, Building2, Factory } from "lucide-react";
import { SchematicBackground } from "./cta-power/schematic-background";
import { TrustStat } from "./cta-power/trust-stat";
import { DomainCards } from "./cta-power/domain-cards";
import { CTAActions } from "./cta-power/cta-actions";

const CTAPowerClient = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isInView, setIsInView] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Intersection observer for animation trigger — toggles both ways for reanimate
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsInView(entry.isIntersecting);
      },
      { threshold: 0.2 },
    );

    if (containerRef.current) {
      observer.observe(containerRef.current);
    }

    return () => observer.disconnect();
  }, []);

  const { scrollYProgress } = useScroll({
    target: mounted ? containerRef : undefined,
    offset: ["start end", "end start"],
  });

  // Circuit trace animation (draw effect) — background schematics only
  const circuitOpacity = useTransform(scrollYProgress, [0, 0.2], [0, 1]);

  const domains = [
    { name: "Residential", icon: Home },
    { name: "Commercial", icon: Building2 },
    { name: "Industrial", icon: Factory },
  ];

  const stats = [
    { value: 25, suffix: "+", label: "Years Experience" },
    { value: 2500, suffix: "+", label: "Projects Completed" },
    { value: 100, suffix: "%", label: "Safety Compliance" },
  ] as const;

  return (
    <section
      ref={containerRef}
      id="power-vision"
      className="section-container section-padding relative min-h-screen bg-background"
      style={{ position: "relative" }}
    >
      <SchematicBackground
        isInView={isInView}
        circuitOpacity={circuitOpacity}
      />

      {/* Live Connection Indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={isInView ? { opacity: 1 } : { opacity: 0 }}
        transition={{ delay: 0.2, duration: 0.8 }}
        className="absolute top-8 right-8 lg:top-16 lg:right-16 flex items-center gap-2 text-sm"
      >
        <div className="w-2 h-2 rounded-full bg-electric-cyan animate-pulse" />
        <span className="text-slate-400 font-mono text-xs uppercase tracking-wide">
          Systems Ready
        </span>
      </motion.div>

      {/* Content Container */}
      <div className="section-content relative z-10 max-w-5xl">
        {/* Trust Stats */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
          transition={{ duration: 0.7, delay: 0.1 }}
          className="grid grid-cols-3 gap-4 sm:gap-8 mb-20 pb-12 border-b border-border"
        >
          {stats.map((stat, idx) => (
            <TrustStat
              key={idx}
              value={stat.value}
              suffix={stat.suffix}
              label={stat.label}
              delay={0.1 * idx}
              isInView={isInView}
            />
          ))}
        </motion.div>

        {/* Main Headline */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 40 }}
          transition={{ duration: 0.7, delay: 0.25 }}
          className="mb-16 text-center"
        >
          <h2 className="text-3xl sm:text-4xl md:text-6xl font-bold mb-6 leading-tight">
            <span className="text-foreground">Ready to Power</span>
            <br />
            <span className="bg-linear-to-r from-electric-cyan to-amber-warning bg-clip-text text-transparent">
              Your Vision?
            </span>
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto leading-relaxed">
            From precision engineering to complete installation, we deliver
            electrical solutions tailored to your domain. Let's build something
            extraordinary.
          </p>
        </motion.div>

        <DomainCards domains={domains} isInView={isInView} />
        <CTAActions isInView={isInView} />
      </div>

      {/* Bottom Accent Line */}
      <motion.div
        className="absolute bottom-0 left-0 right-0 h-px bg-linear-to-r from-transparent via-electric-cyan to-transparent"
        initial={{ opacity: 0 }}
        animate={isInView ? { opacity: 1 } : { opacity: 0 }}
        transition={{ delay: 1, duration: 1 }}
      />
    </section>
  );
};

export function CTAPower() {
  return <CTAPowerClient />;
}
