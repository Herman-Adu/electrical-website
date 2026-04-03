/**
 * ORGANISM: InquiryTypeStep (Step 2 of 5)
 * 
 * Categorizes the type of inquiry and sector
 */

"use client"

import { useForm, Controller } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { motion } from "framer-motion"
import { MessageSquare, Building, Factory, Home, AlertTriangle } from "lucide-react"
import { RadioGroup } from "@/components/atoms/radio-group"
import { Button } from "@/components/ui/button"
import { useContactStore } from "../../../hooks/use-contact-store"
import { inquiryTypeSchema, type InquiryTypeInput } from "../../../schemas/contact-schemas"

const inquiryTypeOptions = [
  { value: "general-inquiry", label: "General Inquiry", description: "Questions about our services" },
  { value: "service-follow-up", label: "Service Follow-up", description: "Regarding an existing service request" },
  { value: "quote-follow-up", label: "Quote Follow-up", description: "Questions about a quotation" },
  { value: "complaint", label: "Complaint", description: "Report an issue or concern" },
  { value: "feedback", label: "Feedback", description: "Share your experience" },
  { value: "partnership", label: "Partnership", description: "Business collaboration opportunities" },
  { value: "media-press", label: "Media & Press", description: "Press inquiries and interviews" },
  { value: "careers", label: "Careers", description: "Employment opportunities" },
]

const sectorOptions = [
  { value: "residential", label: "Residential", icon: Home },
  { value: "commercial", label: "Commercial", icon: Building },
  { value: "industrial", label: "Industrial", icon: Factory },
  { value: "not-applicable", label: "Not Applicable", icon: MessageSquare },
]

const priorityOptions = [
  { value: "low", label: "Low", description: "Response within 5-7 days" },
  { value: "normal", label: "Normal", description: "Response within 2-3 days" },
  { value: "high", label: "High", description: "Response within 24 hours" },
  { value: "urgent", label: "Urgent", description: "Same day response" },
]

export function InquiryTypeStep() {
  const { inquiryType, updateInquiryType, nextStep, prevStep } = useContactStore()

  const {
    control,
    handleSubmit,
    watch,
    formState: { errors, isValid },
  } = useForm<InquiryTypeInput>({
    resolver: zodResolver(inquiryTypeSchema),
    defaultValues: inquiryType,
    mode: "onChange",
  })

  const selectedInquiry = watch("inquiryType")
  const selectedPriority = watch("priority")

  const onSubmit = (data: InquiryTypeInput) => {
    updateInquiryType(data)
    nextStep()
  }

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      transition={{ duration: 0.3 }}
    >
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        {/* Header */}
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <MessageSquare className="h-5 w-5 text-accent" />
            <h2 className="text-xl font-semibold text-foreground">Type of Inquiry</h2>
          </div>
          <p className="text-muted-foreground text-sm">
            Help us direct your inquiry to the right team.
          </p>
        </div>

        {/* Inquiry Type Selection */}
        <div className="space-y-3">
          <label className="text-sm font-medium text-foreground">
            What can we help you with? <span className="text-destructive">*</span>
          </label>
          <Controller
            name="inquiryType"
            control={control}
            render={({ field }) => (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {inquiryTypeOptions.map((option) => (
                  <button
                    key={option.value}
                    type="button"
                    onClick={() => field.onChange(option.value)}
                    className={`p-4 rounded-lg border text-left transition-all ${
                      field.value === option.value
                        ? "border-accent bg-accent/10 ring-1 ring-accent"
                        : "border-border hover:border-accent/50 hover:bg-accent/5"
                    }`}
                  >
                    <p className="font-medium text-sm text-foreground">{option.label}</p>
                    <p className="text-xs text-muted-foreground mt-1">{option.description}</p>
                  </button>
                ))}
              </div>
            )}
          />
          {errors.inquiryType && (
            <p className="text-sm text-destructive">{errors.inquiryType.message}</p>
          )}
        </div>

        {/* Sector Selection */}
        <div className="space-y-3">
          <label className="text-sm font-medium text-foreground">
            Which sector applies? <span className="text-destructive">*</span>
          </label>
          <Controller
            name="sector"
            control={control}
            render={({ field }) => (
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {sectorOptions.map((option) => {
                  const Icon = option.icon
                  return (
                    <button
                      key={option.value}
                      type="button"
                      onClick={() => field.onChange(option.value)}
                      className={`p-4 rounded-lg border text-center transition-all ${
                        field.value === option.value
                          ? "border-accent bg-accent/10 ring-1 ring-accent"
                          : "border-border hover:border-accent/50 hover:bg-accent/5"
                      }`}
                    >
                      <Icon className={`h-6 w-6 mx-auto mb-2 ${
                        field.value === option.value ? "text-accent" : "text-muted-foreground"
                      }`} />
                      <p className="font-medium text-sm text-foreground">{option.label}</p>
                    </button>
                  )
                })}
              </div>
            )}
          />
        </div>

        {/* Priority Selection */}
        <div className="space-y-3">
          <label className="text-sm font-medium text-foreground">
            Priority Level <span className="text-destructive">*</span>
          </label>
          <Controller
            name="priority"
            control={control}
            render={({ field }) => (
              <RadioGroup
                name="priority"
                options={priorityOptions}
                value={field.value}
                onChange={field.onChange}
                error={errors.priority?.message}
              />
            )}
          />
          {selectedPriority === "urgent" && (
            <div className="p-3 rounded-lg bg-amber-500/10 border border-amber-500/30">
              <div className="flex items-start gap-2">
                <AlertTriangle className="h-4 w-4 text-amber-500 shrink-0 mt-0.5" />
                <p className="text-xs text-amber-600 dark:text-amber-400">
                  Urgent inquiries are prioritized. For emergencies requiring immediate electrical assistance, 
                  please call us directly or use our emergency service request form.
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Navigation */}
        <div className="flex justify-between pt-4">
          <Button
            type="button"
            variant="outline"
            onClick={prevStep}
          >
            Back
          </Button>
          <Button
            type="submit"
            className="min-w-[140px]"
            disabled={!isValid}
          >
            Continue
          </Button>
        </div>
      </form>
    </motion.div>
  )
}
