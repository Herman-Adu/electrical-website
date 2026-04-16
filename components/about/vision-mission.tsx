"use client";

import React, { useState, useEffect } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { Eye, Target, ArrowRight } from "lucide-react";
import {
  useAnimatedBorders,
  AnimatedBorders,
} from "@/lib/use-animated-borders";

const visionPoints = [
  {
    label: "Innovation",
    text: "Pioneering smart electrical systems that set the standard for the next generation of infrastructure.",
  },
  {
    label: "Sustainability",
    text: "Leading the transition to energy-efficient electrical solutions that reduce carbon footprint across all sectors.",
  },
  {
    label: "Leadership",
    text: "Recognised nationally as the benchmark for excellence in electrical engineering and contractor standards.",
  },
];

const missionPillars = [
  {
    title: "Safety",
    desc: "Zero compromise on electrical safety, from initial design to final certification.",
  },
  {
    title: "Quality",
    desc: "Workmanship that exceeds British Standards on every single project, without exception.",
  },
  {
    title: "Community",
    desc: "Reinvesting in the communities we serve through training, employment and charitable programmes.",
  },
  {
    title: "Innovation",
    desc: "Continuously adopting new technologies and methods that deliver better outcomes for clients.",
  },
];


export function VisionMission() {
  const { sectionRef, lineScale, shouldReduce } = useAnimatedBorders();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const { scrollYProgress } = useScroll({
    target: mounted ? sectionRef : undefined,
    offset: ["start end", "end start"],
  });
  const dividerScale = useTransform(scrollYProgress, [0.1, 0.6], [0, 1]);


  return (
    <section
      id="vision-mission"
      ref={sectionRef}
      className="section-container section-padding bg-background"
    >
      <AnimatedBorders
        shouldReduce={shouldReduce}
        lineScale={lineScale}
        showBottom={false}
      />
      <div className="absolute inset-0 blueprint-grid-fine opacity-20 pointer-events-none" />

      <div className="section-content">
        <div className="grid lg:grid-cols-2 gap-16 lg:gap-24">
          {/* VISION */}
          <div>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: false }}
            >
              {/* Section label */}
              <div className="flex items-center gap-3 mb-8">
                <div className="w-10 h-10 rounded-xl border border-electric-cyan/40 bg-electric-cyan/10 flex items-center justify-center">
                  <Eye size={18} className="text-electric-cyan" />
                </div>
                <div>
                  <div className="font-mono text-[10px] tracking-widest uppercase text-electric-cyan/60 mb-0.5">
                    Looking Ahead
                  </div>
                  <h2 className="text-3xl md:text-4xl font-bold text-foreground">
                    Our Vision
                  </h2>
                </div>
              </div>

              {/* Terminal statement */}
              <div className="p-6 rounded-xl border border-electric-cyan/30 bg-electric-cyan/5 mb-8 font-mono text-sm leading-relaxed">
                <div className="text-electric-cyan/50 text-xs mb-2 tracking-widest">
                  {"> VISION_2030.md"}
                </div>
                <p className="text-foreground text-base leading-relaxed">
                  To be the UK&apos;s most trusted electrical engineering
                  partner — recognised not just for the quality of our
                  installations, but for the lasting positive impact we create
                  in every community we touch.
                </p>
              </div>

              {/* Vision points */}
              <div className="space-y-5">
                {visionPoints.map((point, idx) => (
                  <motion.div
                    key={point.label}
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.5, delay: idx * 0.1 }}
                    viewport={{ once: false }}
                    className="flex gap-4 group"
                  >
                    <div className="w-8 h-8 rounded-lg border border-border flex items-center justify-center shrink-0 mt-0.5 group-hover:border-electric-cyan/40 transition-colors">
                      <ArrowRight
                        size={14}
                        className="text-muted-foreground group-hover:text-electric-cyan transition-colors"
                      />
                    </div>
                    <div>
                      <div className="font-semibold text-foreground mb-1">
                        {point.label}
                      </div>
                      <div className="text-sm text-muted-foreground leading-relaxed">
                        {point.text}
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </div>

          {/* Animated divider — visible on desktop */}
          <div className="hidden lg:block absolute left-1/2 top-28 bottom-28 w-px -translate-x-1/2 overflow-hidden">
            <motion.div
              className="w-full bg-linear-to-b from-transparent via-electric-cyan/30 to-transparent"
              style={{
                scaleY: dividerScale,
                transformOrigin: "top",
                height: "100%",
              }}
            />
          </div>

          {/* MISSION */}
          <div>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.15 }}
              viewport={{ once: false }}
            >
              {/* Section label */}
              <div className="flex items-center gap-3 mb-8">
                <div className="w-10 h-10 rounded-xl border border-amber-warning/40 bg-amber-warning/10 flex items-center justify-center">
                  <Target size={18} className="text-amber-warning" />
                </div>
                <div>
                  <div className="font-mono text-[10px] tracking-widest uppercase text-amber-warning/60 mb-0.5">
                    Every Day
                  </div>
                  <h2 className="text-3xl md:text-4xl font-bold text-foreground">
                    Our Mission
                  </h2>
                </div>
              </div>

              {/* Terminal statement */}
              <div className="p-6 rounded-xl border border-amber-warning/30 bg-amber-warning/5 mb-8 font-mono text-sm leading-relaxed">
                <div className="text-amber-warning/50 text-xs mb-2 tracking-widest">
                  {"> MISSION_STATEMENT.md"}
                </div>
                <p className="text-foreground text-base leading-relaxed">
                  To deliver safe, reliable, and innovative electrical
                  solutions that exceed client expectations — while building
                  stronger communities through honest work, continuous learning,
                  and unwavering integrity.
                </p>
              </div>

              {/* Mission pillars */}
              <div className="grid grid-cols-2 gap-4">
                {missionPillars.map((pillar, idx) => (
                  <motion.div
                    key={pillar.title}
                    initial={{ opacity: 0, y: 16 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: idx * 0.08 }}
                    viewport={{ once: false }}
                    className="p-5 rounded-xl border border-border bg-card/40 hover:border-amber-warning/30 hover:bg-amber-warning/5 transition-all duration-300 group"
                  >
                    <div className="font-bold text-foreground mb-2 group-hover:text-amber-warning transition-colors">
                      {pillar.title}
                    </div>
                    <div className="text-xs text-muted-foreground leading-relaxed">
                      {pillar.desc}
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
}
