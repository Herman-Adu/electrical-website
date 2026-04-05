import type React from "react"
import { AlertCircle, Info, AlertTriangle, CheckCircle, Lightbulb } from "lucide-react"
import { cn } from "@/lib/utils"

interface CalloutProps {
  type?: "info" | "warning" | "error" | "success" | "tip"
  title?: string
  children: React.ReactNode
  className?: string
}

const icons = {
  info: Info,
  warning: AlertTriangle,
  error: AlertCircle,
  success: CheckCircle,
  tip: Lightbulb,
}

const styles = {
  info: "bg-blue-500/10 border-blue-500/30 text-blue-700 dark:text-blue-300",
  warning: "bg-yellow-500/10 border-yellow-500/30 text-yellow-700 dark:text-yellow-300",
  error: "bg-red-500/10 border-red-500/30 text-red-700 dark:text-red-300",
  success: "bg-green-500/10 border-green-500/30 text-green-700 dark:text-green-300",
  tip: "bg-purple-500/10 border-purple-500/30 text-purple-700 dark:text-purple-300",
}

export function Callout({ type = "info", title, children, className }: CalloutProps) {
  const Icon = icons[type]

  return (
    <div className={cn("rounded-lg border-l-4 p-4", styles[type], className)}>
      <div className="flex gap-3">
        <Icon className="h-5 w-5 shrink-0 mt-0.5" />
        <div className="flex-1 space-y-2">
          {title && <p className="font-semibold">{title}</p>}
          <div className="text-sm leading-relaxed">{children}</div>
        </div>
      </div>
    </div>
  )
}
