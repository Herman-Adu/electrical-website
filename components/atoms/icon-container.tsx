import { cn } from "@/lib/utils"
import type { LucideIcon } from "lucide-react"

const sizeStyles = {
  sm: "w-7 h-7",
  md: "w-9 h-9",
  lg: "w-10 h-10",
}

const iconSizeStyles = {
  sm: "h-3.5 w-3.5",
  md: "h-4 w-4",
  lg: "h-5 w-5",
}

interface IconContainerProps {
  icon: LucideIcon
  colorClass?: string
  size?: "sm" | "md" | "lg"
  withBorder?: boolean
  className?: string
}

/**
 * Reusable icon wrapper with accent-colored background.
 * 
 * Usage:
 *   <IconContainer icon={Share2} colorClass="bg-sky-500/10 text-sky-500" />
 *   <IconContainer icon={Mail} colorClass="bg-amber-500/10 text-amber-500" size="lg" withBorder />
 */
export function IconContainer({
  icon: Icon,
  colorClass = "bg-muted text-foreground",
  size = "md",
  withBorder = false,
  className,
}: IconContainerProps) {
  return (
    <div
      className={cn(
        "flex items-center justify-center rounded-lg shrink-0",
        sizeStyles[size],
        colorClass,
        withBorder && "border border-current/20",
        className
      )}
    >
      <Icon className={cn(iconSizeStyles[size])} />
    </div>
  )
}
