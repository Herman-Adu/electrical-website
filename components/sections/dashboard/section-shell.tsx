"use client";

import React from "react";

interface SectionShellProps {
  sectionRef: React.RefObject<HTMLElement | null>;
  children: React.ReactNode;
}

export function SectionShell({ sectionRef, children }: SectionShellProps) {
  return (
    <section
      id="dashboard"
      ref={sectionRef}
      className="section-container section-padding bg-background"
    >
      <div className="absolute inset-0 blueprint-grid opacity-3" />

      <div
        className="absolute top-0 left-0 right-0 h-px"
        style={{
          background:
            "linear-gradient(to right, transparent, var(--electric-cyan), transparent)",
          opacity: 0.2,
        }}
      />

      <div className="section-content">{children}</div>
    </section>
  );
}
