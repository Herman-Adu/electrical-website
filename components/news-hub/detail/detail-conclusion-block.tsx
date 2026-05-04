"use client";

import { motion, type Variants } from "framer-motion";

interface DetailConclusionBlockProps {
  conclusion?: string[];
}

const sectionVariants: Variants = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: "easeOut" },
  },
};

export function DetailConclusionBlock({ conclusion }: DetailConclusionBlockProps) {
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
      <h2 className="text-2xl font-bold text-foreground">Conclusion</h2>
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
