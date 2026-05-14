"use client";

import Link from "next/link";
import { useRef } from "react";
import { motion, useInView, useReducedMotion } from "framer-motion";
import { ArrowRight, Phone, Mail } from "lucide-react";

const stats = [
  { value: "500+", label: "Projects Completed" },
  { value: "15+", label: "Years Experience" },
  { value: "NICEIC", label: "Approved Contractor" },
];

export function ProjectsListCTA() {
  const containerRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(containerRef, { once: true, amount: 0.3 });
  const shouldReduce = useReducedMotion();

  return (
    <div ref={containerRef} className="grid lg:grid-cols-2 gap-12">
      {/* Left — headline + stats */}
      <motion.div
        initial={shouldReduce ? {} : { opacity: 0, x: -30 }}
        animate={isInView ? { opacity: 1, x: 0 } : {}}
        transition={{ duration: 0.6 }}
      >
        <div className="flex items-center gap-3 mb-6">
          <div className="h-px w-8 bg-electric-cyan" />
          <span className="font-mono text-xs tracking-widest uppercase text-electric-cyan">
            Start Your Project
          </span>
        </div>

        <h3 className="text-2xl sm:text-3xl font-bold text-foreground mb-4">
          Start Your{" "}
          <span className="text-electric-cyan">Next Project</span>
        </h3>

        <p className="text-muted-foreground mb-8 max-w-md">
          From single-site installations to multi-site FM contracts, Nexgen
          Electrical Innovations delivers commercial, residential, and industrial
          electrical works on programme and within budget.
        </p>

        {/* Stats strip */}
        <div className="flex flex-wrap gap-6">
          {stats.map((stat, index) => (
            <motion.div
              key={stat.label}
              initial={shouldReduce ? {} : { opacity: 0, y: 10 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.4, delay: 0.2 + index * 0.1 }}
              className="flex flex-col"
            >
              <span className="text-2xl font-black text-electric-cyan">
                {stat.value}
              </span>
              <span className="text-xs text-muted-foreground">{stat.label}</span>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* Right — CTA card */}
      <motion.div
        initial={shouldReduce ? {} : { opacity: 0, x: 30 }}
        animate={isInView ? { opacity: 1, x: 0 } : {}}
        transition={{ duration: 0.6, delay: 0.2 }}
        className="relative p-8 rounded-2xl border border-electric-cyan/20 bg-linear-to-br from-electric-cyan/5 via-transparent to-transparent backdrop-blur-sm"
      >
        {/* Corner brackets */}
        <div className="absolute top-3 left-3 w-5 h-5 border-t-2 border-l-2 border-electric-cyan/40" />
        <div className="absolute bottom-3 right-3 w-5 h-5 border-b-2 border-r-2 border-electric-cyan/40" />

        <h3 className="text-xl font-bold text-foreground mb-4">
          Get a Free Quote
        </h3>

        <p className="text-muted-foreground mb-6">
          Tell us about your project and we&apos;ll provide a detailed, no-obligation
          quote within 24 hours. NICEIC approved — every time.
        </p>

        <div className="space-y-3 mb-8">
          <a
            href="tel:+442012345678"
            className="flex items-center gap-3 text-muted-foreground hover:text-electric-cyan transition-colors group"
          >
            <div className="w-10 h-10 rounded-lg border border-border bg-card/60 flex items-center justify-center group-hover:border-electric-cyan/40 transition-colors">
              <Phone className="w-4 h-4" />
            </div>
            <div>
              <p className="text-sm font-medium text-foreground">
                +44 (0) 20 1234 5678
              </p>
              <p className="text-xs text-muted-foreground">Mon-Fri, 8am-6pm</p>
            </div>
          </a>

          <a
            href="mailto:projects@nexgenelectrical.co.uk"
            className="flex items-center gap-3 text-muted-foreground hover:text-electric-cyan transition-colors group"
          >
            <div className="w-10 h-10 rounded-lg border border-border bg-card/60 flex items-center justify-center group-hover:border-electric-cyan/40 transition-colors">
              <Mail className="w-4 h-4" />
            </div>
            <div>
              <p className="text-sm font-medium text-foreground">
                projects@nexgenelectrical.co.uk
              </p>
              <p className="text-xs text-muted-foreground">
                We reply within 24 hours
              </p>
            </div>
          </a>
        </div>

        <div className="flex flex-wrap gap-3">
          <Link
            href="/quotation"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-sm bg-electric-cyan text-background font-medium hover:bg-electric-cyan/90 transition-colors"
          >
            Get a Free Quote
            <ArrowRight className="w-4 h-4" />
          </Link>

          <Link
            href="/projects"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-sm border border-border text-foreground font-medium hover:border-electric-cyan/40 hover:text-electric-cyan transition-colors"
          >
            View All Projects
          </Link>
        </div>
      </motion.div>
    </div>
  );
}
