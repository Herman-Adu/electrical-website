import { cn } from "@/lib/utils"

interface MetricValueProps {
  label: string
  value: string
  className?: string
}

/**
 * Simple label + value display for metric summaries.
 * Used in metric grids and summary cards across 9+ pages.
 * 
 * Usage:
 *   <MetricValue label="Total pages" value="100" />
 */
export function MetricValue({ label, value, className }: MetricValueProps) {
  return (
    <div className={cn("text-center", className)}>
      <p className="text-2xl font-bold text-foreground">{value}</p>
      <p className="text-xs text-muted-foreground mt-1">{label}</p>
    </div>
  )
}
