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
import { Turnstile, type TurnstileInstance } from "@marsidev/react-turnstile";

import { CheckCircle, Edit2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { FormStepContainer } from "@/components/molecules/form-step-container";
import { submitQuotationRequestForm } from "../../../api/quotation-request";
import { completeQuotationSchema } from "../../../schemas/quotation-schemas";
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
  turnstileSiteKey: string;
  turnstileToken: string | null;
  turnstileError: string | null;
  onTurnstileTokenChange: (token: string | null) => void;
  onTurnstileErrorChange: (error: string | null) => void;
  onSubmitSuccess: (requestId: string) => void;
  onSubmitError: (error: string | null) => void;
  onPrevious?: () => void;
  onEdit: (step: number) => void;
}

const initialActionState: QuotationFormActionState = {
  success: false,
};

function mapTurnstileClientError(errorCode?: string | number): string {
  const code = String(errorCode ?? "");

  if (code === "110200") {
    return "Verification unavailable for this domain. Please retry shortly.";
  }

  if (code === "400020" || code === "110100" || code === "110110") {
    return "Verification configuration is invalid. Please retry shortly.";
  }

  return "Verification failed. Please retry.";
}

function SubmitQuotationButton({ disabled }: { disabled: boolean }) {
  const { pending } = useFormStatus();

  return (
    <Button type="submit" disabled={pending || disabled} className="gap-2">
      {pending ? "Processing..." : "Submit Quotation Request"}
    </Button>
  );
}

export function QuotationReviewStep({
  formData,
  turnstileSiteKey,
  turnstileToken,
  turnstileError,
  onTurnstileTokenChange,
  onTurnstileErrorChange,
  onSubmitSuccess,
  onSubmitError,
  onPrevious,
  onEdit,
}: QuotationReviewStepProps) {
  const turnstileRef = React.useRef<TurnstileInstance | null>(null);
  const [localError, setLocalError] = useState<string | null>(null);
  const [actionState, formAction, isPending] = useActionState(
    submitQuotationRequestForm,
    initialActionState,
  );

  const payload = useMemo(() => JSON.stringify(formData), [formData]);

  const submitReadiness = useMemo(() => {
    if (!turnstileSiteKey) {
      return {
        isReady: false,
        errorMessage: "Verification is unavailable. Please try again shortly.",
      };
    }

    const validation = completeQuotationSchema.safeParse({
      ...formData,
      turnstileToken: turnstileToken ?? "",
    });

    if (validation.success) {
      return { isReady: true, errorMessage: null, stepToEdit: null };
    }

    const firstIssue = validation.error.issues[0];
    const fieldPath = firstIssue?.path?.join(".");
    const isTurnstileIssue = fieldPath === "turnstileToken";

    return {
      isReady: false,
      errorMessage: isTurnstileIssue
        ? "Please complete verification before submitting."
        : "Please complete all required fields before submitting.",
      stepToEdit: fieldPath ? resolveStepFromFieldPath(fieldPath) : null,
    };
  }, [formData, turnstileSiteKey, turnstileToken]);

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
    if (!submitReadiness.isReady) {
      event.preventDefault();
      onSubmitError(submitReadiness.errorMessage);
      setLocalError(submitReadiness.errorMessage);

      if (typeof submitReadiness.stepToEdit === "number") {
        onEdit(submitReadiness.stepToEdit);
      }

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
        isValid={submitReadiness.isReady}
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

          <div className="space-y-2" data-testid="quotation-turnstile-widget">
            {turnstileSiteKey ? (
              <Turnstile
                ref={turnstileRef}
                siteKey={turnstileSiteKey}
                options={{ theme: "auto", size: "normal" }}
                onSuccess={(token) => {
                  onTurnstileTokenChange(token);
                  onTurnstileErrorChange(null);
                }}
                onExpire={() => {
                  onTurnstileTokenChange(null);
                  onTurnstileErrorChange(
                    "Verification expired. Please try again.",
                  );
                }}
                onError={(errorCode) => {
                  onTurnstileTokenChange(null);
                  onTurnstileErrorChange(mapTurnstileClientError(errorCode));
                }}
              />
            ) : (
              <div className="rounded-md border border-border bg-muted/30 p-3 text-xs text-muted-foreground">
                Turnstile key missing. Verification cannot be completed.
              </div>
            )}

            {turnstileError && (
              <div className="flex items-center justify-between gap-3 rounded-md border border-border bg-muted/20 p-3">
                <p className="text-xs text-muted-foreground" role="status">
                  {turnstileError}
                </p>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    onTurnstileTokenChange(null);
                    onTurnstileErrorChange(null);
                    turnstileRef.current?.reset();
                  }}
                  className="h-7 px-2 text-xs"
                >
                  Retry
                </Button>
              </div>
            )}
          </div>
          <input type="hidden" name="payload" value={payload} />
        </div>
      </FormStepContainer>
      <div className="sr-only" aria-hidden="true">
        <SubmitQuotationButton disabled={!submitReadiness.isReady} />
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
