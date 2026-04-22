"use client";

import { useRef, useState } from "react";
import {
  motion,
  useMotionTemplate,
  useMotionValueEvent,
  useScroll,
  useTransform,
  type MotionValue,
} from "framer-motion";
import {
  Award,
  Building,
  Shield,
  Star,
  Users,
  Zap,
  type LucideIcon,
} from "lucide-react";
import {
  AnimatedBorders,
  useAnimatedBorders,
} from "@/lib/use-animated-borders";
import { adaptCompanyTimeline } from "@/lib/timeline/adapters";
import {
  AnimatedWord,
  ScrollLinkedAnimatedWord,
} from "@/components/shared/animated-word";
import {
  clamp01,
  getTimelineNodeState,
  useTimelineProgressController,
} from "@/lib/timeline/progress-controller";
import type { CompanyTimelineMilestoneInput } from "@/types/timeline";

const companyMilestoneSource = [
  {
    year: "2016",
    title: "Company Founded",
    desc: "Started as a two-man domestic electrical team in South Bucks with a commitment to quality over volume.",
    icon: Zap,
    highlight: true,
  },
  {
    year: "2018",
    title: "NICEIC Approved",
    desc: "Achieved NICEIC Approved Contractor status, cementing our commitment to the highest safety standards.",
    icon: Shield,
    highlight: false,
  },
  {
    year: "2019",
    title: "Commercial Expansion",
    desc: "Expanded into commercial electrical installations, completing our first major office fit-out contract.",
    icon: Building,
    highlight: false,
  },
  {
    year: "2020",
    title: "Professional Team",
    desc: "Growing a team of qualified electricians, taking on larger industrial and commercial projects.",
    icon: Users,
    highlight: false,
  },
  {
    year: "2021",
    title: "DHL Reading",
    desc: "chosen as the preferred and trusted electrical contractor to deliver DHLs distribution hub Cat B fit out in Reading.",
    icon: Award,
    highlight: true,
  },
  {
    year: "20203",
    title: "Community Programme",
    desc: "Launched our community reinvestment programme, providing free electrical safety checks for vulnerable residents, working together with the local council community programmes and local schools.",
    icon: Users,
    highlight: false,
  },
  {
    year: "2023",
    title: "Industrial Division",
    desc: "Opened our dedicated industrial division, handling high-voltage systems and complex distribution networks.",
    icon: Zap,
    highlight: false,
  },
  {
    year: "2026",
    title: "250+ Projects",
    desc: "Surpassed 250 completed projects with a 99.7% client satisfaction rating. The journey continues.",
    icon: Star,
    highlight: true,
  },
] as const satisfies readonly (CompanyTimelineMilestoneInput & {
  icon: LucideIcon;
})[];

type TimelineMilestone = {
  id: string;
  year: string;
  title: string;
  desc: string;
  icon: LucideIcon;
  highlight: boolean;
};

function buildCompanyTimelineModel() {
  const canonicalSection = adaptCompanyTimeline(companyMilestoneSource);

  const milestones: TimelineMilestone[] = canonicalSection.items.map(
    (item, index) => ({
      id: item.id,
      year: item.year ?? item.label,
      title: item.title,
      desc: item.description,
      icon: companyMilestoneSource[index]?.icon ?? Star,
      highlight: item.highlight,
    }),
  );

  return {
    anchorId: canonicalSection.anchorId,
    milestones,
  };
}

const { anchorId: timelineAnchorId, milestones } = buildCompanyTimelineModel();

function getRowSide(index: number) {
  return index % 2 === 0 ? "left" : "right";
}

function TimelineHeader() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 18 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-12%" }}
      transition={{ duration: 0.55, ease: [0.16, 1, 0.3, 1] }}
      className="text-center mb-12 md:mb-20"
    >
      <div className="flex items-center justify-center gap-3 mb-4">
        <div className="h-px w-6 md:w-8 bg-electric-cyan" />
        <span className="font-mono text-[10px] md:text-xs tracking-widest uppercase text-[hsl(174_100%_35%)] dark:text-electric-cyan">
          Our Journey
        </span>
        <div className="h-px w-6 md:w-8 bg-electric-cyan" />
      </div>
      <h2 className="text-3xl md:text-5xl font-bold text-foreground mb-3 md:mb-4 text-balance">
        10+ Years of{" "}
        <span className="text-[hsl(174_100%_35%)] dark:text-electric-cyan">
          Powering Progress
        </span>
      </h2>
      <p className="text-base sm:text-lg lg:text-xl text-foreground/90 dark:text-foreground/90 mb-10 max-w-2xl mx-auto leading-relaxed font-normal">
        From humble beginnings to industry leadership — every year has been
        built on the same foundation of quality and community.
      </p>
    </motion.div>
  );
}

