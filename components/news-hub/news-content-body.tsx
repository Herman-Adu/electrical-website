"use client";

import { motion } from "framer-motion";
import type { NewsDetailContent, NewsSpotlightMetric, NewsQuote } from "@/types/news";
import { NewsArticleCardShell } from "./news-article-card-shell";

interface NewsContentBodyProps {
  detail: NewsDetailContent;
}

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { type: "spring", damping: 25, stiffness: 120 },
  },
};

function SpotlightMetricCard({ metric }: { metric: NewsSpotlightMetric }) {
  return (
    <NewsArticleCardShell className="p-5 border-l-4 border-l-electric-cyan">
      <div className="font-mono text-[10px] uppercase tracking-[0.2em] text-foreground/60">
        {metric.label}
      </div>
      <div className="mt-2 text-3xl font-black text-electric-cyan">
        {metric.value}
      </div>
    </NewsArticleCardShell>
  );
}

function QuoteCard({ quote }: { quote: NewsQuote }) {
  return (
    <NewsArticleCardShell className="p-6 bg-gradient-to-br from-electric-cyan/10 to-transparent border-electric-cyan/30">
      <div className="relative">
        <span className="absolute -left-2 -top-4 text-5xl text-electric-cyan/20 font-serif">
          &ldquo;
        </span>
        <blockquote className="pl-4 text-lg leading-relaxed text-white italic">
          {quote.quote}
        </blockquote>
      </div>
      <footer className="mt-4 pt-4 border-t border-electric-cyan/20">
        <div className="font-semibold text-white">{quote.author}</div>
        <div className="font-mono text-[10px] uppercase tracking-[0.18em] text-electric-cyan/70">
          {quote.role}
        </div>
      </footer>
    </NewsArticleCardShell>
  );
}

export function NewsContentBody({ detail }: NewsContentBodyProps) {
  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-50px" }}
      className="grid gap-8 lg:grid-cols-[minmax(0,1.1fr)_minmax(260px,0.55fr)]"
    >
      {/* Main content */}
      <div className="space-y-10">
        {/* Intro section */}
        <motion.div variants={itemVariants} className="space-y-4">
          <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-electric-cyan">
            Story Overview
          </p>
          {detail.intro.map((paragraph, index) => (
            <p
              key={index}
              className="text-base leading-8 text-foreground/80"
            >
              {paragraph}
            </p>
          ))}
        </motion.div>

        {/* Key takeaways */}
        <motion.div variants={itemVariants} className="space-y-4">
          <h2 className="text-2xl font-bold text-white">Key Takeaways</h2>
          <ul className="space-y-3">
            {detail.takeaways.map((takeaway, index) => (
              <motion.li
                key={index}
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="flex gap-3 rounded-xl border border-electric-cyan/20 bg-electric-cyan/5 px-4 py-4"
              >
                <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-electric-cyan/20 text-xs font-bold text-electric-cyan">
                  {index + 1}
                </span>
                <span className="text-sm leading-6 text-foreground/80">
                  {takeaway}
                </span>
              </motion.li>
            ))}
          </ul>
        </motion.div>
      </div>

      {/* Sidebar */}
      <aside className="space-y-4 lg:sticky lg:top-24 lg:self-start">
        {detail.spotlight?.map((metric, index) => (
          <motion.div
            key={metric.label}
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ delay: index * 0.1 }}
          >
            <SpotlightMetricCard metric={metric} />
          </motion.div>
        ))}

        {detail.quote && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
          >
            <QuoteCard quote={detail.quote} />
          </motion.div>
        )}
      </aside>
    </motion.div>
  );
}
