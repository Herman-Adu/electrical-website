"use client";

import { useEffect, useRef, useState } from "react";
import { usePathname } from "next/navigation";
import { MultiStepFormWrapper } from "@/components/organisms/multi-step-form-wrapper";
import { ContactInfoStep } from "@/components/organisms/shared-steps/contact-info-step";
import { scrollToElementWithOffset } from "@/lib/scroll-to-section";
import type { FormStepConfig } from "@/lib/forms/types";
import { useServiceRequestStore } from "../../hooks/use-service-request-store";
import { ServiceDetailsStep } from "./service-request-steps/service-details-step";
import { PropertyInfoStep } from "./service-request-steps/property-info-step";
import { ServiceReviewStep } from "./service-request-steps/service-review-step";
import { ServiceRequestSuccessMessage } from "../molecules/service-request-success-message";

const SERVICE_REQUEST_STEPS: FormStepConfig[] = [
  { id: "contact", title: "Contact" },
  { id: "service", title: "Service" },
  { id: "property", title: "Property" },
  { id: "review", title: "Review" },
];

const SUCCESS_VISIBILITY_MS = 5000;
const SUCCESS_ANCHOR_ID = "service-request-success-anchor";
const FORM_SECTION_ID = "service-request";

export function ServiceRequestFormContainer() {
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [successData, setSuccessData] = useState<{ requestId: string } | null>(
    null,
  );
  const previousStepRef = useRef<number | null>(null);
  const successTimerRef = useRef<number | null>(null);
  const pathname = usePathname();
  const progressAnchorId = "service-request-progress-anchor";
  const turnstileSiteKey =
    process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY?.trim() ?? "";

  const {
    currentStep,
    contact,
    serviceDetails,
    propertyInfo,
    turnstileToken,
    turnstileError,
    updateContact,
    updateServiceDetails,
    updatePropertyInfo,
    nextStep,
    previousStep,
    goToStep,
    setTurnstileToken,
    setTurnstileError,
    resetForm,
    getCompleteFormData,
  } = useServiceRequestStore();

  useEffect(() => {
    if (previousStepRef.current === null) {
      previousStepRef.current = currentStep;
      return;
    }

    if (previousStepRef.current !== currentStep) {
      const progressAnchor = document.getElementById(progressAnchorId);
      if (progressAnchor) {
        requestAnimationFrame(() => {
          scrollToElementWithOffset(progressAnchor, {
            baseGap: 8,
            extraOffset: 0,
          });
        });
      }
    }

    previousStepRef.current = currentStep;
  }, [currentStep]);

  useEffect(() => {
    if (pathname !== "/services") {
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

  if (successData) {
    return (
      <div id={SUCCESS_ANCHOR_ID}>
        <ServiceRequestSuccessMessage
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
            description="Please provide your details so we can coordinate your service request."
            showTurnstile={true}
            turnstileSiteKey={turnstileSiteKey}
            turnstileToken={turnstileToken}
            turnstileError={turnstileError}
            onTurnstileTokenChange={setTurnstileToken}
            onTurnstileErrorChange={setTurnstileError}
          />
        );
      case 1:
        return (
          <ServiceDetailsStep
            defaultValues={serviceDetails}
            onSubmit={(data) => {
              updateServiceDetails(data);
              nextStep();
            }}
            onPrevious={previousStep}
          />
        );
      case 2:
        return (
          <PropertyInfoStep
            defaultValues={propertyInfo}
            onSubmit={(data) => {
              updatePropertyInfo(data);
              nextStep();
            }}
            onPrevious={previousStep}
          />
        );
      case 3:
        return (
          <ServiceReviewStep
            formData={getCompleteFormData()}
            turnstileToken={turnstileToken}
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
      <MultiStepFormWrapper
        title=""
        description=""
        steps={SERVICE_REQUEST_STEPS}
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
