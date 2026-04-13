"use client";

import React from "react";
import { motion } from "framer-motion";

interface LiveConnectionsProps {
  isInView: boolean;
}

export function LiveConnections({ isInView }: LiveConnectionsProps) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={isInView ? { opacity: 1 } : { opacity: 0 }}
      transition={{ delay: 0.8 }}
      className="mt-8 flex flex-col sm:flex-row justify-between items-center gap-4 pt-6 border-t border-t-electric-cyan/20"
    >
      <div className="font-mono text-[9px] text-foreground/70 tracking-widest flex flex-wrap justify-center gap-4 font-semibold">
        <span>PROTOCOL: IEC 61850</span>
        <span className="hidden sm:inline">|</span>
        <span>LATENCY: 12ms</span>
        <span className="hidden sm:inline">|</span>
        <span>UPTIME: 99.97%</span>
      </div>

      <div className="flex items-center gap-2">
        {[1, 2, 3, 4, 5].map((i) => (
          <div
            key={i}
            className={`w-1.5 h-1.5 rounded-full ${
              i <= 4 ? "bg-electric-cyan/40" : "bg-amber-500"
            }`}
          />
        ))}
        <span className="font-mono text-[9px] text-foreground font-semibold tracking-wide ml-2">
          SIGNAL: STRONG
        </span>
      </div>
    </motion.div>
  );
}
