"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, type Variants } from "framer-motion";
import { ChevronDown } from "lucide-react";
import { HeroParallaxShell } from "@/components/hero/hero-parallax-shell";
import { useHeroParallax } from "@/components/hero/use-hero-parallax";
import { HERO_H1_TALL_IMAGE } from "@/components/hero/hero-tokens";
import {
  HeroStatusBar,
  HeroIconBadge,
  HeroEyebrow,
  HeroMetaBar,
} from "@/components/hero/atoms";
import {
  isMiddleTrustIndicators,
  isMiddleButtons,
  type ImageHeroConfig,
} from "@/components/hero/hero-types";
import { scrollToElementWithOffset } from "@/lib/scroll-to-section";
import { useCyclingText } from "@/lib/hooks/use-cycling-text";
import { cn } from "@/lib/utils";

// ---------------------------------------------------------------------------
// Animation variants — match existing image heroes (news-topic-hero pattern)
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

export interface ImageHeroProps {
  config: ImageHeroConfig;
  /** Override motion reduction — if not supplied, useHeroParallax provides it */
  shouldReduceMotion?: boolean;
}

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

export function ImageHero({
  config,
  shouldReduceMotion: shouldReduceMotionProp = false,
}: ImageHeroProps) {
  // Lazy initializer — true on client, false during SSR
  const [isLoaded] = useState(() => typeof window !== "undefined");

  const {
    sectionRef,
    backgroundFrameStyle,
    contentStyle,
    shouldReduceMotion: hookReduceMotion,
  } = useHeroParallax({ size: "tall" });

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
      size="tall"
      safeArea="page"
      background={
        <>
          <Image
            src={config.background.src}
            alt={config.background.alt}
            fill
            priority
            className="object-cover object-center"
            sizes="100vw"
          />
          {/* Primary dark gradient overlay — matches news-topic-hero pattern */}
          <div className="absolute inset-0 bg-linear-to-b from-black/70 via-black/25 to-black/80" />
          {/* Bottom fade for smooth section transition */}
          <div className="absolute inset-x-0 bottom-0 h-40 bg-linear-to-t from-black/70 to-transparent" />
        </>
      }
      backgroundFrameStyle={backgroundFrameStyle}
      overlay={
        <div
          className="absolute inset-0"
          style={{
            background:
              "radial-gradient(ellipse 85% 75% at 50% 50%, transparent 25%, rgba(0,0,0,0.60) 100%)",
          }}
        />
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
            colorScheme="image"
            variants={flickerVariants}
          />

          {/* Breadcrumbs */}
          {config.breadcrumbs.length > 0 ? (
            <motion.nav
              variants={itemVariants}
              aria-label="Breadcrumb"
              className="mb-6 flex items-center justify-center gap-2 font-mono text-[10px] tracking-[0.14em] text-white/90 uppercase font-bold"
            >
              {config.breadcrumbs.map((crumb, index) => (
                <span key={crumb.label} className="flex items-center gap-2">
                  {index > 0 ? (
                    <span className="text-white/30">/</span>
                  ) : null}
                  {crumb.href ? (
                    <Link
                      href={crumb.href}
                      className="transition-colors hover:text-electric-cyan text-white/90"
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
            colorScheme="image"
            variants={itemVariants}
          />

          {/* Eyebrow */}
          <HeroEyebrow
            text={config.eyebrow}
            colorScheme="image"
            variants={itemVariants}
          />

          {/* Title */}
          <motion.h1
            variants={itemVariants}
            className={HERO_H1_TALL_IMAGE}
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
            className="text-base sm:text-lg lg:text-xl text-white/80 mb-10 max-w-2xl mx-auto leading-relaxed font-normal"
          >
            {config.description}
          </motion.p>

          {/* Middle slot — trust-indicators (inline white/transparent cards — NOT HeroTrustIndicators) */}
          {isMiddleTrustIndicators(config.middle) ? (
            <motion.div
              variants={itemVariants}
              className="flex flex-wrap gap-3 justify-center mb-10"
            >
              {config.middle.items.map((item) => (
                <div
                  key={item.title}
                  className="border border-white/20 bg-white/10 backdrop-blur-sm rounded-lg px-4 py-3 flex items-center gap-2"
                >
                  {item.icon ? (
                    <span className="text-white/70 flex-shrink-0">
                      {/* Icon name only — rendered as a label; actual icon resolved by parent if needed */}
                    </span>
                  ) : null}
                  <div>
                    <p className="text-white font-semibold text-sm leading-snug">
                      {item.title}
                    </p>
                    {item.description ? (
                      <p className="text-white/70 text-sm leading-snug">
                        {item.description}
                      </p>
                    ) : null}
                  </div>
                </div>
              ))}
            </motion.div>
          ) : null}

          {/* Middle slot — buttons */}
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
                    "px-4 py-2 rounded-lg border backdrop-blur-sm font-mono text-[11px] tracking-widest uppercase transition-all duration-300",
                    "bg-white/10 border-electric-cyan/50",
                    "hover:border-electric-cyan dark:hover:border-electric-cyan/70 shadow-md shadow-electric-cyan/30 hover:bg-electric-cyan/15",
                    "text-white shadow-[0_0_20px_rgba(0,211,165,0.1)] hover:shadow-[0_0_20px_rgba(0,211,165,0.4)]",
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
            colorScheme="image"
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
          className="flex cursor-pointer flex-col items-center gap-2 font-bold text-white/80 transition-colors hover:text-electric-cyan"
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
