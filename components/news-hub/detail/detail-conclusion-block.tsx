"use client";

import { motion, type Variants } from "framer-motion";
import { DetailSectionHeading } from "./detail-section-heading";

interface DetailConclusionBlockProps {
  conclusion?: string[];
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

export function DetailConclusionBlock({ conclusion, title = 'Conclusion' }: DetailConclusionBlockProps) {
  if (!conclusion || conclusion.length === 0) {
    return null;
  }

  return (
    <motion.section
      id="conclusion"
      variants={sectionVariants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-50px" }}
      className="space-y-6"
    >
      <DetailSectionHeading title={title} />
      <div className="space-y-4">
        {conclusion.map((paragraph, index) => (
          <p
            key={`conclusion-${index}`}
            className="text-base leading-8 text-foreground/80"
          >
            {paragraph}
          </p>
        ))}
      </div>
    </motion.section>
  );
}
