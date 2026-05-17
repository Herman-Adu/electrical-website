"use client";

import { motion, type Variants } from "framer-motion";
import { DetailSectionHeading } from "./detail-section-heading";

interface DetailHighlightListBlockProps {
  results: string[];
  title?: string;
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
    transition: { staggerChildren: 0.1 },
  },
};

const itemVariants: Variants = {
  hidden: { opacity: 0, x: -16 },
  visible: { opacity: 1, x: 0, transition: { duration: 0.35 } },
};

export function DetailHighlightListBlock({
  results,
  title = 'Outcomes',
}: DetailHighlightListBlockProps) {
  return (
    <motion.section
      id="results"
      variants={sectionVariants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-50px" }}
      className="space-y-6"
    >
      <DetailSectionHeading title={title} />
      <div className="rounded-xl border border-electric-cyan/30 bg-linear-to-br from-electric-cyan/10 to-transparent p-6">
        <motion.div variants={staggerContainer} className="space-y-4">
          {results.map((result, index) => (
            <motion.div
              key={`result-${index}`}
              variants={itemVariants}
              className="flex items-start gap-3"
            >
              <span className="mt-1 h-2 w-2 shrink-0 rounded-full bg-electric-cyan shadow-[0_0_8px_rgba(0,243,189,0.5)]" />
              <p className="text-base leading-7 text-foreground/80">{result}</p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </motion.section>
  );
}
