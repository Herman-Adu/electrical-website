"use client";

import { motion, type Variants } from "framer-motion";
import { Activity, ChevronDown } from "lucide-react";
import Image from "next/image";
import { HeroParallaxShell } from "@/components/hero/hero-parallax-shell";
import { useHeroParallax } from "@/components/hero/use-hero-parallax";
import { HERO_H1_TALL_BLUEPRINT } from "@/components/hero/hero-tokens";
import { scrollToElementWithOffset } from "@/lib/scroll-to-section";
import { useCyclingText } from "@/lib/hooks/use-cycling-text";
import { HeroTrustIndicators } from "@/components/shared";
import type { TrustIndicatorItem } from "@/types/sections";

const containerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.12, delayChildren: 0.2 },
  },
};

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 24, filter: "blur(8px)" },
  visible: {
    opacity: 1,
    y: 0,
    filter: "blur(0px)",
    transition: { type: "spring" as const, damping: 25, stiffness: 120 },
  },
};

const flickerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: [0, 1, 0.6, 1, 0.8, 1],
    transition: { duration: 0.8, times: [0, 0.2, 0.3, 0.5, 0.7, 1] },
  },
};

const SERVICES_TRUST_INDICATORS = [
  {
    icon: "Zap" as const,
    title: "Full Electrical Range",
    description:
      "From high-voltage industrial to smart residential installations",
  },
  {
    icon: "Building2" as const,
    title: "Commercial Specialists",
    description:
      "Trusted by schools, warehouses and retail chains across the UK",
  },
  {
    icon: "Wrench" as const,
    title: "24/7 Emergency Cover",
    description: "Rapid response with a guaranteed 2-hour callout commitment",
  },
  {
    icon: "Star" as const,
    title: "15+ Years Expertise",
    description:
      "Precision electrical engineering with a proven UK track record",
  },
] as const satisfies readonly TrustIndicatorItem[];

interface ServicesHeroProps {
  activeService?: string;
}

