/**
 * ORGANISM: QuotationFormContainer
 *
 * Main container for the quotation request multi-step form.
 * Manages step navigation and form submission.
 */

"use client";

import { useEffect, useRef, useState } from "react";
import { usePathname } from "next/navigation";
import { useQuotationStore } from "../../hooks/use-quotation-store";
import { MultiStepFormWrapper } from "@/components/organisms/multi-step-form-wrapper";
import { ContactInfoStep } from "@/components/organisms/shared-steps/contact-info-step";
import { AddressInfoStep } from "@/components/organisms/shared-steps/address-info-step";
import { ProjectTypeStep } from "./quotation-steps/project-type-step";
import { ProjectScopeStep } from "./quotation-steps/project-scope-step";
import { BudgetTimelineStep } from "./quotation-steps/budget-timeline-step";
import { AdditionalRequirementsStep } from "./quotation-steps/additional-requirements-step";
import { QuotationReviewStep } from "./quotation-steps/quotation-review-step";
import { QuotationSuccessMessage } from "../molecules/quotation-success-message";
import { PowerSurge } from "@/components/animations/power-surge";
import type { FormStepConfig } from "@/lib/forms/types";
import { scrollToElementWithOffset } from "@/lib/scroll-to-section";

const QUOTATION_STEPS: FormStepConfig[] = [
  { id: "contact", title: "Contact" },
  { id: "project-type", title: "Project Type" },
  { id: "scope", title: "Scope" },
  { id: "site", title: "Site" },
  { id: "budget", title: "Budget" },
  { id: "additional", title: "Additional" },
  { id: "review", title: "Review" },
];

const SUCCESS_VISIBILITY_MS = 5000;
const SUCCESS_ANCHOR_ID = "quotation-success-anchor";
const FORM_SECTION_ID = "quotation-form-section";
const QUOTATION_SCROLL_TOP_GAP = 28;

