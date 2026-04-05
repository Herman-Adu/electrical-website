"use client";

import { motion } from "framer-motion";
import { Activity, ChevronDown } from "lucide-react";
import { BlueprintBackground } from "@/components/hero/blueprint-background";
import { HeroParallaxShell } from "@/components/hero/hero-parallax-shell";
import { useHeroParallax } from "@/components/hero/use-hero-parallax";
import { HERO_H1_COMPACT_BLUEPRINT } from "@/components/hero/hero-tokens";
import { scrollToElementWithOffset } from "@/lib/scroll-to-section";
import type { MarketingQuotationContent } from "@/types/marketing";

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
          <motion.div
            variants={itemVariants}
            className="flex items-center justify-center gap-3 mb-6"
          >
            <div className="flex items-center gap-3 border-l-2 border-electric-cyan pl-4">
              <Activity
                size={12}
                className="text-electric-cyan animate-pulse"
              />
              <span className="font-mono text-[10px] tracking-[0.3em] text-electric-cyan/80 uppercase">
                Quotation // Professional Scope
              </span>
            </div>
          </motion.div>

          <motion.div
            variants={itemVariants}
            className="mb-4 flex items-center justify-center"
          >
            <div className="inline-flex items-center gap-2 border border-electric-cyan/25 bg-electric-cyan/10 px-4 py-2">
              <span className="font-mono text-xs tracking-[0.3em] text-electric-cyan/80 uppercase">
                Project Quotation
              </span>
            </div>
          </motion.div>

          <motion.h1
            variants={itemVariants}
            className={HERO_H1_COMPACT_BLUEPRINT}
          >
            {header.title}
          </motion.h1>

          <motion.p
            variants={itemVariants}
            className="mx-auto max-w-2xl text-base leading-relaxed text-muted-foreground text-pretty sm:text-lg"
          >
            {header.description}
          </motion.p>

          <motion.div
            variants={itemVariants}
            className="mx-auto mt-8 grid w-full max-w-4xl grid-cols-1 gap-4 sm:grid-cols-3"
          >
            {trustIndicators.map((item) => (
              <div
                key={item.label}
                className="border border-electric-cyan/20 bg-background/60 p-4 text-center backdrop-blur-sm"
              >
                <p className="text-2xl font-bold text-electric-cyan">
                  {item.value}
                </p>
                <p className="mt-1 text-xs text-muted-foreground uppercase tracking-[0.18em]">
                  {item.label}
                </p>
              </div>
            ))}
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
