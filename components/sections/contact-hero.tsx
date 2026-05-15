"use client";

import { motion } from "framer-motion";
import { Activity, ChevronDown } from "lucide-react";
import Image from "next/image";
import { HeroParallaxShell } from "@/components/hero/hero-parallax-shell";
import { useHeroParallax } from "@/components/hero/use-hero-parallax";
import { HERO_H1_COMPACT_BLUEPRINT } from "@/components/hero/hero-tokens";
import { scrollToElementWithOffset } from "@/lib/scroll-to-section";
import type { MarketingContactContent } from "@/types/marketing";
import { HeroTrustIndicators } from "@/components/shared";
import type { TrustIndicatorItem } from "@/components/shared";
import { ContactCircuit } from "@/components/hero/circuits/contact-circuit";

// ---------------------------------------------------------------------------
// Animation variants
// ---------------------------------------------------------------------------

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

// ---------------------------------------------------------------------------
// Props
// ---------------------------------------------------------------------------

interface ContactHeroProps {
  hero: MarketingContactContent["hero"];
  trustIndicators: MarketingContactContent["trustIndicators"];
}

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

export function ContactHero({ hero, trustIndicators }: ContactHeroProps) {
  const { sectionRef, backgroundFrameStyle, contentStyle, shouldReduceMotion } =
    useHeroParallax({ size: "compact" });

  const scrollToContactForm = () => {
    const element = document.getElementById("contact-form-section");
    if (element) scrollToElementWithOffset(element, { baseGap: 70 });
  };

  return (
    <HeroParallaxShell
      sectionRef={sectionRef}
      size="compact"
      safeArea="page"
      background={
        <>
          <Image
            src="/images/contact/contact-hero-team-project-planning.jpg"
            alt="Business team collaborating around a table reviewing project analytics and plans — get in touch with Nexgen Electrical Innovations"
            fill
            priority
            className="object-cover object-center"
            sizes="100vw"
          />
          <div className="absolute inset-0 bg-linear-to-b from-black/80 via-black/70 to-black/85" />
          <div className="absolute inset-x-0 bottom-0 h-40 bg-linear-to-t from-black/70 to-transparent" />
        </>
      }
      backgroundFrameStyle={backgroundFrameStyle}
      overlay={
        <div
          className="absolute inset-0"
          style={{
            background:
              "radial-gradient(ellipse 80% 70% at 50% 50%, rgba(0,0,0,0.65) 0%, rgba(0,0,0,0.10) 100%)",
          }}
        />
      }
      decor={<ContactCircuit shouldReduceMotion={shouldReduceMotion} />}
      content={
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="mx-auto max-w-4xl px-4 text-center"
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
                Contact // Ready
              </span>
            </div>
          </motion.div>

          {/* Status Label Eyebrow */}
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
            <span className="block text-white">Contact</span>
            <span className="block text-transparent bg-clip-text bg-linear-to-r from-electric-cyan/10 via-electric-cyan to-electric-cyan/10">
              Nexgen Electrical
            </span>
            <span className="block text-white">Innovations</span>
          </motion.h1>

          {/* Sub */}
          <motion.p
            variants={itemVariants}
            className="text-base sm:text-lg lg:text-xl text-white/80 mb-10 max-w-2xl mx-auto leading-relaxed font-normal"
          >
            {hero.description}
          </motion.p>

          {/* Trust indicators */}
          <HeroTrustIndicators
            items={trustIndicators as readonly TrustIndicatorItem[]}
            variants={itemVariants}
            variant="image-overlay"
          />

          {/* Technical metadata */}
          <motion.div
            variants={itemVariants}
            className="mt-12 flex flex-wrap justify-center gap-8 text-[10px] font-mono font-bold tracking-[0.2em] uppercase text-white/80"
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
          className="flex cursor-pointer flex-col items-center gap-2 text-white/80 font-bold hover:text-electric-cyan transition-colors duration-300"
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
