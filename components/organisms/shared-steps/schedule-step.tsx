/**
 * SHARED STEP: ScheduleStep
 * 
 * A reusable scheduling preferences step used by multiple forms.
 * Collects preferred dates and times using date pickers.
 */

"use client"

import { useForm, Controller } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { motion } from "framer-motion"
import { Calendar } from "lucide-react"
import { DatePicker } from "@/components/atoms/date-picker"
import { FormCheckbox } from "@/components/atoms/form-checkbox"
import { RadioGroup } from "@/components/atoms/radio-group"
import { FormStepContainer } from "@/components/molecules/form-step-container"

const scheduleSchema = z.object({
  preferredDate: z
    .string()
    .min(1, "Please select a preferred date"),
  alternativeDate: z
    .string()
    .optional(),
  preferredTime: z
    .string()
    .min(1, "Please select a preferred time"),
  flexibleScheduling: z
    .boolean()
    .default(false),
})

export type ScheduleInput = z.infer<typeof scheduleSchema>

const timeSlotOptions = [
  { value: "morning", label: "Morning", description: "8:00 AM - 12:00 PM" },
  { value: "afternoon", label: "Afternoon", description: "12:00 PM - 5:00 PM" },
  { value: "evening", label: "Evening", description: "5:00 PM - 8:00 PM" },
]

interface ScheduleStepProps {
  defaultValues?: Partial<ScheduleInput>
  onSubmit: (data: ScheduleInput) => void
  onPrevious?: () => void
  isFirstStep?: boolean
  isLastStep?: boolean
  title?: string
  description?: string
}

export function ScheduleStep({
  defaultValues,
  onSubmit,
  onPrevious,
  isFirstStep = false,
  isLastStep = false,
  title = "Schedule Preferences",
  description = "When would you like us to visit?",
}: ScheduleStepProps) {
  const {
    register,
    handleSubmit,
    control,
    watch,
    formState: { errors, isValid },
  } = useForm<ScheduleInput>({
    resolver: zodResolver(scheduleSchema),
    defaultValues: {
      flexibleScheduling: false,
      ...defaultValues,
    },
    mode: "onChange",
  })

  const flexibleScheduling = watch("flexibleScheduling")
  
  // Get minimum date (today)
  const today = new Date()
  today.setHours(0, 0, 0, 0)

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <FormStepContainer
        title={title}
        description={description}
        icon={<Calendar className="h-5 w-5" />}
        isFirstStep={isFirstStep}
        isLastStep={isLastStep}
        onPrevious={onPrevious}
        isValid={isValid}
      >
        <div className="space-y-6">
          {/* Preferred Time */}
          <Controller
            name="preferredTime"
            control={control}
            render={({ field }) => (
              <RadioGroup
                label="Preferred Time Slot"
                options={timeSlotOptions}
                value={field.value}
                onValueChange={field.onChange}
                error={errors.preferredTime?.message}
                required
              />
            )}
          />

          {/* Flexible Scheduling */}
          <FormCheckbox
            label="I'm flexible with scheduling"
            description="Check this if you can provide an alternative date"
            {...register("flexibleScheduling")}
          />

          <div className="grid gap-6 md:grid-cols-2">
            {/* Preferred Date */}
            <Controller
              name="preferredDate"
              control={control}
              render={({ field }) => (
                <DatePicker
                  label="Preferred Date"
                  value={field.value ? new Date(field.value) : undefined}
                  onChange={(date) => field.onChange(date ? date.toISOString().split("T")[0] : "")}
                  minDate={today}
                  error={errors.preferredDate?.message}
                  helperText="Select your first choice date"
                  required
                />
              )}
            />

            {/* Alternative Date (conditional) */}
            {flexibleScheduling && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
              >
                <Controller
                  name="alternativeDate"
                  control={control}
                  render={({ field }) => (
                    <DatePicker
                      label="Alternative Date (Optional)"
                      value={field.value ? new Date(field.value) : undefined}
                      onChange={(date) => field.onChange(date ? date.toISOString().split("T")[0] : "")}
                      minDate={today}
                      error={errors.alternativeDate?.message}
                      helperText="Provide a backup date option"
                    />
                  )}
                />
              </motion.div>
            )}
          </div>
        </div>
      </FormStepContainer>
    </form>
  )
}
