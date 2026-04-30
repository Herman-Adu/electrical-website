"use client";

import React, { useRef } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { CheckCircle, Building2, Zap, ArrowRight } from "lucide-react";
import {
  useAnimatedBorders,
  AnimatedBorders,
} from "@/lib/use-animated-borders";

// ─── Content Data ─────────────────────────────────────────────────────────

const serviceExcelReasons = [
  "Full voltage spectrum coverage — 230V residential to 33kV industrial",
  "Minimal downtime with flexible off-peak scheduling",
  "BS 7671 certified on every installation, full documentation included",
  "Single point of accountability — design, install, commission under one project manager",
  "Energy management built in from day one, not retrofitted later",
  "24/7 responsive support and emergency electrical response",
];

interface FeaturedProjectCard {
  tag: string;
  title: string;
  excerpt: string;
}

const defaultFeaturedProject: FeaturedProjectCard = {
  tag: "Featured Project",
  title: "Industrial Retrofit — 50kW System Upgrade",
  excerpt:
    "Complete electrical system upgrade for a manufacturing facility. Delivered on schedule with zero downtime, including new switchgear, load balancing, and 24/7 monitoring integration.",
};

// ─── Services CTA Component ────────────────────────────────────────────────

export function ServicesCTA({
  featuredProject = defaultFeaturedProject,
}: {
  featuredProject?: FeaturedProjectCard;
}) {
  const router = useRouter();
  const surgeRef = useRef<HTMLButtonElement>(null);
  const { sectionRef, lineScale, shouldReduce } = useAnimatedBorders();

  const handleGetAssessment = () => {
    const element = document.getElementById("service-request");
    if (element) {
      element.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  return (
    <section
      id="why-services"
      ref={sectionRef}
      className="section-container section-padding bg-background"
    >
      <AnimatedBorders
        shouldReduce={shouldReduce}
        lineScale={lineScale}
        showBottom={false}
      />

      <div className="section-content">
        {/* Two-Column Layout: Benefits (Left) + Featured Card (Right) */}
        <div className="grid lg:grid-cols-2 gap-16 mb-24 items-center">
          {/* Left Column: Why Our Services Excel */}
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.7 }}
            viewport={{ once: false }}
          >
            <div className="flex items-center gap-3 mb-5">
              <div className="h-px w-8 bg-[hsl(174_100%_35%)] dark:bg-electric-cyan" />
              <span className="font-mono text-xs tracking-widest uppercase text-[hsl(174_100%_35%)] dark:text-electric-cyan">
                Why Choose Us
              </span>
            </div>
            <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-5 text-balance">
              Why Our Services{" "}
              <span className="text-[hsl(174_100%_35%)] dark:text-electric-cyan">
                Excel
              </span>
            </h2>
            <p className="text-muted-foreground leading-relaxed mb-8">
              Comprehensive electrical solutions engineered for reliability,
              compliance, and operational excellence — whether you&apos;re a
              residential client or managing industrial infrastructure.
            </p>
            <div className="space-y-4">
              {serviceExcelReasons.map((reason, idx) => (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.4, delay: idx * 0.07 }}
                  viewport={{ once: false }}
                  className="flex items-start gap-3"
                >
                  <CheckCircle
                    size={16}
                    className="mt-0.5 shrink-0 text-[hsl(174_100%_35%)] dark:text-electric-cyan"
                  />
                  <span className="text-sm text-muted-foreground leading-relaxed">
                    {reason}
                  </span>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Right Column: Featured Process Card */}
          <motion.div
            initial={{ opacity: 0, x: 40 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.7 }}
            viewport={{ once: false }}
          >
            <div className="group relative overflow-hidden rounded-2xl border border-[hsl(174_100%_35%)]/30 dark:border-electric-cyan/30 bg-[hsl(174_100%_35%)]/5 dark:bg-card/60 p-8 transition-all duration-300 hover:border-electric-cyan/60">
              {/* Shimmer Effect */}
              <div className="absolute inset-0 -translate-x-full bg-linear-to-r from-transparent via-electric-cyan/5 to-transparent transition-transform duration-700 group-hover:translate-x-full" />

              {/* Corner Brackets */}
              <div className="absolute top-3 left-3 h-5 w-5 border-t border-l border-[hsl(174_100%_35%)]/30 dark:border-electric-cyan/30 transition-colors dark:group-hover:border-electric-cyan/60 group-hover:border-[hsl(174_100%_35%)]/60 rounded-tl-xl" />
              <div className="absolute right-3 bottom-3 h-5 w-5 border-r border-b border-[hsl(174_100%_35%)]/30 dark:border-electric-cyan/30 transition-colors dark:group-hover:border-electric-cyan/60 group-hover:border-[hsl(174_100%_35%)]/60 rounded-br-xl" />

              <div className="flex items-center gap-2 mb-4">
                <Building2
                  size={14}
                  className="text-[hsl(174_100%_35%)] dark:text-electric-cyan"
                />
                <span className="font-mono text-xs tracking-widest uppercase text-[hsl(174_100%_35%)]/70 dark:text-electric-cyan/70">
                  {featuredProject.tag}
                </span>
              </div>
              <h3 className="text-2xl font-bold text-foreground mb-4 text-balance leading-snug">
                {featuredProject.title}
              </h3>
              <p className="text-muted-foreground leading-relaxed mb-6 text-sm">
                {featuredProject.excerpt}
              </p>
              <button
                onClick={() => router.push("/projects")}
                className="flex items-center gap-2 text-sm font-medium text-[hsl(174_100%_35%)] dark:text-electric-cyan transition-all duration-200 hover:gap-3"
              >
                View Case Studies <ArrowRight size={14} />
              </button>
            </div>
          </motion.div>
        </div>

        {/* Final CTA Block */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: false }}
          className="relative overflow-hidden rounded-3xl border border-[hsl(174_100%_35%)]/30 dark:border-electric-cyan/30 bg-[hsl(174_100%_35%)]/5 dark:bg-electric-cyan/5 px-8 py-20 text-center"
        >
          {/* Blueprint Grid Background */}
          <div className="absolute inset-0 blueprint-grid opacity-20 pointer-events-none" />

          {/* Animated Corner Brackets (All 4 Corners) */}
          <div className="absolute top-4 left-4 h-8 w-8 border-t-2 border-l-2 border-[hsl(174_100%_35%)]/60 dark:border-electric-cyan/50 rounded-tl-xl" />
          <div className="absolute top-4 right-4 h-8 w-8 border-t-2 border-r-2 border-[hsl(174_100%_35%)]/60 dark:border-electric-cyan/50 rounded-tr-xl" />
          <div className="absolute bottom-4 left-4 h-8 w-8 border-b-2 border-l-2 border-[hsl(174_100%_35%)]/60 dark:border-electric-cyan/50 rounded-bl-xl" />
          <div className="absolute bottom-4 right-4 h-8 w-8 border-r-2 border-b-2 border-[hsl(174_100%_35%)]/60 dark:border-electric-cyan/50 rounded-br-xl" />

          {/* Floating Animated Particles */}
          {[...Array(4)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute size-1 rounded-full bg-electric-cyan/30"
              style={{ left: `${20 + i * 20}%`, top: `${20 + (i % 2) * 60}%` }}
              animate={{ y: [0, -15, 0], opacity: [0.2, 0.6, 0.2] }}
              transition={{
                duration: 3 + i * 0.5,
                repeat: Infinity,
                ease: "easeInOut",
                delay: i * 0.3,
              }}
            />
          ))}

          {/* Content */}
          <div className="relative z-10">
            <div className="flex items-center justify-center gap-3 mb-4">
              <Zap
                size={14}
                className="animate-pulse text-[hsl(174_100%_35%)] dark:text-electric-cyan"
              />
              <span className="font-mono text-xs tracking-widest uppercase text-[hsl(174_100%_35%)] dark:text-electric-cyan">
                Ready to Start?
              </span>
            </div>
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-black text-foreground mb-5 text-balance">
              Ready to Power Your{" "}
              <span className="text-[hsl(174_100%_35%)] dark:text-electric-cyan">
                Project
              </span>{" "}
              Forward?
            </h2>
            <p className="text-muted-foreground text-lg max-w-xl mx-auto mb-10 leading-relaxed">
              Whether it&apos;s a new installation, system upgrade, or emergency
              response — we bring comprehensive expertise, transparent pricing,
              and one dedicated point of contact. Let&apos;s get started.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button
                ref={surgeRef}
                onClick={handleGetAssessment}
                className="group relative rounded-xl overflow-hidden bg-[hsl(174_100%_35%)] dark:bg-electric-cyan px-10 py-5 text-sm font-bold uppercase tracking-widest text-background transition-all duration-300 hover:shadow-[0_0_40px_rgba(0,243,189,0.4)] active:scale-95"
              >
                <span className="relative z-10 flex items-center gap-3">
                  Get a Free Assessment
                  <Zap size={16} className="group-hover:animate-pulse" />
                </span>
                <div className="absolute inset-0 bg-white/20 -translate-x-full group-hover:translate-x-full transition-transform duration-500" />
              </button>

              <button
                onClick={() => router.push("/about#why-choose-us")}
                className="rounded-xl border border-border px-10 py-5 text-sm font-bold uppercase tracking-widest text-foreground transition-all duration-300 hover:border-[hsl(174_100%_35%)] dark:hover:border-electric-cyan hover:text-[hsl(174_100%_35%)] dark:hover:text-electric-cyan"
              >
                Explore Our Process
              </button>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
