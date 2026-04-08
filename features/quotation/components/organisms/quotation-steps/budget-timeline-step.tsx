/**
 * QUOTATION STEP: BudgetTimelineStep
 *
 * Collects budget range, timeline expectations,
 * and flexibility preferences.
 */

"use client";

import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { PoundSterling } from "lucide-react";
import { FormSelect } from "@/components/atoms/form-select";
import { FormCheckbox } from "@/components/atoms/form-checkbox";
import { DatePicker } from "@/components/atoms/date-picker";
import { RadioGroup } from "@/components/atoms/radio-group";
import { FormStepContainer } from "@/components/molecules/form-step-container";
import {
  quotationBudgetSchema,
  type QuotationBudgetInput,
} from "../../../schemas/quotation-schemas";

const budgetRangeOptions = [
  { value: "under-5k", label: "Under £5,000" },
  { value: "5k-15k", label: "£5,000 - £15,000" },
  { value: "15k-50k", label: "£15,000 - £50,000" },
  { value: "50k-100k", label: "£50,000 - £100,000" },
  { value: "100k-250k", label: "£100,000 - £250,000" },
  { value: "over-250k", label: "Over £250,000" },
  { value: "unsure", label: "Not sure / Need guidance" },
];

const timelineOptions = [
  {
    value: "urgent",
    label: "Urgent",
    description: "Need to start as soon as possible",
  },
  {
    value: "1-month",
    label: "Within 1 Month",
    description: "Looking to start within the next few weeks",
  },
  {
    value: "1-3-months",
    label: "1-3 Months",
    description: "Planning for the near future",
  },
  {
    value: "3-6-months",
    label: "3-6 Months",
    description: "Part of a larger project timeline",
  },
  {
    value: "6-12-months",
    label: "6-12 Months",
    description: "Long-term planning",
  },
  {
    value: "flexible",
    label: "Flexible",
    description: "No fixed timeline, open to suggestions",
  },
];

interface BudgetTimelineStepProps {
  defaultValues?: Partial<QuotationBudgetInput>;
  onSubmit: (data: QuotationBudgetInput) => void;
  onPrevious?: () => void;
  isFirstStep?: boolean;
  isLastStep?: boolean;
}

export function BudgetTimelineStep({
  defaultValues,
  onSubmit,
  onPrevious,
  isFirstStep = false,
  isLastStep = false,
}: BudgetTimelineStepProps) {
  const {
    register,
    control,
    handleSubmit,
    formState: { errors, isValid },
  } = useForm<QuotationBudgetInput>({
    resolver: zodResolver(quotationBudgetSchema),
    defaultValues: {
      flexibleOnBudget: false,
      flexibleOnTimeline: true,
      ...defaultValues,
    },
    mode: "onChange",
  });

  // Get minimum date (today)
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <FormStepContainer
        title="Budget & Timeline"
        description="Help us understand your budget expectations and timeline."
        icon={<PoundSterling className="h-5 w-5" />}
        isFirstStep={isFirstStep}
        isLastStep={isLastStep}
        onPrevious={onPrevious}
        isValid={isValid}
      >
        <div className="space-y-6">
          {/* Budget Range */}
          <Controller
            name="budgetRange"
            control={control}
            render={({ field }) => (
              <FormSelect
                label="Budget Range"
                options={[
                  { value: "", label: "Select budget range..." },
                  ...budgetRangeOptions,
                ]}
                value={field.value || ""}
                onChange={field.onChange}
                error={errors.budgetRange?.message}
                helperText="Required field"
                required
              />
            )}
          />

          <FormCheckbox
            label="I'm flexible on budget"
            description="I'm open to discussing options that may affect the budget"
            {...register("flexibleOnBudget")}
          />

          {/* Timeline */}
          <Controller
            name="timeline"
            control={control}
            render={({ field }) => (
              <RadioGroup
                label="Project Timeline"
                options={timelineOptions}
                value={field.value}
                onValueChange={field.onChange}
                error={errors.timeline?.message}
                showRequiredHelper
                required
              />
            )}
          />

          {/* Preferred Start Date */}
          <Controller
            name="preferredStartDate"
            control={control}
            render={({ field }) => (
              <DatePicker
                label="Preferred Start Date (Optional)"
                value={field.value ? new Date(field.value) : undefined}
                onChange={(date) =>
                  field.onChange(date ? date.toISOString().split("T")[0] : "")
                }
                minDate={today}
                helperText="When would you ideally like work to begin?"
              />
            )}
          />

          <FormCheckbox
            label="I'm flexible on timeline"
            description="Dates can be adjusted based on availability and project requirements"
            {...register("flexibleOnTimeline")}
          />
        </div>
      </FormStepContainer>
    </form>
  );
}
