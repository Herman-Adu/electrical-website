"use client";

import React, { useRef } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import {
  CheckCircle,
  Zap,
  ArrowRight,
  Facebook,
  Instagram,
  Linkedin,
  Twitter,
  Youtube,
  BookOpen,
} from "lucide-react";
import {
  useAnimatedBorders,
  AnimatedBorders,
} from "@/lib/use-animated-borders";

const whyUs = [
  "NICEIC Approved Contractor — fully verified and independently audited",
  "Fixed price quotes with zero hidden charges or surprises",
  "All work certified to BS 7671 18th Edition with full documentation",
  "Emergency response within 2 hours, 24 hours a day, 365 days a year",
  "Directly employed, directly accountable — no subcontractors",
  "99.7% client satisfaction rating across 2,400+ completed projects",
];

const socials = [
  {
    name: "Facebook",
    icon: Facebook,
    href: "https://facebook.com",
    handle: "@nexgen-electrical-innovations",
  },
  {
    name: "Instagram",
    icon: Instagram,
    href: "https://instagram.com",
    handle: "@nexgen-electrical-innovations",
  },
  {
    name: "LinkedIn",
    icon: Linkedin,
    href: "https://linkedin.com",
    handle: "nexgen-electrical-innovations",
  },
  {
    name: "Twitter",
    icon: Twitter,
    href: "https://twitter.com",
    handle: "@nexgen-electrical-innovations",
  },
  {
    name: "YouTube",
    icon: Youtube,
    href: "https://youtube.com",
    handle: "Nexgen Electrical Innovations TV",
  },
];

const article = {
  tag: "Featured Article",
  title: "The True Cost of Cheap Electrical Work",
  excerpt:
    "We break down why cutting corners on electrical installations risks more than just your budget — and what to look for when choosing a contractor.",
  readTime: "4 min read",
};

