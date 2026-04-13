"use client";

import React from "react";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { FeaturesList } from "./schematic/features-list";
import { SchematicSvg } from "./schematic/schematic-svg";
import { StatsStrip } from "./schematic/stats-strip";
import { useSchematicAnimation } from "./schematic/use-schematic-animation";

const features = [
  {
    title: "Load Analysis",
    description: "Comprehensive power requirement assessment",
  },
  {
    title: "CAD Design",
    description: "Precision digital blueprints and schematics",
  },
  {
    title: "Safety Audits",
    description: "Thorough safety compliance verification",
  },
  {
    title: "Efficiency Tuning",
    description: "Optimized power distribution design",
  },
];

const stats = [
  { value: "500+", label: "Projects Completed" },
  { value: "99.9%", label: "System Uptime" },
  { value: "24/7", label: "Support Available" },
  { value: "15+", label: "Years Experience" },
];

export function Schematic() {
  const { sectionRef, svgRef, isInView } = useSchematicAnimation();

  return (
    <section
      id="architecture"
      ref={sectionRef}
      className="section-container section-padding bg-background"
    >
      {/* Top border gradient */}
      <div
        className="absolute top-0 left-0 right-0 h-px"
        style={{
          background:
            "linear-gradient(to right, transparent, var(--electric-cyan), transparent)",
          opacity: 0.2,
        }}
      />

      <div className="section-content">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          {/* Content Side */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: -30 }}
            transition={{ duration: 0.6 }}
            className="order-1 lg:order-1"
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 border border-electric-cyan/20 mb-6">
              <div className="size-2 bg-electric-cyan animate-pulse" />
              <span className="font-mono text-[10px] tracking-[0.3em] text-electric-cyan/80 uppercase">
                Our Process
              </span>
            </div>

            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-foreground uppercase tracking-tight mb-6">
              Precision <span className="text-electric-cyan">Architecture</span>
            </h2>

            <p className="text-muted-foreground text-base lg:text-lg font-light leading-relaxed mb-8">
              We don't just install; we engineer. Every Nexgen project begins
              with a high-fidelity digital twin of your electrical
              infrastructure, ensuring precision before a single wire is laid.
            </p>

            <FeaturesList features={features} isInView={isInView} />

            {/* CTA */}
            <button className="group flex items-center rounded-xl gap-3 px-6 py-3 bg-electric-cyan text-deep-slate font-bold uppercase tracking-widest text-sm hover:shadow-[0_0_30px_rgba(0,243,189,0.3)] transition-all duration-300">
              Start Your Project
              <ArrowRight
                size={16}
                className="group-hover:translate-x-1 transition-transform"
              />
            </button>
          </motion.div>

          {/* Schematic SVG Side */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: 30 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="order-2 lg:order-2 relative"
          >
            <SchematicSvg svgRef={svgRef} />
          </motion.div>
        </div>

        <StatsStrip stats={stats} isInView={isInView} />
      </div>
    </section>
  );
}
