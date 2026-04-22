"use client";

import React, { useRef } from "react";
import Link from "next/link";
import { motion, useInView } from "framer-motion";
import {
  Zap,
  Building2,
  Factory,
  Home,
  Gauge,
  Wrench,
  ArrowRight,
} from "lucide-react";
import { ScrollReveal } from "@/components/ui/scroll-reveal";

const services = [
  {
    icon: Building2,
    title: "Commercial Installations",
    description:
      "Full electrical infrastructure for offices, retail spaces, and commercial complexes including full lighting design, fit-out wiring, and emergency systems.",
    specs: [
      //"High-rise wiring",
      "Emergency systems",
      "Data installs",
      "LED lighting",
      "Fit-out wiring",
    ],
    voltage: "440V",
  },
  {
    icon: Factory,
    title: "Industrial Systems",
    description:
      "Heavy-duty electrical solutions for manufacturing plants, warehouses, and processing facilities with full lighting and high-voltage infrastructure.",
    specs: [
      "Motor controls",
      "Busbar systems",
      //"High-voltage",
      "Warehouse lighting",
      "Panel boards",
    ],
    voltage: "11kV",
  },
  {
    icon: Zap,
    title: "Power Distribution",
    description:
      "Efficient power distribution networks ensuring reliable electricity flow across facilities, from transformer installation to final circuit protection.",
    specs: [
      "Transformers",
      "Switchgear",
      "Load balancing",
      "Cable management",
      "Sub-metering",
    ],
    voltage: "33kV",
  },
  {
    icon: Home,
    title: "Residential Services",
    description:
      "Complete home electrical solutions from new builds to full rewires, EV charger installation, smart home wiring, and solar-ready consumer units.",
    specs: [
      "Full rewires",
      "EV chargers",
      "Smart home",
      "Solar-ready",
      "Consumer units",
    ],
    voltage: "230V",
  },
  {
    icon: Gauge,
    title: "Energy Management",
    description:
      "Smart energy monitoring and optimisation systems to reduce operational costs, improve efficiency, and meet sustainability compliance targets.",
    specs: [
      "BMS system",
      "Metering",
      "Analytics",
      "Power factor",
      "Compliance",
    ],
    voltage: "Smart",
  },
  {
    icon: Wrench,
    title: "Maintenance & Repair",
    description:
      "24/7 emergency response and scheduled preventive maintenance programmes to keep commercial, industrial, and residential systems operational.",
    specs: [
      "24/7 support",
      "Preventive",
      "Upgrades",
      "Testing",
      "Certification",
    ],
    voltage: "All",
  },
];