export function AboutCTA() {
  const router = useRouter();
  const surgeRef = useRef<HTMLButtonElement>(null);
  const { sectionRef, lineScale, shouldReduce } = useAnimatedBorders();

  const handleCTA = () => {
    router.push("/contact");
  };

  return (
    <section
      id="why-choose-us"
      ref={sectionRef}
      className="section-container section-padding bg-background"
    >
      <AnimatedBorders
        shouldReduce={shouldReduce}
        lineScale={lineScale}
        showBottom={false}
      />
      <div className="absolute inset-0 blueprint-grid opacity-10 pointer-events-none" />

      <div className="section-content">
        {/* Why Choose Us */}
        <div className="grid lg:grid-cols-2 gap-16 mb-24 items-center">
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.7 }}
            viewport={{ once: false }}
          >
            <div className="flex items-center gap-3 mb-5">
              <div className="h-px w-8 bg-electric-cyan" />
              <span className="font-mono text-xs tracking-widest uppercase text-electric-cyan">
                The Difference
              </span>
            </div>
            <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-5 text-balance">
              Why Choose{" "}
              <span className="text-electric-cyan">Nexgen Electrical </span>
              <span className="dark:text-foreground">Innovations?</span>
            </h2>
            <p className="text-muted-foreground leading-relaxed mb-8">
              There are thousands of electricians. There are very few Nexgen
              Electrical Innovations Electrical Innovations. Here&apos;s exactly
              what sets us apart.
            </p>
            <div className="space-y-4">
              {whyUs.map((point, idx) => (
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
                    className="mt-0.5 shrink-0 text-electric-cyan"
                  />
                  <span className="text-sm text-muted-foreground leading-relaxed">
                    {point}
                  </span>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Featured article card */}
          <motion.div
            initial={{ opacity: 0, x: 40 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.7 }}
            viewport={{ once: false }}
          >
            <div className="group relative overflow-hidden rounded-2xl border border-electric-cyan/30 bg-card/60 p-8 transition-all duration-300 hover:border-electric-cyan/60">
              {/* Shimmer */}
              <div className="absolute inset-0 -translate-x-full bg-linear-to-r from-transparent via-electric-cyan/5 to-transparent transition-transform duration-700 group-hover:translate-x-full" />

              <div className="absolute top-3 left-3 h-5 w-5 border-t border-l border-electric-cyan/30 transition-colors group-hover:border-electric-cyan/60" />
              <div className="absolute right-3 bottom-3 h-5 w-5 border-r border-b border-electric-cyan/30 transition-colors group-hover:border-electric-cyan/60" />

              <div className="flex items-center gap-2 mb-4">
                <BookOpen size={14} className="text-electric-cyan" />
                <span className="font-mono text-xs tracking-widest uppercase text-electric-cyan/70">
                  {article.tag}
                </span>
              </div>
              <h3 className="text-2xl font-bold text-foreground mb-4 text-balance leading-snug">
                {article.title}
              </h3>
              <p className="text-muted-foreground leading-relaxed mb-6 text-sm">
                {article.excerpt}
              </p>
              <div className="flex items-center justify-between">
                <span className="font-mono text-xs text-muted-foreground/60">
                  {article.readTime}
                </span>
                <button className="flex items-center gap-2 text-sm font-medium text-electric-cyan transition-all duration-200 hover:gap-3">
                  Read Article <ArrowRight size={14} />
                </button>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Social media */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: false }}
          className="mb-24"
        >
          <div className="text-center mb-10">
            <div className="flex items-center justify-center gap-3 mb-3">
              <div className="h-px w-8 bg-border" />
              <span className="font-mono text-xs tracking-widest uppercase text-muted-foreground">
                Follow Our Work
              </span>
              <div className="h-px w-8 bg-border" />
            </div>
            <h3 className="text-2xl font-bold text-foreground">
              Stay Connected
            </h3>
          </div>

          <div className="flex flex-wrap justify-center gap-4">
            {socials.map((social, idx) => {
              const Icon = social.icon;
              return (
                <motion.a
                  key={social.name}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  initial={{ opacity: 0, scale: 0.8 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.4, delay: idx * 0.06 }}
                  viewport={{ once: false }}
                  className="group flex items-center gap-2 rounded-xl border border-border bg-card/40 px-3 py-2 transition-all duration-300 hover:border-electric-cyan/40 hover:bg-electric-cyan/5 hover:shadow-lg hover:shadow-electric-cyan/10"
                >
                  <Icon
                    size={18}
                    className="text-muted-foreground transition-colors group-hover:text-electric-cyan"
                  />
                  <div>
                    <div className="text-xs font-medium text-foreground">
                      {social.name}
                    </div>
                    {/* <div className="text-[10px] font-mono text-muted-foreground/60">
                      {social.handle}
                    </div> */}
                  </div>
                </motion.a>
              );
            })}
          </div>
        </motion.div>

        {/* Final CTA */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: false }}
          className="relative overflow-hidden rounded-3xl border border-electric-cyan/30 bg-electric-cyan/5 px-8 py-20 text-center"
        >
          {/* Blueprint grid inside CTA */}
          <div className="absolute inset-0 blueprint-grid opacity-20 pointer-events-none" />

          {/* Animated corner brackets */}
          <div className="absolute top-4 left-4 h-8 w-8 border-t-2 border-l-2 border-electric-cyan/50" />
          <div className="absolute top-4 right-4 h-8 w-8 border-t-2 border-r-2 border-electric-cyan/50" />
          <div className="absolute bottom-4 left-4 h-8 w-8 border-b-2 border-l-2 border-electric-cyan/50" />
          <div className="absolute right-4 bottom-4 h-8 w-8 border-r-2 border-b-2 border-electric-cyan/50" />

          {/* Floating particles */}
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

          <div className="relative z-10">
            <div className="flex items-center justify-center gap-3 mb-4">
              <Zap size={14} className="animate-pulse text-electric-cyan" />
              <span className="font-mono text-xs tracking-widest uppercase text-electric-cyan">
                Ready to Start?
              </span>
            </div>
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-black text-foreground mb-5 text-balance">
              Let&apos;s Build Something{" "}
              <span className="text-electric-cyan">Extraordinary</span>
            </h2>
            <p className="text-muted-foreground text-lg max-w-xl mx-auto mb-10 leading-relaxed">
              Whether it&apos;s a domestic rewire or a full industrial
              installation — bring us your project. We&apos;ll bring the
              expertise, integrity, and commitment it deserves.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button
                ref={surgeRef}
                onClick={handleCTA}
                className="group relative overflow-hidden rounded-sm bg-electric-cyan px-10 py-5 text-sm font-bold uppercase tracking-widest text-background transition-all duration-300 hover:shadow-[0_0_40px_rgba(0,243,189,0.4)] active:scale-95"
              >
                <span className="relative z-10 flex items-center gap-3">
                  Start Your Project
                  <Zap size={16} className="group-hover:animate-pulse" />
                </span>
                <div className="absolute inset-0 bg-white/20 -translate-x-full group-hover:translate-x-full transition-transform duration-500" />
              </button>

              <button
                onClick={() => router.push("/contact")}
                className="rounded-sm border border-border px-10 py-5 text-sm font-bold uppercase tracking-widest text-foreground transition-all duration-300 hover:border-electric-cyan hover:text-electric-cyan"
              >
                Contact Our Team
              </button>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
