"use client";

import { motion, type Variants } from "framer-motion";
import { DetailSectionHeading } from "./detail-section-heading";

interface DetailIntroBlockProps {
  intro: string[];
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

export function DetailIntroBlock({ intro, title = 'Overview' }: DetailIntroBlockProps) {
  return (
    <motion.section
      id="overview"
      variants={sectionVariants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-50px" }}
      className="space-y-6"
    >
      <DetailSectionHeading title={title} mono />
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