export function Services() {
  const headerRef = useRef<HTMLDivElement>(null);
  const headerInView = useInView(headerRef, { once: true, margin: "-100px" });

  return (
    <section
      id="services"
      className="section-container section-padding bg-background"
    >
      {/* Background Elements */}
      <div className="absolute inset-0 blueprint-grid opacity-5" />

      <div
        className="absolute top-0 left-0 right-0 h-px"
        style={{
          background:
            "linear-gradient(to right, transparent, hsl(174 100% 50%), transparent)",
          opacity: 0.3,
        }}
      />

      <div className="section-content">
        {/* Section Header */}
        <motion.div
          ref={headerRef}
          initial={{ opacity: 0, y: 20 }}
          animate={headerInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-xl border border-foreground/50 dark:border-electric-cyan/20 mb-6">
            <span className="font-mono text-[10px] tracking-[0.3em] text-foreground/80 dark:text-electric-cyan/80 uppercase">
              Core Services
            </span>
            <div className="w-2 h-2 rounded-full bg-[hsl(174_100%_35%)] dark:bg-white animate-pulse" />
          </div>

          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-foreground uppercase tracking-tight mb-4">
            Engineering{" "}
            <span className="text-[hsl(174_100%_35%)] dark:text-electric-cyan">
              Excellence
            </span>
          </h2>

          <p className="text-foreground/70 dark:text-foreground/70 max-w-2xl mx-auto text-base lg:text-lg font-light">
            Comprehensive electrical solutions designed for the demands of
            modern commercial and industrial operations.
          </p>
        </motion.div>

        {/* Services Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {services.map((service, index) => (
            <ScrollReveal
              key={service.title}
              direction="up"
              blur
              delay={(index % 3) * 0.07}
            >
              <motion.div className="group relative flex flex-col border border-foreground/20 dark:border-electric-cyan/10 rounded-2xl p-6 lg:p-8 hover:border-[hsl(174_100%_35%)] dark:hover:border-electric-cyan transition-all duration-300 dark:hover:shadow-xl dark:hover:shadow-(--electric-cyan)/5 dark:bg-gradient-to-br dark:from-electric-cyan/5 dark:to-transparent">
                {/* Light theme shimmer background */}
                <div className="absolute inset-0 bg-gradient-to-br from-[hsl(174_100%_35%)]/6 via-transparent to-[hsl(174_100%_35%)]/5 pointer-events-none rounded-2xl dark:hidden" />
                {/* Corner accent — inset to respect border-radius */}
                <div className="absolute top-3 right-3 w-10 h-10 border-t border-r border-foreground/30 dark:border-electric-cyan/20 rounded-tr-xl group-hover:border-[hsl(174_100%_35%)] dark:group-hover:border-electric-cyan/40 transition-colors" />

                {/* Voltage badge */}
                <div className="absolute top-4 right-4 pr-1">
                  <span className="font-mono text-[9px] text-foreground/60 dark:text-electric-cyan/40 group-hover:text-[hsl(174_100%_35%)] dark:group-hover:text-electric-cyan/80 tracking-widest transition-colors duration-300 dark:group-hover:drop-shadow-[0_0_8px_rgba(0,243,189,0.4)]">
                    {service.voltage}
                  </span>
                </div>

                {/* Icon */}
                <div className="relative mb-6">
                  <service.icon
                    size={32}
                    className="text-foreground/70 dark:text-electric-cyan group-hover:text-[hsl(174_100%_35%)] dark:group-hover:text-white transition-colors"
                  />
                  <div className="absolute -inset-2 bg-[hsl(174_100%_35%)]/5 dark:bg-electric-cyan/10 blur-xl opacity-0 group-hover:opacity-100 transition-opacity" />
                </div>

                {/* Content */}
                <h3 className="text-lg lg:text-xl font-bold text-foreground mb-3 group-hover:text-[hsl(174_100%_35%)] dark:group-hover:text-electric-cyan transition-colors">
                  {service.title}
                </h3>

                <p className="text-foreground/70 dark:text-foreground/70 text-sm leading-relaxed mb-4 line-clamp-3">
                  {service.description}
                </p>

                {/* Specs — 2 rows */}
                <div className="flex flex-wrap gap-2 mb-6 min-h-13 content-start">
                  {service.specs.map((spec) => (
                    <span
                      key={spec}
                      className="font-mono text-[10px] px-2 py-1 rounded bg-foreground/10 dark:bg-electric-cyan/10 border border-foreground/20 dark:border-electric-cyan/10 text-foreground dark:text-foreground/80 tracking-wider"
                    >
                      {spec}
                    </span>
                  ))}
                </div>

                {/* Learn More — pinned to bottom */}
                <div className="mt-auto flex items-end justify-between">
                  <button className="flex items-center gap-2 text-sm text-foreground/70 group-hover:text-[hsl(174_100%_35%)] dark:text-foreground/70 dark:group-hover:text-electric-cyan transition-colors px-3 py-2 rounded-lg hover:bg-foreground/5 dark:hover:bg-electric-cyan/5">
                    <span className="font-medium">Learn More</span>
                    <ArrowRight
                      size={14}
                      className="group-hover:translate-x-1 transition-transform"
                    />
                  </button>

                  {/* Index number */}
                  <div className="font-mono text-[40px] font-bold text-foreground/30 group-hover:text-foreground/50 dark:group-hover:text-electric-cyan/40 leading-none select-none transition-colors duration-300 dark:group-hover:drop-shadow-[0_0_12px_rgba(0,243,189,0.5)]">
                    {String(index + 1).padStart(2, "0")}
                  </div>
                </div>
              </motion.div>
            </ScrollReveal>
          ))}
        </div>

        {/* Bottom CTA */}
        <ScrollReveal
          direction="fade"
          delay={0.2}
          className="mt-16 text-center"
        >
          <div className="inline-flex items-center gap-4 text-foreground/70">
            <div className="h-px w-12 bg-foreground/50 dark:bg-electric-cyan/50" />
            <span className="relative font-mono text-xs tracking-widest uppercase overflow-hidden">
              <span className="relative z-10">Need a custom solution?</span>
              {/* Shimmer sweep animation */}
              <span
                className="absolute inset-0 z-20 bg-linear-to-r from-transparent via-electric-cyan/30 to-transparent -translate-x-full animate-[shimmer_3s_ease-in-out_infinite]"
                style={{ backgroundSize: "200% 100%" }}
              />
            </span>
            <div className="h-px w-12 bg-foreground/50 dark:bg-electric-cyan/50" />
          </div>

          <div className="mt-6 flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              href="/services"
              className="px-8 py-4 rounded-xl bg-[hsl(174_100%_35%)]/10 dark:bg-electric-cyan/10 border border-[hsl(174_100%_35%)]/30 dark:border-electric-cyan/30 text-[hsl(174_100%_35%)] dark:text-electric-cyan font-bold uppercase tracking-widest hover:bg-[hsl(174_100%_35%)]/20 dark:hover:bg-electric-cyan/20 hover:shadow-lg hover:shadow-[hsl(174_100%_35%)]/10 dark:hover:shadow-(--electric-cyan)/10 transition-all duration-300"
            >
              View All Services
            </Link>
            <Link
              href="/contact"
              className="px-8 py-4 rounded-xl border border-foreground/30 dark:border-foreground/30 text-foreground/70 dark:text-foreground/70 font-bold uppercase tracking-widest hover:border-[hsl(174_100%_35%)] dark:hover:border-electric-cyan hover:text-[hsl(174_100%_35%)] dark:hover:text-electric-cyan transition-all duration-300"
            >
              Request Consultation
            </Link>
          </div>
        </ScrollReveal>
      </div>
    </section>
  );
}
