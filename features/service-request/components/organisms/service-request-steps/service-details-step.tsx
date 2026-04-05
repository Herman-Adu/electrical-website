"use client";

import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Wrench } from "lucide-react";
import { FormSelect } from "@/components/atoms/form-select";
import { FormTextarea } from "@/components/atoms/form-textarea";
import { RadioGroup } from "@/components/atoms/radio-group";
import { FormStepContainer } from "@/components/molecules/form-step-container";
import {
  serviceDetailsSchema,
  type ServiceDetailsInput,
} from "../../../schemas/service-request-schemas";

const serviceTypeOptions = [
  { value: "electrical-repair", label: "Electrical Repair" },
  { value: "electrical-installation", label: "Electrical Installation" },
  { value: "power-outage", label: "Power Outage" },
  { value: "fuse-board-upgrade", label: "Fuse Board Upgrade" },
  { value: "lighting", label: "Lighting" },
  { value: "safety-inspection", label: "Safety Inspection" },
  { value: "emergency-callout", label: "Emergency Callout" },
  { value: "other", label: "Other" },
];

const urgencyOptions = [
  {
    value: "routine",
    label: "Routine",
    description: "Standard response window.",
  },
  {
    value: "urgent",
    label: "Urgent",
    description: "Priority handling by our team.",
  },
  {
    value: "emergency",
    label: "Emergency",
    description: "Immediate response required. Same-day only.",
  },
];

interface ServiceDetailsStepProps {
  defaultValues?: Partial<ServiceDetailsInput>;
  onSubmit: (data: ServiceDetailsInput) => void;
  onPrevious?: () => void;
}

export function ServiceDetailsStep({
  defaultValues,
  onSubmit,
  onPrevious,
}: ServiceDetailsStepProps) {
  const {
    control,
    register,
    handleSubmit,
    formState: { errors, isValid },
  } = useForm<ServiceDetailsInput>({
    resolver: zodResolver(serviceDetailsSchema),
    defaultValues,
    mode: "onChange",
  });

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <FormStepContainer
        title="Service Details"
        description="Tell us what service you need and how urgent it is."
        icon={<Wrench className="h-5 w-5" />}
        onPrevious={onPrevious}
        isValid={isValid}
      >
        <div className="space-y-6">
          <Controller
            name="serviceType"
            control={control}
            render={({ field }) => (
              <FormSelect
                label="Service Type"
                options={[
                  { value: "", label: "Select service type..." },
                  ...serviceTypeOptions,
                ]}
                value={field.value || ""}
                onChange={field.onChange}
                error={errors.serviceType?.message}
                required
              />
            )}
          />

          <Controller
            name="urgency"
            control={control}
            render={({ field }) => (
              <RadioGroup
                label="Urgency"
                options={urgencyOptions}
                value={field.value}
                onValueChange={field.onChange}
                error={errors.urgency?.message}
                required
              />
            )}
          />

          <FormTextarea
            label="Description"
            placeholder="Describe the issue or work required..."
            rows={5}
            error={errors.description?.message}
            required
            {...register("description")}
          />
        </div>
      </FormStepContainer>
    </form>
  );
}