function TimelineCard({
  milestone,
  side,
  emphasis,
  offset,
  titlePhase,
  titleActive,
  shouldReduceTitle,
}: {
  milestone: TimelineMilestone;
  side: "left" | "right";
  emphasis?: MotionValue<number>;
  offset?: MotionValue<number>;
  titlePhase?: MotionValue<number>;
  titleActive?: boolean;
  shouldReduceTitle?: boolean;
}) {
  const alignmentClass =
    side === "left"
      ? "md:col-start-1 md:justify-end md:text-right"
      : "md:col-start-3 md:justify-start md:text-left";
  const titleWords = milestone.title.split(" ");

  return (
    <motion.div
      style={emphasis || offset ? { opacity: emphasis, y: offset } : undefined}
      className={`col-start-2 row-start-1 flex ${alignmentClass}`}
    >
      <div
        className={`relative w-full md:max-w-sm rounded-3xl border p-5 md:p-6 backdrop-blur-sm transition-colors duration-300 ${
          milestone.highlight
            ? "border-[hsl(174_100%_35%)]/30 dark:border-electric-cyan/30 bg-[hsl(174_100%_35%)]/[0.07] dark:bg-electric-cyan/[0.07]"
            : "border-border/70 bg-card/65"
        }`}
      >
        <div className="absolute inset-x-0 top-0 h-px bg-linear-to-r from-electric-cyan/0 via-electric-cyan/50 to-electric-cyan/0" />
        <div className="font-mono text-xs tracking-[0.28em] text-[hsl(174_100%_35%)] dark:text-electric-cyan/70 mb-3 font-bold">
          {milestone.year}
        </div>
        <h3 className="text-lg md:text-xl font-bold text-foreground mb-2 leading-tight text-balance">
          {titleWords.map((word, wordIndex) =>
            titlePhase ? (
              <ScrollLinkedAnimatedWord
                key={`${milestone.id}-${word}-${wordIndex}`}
                word={word}
                index={wordIndex}
                phase={titlePhase}
                shouldReduce={shouldReduceTitle}
                className="inline-block mr-[0.26em] last:mr-0"
                staggerWindow={0.16}
              />
            ) : (
              <AnimatedWord
                key={`${milestone.id}-${word}-${wordIndex}`}
                word={word}
                index={wordIndex}
                active={titleActive ?? true}
                shouldReduce={shouldReduceTitle}
                className="inline-block mr-[0.26em] last:mr-0"
                stagger={0.05}
              />
            ),
          )}
        </h3>
        <p className="text-sm md:text-[0.95rem] text-muted-foreground leading-relaxed">
          {milestone.desc}
        </p>
        {milestone.highlight && (
          <div className="mt-4 inline-flex items-center gap-1.5 rounded-full border border-amber-warning/30 bg-amber-warning/10 px-2.5 py-1">
            <Star className="size-3 text-amber-warning fill-amber-warning shrink-0" />
            <span className="font-mono text-[10px] tracking-[0.24em] uppercase text-amber-warning">
              Milestone
            </span>
          </div>
        )}
      </div>
    </motion.div>
  );
}