export function ServicesHero({
  activeService: _activeService,
}: ServicesHeroProps = {}) {
  const { sectionRef, backgroundFrameStyle, contentStyle, shouldReduceMotion } =
    useHeroParallax({ size: "tall" });

  const statuses = [
    "INITIALIZING",
    "LOADING_SERVICES",
    "SCANNING_CAPABILITIES",
    "SYSTEMS_READY",
  ];

  const { currentText: statusText } = useCyclingText(statuses, 380);

  const scrollToGrid = () => {
    const el = document.getElementById("services-intro");
    if (el) scrollToElementWithOffset(el);
  };

  return (
    <HeroParallaxShell
      sectionRef={sectionRef}
      size="tall"
      safeArea="page"
      background={
        <>
          <Image
            src="/images/projects/commercial/dhl/nexgen-dhl-reading-mewp-high-level-containment.jpg"
            alt="Nexgen electricians installing commercial LED lighting in a sports hall ceiling"
            fill
            priority
            className="object-cover object-center"
            sizes="100vw"
          />
          <div className="absolute inset-0 bg-linear-to-b from-black/70 via-black/55 to-black/80" />
          <div className="absolute inset-x-0 bottom-0 h-40 bg-linear-to-t from-black/70 to-transparent" />
        </>
      }
      backgroundFrameStyle={backgroundFrameStyle}
      overlay={
        <div
          className="absolute inset-0"
          style={{
            background:
              "radial-gradient(ellipse 80% 70% at 50% 50%, rgba(0,0,0,0.55) 0%, rgba(0,0,0,0.05) 100%)",
          }}
        />
      }
      decor={
        <>
          <svg
            className="absolute inset-0 h-full w-full opacity-15"
            viewBox="0 0 1440 700"
            fill="none"
          >
            <motion.path
              d="M0 350 H350 L400 300 H750 L800 350 H1440"
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
                  : { duration: 2.5, delay: 0.6, ease: "easeOut" }
              }
            />
            <motion.path
              d="M0 450 H250 L300 400 H600 L700 500 H1440"
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
                  : { duration: 2.5, delay: 1, ease: "easeOut" }
              }
            />
            {[
              [400, 300],
              [800, 350],
              [300, 400],
              [600, 500],
            ].map(([cx, cy], i) => (
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
                    : { delay: 1.4 + i * 0.1, duration: 0.3 }
                }
              />
            ))}
          </svg>

          {!shouldReduceMotion ? (
            <motion.div
              className="absolute left-0 right-0 h-px bg-linear-to-r from-transparent via-electric-cyan/30 to-transparent"
              animate={{ top: ["0%", "100%"] }}
              transition={{ duration: 6, repeat: Infinity, ease: "linear" }}
            />
          ) : null}

          {!shouldReduceMotion ? (
            <div className="absolute inset-0">
              {[...Array(6)].map((_, i) => (
                <motion.div
                  key={i}
                  className="absolute size-1 rounded-full bg-electric-cyan/30"
                  style={{
                    left: `${12 + i * 14}%`,
                    top: `${20 + (i % 3) * 20}%`,
                  }}
                  animate={{ y: [0, -20, 0], opacity: [0.15, 0.45, 0.15] }}
                  transition={{
                    duration: 3 + i * 0.5,
                    repeat: Infinity,
                    ease: "easeInOut",
                    delay: i * 0.3,
                  }}
                />
              ))}
            </div>
          ) : null}
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
            <div className="flex items-center gap-3 border-l-2 border-white/60 pl-4 font-bold">
              <Activity
                size={14}
                className="text-electric-cyan animate-pulse"
              />
              <span className="font-mono text-[10px] tracking-[0.3em] text-white uppercase font-bold">
                Services // {statusText}
              </span>
            </div>
          </motion.div>

          {/* Status Label Eyebrow */}
          <motion.div
            variants={itemVariants}
            className="flex items-center justify-center gap-4 mb-6"
          >
            <span className="h-px w-12 bg-electric-cyan" />
            <span className="font-mono text-xs tracking-[0.3em] uppercase text-electric-cyan font-bold">
              Professional Electrical Solutions
            </span>
            <span className="h-px w-12 bg-electric-cyan" />
          </motion.div>

          {/* Main Headline */}
          <motion.h1 variants={itemVariants} className={HERO_H1_TALL_BLUEPRINT}>
            <span className="block text-white">Engineering</span>
            <span className="block text-transparent bg-clip-text bg-linear-to-r from-electric-cyan/10 via-electric-cyan to-electric-cyan/10">
              Excellence
            </span>
            <span className="block text-white">Delivered</span>
          </motion.h1>

          {/* Subline */}
          <motion.p
            variants={itemVariants}
            className="text-base sm:text-lg lg:text-xl text-white/80 mb-6 max-w-2xl mx-auto leading-relaxed font-normal"
          >
            Comprehensive electrical solutions from high-voltage industrial
            systems to intelligent residential installations — all backed by 15+
            years of precision engineering.
          </motion.p>

          {/* Trust Indicators */}
          <HeroTrustIndicators
            items={SERVICES_TRUST_INDICATORS}
            variants={itemVariants}
            variant="image-overlay"
          />

          {/* Meta */}
          <motion.div
            variants={itemVariants}
            className="mt-10 flex flex-wrap justify-center gap-8 text-[10px] font-mono font-bold tracking-[0.2em] uppercase text-white/80"
          >
            <span>NICEIC Approved</span>
            <span className="hidden sm:inline">|</span>
            <span>Part P Certified</span>
            <span className="hidden sm:inline">|</span>
            <span>24/7 Emergency</span>
            <span className="hidden sm:inline">|</span>
            <span>6 Service Lines</span>
          </motion.div>
        </motion.div>
      }
      contentStyle={contentStyle}
      scrollIndicator={
        <motion.button
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 2, duration: 0.5 }}
          onClick={scrollToGrid}
          className="flex cursor-pointer flex-col items-center gap-2 text-white/80 font-bold hover:text-electric-cyan transition-colors duration-300"
          aria-label="Scroll to services"
        >
          <span className="font-mono text-[9px] tracking-[0.3em] uppercase">
            Explore Services
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
