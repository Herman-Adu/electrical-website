"use client";

import { motion, type Variants } from "framer-motion";

interface DetailIntroBlockProps {
  intro: string[];
}

const sectionVariants: Variants = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: "easeOut" },
  },
};

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 16 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.45, ease: "easeOut" },
  },
};

const staggerContainer: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.12 },
  },
};

export function DetailIntroBlock({ intro }: DetailIntroBlockProps) {
  return (
    <motion.section
      id="overview"
      variants={sectionVariants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-50px" }}
      className="space-y-6"
    >
      <div className="flex items-center gap-3">
        <div className="h-px flex-1 bg-linear-to-r from-electric-cyan/40 to-transparent" />
        <h2 className="font-mono text-[10px] uppercase tracking-[0.2em] text-electric-cyan">
          Overview
        </h2>
        <div className="h-px flex-1 bg-linear-to-l from-electric-cyan/40 to-transparent" />
      </div>
      <motion.div variants={staggerContainer} className="space-y-4">
        {intro.map((paragraph, index) => (
          <motion.p
            key={`intro-${index}`}
            variants={itemVariants}
            className="text-base leading-8 text-foreground/80"
          >
            {paragraph}
          </motion.p>
        ))}
      </motion.div>
    </motion.section>
  );
}
