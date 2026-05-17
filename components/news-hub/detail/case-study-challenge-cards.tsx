"use client";

import { motion, type Variants } from "framer-motion";
import type { NewsChallengeItem } from "@/types/news";
import { NewsArticleCardShell } from "@/components/news-hub/news-article-card-shell";
import { DetailSectionHeading } from "./detail-section-heading";

interface CaseStudyChallengeCardsProps {
  challenges: NewsChallengeItem[];
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
    transition: { staggerChildren: 0.12 },
  },
};

const cardVariants: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.4 } },
};

export function CaseStudyChallengeCards({
  challenges,
  title = 'Challenges & Solutions',
}: CaseStudyChallengeCardsProps) {
  return (
    <motion.section
      id="challenges"
      variants={sectionVariants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-50px" }}
      className="space-y-6"
    >
      <DetailSectionHeading title={title} />
      <motion.div variants={staggerContainer} className="space-y-4">
        {challenges.map((challenge, index) => (
          <motion.div key={`challenge-${index}`} variants={cardVariants}>
            <NewsArticleCardShell className="overflow-hidden">
              {/* Card header */}
              <div className="border-b border-electric-cyan/10 bg-electric-cyan/5 px-5 py-3">
                <div className="flex items-center gap-2">
                  <span className="flex h-6 w-6 items-center justify-center rounded-md bg-electric-cyan/20 font-mono text-[10px] text-electric-cyan">
                    {String(index + 1).padStart(2, "0")}
                  </span>
                  <h3 className="font-semibold text-foreground">
                    {challenge.title}
                  </h3>
                </div>
              </div>
              {/* 2-col split */}
              <div className="grid gap-0 sm:grid-cols-2">
                {/* Challenge side */}
                <div className="border-b border-amber-500/20 bg-amber-500/5 p-5 sm:border-b-0 sm:border-r">
                  <p className="font-mono text-[9px] uppercase tracking-[0.16em] text-amber-400/70 mb-2">
                    Challenge
                  </p>
                  <p className="text-sm leading-6 text-foreground/75">
                    {challenge.description}
                  </p>
                </div>
                {/* Solution side */}
                <div className="border-electric-cyan/20 bg-electric-cyan/5 p-5">
                  <p className="font-mono text-[9px] uppercase tracking-[0.16em] text-electric-cyan/70 mb-2">
                    Solution
                  </p>
                  <p className="text-sm leading-6 text-foreground/80">
                    {challenge.solution}
                  </p>
                </div>
              </div>
            </NewsArticleCardShell>
          </motion.div>
        ))}
      </motion.div>
    </motion.section>
  );
}
