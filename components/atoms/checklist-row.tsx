import { CheckCircle2 } from "lucide-react"
import { cn } from "@/lib/utils"

interface ChecklistRowProps {
  text: string
  checked?: boolean
  accentColorClass?: string
  className?: string
}

/**
 * Single checklist item with accent-colored check icon.
 * Extracted from 20 checklist patterns across dashboard pages.
 * 
 * Usage:
 *   <ChecklistRow text="Company page optimised" accentColorClass="text-sky-500" />
 *   <ChecklistRow text="SEO audit complete" checked={false} />
 */
export function ChecklistRow({
  text,
  checked = true,
  accentColorClass = "text-green-500",
  className,
}: ChecklistRowProps) {
  return (
    <div className={cn("flex items-center gap-2 text-sm", className)}>
      <CheckCircle2
        className={cn(
          "h-3.5 w-3.5 shrink-0",
          checked ? accentColorClass : "text-muted-foreground/40"
        )}
      />
      <span className={cn("text-foreground", !checked && "text-muted-foreground")}>
        {text}
      </span>
    </div>
  )
}
