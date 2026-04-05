import { cn } from "@/lib/utils"

interface CategoryBadgeProps {
  label: string
  colorClass?: string
  variant?: "default" | "outline" | "accent"
  className?: string
}

const variantStyles = {
  default: "bg-muted text-muted-foreground border border-border",
  outline: "bg-transparent text-foreground border border-border",
  accent: "", // Uses colorClass directly
}

export function CategoryBadge({
  label,
  colorClass,
  variant = "default",
  className,
}: CategoryBadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-md px-2 py-0.5 text-xs font-medium",
        variant === "accent" && colorClass ? colorClass : variantStyles[variant],
        className
      )}
    >
      {label}
    </span>
  )
}
