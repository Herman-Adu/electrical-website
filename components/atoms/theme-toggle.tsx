"use client";

import { Moon, Sun } from "lucide-react";
import { motion } from "framer-motion";
import { useTheme } from "next-themes";
import { cn } from "@/lib/utils";

export function ThemeToggle() {
  const { resolvedTheme, setTheme } = useTheme();
  const theme = resolvedTheme ?? "light";
  const toggleTheme = () => setTheme(theme === "dark" ? "light" : "dark");

  return (
    <button
      onClick={toggleTheme}
      className={cn(
        "relative w-14 h-7 rounded-full transition-colors duration-300",
        "focus:outline-none focus:ring-2 focus:ring-accent focus:ring-offset-2 focus:ring-offset-background",
        theme === "dark" ? "bg-accent/20" : "bg-muted",
      )}
      aria-label={`Switch to ${theme === "light" ? "dark" : "light"} mode`}
    >
      {/* Sliding toggle */}
      <motion.div
        className={cn(
          "absolute top-0.5 w-6 h-6 rounded-full flex items-center justify-center",
          "shadow-md transition-colors duration-300",
          theme === "dark" ? "bg-accent" : "bg-background",
        )}
        animate={{
          x: theme === "dark" ? 28 : 2,
        }}
        transition={{
          type: "spring",
          stiffness: 500,
          damping: 30,
        }}
      >
        {theme === "dark" ? (
          <Moon className="w-4 h-4 text-accent-foreground" />
        ) : (
          <Sun className="w-4 h-4 text-foreground" />
        )}
      </motion.div>

      {/* Background icons */}
      <div className="absolute inset-0 flex items-center justify-between px-2">
        <Sun
          className={cn(
            "w-3 h-3 transition-opacity",
            theme === "dark" ? "opacity-30" : "opacity-0",
          )}
        />
        <Moon
          className={cn(
            "w-3 h-3 transition-opacity",
            theme === "dark" ? "opacity-0" : "opacity-30",
          )}
        />
      </div>
    </button>
  );
}
