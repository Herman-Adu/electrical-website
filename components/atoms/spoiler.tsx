"use client"

import type React from "react"

import { useState } from "react"
import { Eye, EyeOff } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"

interface SpoilerProps {
  children: React.ReactNode
  title?: string
  hint?: string
  defaultOpen?: boolean
}

export function Spoiler({ children, title = "Show Answer", hint, defaultOpen = false }: SpoilerProps) {
  const [isRevealed, setIsRevealed] = useState(defaultOpen)

  return (
    <div className="my-4 rounded-lg border border-border bg-card/50">
      {hint && !isRevealed && (
        <div className="px-4 py-2 border-b border-border bg-muted/30">
          <p className="text-sm text-muted-foreground">
            <span className="font-medium text-foreground">Hint:</span> {hint}
          </p>
        </div>
      )}

      <button
        onClick={() => setIsRevealed(!isRevealed)}
        className="w-full flex items-center justify-between px-4 py-3 text-left hover:bg-accent/5 transition-colors"
      >
        <span className="text-sm font-medium text-foreground">{title}</span>
        {isRevealed ? (
          <EyeOff className="h-4 w-4 text-muted-foreground" />
        ) : (
          <Eye className="h-4 w-4 text-muted-foreground" />
        )}
      </button>

      <AnimatePresence>
        {isRevealed && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="overflow-hidden"
          >
            <div className="px-4 py-3 border-t border-border">{children}</div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
