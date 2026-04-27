"use client";

import { motion } from "framer-motion";
import {
  Activity,
  ChevronDown,
  Clock,
  MessageSquare,
  ShieldCheck,
  Wrench,
} from "lucide-react";
import { BlueprintBackground } from "@/components/hero/blueprint-background";
import { HeroParallaxShell } from "@/components/hero/hero-parallax-shell";
import { useHeroParallax } from "@/components/hero/use-hero-parallax";
import { HERO_H1_COMPACT_BLUEPRINT } from "@/components/hero/hero-tokens";
import { scrollToElementWithOffset } from "@/lib/scroll-to-section";
import type {
  MarketingQuotationContent,
  MarketingIconName,
} from "@/types/marketing";
import { useCyclingText } from "@/lib/hooks/use-cycling-text";

const iconMap = {
  Clock,
  MessageSquare,
  ShieldCheck,
  Wrench,
} as const;

type QuotationIconName = keyof typeof iconMap;

const getIcon = (name?: MarketingIconName) =>
  name ? iconMap[name as QuotationIconName] : undefined;

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1, delayChildren: 0.15 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20, filter: "blur(6px)" },
  visible: {
    opacity: 1,
    y: 0,
    filter: "blur(0px)",
    transition: { type: "spring" as const, damping: 25, stiffness: 120 },
  },
};

const flickerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: [0, 1, 0.5, 1, 0.8, 1],
    transition: {
      duration: 0.8,
      times: [0, 0.2, 0.3, 0.5, 0.7, 1],
    },
  },
};

interface QuotationHeroProps {
  header: MarketingQuotationContent["header"];
  trustIndicators: MarketingQuotationContent["trustIndicators"];
}

