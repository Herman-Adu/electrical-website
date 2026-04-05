import { cn } from "@/lib/utils"

const statusStyles = {
  Active: "bg-green-500/20 text-green-400 border-green-500/30",
  Beta: "bg-blue-500/20 text-blue-400 border-blue-500/30",
  "Coming Soon": "bg-amber-500/20 text-amber-400 border-amber-500/30",
  Deprecated: "bg-red-500/20 text-red-400 border-red-500/30",
}

const sizeStyles = {
  sm: "px-1.5 py-0.5 text-[10px]",
  md: "px-2 py-0.5 text-xs",
  lg: "px-2.5 py-1 text-sm",
}

interface StatusBadgeProps {
  status: keyof typeof statusStyles
  size?: "sm" | "md" | "lg"
  className?: string
}

export function StatusBadge({ status, size = "md", className }: StatusBadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-md font-medium border-0",
        statusStyles[status],
        sizeStyles[size],
        className
      )}
    >
      {status}
    </span>
  )
}
