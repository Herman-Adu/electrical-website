/**
 * ATOMIC COMPONENT: FormCheckbox
 *
 * Checkbox with label and optional description.
 * Properly handles controlled state with onChange handler.
 */

import { forwardRef, type InputHTMLAttributes } from "react"
import { cn } from "@/lib/utils"

interface FormCheckboxProps extends Omit<InputHTMLAttributes<HTMLInputElement>, "type"> {
  label: string
  description?: string
  error?: string
}

export const FormCheckbox = forwardRef<HTMLInputElement, FormCheckboxProps>(
  ({ label, description, error, className, ...props }, ref) => {
    return (
      <div className="space-y-2">
        <label className="flex items-start gap-3 cursor-pointer">
          <input
            ref={ref}
            type="checkbox"
            className={cn("mt-0.5 h-4 w-4 rounded", "text-accent focus:ring-accent", "border-input", className)}
            {...props}
          />
          <div className="flex-1">
            <div className="text-sm font-medium text-foreground">{label}</div>
            {description && <div className="text-sm text-muted-foreground mt-1">{description}</div>}
          </div>
        </label>

        {error && <p className="text-sm text-destructive">{error}</p>}
      </div>
    )
  },
)

FormCheckbox.displayName = "FormCheckbox"
