"use client";

import { useState } from "react";
import { motion } from "framer-motion";

export interface DimmerSliderProps {
  label: string;
  defaultValue: number;
  delay: number;
  inView: boolean;
}

export function DimmerSlider({
  label,
  defaultValue,
  delay,
  inView,
}: DimmerSliderProps) {
  const [value, setValue] = useState(defaultValue);

  return (
    <motion.div
      initial={{ opacity: 0, x: 30 }}
      animate={inView ? { opacity: 1, x: 0 } : { opacity: 0, x: 30 }}
      transition={{ duration: 0.6, delay }}
      className="bg-white/10 backdrop-blur-md rounded-xl p-4 border border-white/20 hover:border-amber-500/40 transition-all duration-300 will-change-transform will-change-opacity"
    >
      <div className="flex justify-between items-center mb-3">
        <span className="text-sm text-slate-300 font-medium">{label}</span>
        <span className="text-xs font-mono text-amber-400">{value}%</span>
      </div>
      <div className="relative h-2 bg-slate-700/50 rounded-full overflow-hidden">
        <motion.div
          className="absolute inset-y-0 left-0 rounded-full bg-linear-to-r from-amber-600 to-amber-400 will-change-transform"
          initial={{ width: 0 }}
          animate={inView ? { width: `${value}%` } : { width: 0 }}
          transition={{ duration: 1, delay: delay + 0.3 }}
        />
        <div
          className="absolute inset-y-0 left-0 rounded-full bg-linear-to-r from-amber-600/50 to-amber-400/50 blur-sm"
          style={{ width: `${value}%` }}
        />
      </div>
      <input
        type="range"
        min="0"
        max="100"
        value={value}
        onChange={(e) => setValue(Number(e.target.value))}
        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
      />
    </motion.div>
  );
}
