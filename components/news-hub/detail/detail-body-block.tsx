"use client";

import { motion, type Variants } from "framer-motion";
import { DetailSectionHeading } from "./detail-section-heading";

interface DetailBodyBlockProps {
  body: string[];
  title?: string;
  id?: string;
}

const sectionVariants: Variants = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: "easeOut" },
  },
};

export function DetailBodyBlock({ body, title = 'Project Details', id = 'details' }: DetailBodyBlockProps) {
  if (!body || body.length === 0) {
    return null;
  }

  return (
    <motion.section
      id={id}
      variants={sectionVariants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-50px" }}
      className="space-y-6"
    >
      <DetailSectionHeading title={title} />
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
