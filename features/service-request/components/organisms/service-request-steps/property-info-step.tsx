"use client";

import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Building2 } from "lucide-react";
import { FormSelect } from "@/components/atoms/form-select";
import { FormInput } from "@/components/atoms/form-input";
import { FormCheckbox } from "@/components/atoms/form-checkbox";
import { FormTextarea } from "@/components/atoms/form-textarea";
import { DatePicker } from "@/components/atoms/date-picker";
import { RadioGroup } from "@/components/atoms/radio-group";
import { FormStepContainer } from "@/components/molecules/form-step-container";
import {
  propertyInfoSchema,
  type PropertyInfoInput,
} from "../../../schemas/service-request-schemas";

const propertyTypeOptions = [
  { value: "house", label: "House" },
  { value: "flat", label: "Flat" },
  { value: "bungalow", label: "Bungalow" },
  { value: "office", label: "Office" },
  { value: "shop", label: "Shop" },
  { value: "warehouse", label: "Warehouse" },
  { value: "factory", label: "Factory" },
  { value: "other", label: "Other" },
];

const timeSlotOptions = [
  { value: "morning", label: "Morning", description: "08:00 - 12:00" },
  { value: "afternoon", label: "Afternoon", description: "12:00 - 17:00" },
  { value: "evening", label: "Evening", description: "17:00 - 20:00" },
  { value: "anytime", label: "Any time", description: "First available slot" },
];

interface PropertyInfoStepProps {
  defaultValues?: Partial<PropertyInfoInput>;
  onSubmit: (data: PropertyInfoInput) => void;
  onPrevious?: () => void;
}

export function PropertyInfoStep({
  defaultValues,
  onSubmit,
  onPrevious,
}: PropertyInfoStepProps) {
  const {
    register,
    control,
    handleSubmit,
    watch,
    formState: { errors, isValid },
  } = useForm<PropertyInfoInput>({
    resolver: zodResolver(propertyInfoSchema),
    defaultValues: {
      preferredTimeSlot: "anytime",
      flexibleScheduling: false,
      ...defaultValues,
    },
    mode: "onChange",
  });

  const flexibleScheduling = watch("flexibleScheduling");

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <FormStepContainer
        title="Property & Schedule"
        description="Provide the service location and preferred visit timing."
        icon={<Building2 className="h-5 w-5" />}
        onPrevious={onPrevious}
        isValid={isValid}
      >
        <div className="space-y-6">
          <Controller
            name="propertyType"
            control={control}
            render={({ field }) => (
              <FormSelect
                label="Property Type"
                options={[
                  { value: "", label: "Select property type..." },
                  ...propertyTypeOptions,
                ]}
                value={field.value || ""}
                onChange={field.onChange}
                error={errors.propertyType?.message}
                required
              />
            )}
          />

          <FormInput
            label="Address Line 1"
            placeholder="123 High Street"
            error={errors.addressLine1?.message}
            required
            {...register("addressLine1")}
          />

          <FormInput
            label="Address Line 2"
            placeholder="Flat, suite or building (optional)"
            error={errors.addressLine2?.message}
            {...register("addressLine2")}
          />

          <div className="grid gap-6 md:grid-cols-2">
            <FormInput
              label="City / Town"
              placeholder="London"
              error={errors.city?.message}
              required
              {...register("city")}
            />
            <FormInput
              label="County"
              placeholder="Greater London (optional)"
              error={errors.county?.message}
              {...register("county")}
            />
          </div>

          <div className="md:w-1/2">
            <FormInput
              label="Postcode"
              placeholder="SW1A 1AA"
              error={errors.postcode?.message}
              required
              {...register("postcode")}
            />
          </div>

          <FormTextarea
            label="Access Instructions"
            placeholder="Gate code, parking, or access guidance (optional)"
            rows={3}
            error={errors.accessInstructions?.message}
            {...register("accessInstructions")}
          />

          <div className="grid gap-6 md:grid-cols-2">
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
                  error={errors.preferredDate?.message}
                  required
                />
              )}
            />

            {flexibleScheduling && (
              <Controller
                name="alternativeDate"
                control={control}
                render={({ field }) => (
                  <DatePicker
                    label="Alternative Date"
                    value={field.value ? new Date(field.value) : undefined}
                    onChange={(date) =>
                      field.onChange(
                        date ? date.toISOString().split("T")[0] : "",
                      )
                    }
                    minDate={today}
                    error={errors.alternativeDate?.message}
                  />
                )}
              />
            )}
          </div>

          <Controller
            name="preferredTimeSlot"
            control={control}
            render={({ field }) => (
              <RadioGroup
                label="Preferred Time Slot"
                options={timeSlotOptions}
                value={field.value}
                onValueChange={field.onChange}
                error={errors.preferredTimeSlot?.message}
                required
              />
            )}
          />

          <FormCheckbox
            label="I am flexible with scheduling"
            description="Allow us to offer alternatives if your first slot is unavailable"
            {...register("flexibleScheduling")}
          />
        </div>
      </FormStepContainer>
    </form>
  );
}
