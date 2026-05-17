"use client";

import { motion, type Variants } from "framer-motion";
import { DetailSectionHeading } from "./detail-section-heading";

interface DetailTakeawayBlockProps {
  takeaways: string[];
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
  hidden: { opacity: 0, x: -20 },
  visible: { opacity: 1, x: 0 },
};

export function DetailTakeawayBlock({ takeaways, title = 'Key Takeaways' }: DetailTakeawayBlockProps) {
  return (
    <motion.section
      id="takeaways"
      variants={sectionVariants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-50px" }}
      className="space-y-6"
    >
      <DetailSectionHeading title={title} />
      <motion.ul variants={staggerContainer} className="space-y-3">
        {takeaways.map((takeaway, index) => (
          <motion.li
            key={`takeaway-${index}`}
            variants={itemVariants}
            className="rounded-xl border-l-4 border-l-electric-cyan/50 border border-electric-cyan/20 bg-electric-cyan/5 px-5 py-4 text-sm leading-7 text-foreground/80 hover:border-l-electric-cyan hover:bg-electric-cyan/10 transition-all cursor-default"
          >
            <span className="inline-flex h-5 w-5 items-center justify-center rounded-md bg-electric-cyan/20 font-mono text-[9px] text-electric-cyan mr-3">
              {String(index + 1).padStart(2, "0")}
            </span>
            {takeaway}
          </motion.li>
        ))}
      </motion.ul>
    </motion.section>
  );
}
