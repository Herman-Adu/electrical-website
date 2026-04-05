"use client"

import { useState } from "react"
import { Check, Copy } from "lucide-react"
import { cn } from "@/lib/utils"

interface CodeBlockProps {
  code?: string
  language?: string
  title?: string
  filename?: string
  className?: string
  children?: string
}

export function CodeBlock({ code, language = "typescript", title, filename, className, children }: CodeBlockProps) {
  const [copied, setCopied] = useState(false)

  const codeContent = code || children || ""

  const copyToClipboard = async () => {
    await navigator.clipboard.writeText(codeContent)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const displayTitle = filename || title

  return (
    <div className={cn("relative rounded-lg border border-border bg-muted/30 overflow-hidden code-block-responsive", className)}>
      {displayTitle && (
        <div className="flex items-center justify-between border-b border-border bg-muted/50 px-4 py-2">
          <span className="text-xs font-medium text-foreground">{displayTitle}</span>
          <span className="text-xs text-muted-foreground">{language}</span>
        </div>
      )}
      <div className="relative">
        <pre className="w-full overflow-x-auto p-4 text-responsive-base leading-relaxed transition-layout">
          <code className="text-foreground font-mono whitespace-pre">{codeContent}</code>
        </pre>
        <button
          onClick={copyToClipboard}
          className="absolute top-2 right-2 rounded-md bg-background/80 p-2 transition-colors hover:bg-accent hover:text-accent-foreground border border-border shadow-sm"
          aria-label="Copy code"
        >
          {copied ? <Check className="h-4 w-4 text-green-500" /> : <Copy className="h-4 w-4" />}
        </button>
      </div>
    </div>
  )
}
