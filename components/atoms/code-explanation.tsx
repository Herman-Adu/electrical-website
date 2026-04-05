"use client"

import { useState } from "react"
import { ChevronDown, ChevronUp, Code2, ThumbsUp, ThumbsDown } from "lucide-react"
import { cn } from "@/lib/utils"

export interface CodeTerm {
  term: string
  description: string
}

interface CodeExplanationProps {
  /** The key terms/concepts explained */
  terms: CodeTerm[]
  /** Overall summary of what the code does */
  summary: string
  /** Optional label for the toggle button */
  label?: string
  /** Whether the explanation starts expanded */
  defaultOpen?: boolean
  className?: string
}

export function CodeExplanation({
  terms,
  summary,
  label = "Explain code",
  defaultOpen = false,
  className,
}: CodeExplanationProps) {
  const [isOpen, setIsOpen] = useState(defaultOpen)
  const [feedback, setFeedback] = useState<"helpful" | "not-helpful" | null>(null)

  return (
    <div className={cn("rounded-lg border border-border overflow-hidden", className)}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex w-full items-center gap-2 px-4 py-2.5 text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-muted/50 transition-colors"
        aria-expanded={isOpen}
      >
        <Code2 className="h-4 w-4" />
        <span>{isOpen ? `Hide code explanation` : label}</span>
        {isOpen ? (
          <ChevronUp className="ml-auto h-4 w-4" />
        ) : (
          <ChevronDown className="ml-auto h-4 w-4" />
        )}
      </button>

      {isOpen && (
        <div className="border-t border-border bg-muted/20 px-4 py-4 space-y-4">
          <p className="text-sm text-foreground leading-relaxed">{summary}</p>

          {terms.length > 0 && (
            <ul className="space-y-2.5">
              {terms.map((item, idx) => (
                <li key={idx} className="flex gap-2 text-sm">
                  <code className="shrink-0 rounded bg-muted px-1.5 py-0.5 font-mono text-xs text-foreground border border-border">
                    {item.term}
                  </code>
                  <span className="text-muted-foreground">{item.description}</span>
                </li>
              ))}
            </ul>
          )}

          <div className="flex items-center gap-3 pt-2 border-t border-border">
            <span className="text-xs text-muted-foreground">Was this explanation helpful?</span>
            <button
              onClick={() => setFeedback("helpful")}
              className={cn(
                "rounded-md p-1.5 text-muted-foreground hover:text-foreground hover:bg-muted transition-colors",
                feedback === "helpful" && "text-green-600 bg-green-50 dark:bg-green-950/30"
              )}
              aria-label="Yes, helpful"
            >
              <ThumbsUp className="h-3.5 w-3.5" />
            </button>
            <button
              onClick={() => setFeedback("not-helpful")}
              className={cn(
                "rounded-md p-1.5 text-muted-foreground hover:text-foreground hover:bg-muted transition-colors",
                feedback === "not-helpful" && "text-red-600 bg-red-50 dark:bg-red-950/30"
              )}
              aria-label="No, not helpful"
            >
              <ThumbsDown className="h-3.5 w-3.5" />
            </button>
            {feedback && (
              <span className="text-xs text-muted-foreground">
                {feedback === "helpful" ? "Thanks for the feedback!" : "We'll improve this."}
              </span>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
