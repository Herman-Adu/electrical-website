"use client";

import React, { useActionState, useEffect, useMemo, useState } from "react";
import { useFormStatus } from "react-dom";
import { CheckCircle, Edit2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { FormStepContainer } from "@/components/molecules/form-step-container";
import { submitServiceRequestForm } from "../../../api/service-request";
import type { ServiceRequestFormActionState } from "@/lib/actions/action.types";
import type {
  ServiceContactInput,
  ServiceDetailsInput,
  PropertyInfoInput,
} from "../../../schemas/service-request-schemas";
import { resolveStepFromFieldPath } from "./service-review-step.utils";

type ServiceReviewData = {
  contact?: Partial<ServiceContactInput>;
  serviceDetails?: Partial<ServiceDetailsInput>;
  propertyInfo?: Partial<PropertyInfoInput>;
};

interface ServiceReviewStepProps {
  formData: ServiceReviewData;
  turnstileToken: string | null;
  onSubmitSuccess: (requestId: string) => void;
  onSubmitError: (error: string | null) => void;
  onPrevious?: () => void;
  onEdit: (step: number) => void;
}

const initialActionState: ServiceRequestFormActionState = {
  success: false,
};

function SubmitServiceButton({ tokenMissing }: { tokenMissing: boolean }) {
  const { pending } = useFormStatus();

  return (
    <Button type="submit" disabled={pending || tokenMissing} className="gap-2">
      {pending ? "Processing..." : "Submit Service Request"}
    </Button>
  );
}

function formatServiceType(value?: string) {
  return value ? value.replace(/-/g, " ") : undefined;
}

function formatTimeSlot(value?: string) {
  const labels: Record<string, string> = {
    morning: "Morning",
    afternoon: "Afternoon",
    evening: "Evening",
    anytime: "Any time",
  };

  if (!value) return undefined;
  return labels[value] ?? value;
}

export function ServiceReviewStep({
  formData,
  turnstileToken,
  onSubmitSuccess,
  onSubmitError,
  onPrevious,
  onEdit,
}: ServiceReviewStepProps) {
  const [localError, setLocalError] = useState<string | null>(null);
  const [actionState, formAction, isPending] = useActionState(
    submitServiceRequestForm,
    initialActionState,
  );

  const payload = useMemo(() => JSON.stringify(formData), [formData]);

  useEffect(() => {
    if (actionState.success) {
      onSubmitError(null);
      setLocalError(null);
      if (actionState.requestId) {
        onSubmitSuccess(actionState.requestId);
      }
      return;
    }

    if (actionState.error) {
      onSubmitError(actionState.error);
      setLocalError(actionState.error);
    }

    const fieldPaths = Object.keys(actionState.fieldErrors ?? {});
    if (fieldPaths.length > 0) {
      onEdit(resolveStepFromFieldPath(fieldPaths[0]));
    }
  }, [actionState, onEdit, onSubmitError, onSubmitSuccess]);

  const handleBeforeSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    if (!turnstileToken) {
      event.preventDefault();
      const verificationError =
        "Verification expired. Return to Contact step and complete verification.";
      onSubmitError(verificationError);
      setLocalError(verificationError);
      onEdit(0);
      return;
    }

    if (localError) {
      setLocalError(null);
    }

    onSubmitError(null);
  };

  const { contact, serviceDetails, propertyInfo } = formData;

  return (
    <form
      className="space-y-6"
      action={formAction}
      onSubmit={handleBeforeSubmit}
    >
      <FormStepContainer
        title="Review Your Request"
        description="Please review your service request before submitting."
        icon={<CheckCircle className="h-5 w-5" />}
        isFirstStep={false}
        isLastStep={true}
        onPrevious={onPrevious}
        isSubmitting={isPending}
        submitLabel="Submit Service Request"
      >
        <div className="space-y-6">
          <ReviewSection title="Contact" onEdit={() => onEdit(0)}>
            <ReviewItem label="Name" value={contact?.fullName} />
            <ReviewItem label="Email" value={contact?.email} />
            <ReviewItem label="Phone" value={contact?.phone} />
            {contact?.company && (
              <ReviewItem label="Company" value={contact.company} />
            )}
          </ReviewSection>

          <ReviewSection title="Service" onEdit={() => onEdit(1)}>
            <ReviewItem
              label="Service Type"
              value={formatServiceType(serviceDetails?.serviceType)}
              className="capitalize"
            />
            <ReviewItem
              label="Urgency"
              value={serviceDetails?.urgency}
              className="capitalize"
            />
            <div className="col-span-2">
              <ReviewItem
                label="Description"
                value={serviceDetails?.description}
              />
            </div>
          </ReviewSection>

          <ReviewSection title="Property & Schedule" onEdit={() => onEdit(2)}>
            <ReviewItem
              label="Property Type"
              value={propertyInfo?.propertyType}
              className="capitalize"
            />
            <ReviewItem label="Postcode" value={propertyInfo?.postcode} />
            <div className="col-span-2">
              <ReviewItem
                label="Address"
                value={[
                  propertyInfo?.addressLine1,
                  propertyInfo?.addressLine2,
                  propertyInfo?.city,
                  propertyInfo?.county,
                ]
                  .filter(Boolean)
                  .join(", ")}
              />
            </div>
            <ReviewItem
              label="Preferred Date"
              value={propertyInfo?.preferredDate}
            />
            <ReviewItem
              label="Preferred Time"
              value={formatTimeSlot(propertyInfo?.preferredTimeSlot)}
            />
            {propertyInfo?.alternativeDate && (
              <ReviewItem
                label="Alternative Date"
                value={propertyInfo.alternativeDate}
              />
            )}
            {propertyInfo?.flexibleScheduling && (
              <ReviewItem label="Flexible Scheduling" value="Yes" />
            )}
          </ReviewSection>

          {localError && (
            <div className="p-4 bg-destructive/10 border border-destructive/30 rounded-lg">
              <p className="text-sm font-medium text-destructive">
                Submission Error
              </p>
              <p className="text-sm text-destructive/80 mt-1">{localError}</p>
            </div>
          )}

          <input type="hidden" name="payload" value={payload} />
        </div>
      </FormStepContainer>

      <div className="sr-only" aria-hidden="true">
        <SubmitServiceButton tokenMissing={!turnstileToken} />
      </div>
    </form>
  );
}

function ReviewSection({
  title,
  onEdit,
  children,
}: {
  title: string;
  onEdit: () => void;
  children: React.ReactNode;
}) {
  return (
    <div className="border border-border rounded-lg overflow-hidden">
      <div className="flex items-center justify-between px-4 py-3 bg-muted/50 border-b border-border">
        <h3 className="font-medium text-foreground">{title}</h3>
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={onEdit}
          className="gap-2 text-muted-foreground hover:text-foreground"
        >
          <Edit2 className="h-3 w-3" />
          Edit
        </Button>
      </div>
      <div className="p-4 grid gap-3 md:grid-cols-2">{children}</div>
    </div>
  );
}

function ReviewItem({
  label,
  value,
  className = "",
}: {
  label: string;
  value?: string;
  className?: string;
}) {
  if (!value) return null;

  return (
    <div>
      <dt className="text-sm text-muted-foreground">{label}</dt>
      <dd className={`text-sm font-medium text-foreground ${className}`}>
        {value}
      </dd>
    </div>
  );
}
