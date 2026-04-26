"use client";

import { useRef } from "react";
import {
  motion,
  useInView,
  useReducedMotion,
  useScroll,
  useTransform,
  type MotionValue,
} from "framer-motion";
import { CheckCircle, Clock, Circle } from "lucide-react";
import {
  AnimatedWord,
  ScrollLinkedAnimatedWord,
} from "@/components/shared/animated-word";
import {
  useAnimatedBorders,
  AnimatedBorders,
} from "@/lib/use-animated-borders";
import { useTimelineProgressController } from "@/lib/timeline/progress-controller";
import type { TimelineItem } from "@/types/timeline";

interface ProjectTimelineProps {
  items: readonly TimelineItem[];
  heading?: string;
  title?: string;
  description?: string;
  anchorId?: string;
  embedded?: boolean;
}

function ProjectTimelineSegment({
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
      className="pointer-events-none absolute top-10 -bottom-8 w-px left-1/2 -translate-x-1/2 rounded-full"
    >
      <div className="absolute inset-0 rounded-full bg-electric-cyan/20" />
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

function ProjectTimelineRow({
  item,
  index,
  trigger,
  nextTrigger,
  shouldReduce,
  isInView,
  progress,
  nodeRef,
}: {
  item: TimelineItem;
  index: number;
  trigger: number;
  nextTrigger?: number;
  shouldReduce: boolean;
  isInView: boolean;
  progress: MotionValue<number>;
  nodeRef?: (nodeElement: HTMLDivElement | null) => void;
}) {
  const status = item.status ?? "upcoming";
  const config = statusConfig[status];
  const Icon = config.icon;
  const revealStart = Math.max(0, trigger - 0.12);
  const settlePoint = nextTrigger ?? 1;

  const cardEmphasis = useTransform(
    progress,
    [revealStart, trigger, Math.min(settlePoint + 0.02, 1)],
    [0.72, 1, 0.92],
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
  const titleEnd = Math.min(
    1,
    trigger + Math.max(0.08, (nextTrigger ?? 1) - trigger),
  );
  const titlePhase = useTransform(progress, [trigger, titleEnd], [0, 1], {
    clamp: true,
  });
  const titleWords = item.title.split(" ");

  return (
    <motion.li
      initial={shouldReduce ? {} : { opacity: 0, x: -30 }}
      animate={isInView ? { opacity: 1, x: 0 } : {}}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      className="relative grid list-none grid-cols-[40px_minmax(0,1fr)] gap-x-4 gap-y-0 md:flex md:flex-row md:items-stretch md:gap-8"
      data-timeline-row={item.id}
    >
      {/* Desktop-only label column — hidden on mobile */}
      <div className="hidden md:block md:w-25 shrink-0 pt-2">
        <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-foreground">
          {item.label}
        </span>
        <p className="font-mono text-xs text-electric-cyan/70 mt-1">
          {item.duration}
        </p>
      </div>

      {/* Node column — col 1 on mobile, inline on desktop */}
      <div className="col-start-1 row-start-1 relative z-10 flex flex-col items-center self-stretch">
        <motion.div
          ref={nodeRef}
          data-timeline-node={item.id}
          className={`relative z-10 w-10 h-10 shrink-0 rounded-full border-2 ${config.borderColor} ${config.bgColor} flex items-center justify-center`}
          style={shouldReduce ? undefined : { scale: nodeScale }}
          initial={shouldReduce ? {} : { scale: 0 }}
          animate={isInView ? { scale: 1 } : {}}
          transition={{
            duration: 0.4,
            delay: index * 0.1 + 0.18,
            type: "spring",
            stiffness: 200,
          }}
        >
          <Icon className={`w-5 h-5 ${config.color}`} />
        </motion.div>

        {status === "in-progress" && !shouldReduce && (
          <motion.div
            className="absolute top-0 left-0 w-10 h-10 rounded-full border-2 border-electric-cyan"
            animate={{ scale: [1, 1.4], opacity: [0.6, 0] }}
            transition={{ duration: 1.5, repeat: Infinity, ease: "easeOut" }}
          />
        )}

        {nextTrigger !== undefined && (
          <ProjectTimelineSegment
            trigger={trigger}
            nextTrigger={nextTrigger}
            progress={progress}
          />
        )}
      </div>

      {/* Content column — col 2 on mobile, flex-1 on desktop */}
      <motion.div
        className="col-start-2 row-start-1 flex-1"
        style={
          shouldReduce ? undefined : { opacity: cardEmphasis, y: cardOffset }
        }
      >
        {/* Mobile-only label shown above card */}
        <div className="md:hidden mb-2">
          <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-muted-foreground">
            {item.label}
          </span>
          <p className="font-mono text-xs text-electric-cyan/70 mt-0.5">
            {item.duration}
          </p>
        </div>

        <div
          className={`p-6 rounded-xl border ${config.borderColor} ${config.bgColor} backdrop-blur-sm transition-all duration-300 hover:border-electric-cyan/40`}
        >
          <div className="flex items-start justify-between gap-4 mb-3">
            <h3 className="text-lg font-bold text-foreground">
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
            <div
              className={`flex items-center gap-1.5 px-2 py-1 rounded-full border ${config.borderColor} ${config.bgColor}`}
            >
              <Icon className={`w-3 h-3 ${config.color}`} />
              <span
                className={`font-mono text-[9px] uppercase tracking-wider ${config.color}`}
              >
                {status.replace("-", " ")}
              </span>
            </div>
          </div>
          <p className="text-sm text-foreground/70 leading-relaxed">
            {item.description}
          </p>
        </div>
      </motion.div>
    </motion.li>
  );
}

const statusConfig = {
  completed: {
    icon: CheckCircle,
    color: "text-emerald-500",
    bgColor: "bg-emerald-500/10",
    borderColor: "border-emerald-500/30",
    lineColor: "bg-emerald-500",
  },
  "in-progress": {
    icon: Clock,
    color: "text-electric-cyan",
    bgColor: "bg-electric-cyan/10",
    borderColor: "border-electric-cyan/30",
    lineColor: "bg-electric-cyan",
  },
  upcoming: {
    icon: Circle,
    color: "text-muted-foreground",
    bgColor: "bg-muted/30",
    borderColor: "border-border",
    lineColor: "bg-border",
  },
};

export function ProjectTimeline({
  items,
  heading = "Project Timeline",
  title = "A Methodical Approach to Delivery.",
  description = "Every phase is planned, sequenced, and executed with precision. From initial assessment through to commissioning, we keep every milestone visible and every deadline on track.",
  anchorId,
  embedded,
}: ProjectTimelineProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const timelineRef = useRef<HTMLUListElement>(null);
  const nodeRefs = useRef<(HTMLDivElement | null)[]>([]);
  const isInView = useInView(containerRef, { once: true, amount: 0.2 });
  const shouldReduce = useReducedMotion();
  const { sectionRef, lineScale } = useAnimatedBorders();
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

  if (items.length === 0) return null;

  return (
    <section
      ref={sectionRef}
      className="relative overflow-hidden bg-background section-padding"
    >
      <AnimatedBorders shouldReduce={shouldReduce} lineScale={lineScale} showBottom={false} />
      <div className="section-content max-w-6xl" ref={containerRef}>
        {/* Eyebrow */}
        <motion.div
          id={anchorId}
          className="flex items-center gap-4 mb-6 scroll-mt-36"
          initial={shouldReduce ? {} : { opacity: 0, x: -20 }}
          animate={isInView ? { opacity: 1, x: 0 } : {}}
          transition={{ duration: 0.5 }}
        >
          <div className="h-px w-8 bg-[hsl(174_100%_35%)]/50 dark:bg-electric-cyan/50" />
          <h2 className="font-mono text-xs tracking-widest uppercase text-[hsl(174_100%_35%)] dark:text-electric-cyan">
            {heading}
          </h2>
        </motion.div>

        {/* Title */}
        <motion.h3
          className="text-2xl sm:text-3xl md:text-4xl font-bold text-foreground mb-6 max-w-3xl"
          initial={shouldReduce ? {} : { opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.1 }}
        >
          {title}
        </motion.h3>

        {/* Description */}
        <motion.p
          className="text-base sm:text-lg text-foreground dark:text-foreground/70 leading-relaxed max-w-4xl mb-12"
          initial={shouldReduce ? {} : { opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          {description}
        </motion.p>

        {/* Timeline */}
        <div className="relative">
          <ul ref={timelineRef} className="m-0 list-none space-y-8 p-0">
            {items.map((item, index) => (
              <ProjectTimelineRow
                key={item.id}
                item={item}
                index={index}
                trigger={thresholds[index] ?? 0}
                nextTrigger={thresholds[index + 1]}
                shouldReduce={Boolean(shouldReduce)}
                isInView={isInView}
                progress={scrollYProgress}
                nodeRef={(nodeElement) => {
                  nodeRefs.current[index] = nodeElement;
                }}
              />
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
