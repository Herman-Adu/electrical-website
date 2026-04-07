/**
 * ORGANISM: ScheduleStep (Step 4 of 5)
 *
 * This step handles scheduling preferences.
 * Demonstrates date picker components with minimum date constraints.
 */

"use client";

import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { motion } from "framer-motion";
import { DatePicker } from "@/components/atoms/date-picker";
import { FormCheckbox } from "@/components/atoms/form-checkbox";
import { RadioGroup } from "@/components/atoms/radio-group";
import { useFormStore } from "../../hooks/use-form-store";
import {
  schedulePreferencesSchema,
  type SchedulePreferencesInput,
} from "../../schemas/schemas";
import { getUrgencyScheduleValidationError } from "../../lib/urgency-schedule";

const TIME_SLOT_OPTIONS = [
  {
    value: "morning",
    label: "Morning",
    description: "8:00 AM - 12:00 PM",
  },
  {
    value: "afternoon",
    label: "Afternoon",
    description: "12:00 PM - 5:00 PM",
  },
  {
    value: "evening",
    label: "Evening",
    description: "5:00 PM - 8:00 PM",
  },
];

export function ScheduleStep() {
  const { data, updateSchedulePreferences, nextStep, prevStep } =
    useFormStore();
  const urgency = data.serviceDetails.urgency;

  const {
    register,
    handleSubmit,
    control,
    watch,
    formState: { errors, isValid },
  } = useForm<SchedulePreferencesInput>({
    resolver: zodResolver(schedulePreferencesSchema),
    defaultValues: {
      ...data.schedulePreferences,
      preferredTimeSlot:
        data.schedulePreferences.preferredTimeSlot || undefined,
    },
    mode: "onChange",
    reValidateMode: "onChange",
  });

  const flexibleScheduling = watch("flexibleScheduling");
  const preferredDate = watch("preferredDate");
  const urgencyDateError = getUrgencyScheduleValidationError({
    urgency,
    preferredDate,
  });

  const onSubmit = (formData: SchedulePreferencesInput) => {
    if (urgencyDateError) {
      return;
    }

    updateSchedulePreferences(formData);
    nextStep();
  };

  const onError = (_errors: unknown) => {
    // Validation errors are displayed inline by react-hook-form
  };

  // Get minimum date (today) - users can't select past dates
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      transition={{ duration: 0.3 }}
    >
      <form onSubmit={handleSubmit(onSubmit, onError)} className="space-y-6">
        <div className="space-y-2">
          <h2 className="text-2xl font-semibold text-foreground">
            Schedule Preferences
          </h2>
          <p className="text-muted-foreground">
            When would you like us to visit?
          </p>
        </div>

        {/* Preferred Date */}
        <Controller
          name="preferredDate"
          control={control}
          render={({ field }) => (
            <DatePicker
              label="Preferred Date"
              value={field.value ? new Date(field.value) : undefined}
              onChange={(date) =>
                field.onChange(date ? date.toISOString().split("T")[0] : "")
              }
              minDate={today}
              error={
                errors.preferredDate?.message ?? urgencyDateError ?? undefined
              }
              helperText="Select your first choice date"
              required
            />
          )}
        />

        {/* Time Slot */}
        <Controller
          name="preferredTimeSlot"
          control={control}
          render={({ field }) => (
            <RadioGroup
              label="Preferred Time Slot"
              options={TIME_SLOT_OPTIONS}
              error={errors.preferredTimeSlot?.message}
              required
              value={field.value}
              onValueChange={field.onChange}
            />
          )}
        />

        {/* Flexible Scheduling */}
        <Controller
          name="flexibleScheduling"
          control={control}
          render={({ field }) => (
            <FormCheckbox
              label="I have flexible scheduling"
              description="Check this if you're open to alternative dates/times for faster scheduling"
              checked={field.value}
              onChange={(e) => field.onChange(e.target.checked)}
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
                  onChange={(date) =>
                    field.onChange(date ? date.toISOString().split("T")[0] : "")
                  }
                  minDate={today}
                  error={errors.alternativeDate?.message}
                  helperText="Provide a backup date option"
                />
              )}
            />
          </motion.div>
        )}

        {/* Info Box */}
        <div className="bg-accent/10 border border-accent/30 rounded-lg p-4">
          <div className="flex gap-3">
            <svg
              className="h-5 w-5 text-accent shrink-0 mt-0.5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            <div className="text-sm text-foreground">
              <p className="font-semibold mb-1">Scheduling Note</p>
              <p className="text-muted-foreground">
                We'll confirm your appointment within 24 hours. Emergency
                requests will be processed immediately.
              </p>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <div className="flex items-center justify-between pt-4">
          <button
            type="button"
            onClick={prevStep}
            className="px-6 py-2.5 bg-secondary text-secondary-foreground rounded-lg font-medium transition-all duration-200 hover:bg-secondary/80"
          >
            <svg
              className="inline-block mr-2 h-4 w-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 19l-7-7 7-7"
              />
            </svg>
            Previous
          </button>

          <button
            type="submit"
            disabled={!isValid || Boolean(urgencyDateError)}
            className="px-6 py-2.5 bg-accent text-accent-foreground rounded-lg font-medium transition-all duration-200 hover:bg-accent/90 disabled:opacity-50 disabled:cursor-not-allowed electric-glow-sm"
          >
            Continue
            <svg
              className="inline-block ml-2 h-4 w-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 5l7 7-7 7"
              />
            </svg>
          </button>
        </div>
      </form>
    </motion.div>
  );
}