function AnimatedSegment({
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

  // Single origin-top container: scaleY 0→1 grows from top to bottom when scrolling down.
  // When scrolling up, scaleY 1→0 shrinks from the bottom upward — correct reversal, no
  // class-switching required. The MotionValue is inherently bidirectional.
  return (
    <div
      aria-hidden="true"
      className="pointer-events-none absolute left-1/2 top-(--timeline-node) bottom-[calc(var(--timeline-gap)*-1)] w-0.5 -translate-x-1/2 z-10 rounded-full"
    >
      <motion.div
        className="absolute inset-0 rounded-full origin-top"
        style={{
          scaleY: segmentProgress,
          background: `linear-gradient(to bottom, var(--timeline-stroke), rgba(0, 243, 189, 0.85), rgba(0, 243, 189, 0.25))`,
        }}
      />
      <motion.div
        className="absolute inset-0 rounded-full origin-top blur-[2px]"
        style={{
          scaleY: segmentProgress,
          backgroundColor: `rgba(0, 243, 189, 0.45)`,
        }}
      />
    </div>
  );
}

function AnimatedTimelineNode({
  milestone,
  index,
  trigger,
  nextTrigger,
  progress,
  nodeRef,
}: {
  milestone: TimelineMilestone;
  index: number;
  trigger: number;
  nextTrigger?: number;
  progress: MotionValue<number>;
  nodeRef?: (nodeElement: HTMLDivElement | null) => void;
}) {
  const side = getRowSide(index);
  const Icon = milestone.icon;
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
  const ringOpacity = useTransform(
    progress,
    [revealStart, trigger, settlePoint],
    [0.16, 1, 0.54],
    {
      clamp: true,
    },
  );
  const fillOpacity = useTransform(
    progress,
    [revealStart, trigger, settlePoint],
    [0, 0.2, 0.28],
    {
      clamp: true,
    },
  );
  const iconAccentOpacity = useTransform(
    progress,
    [revealStart, trigger],
    [0, 1],
    {
      clamp: true,
    },
  );
  const glowStrength = useTransform(
    progress,
    [revealStart, trigger, settlePoint],
    [0, 1, 0.48],
    {
      clamp: true,
    },
  );
  const glowScale = useTransform(
    progress,
    [revealStart, trigger, settlePoint],
    [0.9, 1, 1.04],
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
  const glowShadow = useMotionTemplate`0 0 0 1px rgba(34, 211, 238, ${ringOpacity}), 0 0 34px rgba(34, 211, 238, ${glowStrength})`;

  return (
    <li className="relative mb-(--timeline-gap) grid grid-cols-[var(--timeline-node)_minmax(0,1fr)] gap-x-4 last:mb-0 md:grid-cols-[minmax(0,1fr)_var(--timeline-node)_minmax(0,1fr)] md:gap-x-8">
      <div className="relative col-start-1 row-start-1 flex min-h-(--timeline-node) self-stretch justify-center md:col-start-2">
        <motion.div
          ref={nodeRef}
          style={{ scale: nodeScale }}
          className="relative z-10 flex h-(--timeline-node) w-(--timeline-node) items-center justify-center rounded-full border border-border/70 bg-card/95 shadow-[0_14px_34px_-22px_rgba(2,12,27,0.95)] backdrop-blur-sm"
        >
          <motion.div
            className="absolute inset-0.75 rounded-full bg-electric-cyan/20"
            style={{ opacity: fillOpacity }}
          />
          <motion.div
            className="absolute inset-0 rounded-full border border-electric-cyan/60"
            style={{ opacity: ringOpacity, boxShadow: glowShadow }}
          />
          <motion.div
            className="absolute -inset-2.5 rounded-full border border-electric-cyan/35 blur-[0.5px]"
            style={{ opacity: glowStrength, scale: glowScale }}
          />
          <Icon className="relative z-10 size-4 text-muted-foreground md:size-[1.1rem]" />
          <motion.div
            className="absolute inset-0 flex items-center justify-center text-electric-cyan"
            style={{ opacity: iconAccentOpacity }}
          >
            <Icon className="size-4 md:size-[1.1rem]" />
          </motion.div>
        </motion.div>

        {nextTrigger !== undefined && (
          <AnimatedSegment
            trigger={trigger}
            nextTrigger={nextTrigger}
            progress={progress}
          />
        )}
      </div>

      <TimelineCard
        milestone={milestone}
        side={side}
        emphasis={cardEmphasis}
        offset={cardOffset}
        titlePhase={titlePhase}
      />
    </li>
  );
}

function ReducedTimelineNode({
  milestone,
  index,
  state,
  showSegment,
  nodeRef,
  shouldReduceTitle,
}: {
  milestone: TimelineMilestone;
  index: number;
  state: ReturnType<typeof getTimelineNodeState>;
  showSegment: boolean;
  nodeRef?: (nodeElement: HTMLDivElement | null) => void;
  shouldReduceTitle?: boolean;
}) {
  const side = getRowSide(index);
  const Icon = milestone.icon;
  const isActive = state === "active";
  const isCompleted = state === "completed";

  return (
    <li className="relative mb-(--timeline-gap) grid grid-cols-[var(--timeline-node)_minmax(0,1fr)] gap-x-4 last:mb-0 md:grid-cols-[minmax(0,1fr)_var(--timeline-node)_minmax(0,1fr)] md:gap-x-8">
      <div className="relative col-start-1 row-start-1 flex min-h-(--timeline-node) self-stretch justify-center md:col-start-2">
        <div
          ref={nodeRef}
          className={`relative z-10 flex h-(--timeline-node) w-(--timeline-node) items-center justify-center rounded-full border bg-card/95 shadow-[0_14px_34px_-22px_rgba(2,12,27,0.95)] ${
            isActive || isCompleted
              ? "border-electric-cyan/70"
              : "border-border/70"
          }`}
        >
          <div
            className={`absolute inset-0.75 rounded-full ${
              isActive || isCompleted ? "bg-electric-cyan/20" : "bg-transparent"
            }`}
          />
          {isActive && (
            <div className="absolute inset-0 rounded-full border border-electric-cyan/60 shadow-[0_0_0_1px_rgba(34,211,238,0.5),0_0_28px_rgba(34,211,238,0.24)]" />
          )}
          <Icon
            className={`relative z-10 size-4 md:size-[1.1rem] ${
              isActive || isCompleted
                ? "text-electric-cyan"
                : "text-muted-foreground"
            }`}
          />
        </div>

        {showSegment && (
          <div
            aria-hidden="true"
            className="pointer-events-none absolute left-1/2 top-(--timeline-node) bottom-[calc(var(--timeline-gap)*-1)] w-0.5 -translate-x-1/2 rounded-full shadow-[0_0_18px_rgba(34,211,238,0.25)]"
            style={{
              background: `linear-gradient(to bottom, var(--timeline-stroke), rgba(0, 243, 189, 0.85), rgba(0, 243, 189, 0.25))`,
            }}
          />
        )}
      </div>

      <TimelineCard
        milestone={milestone}
        side={side}
        titleActive={isActive || isCompleted}
        shouldReduceTitle={shouldReduceTitle}
      />
    </li>
  );
}

export function CompanyTimeline() {
  const timelineRef = useRef<HTMLUListElement>(null);
  const nodeRefs = useRef<(HTMLDivElement | null)[]>([]);
  const { sectionRef, lineScale, shouldReduce } = useAnimatedBorders();
  const isReduced = Boolean(shouldReduce);
  const [reducedProgress, setReducedProgress] = useState(0);
  const { thresholds, scrollOffsets } = useTimelineProgressController({
    timelineRef,
    nodeRefs,
    itemCount: milestones.length,
  });

  const { scrollYProgress } = useScroll({
    target: timelineRef,
    offset: scrollOffsets as NonNullable<
      Parameters<typeof useScroll>[0]
    >["offset"],
  });

  useMotionValueEvent(scrollYProgress, "change", (latest) => {
    if (isReduced) {
      setReducedProgress(clamp01(latest));
    }
  });

  return (
    <div className="timeline-container">
      <style>{`
        .timeline-container {
          --timeline-stroke: hsl(174 100% 35%);
        }
        .dark .timeline-container {
          --timeline-stroke: #00f3bd;
        }
      `}</style>
      <section
        id={timelineAnchorId}
        ref={sectionRef}
        className="section-container section-padding bg-background"
      >
        <AnimatedBorders
          shouldReduce={shouldReduce}
          lineScale={lineScale}
          showBottom={false}
        />
        <div className="absolute inset-0 blueprint-grid opacity-10 pointer-events-none" />

        <div className="section-content max-w-5xl">
          <TimelineHeader />

          <ul
            ref={timelineRef}
            className="relative m-0 list-none p-0 [--timeline-node:2.5rem] [--timeline-gap:1.75rem] md:[--timeline-node:3rem] md:[--timeline-gap:2.5rem]"
          >
            {isReduced
              ? milestones.map((milestone, index) => {
                  const trigger = thresholds[index] ?? 0;
                  const nextTrigger = thresholds[index + 1];
                  const state = getTimelineNodeState(
                    reducedProgress,
                    trigger,
                    nextTrigger,
                  );
                  const showSegment =
                    nextTrigger !== undefined && reducedProgress >= nextTrigger;

                  return (
                    <ReducedTimelineNode
                      key={milestone.id}
                      milestone={milestone}
                      index={index}
                      state={state}
                      showSegment={showSegment}
                      shouldReduceTitle={isReduced}
                      nodeRef={(nodeElement) => {
                        nodeRefs.current[index] = nodeElement;
                      }}
                    />
                  );
                })
              : milestones.map((milestone, index) => (
                  <AnimatedTimelineNode
                    key={milestone.id}
                    milestone={milestone}
                    index={index}
                    trigger={thresholds[index] ?? 0}
                    nextTrigger={thresholds[index + 1]}
                    progress={scrollYProgress}
                    nodeRef={(nodeElement) => {
                      nodeRefs.current[index] = nodeElement;
                    }}
                  />
                ))}
          </ul>
        </div>
      </section>
    </div>
  );
}
