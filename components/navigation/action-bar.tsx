"use client";

import Link from "next/link";
import { ThemeToggle } from "@/components/ui/theme-toggle";

/**
 * Reusable navbar action bar with a Get Quote CTA and theme toggle.
 */
export function ActionBar() {
  return (
    <div className="flex items-center gap-4 lg:gap-6 h-full">
      <Link
        href="/contact"
        className="inline-flex items-center px-3 py-2 rounded-lg border border-border bg-background text-electric-cyan text-sm font-medium tracking-wide hover:bg-electric-cyan/15 hover:border-electric-cyan/50 transition-all duration-300"
      >
        Get Quote
      </Link>

      {/* <Link
        href="/contact"
        className="inline-flex items-center px-3 py-2 bg-electric-cyan/10 border border-electric-cyan/30 text-electric-cyan text-sm font-medium tracking-wide hover:bg-electric-cyan/20 hover:border-electric-cyan/50 transition-all duration-300"
      >
        Get Quote
      </Link> */}

      <ThemeToggle />
    </div>
  );
}
