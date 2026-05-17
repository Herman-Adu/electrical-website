"use client";

import { motion, type Variants } from "framer-motion";
import type { NewsSpecification } from "@/types/news";
import { NewsArticleCardShell } from "@/components/news-hub/news-article-card-shell";
import { DetailSectionHeading } from "./detail-section-heading";

interface DetailSpecsBlockProps {
  specifications: NewsSpecification[];
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
  hidden: { opacity: 0, y: 16 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.4 } },
};

export function DetailSpecsBlock({ specifications, title = 'Specifications' }: DetailSpecsBlockProps) {
  return (
    <motion.section
      id="specifications"
      variants={sectionVariants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-50px" }}
      className="space-y-6"
    >
      <DetailSectionHeading title={title} />
      <motion.div
        variants={staggerContainer}
        className="grid gap-4 sm:grid-cols-2"
      >
        {specifications.map((spec, specIndex) => (
          <motion.div key={`spec-${specIndex}`} variants={itemVariants}>
            <NewsArticleCardShell className="p-5">
              <h3 className="mb-4 font-mono text-[10px] uppercase tracking-[0.18em] text-electric-cyan">
                {spec.category}
              </h3>
              <dl className="space-y-3">
                {spec.items.map((item, itemIndex) => (
                  <div
                    key={`spec-item-${itemIndex}`}
                    className="flex items-center justify-between gap-4 border-b border-electric-cyan/10 pb-2 last:border-0 last:pb-0"
                  >
                    <dt className="text-sm text-foreground/60">{item.label}</dt>
                    <dd className="font-mono text-sm font-medium text-foreground">
                      {item.value}
                    </dd>
                  </div>
                ))}
              </dl>
            </NewsArticleCardShell>
          </motion.div>
        ))}
      </motion.div>
    </motion.section>
  );
}
