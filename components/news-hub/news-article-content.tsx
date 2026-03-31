"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import type { NewsDetailContent, NewsQuote } from "@/types/news";
import { NewsArticleCardShell } from "./news-article-card-shell";
import { NewsStatCounter } from "./news-stat-counter";

interface NewsArticleContentProps {
  detail: NewsDetailContent;
  categorySlug: string;
}

const sectionVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: "easeOut" },
  },
};

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, x: -20 },
  visible: { opacity: 1, x: 0 },
};

export function NewsArticleContent({ detail, categorySlug }: NewsArticleContentProps) {
  return (
    <div className="space-y-16">
      {/* Introduction Section */}
      <motion.section
        id="overview"
        variants={sectionVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-50px" }}
        className="space-y-6"
      >
        <div className="flex items-center gap-3">
          <div className="h-px flex-1 bg-gradient-to-r from-electric-cyan/40 to-transparent" />
          <h2 className="font-mono text-[10px] uppercase tracking-[0.2em] text-electric-cyan">
            Overview
          </h2>
          <div className="h-px flex-1 bg-gradient-to-l from-electric-cyan/40 to-transparent" />
        </div>
        {detail.intro.map((paragraph, index) => (
          <motion.p
            key={`intro-${index}`}
            variants={itemVariants}
            className="text-base leading-8 text-foreground/80"
          >
            {paragraph}
          </motion.p>
        ))}
      </motion.section>

      {/* Body Content */}
      {detail.body && detail.body.length > 0 && (
        <motion.section
          id="details"
          variants={sectionVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-50px" }}
          className="space-y-6"
        >
          <h2 className="text-2xl font-bold text-white">Project Details</h2>
          {detail.body.map((paragraph, index) => (
            <p key={`body-${index}`} className="text-base leading-8 text-foreground/75">
              {paragraph}
            </p>
          ))}
        </motion.section>
      )}

      {/* Scope Section */}
      {detail.scope && detail.scope.length > 0 && (
        <motion.section
          id="scope"
          variants={sectionVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-50px" }}
          className="space-y-6"
        >
          <h2 className="text-2xl font-bold text-white">Project Scope</h2>
          <motion.ul variants={staggerContainer} className="grid gap-3 sm:grid-cols-2">
            {detail.scope.map((item, index) => (
              <motion.li
                key={`scope-${index}`}
                variants={itemVariants}
                className="flex items-start gap-3 rounded-lg border border-electric-cyan/20 bg-electric-cyan/5 p-4"
              >
                <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-md bg-electric-cyan/20 font-mono text-[9px] text-electric-cyan">
                  {String(index + 1).padStart(2, "0")}
                </span>
                <span className="text-sm leading-6 text-foreground/80">{item}</span>
              </motion.li>
            ))}
          </motion.ul>
        </motion.section>
      )}

      {/* Methodology Section */}
      {detail.methodology && detail.methodology.length > 0 && (
        <motion.section
          id="methodology"
          variants={sectionVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-50px" }}
          className="space-y-6"
        >
          <h2 className="text-2xl font-bold text-white">Methodology & Approach</h2>
          <div className="space-y-4">
            {detail.methodology.map((paragraph, index) => (
              <p key={`method-${index}`} className="text-base leading-8 text-foreground/75">
                {paragraph}
              </p>
            ))}
          </div>
        </motion.section>
      )}

      {/* Challenges & Solutions */}
      {detail.challenges && detail.challenges.length > 0 && (
        <motion.section
          id="challenges"
          variants={sectionVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-50px" }}
          className="space-y-6"
        >
          <h2 className="text-2xl font-bold text-white">Challenges & Solutions</h2>
          <motion.div variants={staggerContainer} className="space-y-4">
            {detail.challenges.map((challenge, index) => (
              <motion.div
                key={`challenge-${index}`}
                variants={itemVariants}
                className="rounded-xl border border-electric-cyan/20 bg-gradient-to-br from-background to-electric-cyan/5 overflow-hidden"
              >
                <div className="border-b border-electric-cyan/10 bg-electric-cyan/10 px-5 py-3">
                  <div className="flex items-center gap-2">
                    <span className="flex h-6 w-6 items-center justify-center rounded-md bg-electric-cyan/20 font-mono text-[10px] text-electric-cyan">
                      {String(index + 1).padStart(2, "0")}
                    </span>
                    <h3 className="font-semibold text-white">{challenge.title}</h3>
                  </div>
                </div>
                <div className="p-5 space-y-4">
                  <div>
                    <p className="font-mono text-[9px] uppercase tracking-[0.16em] text-foreground/50 mb-2">
                      Challenge
                    </p>
                    <p className="text-sm leading-6 text-foreground/75">{challenge.description}</p>
                  </div>
                  <div className="border-t border-electric-cyan/10 pt-4">
                    <p className="font-mono text-[9px] uppercase tracking-[0.16em] text-electric-cyan/70 mb-2">
                      Solution
                    </p>
                    <p className="text-sm leading-6 text-foreground/80">{challenge.solution}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </motion.section>
      )}

      {/* Timeline Section */}
      {detail.timeline && detail.timeline.length > 0 && (
        <motion.section
          id="timeline"
          variants={sectionVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-50px" }}
          className="space-y-6"
        >
          <h2 className="text-2xl font-bold text-white">Project Timeline</h2>
          <div className="relative">
            {/* Timeline line */}
            <div className="absolute left-[19px] top-0 bottom-0 w-px bg-gradient-to-b from-electric-cyan/40 via-electric-cyan/20 to-transparent" />
            
            <motion.div variants={staggerContainer} className="space-y-6">
              {detail.timeline.map((phase, index) => (
                <motion.div
                  key={`timeline-${index}`}
                  variants={itemVariants}
                  className="relative pl-12"
                >
                  {/* Timeline dot */}
                  <div className="absolute left-0 top-1 flex h-10 w-10 items-center justify-center">
                    <div className="h-3 w-3 rounded-full bg-electric-cyan shadow-[0_0_12px_rgba(0,243,189,0.5)]" />
                  </div>
                  
                  <NewsArticleCardShell className="p-5">
                    <div className="flex items-start justify-between gap-4 mb-3">
                      <div>
                        <p className="font-mono text-[9px] uppercase tracking-[0.16em] text-electric-cyan/70">
                          {phase.phase}
                        </p>
                        <h3 className="mt-1 font-semibold text-white">{phase.title}</h3>
                      </div>
                      {phase.duration && (
                        <span className="shrink-0 rounded-md border border-electric-cyan/30 bg-electric-cyan/10 px-2 py-1 font-mono text-[9px] uppercase tracking-[0.12em] text-electric-cyan">
                          {phase.duration}
                        </span>
                      )}
                    </div>
                    <p className="text-sm leading-6 text-foreground/75">{phase.description}</p>
                  </NewsArticleCardShell>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </motion.section>
      )}

      {/* Specifications Section */}
      {detail.specifications && detail.specifications.length > 0 && (
        <motion.section
          id="specifications"
          variants={sectionVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-50px" }}
          className="space-y-6"
        >
          <h2 className="text-2xl font-bold text-white">Technical Specifications</h2>
          <div className="grid gap-4 sm:grid-cols-2">
            {detail.specifications.map((spec, specIndex) => (
              <NewsArticleCardShell key={`spec-${specIndex}`} className="p-5">
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
                      <dd className="font-mono text-sm font-medium text-white">{item.value}</dd>
                    </div>
                  ))}
                </dl>
              </NewsArticleCardShell>
            ))}
          </div>
        </motion.section>
      )}

      {/* Key Takeaways */}
      <motion.section
        id="takeaways"
        variants={sectionVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-50px" }}
        className="space-y-6"
      >
        <h2 className="text-2xl font-bold text-white">Key Takeaways</h2>
        <motion.ul variants={staggerContainer} className="space-y-3">
          {detail.takeaways.map((takeaway, index) => (
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

      {/* Results Section */}
      {detail.results && detail.results.length > 0 && (
        <motion.section
          id="results"
          variants={sectionVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-50px" }}
          className="space-y-6"
        >
          <h2 className="text-2xl font-bold text-white">Results & Outcomes</h2>
          <div className="rounded-xl border border-electric-cyan/30 bg-gradient-to-br from-electric-cyan/10 to-transparent p-6 space-y-4">
            {detail.results.map((result, index) => (
              <div key={`result-${index}`} className="flex items-start gap-3">
                <span className="mt-1 h-2 w-2 shrink-0 rounded-full bg-electric-cyan shadow-[0_0_8px_rgba(0,243,189,0.5)]" />
                <p className="text-base leading-7 text-foreground/80">{result}</p>
              </div>
            ))}
          </div>
        </motion.section>
      )}

      {/* Gallery Section */}
      {detail.gallery && detail.gallery.length > 0 && (
        <motion.section
          id="gallery"
          variants={sectionVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-50px" }}
          className="space-y-6"
        >
          <h2 className="text-2xl font-bold text-white">Project Gallery</h2>
          <div className="grid gap-4 sm:grid-cols-2">
            {detail.gallery.map((image, index) => (
              <motion.div
                key={`gallery-${index}`}
                variants={itemVariants}
                className="group relative aspect-video overflow-hidden rounded-xl border border-electric-cyan/20"
              >
                <Image
                  src={image.src}
                  alt={image.alt}
                  fill
                  className="object-cover transition-transform duration-500 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-background/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                {image.caption && (
                  <div className="absolute bottom-0 left-0 right-0 p-4 translate-y-full group-hover:translate-y-0 transition-transform">
                    <p className="text-sm text-white">{image.caption}</p>
                  </div>
                )}
              </motion.div>
            ))}
          </div>
        </motion.section>
      )}

      {/* Conclusion Section */}
      {detail.conclusion && detail.conclusion.length > 0 && (
        <motion.section
          id="conclusion"
          variants={sectionVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-50px" }}
          className="space-y-6"
        >
          <h2 className="text-2xl font-bold text-white">Conclusion</h2>
          {detail.conclusion.map((paragraph, index) => (
            <p key={`conclusion-${index}`} className="text-base leading-8 text-foreground/80">
              {paragraph}
            </p>
          ))}
        </motion.section>
      )}

      {/* Primary Quote */}
      {detail.quote && (
        <motion.section
          id="testimonial"
          variants={sectionVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-50px" }}
        >
          <QuoteCard quote={detail.quote} variant="primary" />
        </motion.section>
      )}

      {/* Additional Quotes */}
      {detail.additionalQuotes && detail.additionalQuotes.length > 0 && (
        <motion.div variants={staggerContainer} className="grid gap-4 sm:grid-cols-2">
          {detail.additionalQuotes.map((quote, index) => (
            <motion.div key={`quote-${index}`} variants={itemVariants}>
              <QuoteCard quote={quote} variant="secondary" />
            </motion.div>
          ))}
        </motion.div>
      )}
    </div>
  );
}

function QuoteCard({ quote, variant }: { quote: NewsQuote; variant: "primary" | "secondary" }) {
  const isPrimary = variant === "primary";

  return (
    <blockquote
      className={`rounded-xl border p-6 ${
        isPrimary
          ? "border-electric-cyan/30 bg-gradient-to-br from-electric-cyan/15 to-electric-cyan/5 shadow-[0_0_30px_rgba(0,243,189,0.1)]"
          : "border-electric-cyan/20 bg-electric-cyan/5"
      }`}
    >
      <div className="mb-4 text-electric-cyan/40">
        <svg className="h-8 w-8" fill="currentColor" viewBox="0 0 24 24">
          <path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h3.983v10h-9.983z" />
        </svg>
      </div>
      <p className={`leading-7 text-white ${isPrimary ? "text-lg italic" : "text-base"}`}>
        {quote.quote}
      </p>
      <footer className="mt-4 flex items-center gap-3">
        <div className="h-px flex-1 bg-electric-cyan/20" />
        <div className="text-right">
          <p className="font-medium text-white">{quote.author}</p>
          <p className="font-mono text-[10px] uppercase tracking-[0.16em] text-electric-cyan/70">
            {quote.role}
          </p>
        </div>
      </footer>
    </blockquote>
  );
}
