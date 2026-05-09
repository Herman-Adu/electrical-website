"use client";

import { useState } from "react";
import Link from "next/link";
import { motion, type Variants } from "framer-motion";
import { ChevronDown } from "lucide-react";
import { BlueprintBackground } from "@/components/hero/blueprint-background";
import { HeroParallaxShell } from "@/components/hero/hero-parallax-shell";
import { useHeroParallax } from "@/components/hero/use-hero-parallax";
import { HERO_H1_COMPACT_BLUEPRINT } from "@/components/hero/hero-tokens";
import {
  HeroStatusBar,
  HeroIconBadge,
  HeroEyebrow,
  HeroMetaBar,
} from "@/components/hero/atoms";
import { HeroTrustIndicators } from "@/components/shared/hero-trust-indicators";
import {
  isMiddleTrustIndicators,
  isMiddleButtons,
  type BlueprintHeroConfig,
} from "@/components/hero/hero-types";
import { scrollToElementWithOffset } from "@/lib/scroll-to-section";
import { useCyclingText } from "@/lib/hooks/use-cycling-text";
import { cn } from "@/lib/utils";

// ---------------------------------------------------------------------------
// Animation variants — match existing blueprint heroes
// ---------------------------------------------------------------------------

const containerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.12, delayChildren: 0.3 },
  },
};

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 24, filter: "blur(8px)" },
  visible: {
    opacity: 1,
    y: 0,
    filter: "blur(0px)",
    transition: { type: "spring", damping: 25, stiffness: 120 },
  },
};

const flickerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: [0, 1, 0.6, 1, 0.8, 1],
    transition: { duration: 0.8, times: [0, 0.2, 0.3, 0.5, 0.7, 1] },
  },
};

// ---------------------------------------------------------------------------
// Props
// ---------------------------------------------------------------------------

export interface BlueprintHeroProps {
  config: BlueprintHeroConfig;
  /** Override motion reduction — if not supplied, useHeroParallax provides it */
  shouldReduceMotion?: boolean;
  /** Slot for circuit/SVG decor (HubCircuit, CategoriesCircuit, ContactCircuit) */
  circuitDecor?: React.ReactNode;
}

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

export function BlueprintHero({
  config,
  shouldReduceMotion: shouldReduceMotionProp = false,
  circuitDecor,
}: BlueprintHeroProps) {
  // Lazy initializer — true on client, false during SSR
  const [isLoaded] = useState(() => typeof window !== "undefined");

  const { sectionRef, backgroundFrameStyle, contentStyle, shouldReduceMotion: hookReduceMotion } =
    useHeroParallax({ size: "compact" });

  // Props override takes precedence; otherwise use the hook's value
  const reduceMotion = shouldReduceMotionProp || hookReduceMotion;

  // Status cycling — reuse the config statusValue as the cycling terminal
  const { currentText: statusText } = useCyclingText(
    [config.statusValue],
    380,
  );

  const scrollToContent = () => {
    const el = document.getElementById("hero-content-target");
    if (el) scrollToElementWithOffset(el, { pageType: "default" });
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
          {/* Circuit decor slot — rendered behind content */}
          {circuitDecor}
        </>
      }
      content={
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate={isLoaded ? "visible" : "hidden"}
          className="mx-auto max-w-4xl px-4 text-center"
        >
          {/* Status bar */}
          <HeroStatusBar
            label={config.statusLabel}
            status={statusText}
            colorScheme="blueprint"
            variants={flickerVariants}
          />

          {/* Breadcrumbs */}
          {config.breadcrumbs.length > 0 ? (
            <motion.nav
              variants={itemVariants}
              aria-label="Breadcrumb"
              className="flex items-center justify-center gap-2 font-mono text-[10px] uppercase font-bold tracking-[0.14em] text-foreground mb-8"
            >
              {config.breadcrumbs.map((crumb, index) => (
                <span key={crumb.label} className="flex items-center gap-2">
                  {index > 0 ? (
                    <span className="opacity-30">/</span>
                  ) : null}
                  {crumb.href ? (
                    <Link
                      href={crumb.href}
                      className="hover:text-electric-cyan transition-colors"
                    >
                      {crumb.label}
                    </Link>
                  ) : (
                    <span className="text-electric-cyan">{crumb.label}</span>
                  )}
                </span>
              ))}
            </motion.nav>
          ) : null}

          {/* Icon badge */}
          <HeroIconBadge
            icon={config.icon}
            colorScheme="blueprint"
            variants={itemVariants}
          />

          {/* Eyebrow */}
          <HeroEyebrow
            text={config.eyebrow}
            colorScheme="blueprint"
            variants={itemVariants}
          />

          {/* Title */}
          <motion.h1
            variants={itemVariants}
            className={HERO_H1_COMPACT_BLUEPRINT}
          >
            {config.titleHighlight ? (
              <>
                <span className="block">{config.title}</span>
                <span className="block text-transparent bg-clip-text bg-linear-to-r dark:from-electric-cyan/10 via-electric-cyan to-electric-cyan/10">
                  {config.titleHighlight}
                </span>
              </>
            ) : (
              <span className="block">{config.title}</span>
            )}
          </motion.h1>

          {/* Description */}
          <motion.p
            variants={itemVariants}
            className="text-base sm:text-lg lg:text-xl text-foreground dark:text-foreground/80 mb-10 max-w-2xl mx-auto leading-relaxed font-normal"
          >
            {config.description}
          </motion.p>

          {/* Middle slot */}
          {isMiddleTrustIndicators(config.middle) ? (
            <HeroTrustIndicators
              items={config.middle.items}
              variants={itemVariants}
            />
          ) : null}

          {isMiddleButtons(config.middle) ? (
            <motion.div
              variants={itemVariants}
              className="mb-10 flex flex-wrap items-center justify-center gap-4"
            >
              {config.middle.items.map((btn) => (
                <Link
                  key={btn.href}
                  href={btn.href}
                  className={cn(
                    "px-4 py-2 rounded-lg bg-white/10 border backdrop-blur-sm font-mono text-[11px] tracking-widest uppercase transition-all duration-300",
                    "border-electric-cyan/50 hover:border-electric-cyan dark:hover:border-electric-cyan/70 hover:bg-electric-cyan/15",
                    "text-foreground dark:text-foreground/80 shadow-md shadow-electric-cyan/30 hover:shadow-[0_0_20px_rgba(0,211,165,0.4)]",
                    "hover:text-electric-cyan dark:hover:text-electric-cyan",
                  )}
                >
                  {btn.label}
                </Link>
              ))}
            </motion.div>
          ) : null}

          {/* Meta bar */}
          <HeroMetaBar
            items={config.meta}
            colorScheme="blueprint"
            variants={itemVariants}
          />
        </motion.div>
      }
      contentStyle={contentStyle}
      scrollIndicator={
        <motion.button
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={
            reduceMotion ? { duration: 0 } : { delay: 2.2, duration: 0.5 }
          }
          onClick={scrollToContent}
          type="button"
          className="flex cursor-pointer flex-col items-center gap-2 font-bold text-foreground dark:text-foreground/80 transition-colors hover:text-electric-cyan dark:hover:text-electric-cyan"
          aria-label="Scroll down"
        >
          <span className="font-mono text-[9px] tracking-[0.3em] uppercase">
            Explore
          </span>
          <ChevronDown
            size={20}
            className={reduceMotion ? "" : "animate-bounce"}
          />
        </motion.button>
      }
    />
  );
}