export function QuotationFormContainer() {
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [successData, setSuccessData] = useState<{ requestId: string } | null>(
    null,
  );
  const [surgeTrigger, setSurgeTrigger] = useState(0);
  const previousStepRef = useRef<number | null>(null);
  const successTimerRef = useRef<number | null>(null);
  const pathname = usePathname();
  const progressAnchorId = "quotation-form-progress-anchor";
  const turnstileSiteKey =
    process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY?.trim() ?? "";

  const {
    currentStep,
    contact,
    projectType,
    scope,
    site,
    budget,
    additional,
    turnstileToken,
    turnstileError,
    updateContact,
    updateProjectType,
    updateScope,
    updateSite,
    updateBudget,
    updateAdditional,
    nextStep,
    previousStep,
    goToStep,
    setTurnstileToken,
    setTurnstileError,
    resetForm,
    getCompleteFormData,
  } = useQuotationStore();

  useEffect(() => {
    if (previousStepRef.current === null) {
      previousStepRef.current = currentStep;
      return;
    }

    if (previousStepRef.current !== currentStep) {
      if (currentStep > previousStepRef.current) {
        setSurgeTrigger((prev) => prev + 1);
      }

      const progressAnchor = document.getElementById(progressAnchorId);
      if (progressAnchor) {
        requestAnimationFrame(() => {
          scrollToElementWithOffset(progressAnchor, {
            baseGap: QUOTATION_SCROLL_TOP_GAP,
            extraOffset: 0,
          });
        });
      }
    }

    previousStepRef.current = currentStep;
  }, [currentStep]);

  useEffect(() => {
    if (pathname !== "/quotation") {
      return;
    }

    setSubmitError(null);
    setSuccessData(null);
    resetForm();
  }, [pathname, resetForm]);

  useEffect(() => {
    if (!successData) {
      return;
    }

    const successAnchor = document.getElementById(SUCCESS_ANCHOR_ID);
    if (successAnchor) {
      requestAnimationFrame(() => {
        scrollToElementWithOffset(successAnchor, {
          baseGap: 8,
          extraOffset: 0,
        });
      });
    }

    successTimerRef.current = window.setTimeout(() => {
      setSuccessData(null);
      setSubmitError(null);
      resetForm();

      const formSection = document.getElementById(FORM_SECTION_ID);
      if (formSection) {
        requestAnimationFrame(() => {
          scrollToElementWithOffset(formSection, {
            baseGap: 8,
            extraOffset: 0,
          });
        });
      }
    }, SUCCESS_VISIBILITY_MS);

    return () => {
      if (successTimerRef.current !== null) {
        window.clearTimeout(successTimerRef.current);
        successTimerRef.current = null;
      }
    };
  }, [successData, resetForm]);

  const handleStartNew = () => {
    if (successTimerRef.current !== null) {
      window.clearTimeout(successTimerRef.current);
      successTimerRef.current = null;
    }

    setSuccessData(null);
    setSubmitError(null);
    resetForm();

    const formSection = document.getElementById(FORM_SECTION_ID);
    if (formSection) {
      requestAnimationFrame(() => {
        scrollToElementWithOffset(formSection, {
          baseGap: 8,
          extraOffset: 0,
        });
      });
    }
  };

  // Show success message if submitted
  if (successData) {
    return (
      <div id={SUCCESS_ANCHOR_ID}>
        <QuotationSuccessMessage
          requestId={successData.requestId}
          onStartNew={handleStartNew}
        />
      </div>
    );
  }

  const renderStep = () => {
    switch (currentStep) {
      case 0:
        return (
          <ContactInfoStep
            defaultValues={contact}
            onSubmit={(data) => {
              updateContact(data);
              nextStep();
            }}
            isFirstStep={true}
            showCompany={true}
            title="Contact Information"
            description="Please provide your contact details so we can reach you about your quotation."
          />
        );
      case 1:
        return (
          <ProjectTypeStep
            defaultValues={projectType}
            onSubmit={(data) => {
              updateProjectType(data);
              nextStep();
            }}
            onPrevious={previousStep}
          />
        );
      case 2:
        return (
          <ProjectScopeStep
            defaultValues={scope}
            onSubmit={(data) => {
              updateScope(data);
              nextStep();
            }}
            onPrevious={previousStep}
          />
        );
      case 3:
        return (
          <AddressInfoStep
            defaultValues={{
              addressLine1: site.addressLine1,
              addressLine2: site.addressLine2,
              city: site.city,
              county: site.county,
              postcode: site.postcode,
            }}
            onSubmit={(data) => {
              updateSite(data);
              nextStep();
            }}
            onPrevious={previousStep}
            title="Site Address"
            description="Where is the project located?"
          />
        );
      case 4:
        return (
          <BudgetTimelineStep
            defaultValues={budget}
            onSubmit={(data) => {
              updateBudget(data);
              nextStep();
            }}
            onPrevious={previousStep}
          />
        );
      case 5:
        return (
          <AdditionalRequirementsStep
            defaultValues={additional}
            onSubmit={(data) => {
              updateAdditional(data);
              nextStep();
            }}
            onPrevious={previousStep}
            isLastStep={false}
          />
        );
      case 6:
        return (
          <QuotationReviewStep
            formData={getCompleteFormData()}
            turnstileSiteKey={turnstileSiteKey}
            turnstileToken={turnstileToken}
            turnstileError={turnstileError}
            onTurnstileTokenChange={setTurnstileToken}
            onTurnstileErrorChange={setTurnstileError}
            onSubmitSuccess={(requestId) => {
              setSubmitError(null);
              setTurnstileError(null);
              setSuccessData({ requestId });
              resetForm();
            }}
            onSubmitError={setSubmitError}
            onPrevious={previousStep}
            onEdit={goToStep}
          />
        );
      default:
        return null;
    }
  };

  return (
    <div className="space-y-6">
      <PowerSurge trigger={surgeTrigger} />

      <MultiStepFormWrapper
        title=""
        description=""
        steps={QUOTATION_STEPS}
        currentStep={currentStep}
        progressAnchorId={progressAnchorId}
        onStepClick={(stepIndex) => {
          if (stepIndex <= currentStep) {
            goToStep(stepIndex);
          }
        }}
      >
        {renderStep()}
      </MultiStepFormWrapper>

      {submitError && (
        <div className="p-4 bg-destructive/10 border border-destructive/30 rounded-lg">
          <p className="text-sm font-medium text-destructive">
            Submission Error
          </p>
          <p className="text-sm text-destructive/80 mt-1">{submitError}</p>
        </div>
      )}
    </div>
  );
}
