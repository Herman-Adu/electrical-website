"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import Image from "next/image";

// Unique day identifiers - no duplicates possible
const DAYS = [
  { id: "sunday", label: "S" },
  { id: "monday", label: "M" },
  { id: "tuesday", label: "T" },
  { id: "wednesday", label: "W" },
  { id: "thursday", label: "T" },
  { id: "friday", label: "F" },
  { id: "saturday", label: "S" },
] as const;

export function SchedulerCard() {
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
  const [isScheduled, setIsScheduled] = useState(false);

  const handleDaySelect = (index: number) => {
    setSelectedIndex(index);
  };

  const handleScheduleClick = () => {
    if (selectedIndex !== null) {
      setIsScheduled(true);
      setTimeout(() => {
        setSelectedIndex(null);
        setIsScheduled(false);
      }, 2000);
    }
  };

  return (
    <motion.div
      className="group relative h-full flex flex-col overflow-hidden rounded-2xl bg-transparent border border-slate-700/50 transition-all duration-500 hover:border-electric-cyan/40 hover:shadow-xl hover:shadow-electric-cyan/10"
    >
      <div className="absolute inset-0 pointer-events-none z-10">
        <div className="absolute top-4 left-4 w-6 h-6 border-t-2 border-l-2 border-muted-foreground/40 dark:border-electric-cyan rounded-tl-lg" />
        <div className="absolute bottom-4 right-4 w-6 h-6 border-b-2 border-r-2 border-muted-foreground/40 dark:border-electric-cyan rounded-br-lg" />
      </div>

      <div className="absolute top-4 right-4 text-6xl font-bold text-slate-700/20 font-mono z-0">
        03
      </div>

      <div className="relative w-full h-40 overflow-hidden">
        <Image
          src="/images/maintenance-engineer.jpg"
          alt="Maintenance Engineer"
          fill
          sizes="(min-width: 768px) 33vw, 100vw"
          className="object-cover group-hover:scale-105 transition-transform duration-700"
        />
      </div>

      <div className="p-6 flex flex-col flex-1">
        <div className="flex items-center gap-2 mb-2">
          <span className="text-[10px] font-mono tracking-widest uppercase dark:text-electric-cyan/60">
            Preventive Protocol
          </span>
          <div className="w-2 h-2 rounded-full bg-electric-cyan animate-pulse" />
        </div>
        <h3 className="text-xl font-bold text-card-foreground mb-2">
          Maintenance Scheduler
        </h3>
        <p className="text-sm text-foreground/70 mb-6">
          Automated maintenance scheduling aligned with operational windows
        </p>

        <div className="flex-1 mb-6 p-4 rounded-lg  border bg-electric-cyan/10 border-white/10  flex flex-col justify-center relative">
          <div className="grid grid-cols-7 gap-1.5 w-full">
            {DAYS.map((day, index) => (
              <button
                key={day.id}
                onClick={() => handleDaySelect(index)}
                className={`w-full py-3 rounded text-xs font-mono font-bold transition-all duration-300 ${
                  selectedIndex === index
                    ? "bg-electric-cyan/20 border border-electric-cyan/80 text-electric-cyan"
                    : "bg-transparent border border-slate-700/40 text-foreground/70 hover:border-electric-cyan/40 hover:text-electric-cyan/60"
                }`}
              >
                {day.label}
              </button>
            ))}
          </div>
        </div>

        <button
          onClick={handleScheduleClick}
          disabled={selectedIndex === null || isScheduled}
          className="mt-auto w-full py-3 px-4 rounded-lg bg-transparent border text-sm font-mono tracking-widest uppercase dark:text-electric-cyan/80 hover:border-electric-cyan/80 hover:shadow-lg hover:shadow-(--electric-cyan)/10 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isScheduled ? "Confirmed" : "Schedule Service"}
        </button>
      </div>
    </motion.div>
  );
}
