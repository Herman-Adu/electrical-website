/**
 * QUOTATION STEP: QuotationReviewStep
 *
 * Final review step showing all collected information
 * before submission.
 */

"use client";

import React from "react";
import { useActionState, useEffect, useMemo, useState } from "react";
import { useFormStatus } from "react-dom";

import { CheckCircle, Edit2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { FormStepContainer } from "@/components/molecules/form-step-container";
import { submitQuotationRequestForm } from "../../../api/quotation-request";
import type { QuotationFormActionState } from "@/lib/actions/action.types";
import { resolveStepFromFieldPath } from "./quotation-review-step.utils";
import type {
  QuotationAdditionalInput,
  QuotationBudgetInput,
  QuotationContactInput,
  QuotationProjectTypeInput,
  QuotationScopeInput,
  QuotationSiteInput,
} from "../../../schemas/quotation-schemas";

const formatBudgetRange = (value: string) => {
  const labels: Record<string, string> = {
    "under-5k": "Under £5,000",
    "5k-15k": "£5,000 - £15,000",
    "15k-50k": "£15,000 - £50,000",
    "50k-100k": "£50,000 - £100,000",
    "100k-250k": "£100,000 - £250,000",
    "over-250k": "Over £250,000",
    unsure: "Not sure / Need guidance",
  };
  return labels[value] || value;
};

const formatTimeline = (value: string) => {
  const labels: Record<string, string> = {
    urgent: "Urgent",
    "1-month": "Within 1 Month",
    "1-3-months": "1-3 Months",
    "3-6-months": "3-6 Months",
    "6-12-months": "6-12 Months",
    flexible: "Flexible",
  };
  return labels[value] || value;
};

const formatProjectSize = (value: string) => {
  const labels: Record<string, string> = {
    small: "Small",
    medium: "Medium",
    large: "Large",
    "very-large": "Very Large",
  };
  return labels[value] || value;
};

type QuotationReviewData = {
  contact?: Partial<QuotationContactInput>;
  projectType?: Partial<QuotationProjectTypeInput>;
  scope?: Partial<QuotationScopeInput>;
  site?: Partial<QuotationSiteInput>;
  budget?: Partial<QuotationBudgetInput>;
  additional?: Partial<QuotationAdditionalInput>;
};

interface QuotationReviewStepProps {
  formData: QuotationReviewData;
  turnstileToken: string | null;
  onSubmitSuccess: (requestId: string) => void;
  onSubmitError: (error: string | null) => void;
  onPrevious?: () => void;
  onEdit: (step: number) => void;
}

const initialActionState: QuotationFormActionState = {
  success: false,
};

function SubmitQuotationButton({ tokenMissing }: { tokenMissing: boolean }) {
  const { pending } = useFormStatus();

  return (
    <Button type="submit" disabled={pending || tokenMissing} className="gap-2">
      {pending ? "Processing..." : "Submit Quotation Request"}
    </Button>
  );
}

export function QuotationReviewStep({
  formData,
  turnstileToken,
  onSubmitSuccess,
  onSubmitError,
  onPrevious,
  onEdit,
}: QuotationReviewStepProps) {
  const [localError, setLocalError] = useState<string | null>(null);
  const [actionState, formAction, isPending] = useActionState(
    submitQuotationRequestForm,
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

  const { contact, projectType, scope, site, budget, additional } = formData;

  return (
    <form
      className="space-y-6"
      action={formAction}
      onSubmit={handleBeforeSubmit}
    >
      <FormStepContainer
        title="Review Your Request"
        description="Please review your quotation request before submitting."
        icon={<CheckCircle className="h-5 w-5" />}
        isFirstStep={false}
        isLastStep={true}
        onPrevious={onPrevious}
        isSubmitting={isPending}
        submitLabel="Submit Quotation Request"
      >
        <div className="space-y-6">
          {/* Contact Information */}
          <ReviewSection title="Contact Information" onEdit={() => onEdit(0)}>
            <ReviewItem label="Name" value={contact?.fullName} />
            <ReviewItem label="Email" value={contact?.email} />
            <ReviewItem label="Phone" value={contact?.phone} />
            {contact?.company && (
              <ReviewItem label="Company" value={contact.company} />
            )}
          </ReviewSection>

          {/* Project Type */}
          <ReviewSection title="Project Type" onEdit={() => onEdit(1)}>
            <ReviewItem
              label="Category"
              value={projectType?.projectCategory?.replace("-", " ")}
              className="capitalize"
            />
            <ReviewItem
              label="Project Type"
              value={projectType?.projectType?.replace(/-/g, " ")}
              className="capitalize"
            />
            <ReviewItem
              label="Property Type"
              value={projectType?.propertyType?.replace(/-/g, " ")}
              className="capitalize"
            />
          </ReviewSection>

          {/* Project Scope */}
          <ReviewSection title="Project Scope" onEdit={() => onEdit(2)}>
            <ReviewItem
              label="Estimated Size"
              value={
                scope?.estimatedSize
                  ? formatProjectSize(scope.estimatedSize)
                  : undefined
              }
            />
            <ReviewItem
              label="Services"
              value={scope?.services
                ?.map((s) => s.replace(/-/g, " "))
                .join(", ")}
              className="capitalize"
            />
            <div className="col-span-2">
              <ReviewItem
                label="Description"
                value={scope?.projectDescription}
              />
            </div>
            {scope?.hasDrawings && (
              <ReviewItem label="Has Drawings" value="Yes" />
            )}
            {scope?.needsDesign && (
              <ReviewItem label="Needs Design Help" value="Yes" />
            )}
          </ReviewSection>

          {/* Site Information */}
          <ReviewSection title="Site Address" onEdit={() => onEdit(3)}>
            <div className="col-span-2">
              <ReviewItem
                label="Address"
                value={[
                  site?.addressLine1,
                  site?.addressLine2,
                  site?.city,
                  site?.county,
                  site?.postcode,
                ]
                  .filter(Boolean)
                  .join(", ")}
              />
            </div>
            {site?.siteAccessNotes && (
              <div className="col-span-2">
                <ReviewItem label="Access Notes" value={site.siteAccessNotes} />
              </div>
            )}
          </ReviewSection>

          {/* Budget & Timeline */}
          <ReviewSection title="Budget & Timeline" onEdit={() => onEdit(4)}>
            <ReviewItem
              label="Budget Range"
              value={
                budget?.budgetRange
                  ? formatBudgetRange(budget.budgetRange)
                  : undefined
              }
            />
            <ReviewItem
              label="Timeline"
              value={
                budget?.timeline ? formatTimeline(budget.timeline) : undefined
              }
            />
            {budget?.preferredStartDate && (
              <ReviewItem
                label="Preferred Start"
                value={new Date(budget.preferredStartDate).toLocaleDateString(
                  "en-GB",
                )}
              />
            )}
            {budget?.flexibleOnBudget && (
              <ReviewItem label="Flexible on Budget" value="Yes" />
            )}
            {budget?.flexibleOnTimeline && (
              <ReviewItem label="Flexible on Timeline" value="Yes" />
            )}
          </ReviewSection>

          {/* Additional Information */}
          <ReviewSection
            title="Additional Information"
            onEdit={() => onEdit(5)}
          >
            <ReviewItem
              label="Contact Preference"
              value={additional?.preferredContactMethod}
              className="capitalize"
            />
            {additional?.complianceRequirements &&
              additional.complianceRequirements.length > 0 && (
                <ReviewItem
                  label="Compliance"
                  value={additional.complianceRequirements
                    .join(", ")
                    .toUpperCase()}
                />
              )}
            {additional?.specialRequirements && (
              <div className="col-span-2">
                <ReviewItem
                  label="Special Requirements"
                  value={additional.specialRequirements}
                />
              </div>
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
        <SubmitQuotationButton tokenMissing={!turnstileToken} />
      </div>
    </form>
  );
}

// Helper components
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
