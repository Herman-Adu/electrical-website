"use client";

import React from "react";
import Link from "next/link";
import { Zap } from "lucide-react";
import { GlassCard, WindowDots } from "./services-bento";

// ─── CTA Card ─────────────────────────────────────────────────────────────

function CTACard({ delay }: { delay: number }) {
  return (
    <GlassCard
      delay={delay}
      glowOnHover={false}
      className="relative overflow-hidden p-6 sm:p-8"
    >
      {/* Background shimmer */}
      <div className="absolute inset-0 bg-linear-to-br from-electric-cyan/5 via-transparent to-electric-cyan/5 pointer-events-none" />
      <div className="absolute top-0 left-0 right-0 h-px bg-linear-to-r from-transparent via-electric-cyan/40 to-transparent pointer-events-none" />

      <div className="relative z-10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
        <div className="flex-1">
          <WindowDots />
          <div className="flex items-center gap-2 mb-3">
            <Zap size={16} className="text-electric-cyan" />
            <span className="font-mono text-[10px] tracking-widest uppercase text-electric-cyan/70">
              Custom Solutions
            </span>
          </div>
          <h3 className="text-2xl sm:text-3xl font-black text-card-foreground mb-2 text-balance">
            Need a Bespoke Electrical Solution?
          </h3>
          <p className="text-sm text-foreground/70 max-w-lg leading-relaxed">
            Every project is unique. Our engineering team provides tailored
            consultations, site surveys, and full-scope project proposals — from
            concept to commissioning.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-3 shrink-0">
          <Link
            href="/contact"
            className="px-6 py-3 rounded-xl bg-electric-cyan text-primary-foreground font-bold text-sm tracking-wide hover:shadow-lg hover:shadow-electric-cyan/30 hover:scale-[1.03] transition-all duration-300"
          >
            Request Consultation
          </Link>
          <Link
            href="/#services"
            className="px-6 py-3 rounded-xl border border-electric-cyan/30 text-electric-cyan font-medium text-sm tracking-wide hover:bg-electric-cyan/10 hover:border-electric-cyan/50 transition-all duration-300"
          >
            View Portfolio
          </Link>
        </div>
      </div>
    </GlassCard>
  );
}

// ─── Service CTA Section ───────────────────────────────────────────────────

export function ServiceCTASection() {
  return <CTACard delay={0} />;
}
