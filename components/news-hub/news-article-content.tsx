"use client";

import { useRef } from "react";
import { motion, type Variants } from "framer-motion";
import {
  useReducedMotion,
  useScroll,
  useTransform,
  type MotionValue,
} from "framer-motion";
import Image from "next/image";
import type { NewsDetailContent, NewsQuote } from "@/types/news";
import type { TimelineItem } from "@/types/timeline";
import {
  AnimatedWord,
  ScrollLinkedAnimatedWord,
} from "@/components/shared/animated-word";
import { useTimelineProgressController } from "@/lib/timeline/progress-controller";
import { NewsArticleCardShell } from "./news-article-card-shell";

interface NewsArticleContentProps {
  detail: NewsDetailContent;
  timelineItems?: readonly TimelineItem[];
}

const sectionVariants: Variants = {
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

function StoryTimelineSegment({
  trigger,
  nextTrigger,
  progress,
}: {
  trigger: number;
  nextTrigger: number;
  progress: MotionValue<number>;
}) {
  const segmentProgress = useTransform(
    progress,
    [trigger, nextTrigger],
    [0, 1],
    { clamp: true },
  );

  return (
    <div
      aria-hidden="true"
      className="pointer-events-none absolute left-1/2 top-[28px] bottom-[-2rem] w-0.5 -translate-x-1/2 z-10 rounded-full"
    >
      <motion.div
        className="absolute inset-0 rounded-full origin-top bg-linear-to-b from-electric-cyan via-electric-cyan/85 to-electric-cyan/25"
        style={{ scaleY: segmentProgress }}
      />
      <motion.div
        className="absolute inset-0 rounded-full origin-top bg-electric-cyan/45 blur-[2px]"
        style={{ scaleY: segmentProgress }}
      />
    </div>
  );
}

function StoryTimelineRow({
  item,
  index,
  trigger,
  nextTrigger,
  progress,
  shouldReduce,
  nodeRef,
}: {
  item: TimelineItem;
  index: number;
  trigger: number;
  nextTrigger?: number;
  progress: MotionValue<number>;
  shouldReduce: boolean;
  nodeRef?: (nodeElement: HTMLDivElement | null) => void;
}) {
  const isLeft = index % 2 === 0;
  const revealStart = Math.max(0, trigger - 0.12);
  const settlePoint = nextTrigger ?? 1;

  const cardEmphasis = useTransform(
    progress,
    [revealStart, trigger, Math.min(settlePoint + 0.02, 1)],
    [0.72, 1, 0.9],
    { clamp: true },
  );
  const cardOffset = useTransform(progress, [revealStart, trigger], [14, 0], {
    clamp: true,
  });
  const nodeScale = useTransform(
    progress,
    [revealStart, trigger, settlePoint],
    [0.88, 1, 1],
    {
      clamp: true,
    },
  );
  const nodeRingOpacity = useTransform(
    progress,
    [revealStart, trigger, settlePoint],
    [0.16, 1, 0.54],
    {
      clamp: true,
    },
  );
  const nodeFillOpacity = useTransform(
    progress,
    [revealStart, trigger, settlePoint],
    [0, 0.2, 0.28],
    {
      clamp: true,
    },
  );
  const titleEnd = Math.min(
    1,
    trigger + Math.max(0.08, (nextTrigger ?? 1) - trigger),
  );
  const titlePhase = useTransform(progress, [trigger, titleEnd], [0, 1], {
    clamp: true,
  });
  const titleWords = item.title.split(" ");

  return (
    <li className="relative mb-8 grid grid-cols-[28px_minmax(0,1fr)] gap-4 last:mb-0 md:mb-10 md:grid-cols-[minmax(0,1fr)_28px_minmax(0,1fr)] md:items-start">
      <div className="relative col-start-1 row-start-1 flex min-h-[28px] self-stretch justify-center md:col-start-2">
        <motion.div
          ref={nodeRef}
          data-timeline-node={item.id}
          style={shouldReduce ? undefined : { scale: nodeScale }}
          className="relative z-10 flex h-7 w-7 items-center justify-center rounded-full border border-border/70 bg-card/95 shadow-[0_14px_34px_-22px_rgba(2,12,27,0.95)]"
        >
          <motion.div
            className="absolute inset-0.5 rounded-full bg-electric-cyan/20"
            style={
              shouldReduce ? { opacity: 0.24 } : { opacity: nodeFillOpacity }
            }
          />
          <motion.div
            className="absolute inset-0 rounded-full border border-electric-cyan/60 shadow-[0_0_0_1px_rgba(34,211,238,0.4),0_0_20px_rgba(34,211,238,0.25)]"
            style={
              shouldReduce ? { opacity: 0.6 } : { opacity: nodeRingOpacity }
            }
          />
          <div className="relative z-10 h-2.5 w-2.5 rounded-full bg-electric-cyan" />
        </motion.div>

        {!shouldReduce && nextTrigger !== undefined && (
          <StoryTimelineSegment
            trigger={trigger}
            nextTrigger={nextTrigger}
            progress={progress}
          />
        )}
      </div>

      <motion.div
        style={
          shouldReduce ? undefined : { opacity: cardEmphasis, y: cardOffset }
        }
        className={isLeft ? "md:col-start-1 md:pr-8" : "md:col-start-3 md:pl-8"}
      >
        <NewsArticleCardShell
          className={`p-5 ${
            item.highlight
              ? "border-electric-cyan/35 bg-electric-cyan/[0.08]"
              : ""
          }`}
        >
          <div className="mb-3 flex items-start justify-between gap-4">
            <div>
              <p className="font-mono text-[9px] uppercase tracking-[0.16em] text-electric-cyan/70">
                {item.label}
              </p>
              <h3 className="mt-1 font-semibold text-white">
                {titleWords.map((word, wordIndex) =>
                  shouldReduce ? (
                    <AnimatedWord
                      key={`${item.id}-${word}-${wordIndex}`}
                      word={word}
                      index={wordIndex}
                      active={true}
                      shouldReduce={true}
                      className="inline-block mr-[0.26em] last:mr-0"
                      stagger={0.05}
                    />
                  ) : (
                    <ScrollLinkedAnimatedWord
                      key={`${item.id}-${word}-${wordIndex}`}
                      word={word}
                      index={wordIndex}
                      phase={titlePhase}
                      shouldReduce={false}
                      className="inline-block mr-[0.26em] last:mr-0"
                      staggerWindow={0.16}
                    />
                  ),
                )}
              </h3>
            </div>
            {item.duration && (
              <span className="shrink-0 rounded-md border border-electric-cyan/30 bg-electric-cyan/10 px-2 py-1 font-mono text-[9px] uppercase tracking-[0.12em] text-electric-cyan">
                {item.duration}
              </span>
            )}
          </div>
          <p className="text-sm leading-6 text-foreground/75">
            {item.description}
          </p>
        </NewsArticleCardShell>
      </motion.div>

      <div
        className={`hidden md:block ${
          isLeft ? "md:col-start-3" : "md:col-start-1"
        }`}
      />
    </li>
  );
}

function StoryTimeline({ items }: { items: readonly TimelineItem[] }) {
  const timelineRef = useRef<HTMLUListElement>(null);
  const nodeRefs = useRef<(HTMLDivElement | null)[]>([]);
  const shouldReduce = useReducedMotion();
  const { thresholds, scrollOffsets } = useTimelineProgressController({
    timelineRef,
    nodeRefs,
    itemCount: items.length,
  });

  const { scrollYProgress } = useScroll({
    target: timelineRef,
    offset: scrollOffsets as NonNullable<
      Parameters<typeof useScroll>[0]
    >["offset"],
  });

  return (
    <div className="relative">
      <div className="pointer-events-none absolute left-3.5 top-0 bottom-0 w-px bg-gradient-to-b from-electric-cyan/50 via-electric-cyan/30 to-electric-cyan/10 md:left-1/2 md:-translate-x-px" />

      <motion.ul
        ref={timelineRef}
        variants={staggerContainer}
        className="m-0 list-none p-0"
      >
        {items.map((item, index) => (
          <StoryTimelineRow
            key={item.id}
            item={item}
            index={index}
            trigger={thresholds[index] ?? 0}
            nextTrigger={thresholds[index + 1]}
            progress={scrollYProgress}
            shouldReduce={Boolean(shouldReduce)}
            nodeRef={(nodeElement) => {
              nodeRefs.current[index] = nodeElement;
            }}
          />
        ))}
      </motion.ul>
    </div>
  );
}

export function NewsArticleContent({
  detail,
  timelineItems,
}: NewsArticleContentProps) {
  return (
    <div className="space-y-18">
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
          //className="space-y-6"
        >
          <h2 className="text-2xl font-bold text-white">Project Details</h2>
          {detail.body.map((paragraph, index) => (
            <p
              key={`body-${index}`}
              className="text-base leading-8 text-foreground/75"
            >
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
          <motion.ul
            variants={staggerContainer}
            className="grid gap-3 sm:grid-cols-2"
          >
            {detail.scope.map((item, index) => (
              <motion.li
                key={`scope-${index}`}
                variants={itemVariants}
                className="flex items-start gap-3 rounded-lg border border-electric-cyan/20 bg-electric-cyan/5 p-4"
              >
                <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-md bg-electric-cyan/20 font-mono text-[9px] text-electric-cyan">
                  {String(index + 1).padStart(2, "0")}
                </span>
                <span className="text-sm leading-6 text-foreground/80">
                  {item}
                </span>
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
          <h2 className="text-2xl font-bold text-white">
            Methodology & Approach
          </h2>
          <div className="space-y-4">
            {detail.methodology.map((paragraph, index) => (
              <p
                key={`method-${index}`}
                className="text-base leading-8 text-foreground/75"
              >
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
          <h2 className="text-2xl font-bold text-white">
            Challenges & Solutions
          </h2>
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
                    <h3 className="font-semibold text-white">
                      {challenge.title}
                    </h3>
                  </div>
                </div>
                <div className="p-5 space-y-4">
                  <div>
                    <p className="font-mono text-[9px] uppercase tracking-[0.16em] text-foreground/50 mb-2">
                      Challenge
                    </p>
                    <p className="text-sm leading-6 text-foreground/75">
                      {challenge.description}
                    </p>
                  </div>
                  <div className="border-t border-electric-cyan/10 pt-4">
                    <p className="font-mono text-[9px] uppercase tracking-[0.16em] text-electric-cyan/70 mb-2">
                      Solution
                    </p>
                    <p className="text-sm leading-6 text-foreground/80">
                      {challenge.solution}
                    </p>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </motion.section>
      )}

      {/* Timeline Section */}
      {timelineItems && timelineItems.length > 0 && (
        <motion.section
          id="timeline"
          variants={sectionVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-50px" }}
          className="space-y-6"
        >
          <h2 className="text-2xl font-bold text-white">Project Timeline</h2>
          <StoryTimeline items={timelineItems} />
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
          <h2 className="text-2xl font-bold text-white">
            Technical Specifications
          </h2>
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
                      <dt className="text-sm text-foreground/60">
                        {item.label}
                      </dt>
                      <dd className="font-mono text-sm font-medium text-white">
                        {item.value}
                      </dd>
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
                <p className="text-base leading-7 text-foreground/80">
                  {result}
                </p>
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
            <p
              key={`conclusion-${index}`}
              className="text-base leading-8 text-foreground/80"
            >
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
        <motion.div
          variants={staggerContainer}
          className="grid gap-4 sm:grid-cols-2"
        >
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

function QuoteCard({
  quote,
  variant,
}: {
  quote: NewsQuote;
  variant: "primary" | "secondary";
}) {
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
      <p
        className={`leading-7 text-white ${isPrimary ? "text-lg italic" : "text-base"}`}
      >
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
