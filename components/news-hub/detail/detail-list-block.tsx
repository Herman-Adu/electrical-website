"use client";

import { motion, type Variants } from "framer-motion";
import { DetailSectionHeading } from "./detail-section-heading";

interface DetailListBlockProps {
  scope: string[];
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

export function DetailListBlock({ scope, title = 'Scope' }: DetailListBlockProps) {
  return (
    <motion.section
      id="scope"
      variants={sectionVariants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-50px" }}
      className="space-y-6"
    >
      <DetailSectionHeading title={title} />
      <motion.ul
        variants={staggerContainer}
        className="grid gap-3 sm:grid-cols-2"
      >
        {scope.map((item, index) => (
          <motion.li
            key={`scope-${index}`}
            variants={itemVariants}
            className="flex items-start gap-3 rounded-lg border border-electric-cyan/20 bg-electric-cyan/5 p-4"
          >
            <span className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-md bg-electric-cyan/20 font-mono text-[9px] text-electric-cyan">
              {String(index + 1).padStart(2, "0")}
            </span>
            <span className="text-sm leading-6 text-foreground/80">{item}</span>
          </motion.li>
        ))}
      </motion.ul>
    </motion.section>
  );
}
