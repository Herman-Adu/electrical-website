import { cn } from "@/lib/utils"

interface SectionHeadingProps {
  title: string
  description?: string
  level?: "h1" | "h2" | "h3"
  className?: string
}

const levelStyles = {
  h1: "text-3xl font-bold tracking-tight",
  h2: "text-xl font-semibold",
  h3: "text-sm font-semibold",
}

/**
 * Consistent section heading with optional description.
 * 
 * Usage:
 *   <SectionHeading title="LinkedIn Marketing" description="B2B presence" level="h1" />
 *   <SectionHeading title="Pages" level="h2" />
 */
export function SectionHeading({ title, description, level = "h2", className }: SectionHeadingProps) {
  const Tag = level

  return (
    <div className={cn(className)}>
      <Tag className={cn(levelStyles[level], "text-foreground text-balance")}>
        {title}
      </Tag>
      {description && (
        <p className="text-muted-foreground text-sm mt-1">{description}</p>
      )}
    </div>
  )
}
