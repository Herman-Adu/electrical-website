import { cn } from "@/lib/utils"

interface SpecRowProps {
  spec: string
  value: string
  className?: string
}

/**
 * Label-value row used in platform specification cards.
 * Extracted from 5+ platform spec sections across LinkedIn, Google, Facebook, Twitter pages.
 * 
 * Usage:
 *   <SpecRow spec="Post character limit" value="3,000 characters" />
 */
export function SpecRow({ spec, value, className }: SpecRowProps) {
  return (
    <div className={cn("flex items-center justify-between text-xs", className)}>
      <span className="text-muted-foreground">{spec}</span>
      <span className="text-foreground font-medium">{value}</span>
    </div>
  )
}
