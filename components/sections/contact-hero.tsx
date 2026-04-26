"use client";

import { motion } from "framer-motion";
import {
  Activity,
  ChevronDown,
  Clock,
  Mail,
  MessageSquare,
  Shield,
} from "lucide-react";
import { BlueprintBackground } from "@/components/hero/blueprint-background";
import { HeroParallaxShell } from "@/components/hero/hero-parallax-shell";
import { useHeroParallax } from "@/components/hero/use-hero-parallax";
import {
  HERO_H1_COMPACT_BLUEPRINT,
  HERO_H1_TALL_BLUEPRINT,
} from "@/components/hero/hero-tokens";
import { scrollToElementWithOffset } from "@/lib/scroll-to-section";
import type {
  MarketingContactContent,
  MarketingIconName,
} from "@/types/marketing";

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1, delayChildren: 0.15 },
  },
};

const flickerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: [0, 1, 0.6, 1, 0.8, 1],
    transition: { duration: 0.8, times: [0, 0.2, 0.3, 0.5, 0.7, 1] },
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

const iconMap = {
  Mail,
  MessageSquare,
  Shield,
  Clock,
} as const;

type HeroIconName = keyof typeof iconMap;

interface ContactHeroProps {
  hero: MarketingContactContent["hero"];
  trustIndicators: MarketingContactContent["trustIndicators"];
}

const getIcon = (name?: MarketingIconName) =>
  name ? iconMap[name as HeroIconName] : undefined;

export function ContactHero({ hero, trustIndicators }: ContactHeroProps) {
  const { sectionRef, backgroundFrameStyle, contentStyle, shouldReduceMotion } =
    useHeroParallax({ size: "compact" });

  const scrollToContactForm = () => {
    const element = document.getElementById("contact-form-section");
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
          {/* Horizontal circuit lines */}
          <svg
            className="absolute inset-0 h-full w-full opacity-15"
            viewBox="0 0 1440 600"
            fill="none"
            aria-hidden="true"
          >
            <motion.path
              d="M0 300 H500 L540 260 H900 L940 300 H1440"
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
                  : { duration: 2, delay: 0.5, ease: "easeOut" }
              }
            />
            <motion.path
              d="M0 380 H300 L340 340 H700 L780 420 H1440"
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
                  : { duration: 2, delay: 0.9, ease: "easeOut" }
              }
            />
            {(
              [
                [540, 260],
                [940, 300],
                [340, 340],
                [700, 420],
              ] as [number, number][]
            ).map(([cx, cy], i) => (
              <motion.circle
                key={i}
                cx={cx}
                cy={cy}
                r="3"
                fill="var(--electric-cyan)"
                initial={shouldReduceMotion ? false : { scale: 0, opacity: 0 }}
                animate={{ scale: 1, opacity: 0.5 }}
                transition={
                  shouldReduceMotion
                    ? { duration: 0 }
                    : { delay: 1.2 + i * 0.1, duration: 0.3 }
                }
              />
            ))}
          </svg>

          {/* Scan line */}
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
          className="mx-auto max-w-4xl px-4 text-center"
        >
          {/* Status label */}
          <motion.div
            variants={flickerVariants}
            className="flex items-center justify-center gap-3 mb-8"
          >
            <div className="flex items-center gap-3 border-l-2 border-electric-cyan/50 dark:border-electric-cyan pl-4 font-semibold">
              <Activity
                size={14}
                className="text-electric-cyan animate-pulse"
              />
              <span className="font-mono text-[10px] tracking-[0.3em] text-electric-cyan/80 uppercase font-bold">
                Contact // Ready
              </span>
            </div>
          </motion.div>

          {/* Eyebrow */}
          <motion.div
            variants={itemVariants}
            className="flex items-center justify-center gap-4 mb-6"
          >
            <span className="h-px w-12 bg-electric-cyan/80" />

            <span className="font-mono text-xs tracking-[0.3em] uppercase text-electric-cyan/80 font-bold">
              <span className="font-mono text-xs tracking-[0.3em] text-electric-cyan/80 uppercase">
                {hero.badge.text}
              </span>
            </span>

            <span className="h-px w-12 bg-electric-cyan/80" />
          </motion.div>

          {/* Main headline */}
          <motion.h1
            variants={itemVariants}
            className={HERO_H1_COMPACT_BLUEPRINT}
          >
            <span className="block">Contact</span>
            <span className="block text-transparent bg-clip-text bg-linear-to-r from-electric-cyan via-(--electric-cyan-mid) to-(--electric-cyan-strong)">
              Nexgen Electrical
            </span>
            <span className="block">Innovations</span>
          </motion.h1>

          {/* Sub */}
          <motion.p
            variants={itemVariants}
            className="text-base sm:text-lg lg:text-xl text-foreground/90 dark:text-foreground/90 mb-10 max-w-2xl mx-auto leading-relaxed font-normal"
          >
            {hero.description}
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
                  className="relative p-5 rounded-xl border bg-white/20 dark:bg-white/15 border-[hsl(174_100%_35%)]/20 dark:border-electric-cyan/10 backdrop-blur-md hover:border-[hsl(174_100%_35%)] dark:hover:border-electric-cyan transition-all duration-300 group"
                >
                  {Icon ? (
                    <Icon className="mx-auto mb-2 h-6 w-6 text-electric-cyan/70 dark:text-electric-cyan group-hover:text-electric-cyan transition-colors" />
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

          {/* Technical metadata */}
          <motion.div
            variants={itemVariants}
            className="mt-12 flex flex-wrap justify-center gap-6 font-mono text-[10px] tracking-[0.2em] text-foreground/80 dark:text-foreground/80 uppercase font-bold"
          >
            <span>Est. 2009</span>
            <span className="hidden sm:inline">|</span>
            <span>NICEIC Approved</span>
            <span className="hidden sm:inline">|</span>
            <span>London &amp; Home Counties</span>
            <span className="hidden sm:inline">|</span>
            <span>Part P Certified</span>
          </motion.div>
        </motion.div>
      }
      contentStyle={contentStyle}
      scrollIndicator={
        <motion.button
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.8, duration: 0.45 }}
          onClick={scrollToContactForm}
          className="flex cursor-pointer flex-col items-center gap-2 text-foreground/80 dark:text-foreground/80 transition-colors hover:text-[hsl(174_100%_35%)] dark:hover:text-electric-cyan"
          aria-label="Scroll to contact form"
        >
          <span className="font-mono text-[9px] tracking-[0.3em] uppercase">
            Start Enquiry
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
