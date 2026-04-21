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
        className="inline-flex items-center px-3 py-2 rounded-lg border border-border bg-background text-sm font-medium tracking-wide hover:bg-electric-cyan/15 hover:border-electric-cyan/50 transition-all duration-300 dark:text-electric-cyan"
      >
        <span className="dark:bg-clip-text dark:text-transparent dark:bg-gradient-to-r dark:from-electric-cyan dark:via-[hsl(174_80%_45%)] dark:to-[hsl(174_100%_35%)]">
          Get Quote
        </span>
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
