"use client";

import { motion, type Variants } from "framer-motion";

interface DetailBodyBlockProps {
  body: string[];
}

const sectionVariants: Variants = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: "easeOut" },
  },
};

export function DetailBodyBlock({ body }: DetailBodyBlockProps) {
  if (!body || body.length === 0) {
    return null;
  }

  return (
    <motion.section
      id="details"
      variants={sectionVariants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-50px" }}
      className="space-y-6"
    >
      <h2 className="text-2xl font-bold text-foreground">Project Details</h2>
      <div className="space-y-4">
        {body.map((paragraph, index) => (
          <p key={`body-${index}`} className="text-base leading-8 text-foreground/75">
            {paragraph}
          </p>
        ))}
      </div>
    </motion.section>
  );
}
