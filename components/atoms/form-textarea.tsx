/**
 * ATOMIC COMPONENT: FormTextarea
 *
 * Multi-line text input for longer form content.
 */

import { forwardRef, type TextareaHTMLAttributes } from "react"
import { cn } from "@/lib/utils"

interface FormTextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string
  error?: string
  helperText?: string
}

export const FormTextarea = forwardRef<HTMLTextAreaElement, FormTextareaProps>(
  ({ label, error, helperText, className, ...props }, ref) => {
    return (
      <div className="space-y-2">
        {label && (
          <label className="text-sm font-medium text-foreground">
            {label}
            {props.required && <span className="text-destructive ml-1">*</span>}
          </label>
        )}

        <textarea
          ref={ref}
          className={cn(
            "w-full px-4 py-2.5 rounded-lg",
            "bg-background border border-input",
            "text-foreground placeholder:text-muted-foreground",
            "focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent",
            "focus:shadow-[0_0_10px_oklch(0.745_0.153_72.338_/_0.2)]",
            "transition-all duration-200",
            "disabled:opacity-50 disabled:cursor-not-allowed",
            "resize-none",
            error &&
              "border-destructive focus:ring-destructive focus:shadow-[0_0_10px_oklch(0.577_0.245_27.325_/_0.2)]",
            className,
          )}
          {...props}
        />

        {error && <p className="text-sm text-destructive">{error}</p>}

        {helperText && !error && <p className="text-sm text-muted-foreground">{helperText}</p>}
      </div>
    )
  },
)

FormTextarea.displayName = "FormTextarea"
