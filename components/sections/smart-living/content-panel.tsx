"use client";

import { motion, type MotionValue } from "framer-motion";
import { AnimatedProgressRing } from "./animated-progress-ring";
import { DimmerSlider } from "./dimmer-slider";
import { EnergyGraph } from "./energy-graph";

export interface ContentPanelProps {
  contentY: MotionValue<string>;
  uiY1: MotionValue<string>;
  uiY2: MotionValue<string>;
  uiY3: MotionValue<string>;
  inView: boolean;
}

export function ContentPanel({
  contentY,
  uiY1,
  uiY2,
  uiY3,
  inView,
}: ContentPanelProps) {
  return (
    <motion.div className="relative z-20 w-full" style={{ y: contentY }}>
      <div className="section-content w-full">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div className="max-w-xl">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              viewport={{ once: true }}
              className="inline-flex items-center gap-3 mb-6 p-4 rounded-xl bg-white/10 backdrop-blur-md border border-white/20"
            >
              <div className="h-px w-8 bg-white" />
              <span className="font-mono text-xs tracking-widest uppercase text-white">
                Smart Living
              </span>
            </motion.div>

            <motion.h2
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              viewport={{ once: true }}
              className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6 leading-tight"
            >
              Intelligent Lighting
              <br />
              <span className="bg-linear-to-r from-amber-400 to-[#00f2ff] bg-clip-text text-transparent">
                For Modern Living
              </span>
            </motion.h2>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              viewport={{ once: true }}
              className="mb-8 p-4 rounded-xl bg-white/10 backdrop-blur-md border border-white/20"
            >
              <p className="text-lg text-slate-200 leading-relaxed">
                Transform your home with smart lighting systems that adapt to
                your lifestyle. Experience perfect ambiance at every moment
                while significantly reducing your energy footprint.
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              viewport={{ once: true }}
              className="flex items-center gap-6 mb-10 p-6 rounded-2xl bg-white/10 backdrop-blur-md border border-white/20"
            >
              <AnimatedProgressRing value={40} inView={inView} />
              <div>
                <h3 className="text-2xl font-bold text-white mb-1">
                  Energy Savings
                </h3>
                <p className="text-white text-sm">
                  Average reduction in residential electricity costs with our
                  smart lighting solutions
                </p>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              viewport={{ once: true }}
            >
              <button className="group relative px-8 py-4 rounded-2xl bg-linear-to-r from-amber-500 to-amber-600 text-white font-bold uppercase tracking-widest text-sm overflow-hidden transition-all duration-300 hover:shadow-lg hover:shadow-amber-500/30 hover:scale-[1.03]">
                <span className="relative z-10 flex items-center gap-3">
                  Schedule Consultation
                  <svg
                    className="w-4 h-4 group-hover:translate-x-1 transition-transform"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M17 8l4 4m0 0l-4 4m4-4H3"
                    />
                  </svg>
                </span>
                <span className="absolute inset-0 bg-linear-to-r from-amber-600 to-amber-700 translate-y-full group-hover:translate-y-0 transition-transform duration-300" />
              </button>
            </motion.div>
          </div>

          <div className="flex flex-col gap-4 lg:relative lg:h-150 lg:block">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, delay: 0.5 }}
              viewport={{ once: true }}
              className="lg:absolute lg:top-1/3 lg:-left-8 lg:w-52"
              style={{ y: uiY3 }}
            >
              <div className="bg-white/10 backdrop-blur-md rounded-xl p-5 border border-white/20">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 rounded-full bg-linear-to-br from-amber-500 to-amber-600 flex items-center justify-center shrink-0">
                    <svg
                      className="w-5 h-5 text-white"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M13 10V3L4 14h7v7l9-11h-7z"
                      />
                    </svg>
                  </div>
                  <div>
                    <p className="text-xs text-white">Status</p>
                    <p className="text-sm font-semibold text-white">
                      All Systems Active
                    </p>
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between text-xs">
                    <span className="text-white">Connected Lights</span>
                    <span className="text-electric-cyan font-mono">24</span>
                  </div>
                  <div className="flex justify-between text-xs">
                    <span className="text-white">Scenes Active</span>
                    <span className="text-amber-400 font-mono">Evening</span>
                  </div>
                  <div className="flex justify-between text-xs">
                    <span className="text-white">Auto Schedule</span>
                    <span className="text-green-400 font-mono">ON</span>
                  </div>
                </div>
              </div>
            </motion.div>

            <motion.div
              className="space-y-3 lg:absolute lg:top-0 lg:right-0 lg:w-64"
              style={{ y: uiY1 }}
            >
              <DimmerSlider
                label="Living Room"
                defaultValue={75}
                delay={0.5}
                inView={inView}
              />
              <DimmerSlider
                label="Kitchen"
                defaultValue={90}
                delay={0.6}
                inView={inView}
              />
              <DimmerSlider
                label="Bedroom"
                defaultValue={40}
                delay={0.7}
                inView={inView}
              />
            </motion.div>

            <motion.div
              className="lg:absolute lg:bottom-20 lg:right-8 lg:w-56"
              style={{ y: uiY2 }}
            >
              <EnergyGraph delay={0.8} inView={inView} />
            </motion.div>

            <motion.div
              className="hidden lg:block absolute top-1/4 right-1/3"
              animate={{ y: [0, -10, 0], opacity: [0.5, 1, 0.5] }}
              transition={{
                duration: 3,
                repeat: Infinity,
                ease: "easeInOut",
              }}
            >
              <div className="w-3 h-3 rounded-full bg-amber-400 shadow-lg shadow-amber-400/50" />
            </motion.div>

            <motion.div
              className="hidden lg:block absolute bottom-1/3 left-1/4"
              animate={{ y: [0, -15, 0], opacity: [0.3, 0.8, 0.3] }}
              transition={{
                duration: 4,
                repeat: Infinity,
                ease: "easeInOut",
                delay: 1,
              }}
            >
              <div className="w-2 h-2 rounded-full bg-electric-cyan shadow-lg shadow-(--electric-cyan)/50" />
            </motion.div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
