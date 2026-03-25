"use client";

import { motion } from "framer-motion";

export interface EnergyGraphProps {
  delay: number;
  inView: boolean;
}

export function EnergyGraph({ delay, inView }: EnergyGraphProps) {
  const data = [3.2, 2.1, 3.8, 2.6, 1.9, 1.6, 2.0];
  const days = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
  const maxVal = Math.max(...data);
  const total = data.reduce((a, b) => a + b, 0).toFixed(1);
  const peakIdx = data.indexOf(maxVal);
  const chartHeight = 80;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay }}
      viewport={{ once: true }}
      className="bg-white/10 backdrop-blur-md rounded-xl p-4 pb-5 border border-white/20"
    >
      <div className="flex justify-between items-center mb-1">
        <span className="text-sm text-white font-medium">Weekly Usage</span>
        <span className="text-xs font-mono text-electric-cyan">kWh</span>
      </div>

      <motion.div
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: delay + 0.2 }}
        viewport={{ once: true }}
        className="mb-3"
      >
        <span className="text-xl font-bold text-white font-mono">{total}</span>
        <span className="text-xs text-white ml-1">kWh this week</span>
      </motion.div>

      <div
        className="flex items-end justify-between gap-2"
        style={{ height: chartHeight }}
      >
        {data.map((value, idx) => {
          const barHeight = Math.round((value / maxVal) * chartHeight);
          const isPeak = idx === peakIdx;
          return (
            <div
              key={days[idx]}
              className="flex-1 flex flex-col items-center justify-end h-full"
            >
              <motion.span
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                transition={{ duration: 0.4, delay: delay + 0.5 + idx * 0.05 }}
                viewport={{ once: true }}
                className={`text-[9px] font-mono mb-1 ${isPeak ? "text-amber-400" : "text-white"}`}
              >
                {value}
              </motion.span>
              <motion.div
                className={`w-full rounded-t-sm ${
                  isPeak
                    ? "bg-linear-to-t from-amber-600 to-amber-400 shadow-md shadow-amber-500/30"
                    : "bg-linear-to-t from-electric-cyan/50 to-electric-cyan"
                }`}
                initial={{ height: 0 }}
                animate={inView ? { height: barHeight } : { height: 0 }}
                transition={{
                  duration: 0.8,
                  delay: delay + 0.1 * idx,
                  ease: [0.22, 1, 0.36, 1],
                }}
              />
            </div>
          );
        })}
      </div>

      <div className="flex justify-between gap-2 mt-2">
        {days.map((d) => (
          <div key={d} className="flex-1 text-center">
            <span className="text-[10px] text-slate-500">{d}</span>
          </div>
        ))}
      </div>

      <div className="mt-3 pt-3 border-t border-slate-700/40 flex justify-between items-center">
        <span className="text-[10px] text-slate-500 uppercase tracking-wide">
          Avg / day
        </span>
        <span className="text-xs font-mono text-electric-cyan">
          {(Number(total) / 7).toFixed(1)} kWh
        </span>
      </div>
    </motion.div>
  );
}
