"use client";

import { motion, type Variants } from "framer-motion";

interface InsightMethodologyStepsProps {
  steps: string[];
}

const containerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.15 },
  },
};

const itemVariants: Variants = {
  hidden: { opacity: 0, x: -20 },
  visible: {
    opacity: 1,
    x: 0,
    transition: { duration: 0.45, ease: "easeOut" },
  },
};

export function InsightMethodologySteps({ steps }: InsightMethodologyStepsProps) {
  return (
    <section className="space-y-6">
      <h2 className="text-2xl font-bold text-foreground">Methodology</h2>
      <motion.ul
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-50px" }}
        className="relative list-none space-y-6 pl-6"
      >
        {/* Vertical connecting line */}
        <div
          aria-hidden="true"
          className="absolute left-[11px] top-3 h-[calc(100%-24px)] w-0.5 bg-electric-cyan/30"
        />
        {steps.map((step, index) => (
          <motion.li
            key={`step-${index}`}
            variants={itemVariants}
            className="relative flex items-start gap-4"
          >
            {/* Circle badge */}
            <span className="relative z-10 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-electric-cyan/20 font-mono text-[9px] text-electric-cyan ring-1 ring-electric-cyan/40">
              {String(index + 1).padStart(2, "0")}
            </span>
            <span className="pt-0.5 text-sm leading-6 text-foreground/80">
              {step}
            </span>
          </motion.li>
        ))}
      </motion.ul>
    </section>
  );
}
