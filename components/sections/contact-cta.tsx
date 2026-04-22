"use client";

import Link from "next/link";
import { ArrowRight, Phone, Zap } from "lucide-react";
import { scrollToElementWithOffset } from "@/lib/scroll-to-section";

export function ContactCTA() {
  const scrollToContactForm = () => {
    const element = document.getElementById("contact-form-section");
    if (element) scrollToElementWithOffset(element);
  };
  return (
    <section className="section-container section-padding bg-background">
      <div className="section-content">
        <div className="relative overflow-hidden rounded-3xl border border-[hsl(174_100%_35%)]/30 dark:border-electric-cyan/30 bg-[hsl(174_100%_35%)]/5 dark:bg-electric-cyan/5 px-6 py-14 text-center sm:px-8 sm:py-16">
          <div className="absolute inset-0 blueprint-grid opacity-20 pointer-events-none" />
          <div className="absolute top-4 left-4 h-8 w-8 border-t-2 border-l-2 border-[hsl(174_100%_35%)]/50 dark:border-electric-cyan/50" />
          <div className="absolute top-4 right-4 h-8 w-8 border-t-2 border-r-2 border-[hsl(174_100%_35%)]/50 dark:border-electric-cyan/50" />
          <div className="absolute bottom-4 left-4 h-8 w-8 border-b-2 border-l-2 border-[hsl(174_100%_35%)]/50 dark:border-electric-cyan/50" />
          <div className="absolute right-4 bottom-4 h-8 w-8 border-r-2 border-b-2 border-[hsl(174_100%_35%)]/50 dark:border-electric-cyan/50" />

          <div className="relative z-10 mx-auto max-w-3xl">
            <div className="mb-4 flex items-center justify-center gap-2 text-[hsl(174_100%_35%)] dark:text-electric-cyan">
              <Zap className="h-4 w-4 animate-pulse" />
              <span className="font-mono text-[11px] tracking-[0.2em] uppercase">
                Need a fast response?
              </span>
            </div>

            <h2 className="text-3xl font-bold text-foreground text-balance sm:text-5xl">
              Ready to Move Your{" "}
              <span className="text-[hsl(174_100%_35%)] dark:text-electric-cyan">Project Forward</span>?
            </h2>

            <p className="mx-auto mt-4 max-w-2xl text-sm leading-relaxed text-foreground/70 dark:text-muted-foreground sm:text-base">
              Start your enquiry now and our team will guide you with the right
              next steps, accurate recommendations, and clear timelines.
            </p>

            <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
              <button
                onClick={scrollToContactForm}
                className="inline-flex items-center justify-center gap-2 rounded-sm bg-[hsl(174_100%_35%)] dark:bg-electric-cyan px-8 py-4 text-xs font-bold tracking-[0.16em] text-white dark:text-background uppercase transition-all hover:shadow-[0_0_30px_rgba(0,243,189,0.35)] dark:hover:shadow-[0_0_30px_rgba(0,243,189,0.35)]"
              >
                Start Your Enquiry
                <ArrowRight className="h-4 w-4" />
              </button>

              <Link
                href="tel:+442079460958"
                className="inline-flex items-center justify-center gap-2 rounded-sm border border-foreground/20 dark:border-border px-8 py-4 text-xs font-bold tracking-[0.16em] text-foreground dark:text-foreground uppercase transition-colors hover:border-[hsl(174_100%_35%)] dark:hover:border-electric-cyan hover:text-[hsl(174_100%_35%)] dark:hover:text-electric-cyan"
              >
                <Phone className="h-4 w-4" />
                Emergency Call
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
