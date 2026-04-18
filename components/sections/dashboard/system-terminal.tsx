"use client";

import React, { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { ScrollReveal } from "@/components/ui/scroll-reveal";

const LOG_MESSAGES = [
  "CHECKING PHASE_A VOLTAGE... [OK]",
  "SYNCING GRID_ID: NEX-7729...",
  "THERMAL SENSOR 04: 42C [STABLE]",
  "ENCRYPTING DATA UPLINK... [AES-256]",
  "LOAD BALANCER: OPTIMIZING...",
  "SAFETY PROTOCOL 12-B: ACTIVE",
  "ISOLATING HARMONIC DISTORTION...",
  "BACKUP GENERATOR: STANDBY",
  "POWER FACTOR: 0.98 [OPTIMAL]",
  "GRID FREQUENCY: 50.02Hz [NOMINAL]",
];

interface LogEntry {
  text: string;
  time: string;
  id: number;
}

interface SystemTerminalProps {
  isInView?: boolean;
}

export function SystemTerminal({ isInView = false }: SystemTerminalProps) {
  const [logs, setLogs] = useState<LogEntry[]>([]);
  const [isMounted, setIsMounted] = useState(false);
  const terminalRef = useRef<HTMLDivElement>(null);
  const logIdRef = useRef(0);

  useEffect(() => {
    setIsMounted(true);
    logIdRef.current = 1;
    setLogs([
      {
        text: "> SYSTEM BOOT... INITIALIZING",
        time: new Date().toLocaleTimeString(),
        id: 0,
      },
    ]);
  }, []);

  useEffect(() => {
    if (!isMounted || !isInView) return;

    const interval = setInterval(() => {
      const newMessage =
        LOG_MESSAGES[Math.floor(Math.random() * LOG_MESSAGES.length)];
      const time = new Date().toLocaleTimeString();
      const id = logIdRef.current++;
      setLogs((prev) => [
        ...prev.slice(-5),
        { text: `> ${newMessage}`, time, id },
      ]);
    }, 2500);

    return () => clearInterval(interval);
  }, [isInView, isMounted]);

  return (
    <ScrollReveal direction="up" blur delay={0.4} duration={0.65} distance={40}>
      <motion.div
        ref={terminalRef}
        className="bg-electric-cyan/10 border-electric-cyan/10 p-4 font-mono overflow-hidden rounded-xl"
      >
      <div className="flex items-center justify-between mb-4 pb-2 border-b border-b-electric-cyan/20">
        <div className="flex gap-1.5">
          <div className="w-2.5 h-2.5 rounded-full bg-red-500/60" />
          <div className="w-2.5 h-2.5 rounded-full bg-amber-500/60" />
          <div className="w-2.5 h-2.5 rounded-full bg-emerald-500/60" />
        </div>
        <span className="text-[10px] text-foreground/70 uppercase tracking-widest">
          Diagnostics_Console_v4.2.1
        </span>
      </div>

      <div className="h-36 overflow-hidden flex flex-col justify-end relative">
        <div
          className="text-xs text-slate-600 font-mono"
          style={{ display: isMounted ? "none" : "block" }}
        >
          &gt; AWAITING SYSTEM BOOT...
        </div>
        <div style={{ display: isMounted ? "block" : "none" }}>
          {logs.map((log) => (
            <div
              key={log.id}
              className="text-xs mb-1 flex items-center gap-3 animate-in fade-in slide-in-from-left-2 duration-300"
            >
              <span className="text-foreground/70 text-[10px]">
                [{log.time}]
              </span>
              <span className="dark:text-electric-cyan/70 hover:text-electric-cyan transition-colors">
                {log.text}
              </span>
            </div>
          ))}
        </div>

        <motion.div
          animate={{ y: [0, 144, 0] }}
          transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
          className="absolute inset-x-0 h-8 bg-linear-to-b from-transparent via-electric-cyan/5 to-transparent pointer-events-none"
        />
      </div>

      <div className="mt-4 pt-2 border-t border-t-electric-cyan/20 flex justify-between items-center">
        <div className="flex items-center gap-2">
          <div className="w-1.5 h-1.5 bg-electric-cyan rounded-full animate-pulse" />
          <span className="text-[9px] text-foreground tracking-widest">
            LIVE
          </span>
        </div>
        <span className="text-[9px] text-foreground tracking-widest">
          ENCRYPTION: AES-256 // MQTT_TLS
        </span>
      </div>
      </motion.div>
    </ScrollReveal>
  );
}
