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
import { HERO_H1_COMPACT_BLUEPRINT } from "@/components/hero/hero-tokens";
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
            variants={itemVariants}
            className="flex items-center justify-center gap-3 mb-6"
          >
            <div className="flex items-center gap-3 border-l-2 border-electric-cyan pl-4">
              <Activity
                size={12}
                className="text-electric-cyan animate-pulse"
              />
              <span className="font-mono text-[10px] tracking-[0.3em] text-electric-cyan/80 uppercase">
                Contact // Ready
              </span>
            </div>
          </motion.div>

          {/* Eyebrow */}
          <motion.div
            variants={itemVariants}
            className="mb-4 flex items-center justify-center"
          >
            <div className="inline-flex items-center gap-2 border border-electric-cyan/25 bg-electric-cyan/10 px-4 py-2">
              {(() => {
                const BadgeIcon = getIcon(hero.badge.icon);
                return BadgeIcon ? (
                  <BadgeIcon className="h-4 w-4 text-electric-cyan" />
                ) : null;
              })()}
              <span className="font-mono text-xs tracking-[0.3em] text-electric-cyan/80 uppercase">
                {hero.badge.text}
              </span>
            </div>
          </motion.div>

          {/* Headline */}
          <motion.h1
            variants={itemVariants}
            className={HERO_H1_COMPACT_BLUEPRINT}
          >
            {hero.title}
          </motion.h1>

          {/* Sub */}
          <motion.p
            variants={itemVariants}
            className="mx-auto max-w-2xl text-base leading-relaxed text-muted-foreground text-pretty sm:text-lg"
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
                  className="border border-electric-cyan/20 bg-background/60 p-4 text-center backdrop-blur-sm"
                >
                  {Icon ? (
                    <Icon className="mx-auto mb-2 h-6 w-6 text-electric-cyan" />
                  ) : null}
                  <p className="text-sm font-medium text-foreground">
                    {item.title}
                  </p>
                  <p className="mt-1 hidden text-xs text-muted-foreground sm:block">
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
          onClick={scrollToContactForm}
          className="flex cursor-pointer flex-col items-center gap-2 text-muted-foreground transition-colors hover:text-electric-cyan"
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