export function QuotationHero({ header, trustIndicators }: QuotationHeroProps) {
  const { sectionRef, backgroundFrameStyle, contentStyle, shouldReduceMotion } =
    useHeroParallax({ size: "compact" });

  const scrollToQuotationForm = () => {
    const element = document.getElementById("quotation-form-section");
    if (element) scrollToElementWithOffset(element);
  };

  const statuses = [
    "INITIALIZING",
    "LOADING_MODULES",
    "CALIBRATING",
    "PROFESSIONAL SCOPE",
  ];

  const { currentText: statusText } = useCyclingText(statuses, 400);

  return (
    <HeroParallaxShell
      sectionRef={sectionRef}
      size="compact"
      safeArea="page"
      background={<BlueprintBackground showScanLine={false} />}
      backgroundFrameStyle={backgroundFrameStyle}
      decor={
        <>
          <svg
            className="absolute inset-0 h-full w-full opacity-15"
            viewBox="0 0 1440 600"
            fill="none"
            aria-hidden="true"
          >
            <motion.path
              d="M0 300 H460 L500 260 H920 L980 320 H1440"
              stroke="var(--electric-cyan)"
              strokeWidth="1"
              fill="none"
              initial={
                shouldReduceMotion ? false : { pathLength: 0, opacity: 0 }
              }
              animate={{ pathLength: 1, opacity: 1 }}
              transition={
                shouldReduceMotion
                  ? { duration: 0 }
                  : { duration: 2, delay: 0.4, ease: "easeOut" }
              }
            />
            <motion.path
              d="M0 390 H300 L360 340 H760 L830 420 H1440"
              stroke="var(--electric-cyan)"
              strokeWidth="0.5"
              fill="none"
              initial={
                shouldReduceMotion ? false : { pathLength: 0, opacity: 0 }
              }
              animate={{ pathLength: 1, opacity: 1 }}
              transition={
                shouldReduceMotion
                  ? { duration: 0 }
                  : { duration: 2, delay: 0.8, ease: "easeOut" }
              }
            />
          </svg>

          {!shouldReduceMotion && (
            <motion.div
              className="absolute left-0 right-0 h-px bg-linear-to-r from-transparent via-electric-cyan/30 to-transparent"
              animate={{ top: ["0%", "100%"] }}
              transition={{ duration: 6, repeat: Infinity, ease: "linear" }}
            />
          )}
        </>
      }
      content={
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="mx-auto max-w-5xl px-4 text-center"
        >
          {/* Status Label */}
          <motion.div
            variants={flickerVariants}
            className="flex items-center justify-center gap-3 mb-8"
          >
            <div className="flex items-center gap-3 border-l-2 border-foreground/60 dark:border-foreground pl-4 font-bold">
              <Activity
                size={14}
                className="text-electric-cyan animate-pulse"
              />
              <span className="font-mono text-[10px] tracking-[0.3em] text-foreground uppercase font-bold">
                Services // {statusText}
              </span>
            </div>
          </motion.div>

          {/* Eyebrow */}
          <motion.div
            variants={itemVariants}
            className="flex items-center justify-center gap-4 mb-6"
          >
            <span className="h-px w-12 bg-electric-cyan" />
            <span className="font-mono text-xs tracking-[0.3em] uppercase text-electric-cyan font-bold">
              Engineered For Technical Clarity
            </span>
            <span className="h-px w-12 bg-electric-cyan" />
          </motion.div>

          <motion.h1
            variants={itemVariants}
            className={HERO_H1_COMPACT_BLUEPRINT}
          >
            <span className="block">Request Your</span>
            <span className="block text-transparent bg-clip-text bg-linear-to-r dark:from-electric-cyan/10 via-electric-cyan to-electric-cyan/10">
              Quotation
            </span>
            <span className="block">Today</span>
          </motion.h1>

          {/* <motion.h1
            variants={itemVariants}
            className={HERO_H1_COMPACT_BLUEPRINT}
          >
            {header.title}
          </motion.h1> */}

          {/* Main headline */}
          {/*  <motion.h1 variants={itemVariants} className={HERO_H1_TALL_IMAGE}>
            {headlineHighlight ? (
              <>
                {headlineText.split(headlineHighlight)[0]}
                <span className="text-electric-cyan">{headlineHighlight}</span>
                {headlineText.split(headlineHighlight)[1]}
              </>
            ) : (
              headlineText
            )}
          </motion.h1> */}

          {/* Description */}

          <motion.p
            variants={itemVariants}
            className="mx-auto max-w-2xl text-base leading-relaxed text-muted-foreground text-pretty sm:text-lg"
          >
            {header.description}
          </motion.p>

          {/* Trust indicators */}
          <motion.div
            variants={itemVariants}
            className="mx-auto mt-8 grid w-full max-w-4xl grid-cols-2 gap-4 sm:grid-cols-4"
          >
            {trustIndicators.map((item) => {
              const Icon = getIcon(item.icon);

              return (
                <div
                  key={item.title}
                  className="relative p-5 rounded-xl border bg-foreground/20 dark:bg-white/15 border-foreground/20 dark:border-electric-cyan/10 backdrop-blur-md hover:border-[hsl(174_100%_35%)] dark:hover:border-electric-cyan transition-all duration-300 group"
                >
                  {Icon ? (
                    <Icon className="mx-auto mb-2 h-6 w-6 text-foreground/70 dark:text-electric-cyan group-hover:text-[hsl(174_100%_35%)] dark:group-hover:text-electric-cyan transition-colors" />
                  ) : null}
                  <p className="text-sm font-medium text-foreground group-hover:text-[hsl(174_100%_35%)] dark:group-hover:text-electric-cyan transition-colors">
                    {item.title}
                  </p>
                  <p className="mt-1 hidden text-xs text-foreground/70 dark:text-foreground/70 sm:block">
                    {item.description}
                  </p>
                </div>
              );
            })}
          </motion.div>
        </motion.div>
      }
      contentStyle={contentStyle}
      scrollIndicator={
        <motion.button
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.8, duration: 0.45 }}
          onClick={scrollToQuotationForm}
          className="flex cursor-pointer flex-col items-center gap-2 text-muted-foreground transition-colors hover:text-electric-cyan"
          aria-label="Scroll to quotation form"
        >
          <span className="font-mono text-[9px] tracking-[0.3em] uppercase">
            Start Quotation
          </span>
          <ChevronDown
            size={20}
            className={shouldReduceMotion ? "" : "animate-bounce"}
          />
        </motion.button>
      }
    />
  );
}
