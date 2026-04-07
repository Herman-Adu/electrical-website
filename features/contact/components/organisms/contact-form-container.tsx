/**
 * ORGANISM: ContactFormContainer
 *
 * Orchestrates the multi-step contact form
 */

"use client";

import { useEffect, useRef, useState } from "react";
import { scrollToElementWithOffset } from "@/lib/scroll-to-section";
import { MultiStepFormWrapper } from "@/components/organisms/multi-step-form-wrapper";
import { PowerSurge } from "@/components/animations/power-surge";
import { UnifiedSuccessMessage } from "@/components/molecules/unified-success-message";
import type { FormStepConfig } from "@/lib/forms/types";
import { useContactStore } from "../../hooks/use-contact-store";
import { ContactInfoStep } from "./contact-steps/contact-info-step";
import { InquiryTypeStep } from "./contact-steps/inquiry-type-step";
import { ReferenceLinkingStep } from "./contact-steps/reference-linking-step";
import { MessageDetailsStep } from "./contact-steps/message-details-step";
import { ContactReviewStep } from "./contact-steps/contact-review-step";

const CONTACT_PROGRESS_ANCHOR_ID = "contact-form-progress-anchor";
const CONTACT_SCROLL_TOP_GAP = 28;
const CONTACT_SUCCESS_ANCHOR_ID = "contact-success-anchor";
const CONTACT_SUCCESS_SCROLL_TOP_GAP = 8;

const CONTACT_STEPS: FormStepConfig[] = [
  { id: "contact-info", title: "Contact Info", description: "Your details" },
  { id: "inquiry-type", title: "Inquiry Type", description: "How can we help" },
  { id: "reference", title: "Reference", description: "Link to existing" },
  { id: "message", title: "Message", description: "Your inquiry" },
  { id: "review", title: "Review", description: "Confirm & submit" },
];

export function ContactFormContainer() {
  const {
    currentStep,
    isSubmitted,
    contactReferenceId,
    setCurrentStep,
    resetForm,
  } = useContactStore();

  const handleStartNew = () => {
    resetForm();
    useContactStore.persist.clearStorage();
  };
  const [surgeTrigger, setSurgeTrigger] = useState(0);
  const previousStepRef = useRef<number | null>(null);

  useEffect(() => {
    resetForm();
    useContactStore.persist.clearStorage();
  }, [resetForm]);

  useEffect(() => {
    if (previousStepRef.current === null) {
      previousStepRef.current = currentStep;
      return;
    }

    if (currentStep > previousStepRef.current) {
      setSurgeTrigger((prev) => prev + 1);
      const progressAnchor = document.getElementById(
        CONTACT_PROGRESS_ANCHOR_ID,
      );
      if (progressAnchor) {
        requestAnimationFrame(() => {
          scrollToElementWithOffset(progressAnchor, {
            baseGap: CONTACT_SCROLL_TOP_GAP,
            extraOffset: 0,
          });
        });
      }
    }

    previousStepRef.current = currentStep;
  }, [currentStep]);

  useEffect(() => {
    if (!isSubmitted) {
      return;
    }

    const successAnchor = document.getElementById(CONTACT_SUCCESS_ANCHOR_ID);
    if (successAnchor) {
      requestAnimationFrame(() => {
        scrollToElementWithOffset(successAnchor, {
          baseGap: CONTACT_SUCCESS_SCROLL_TOP_GAP,
          extraOffset: 0,
        });
      });
    }
  }, [isSubmitted]);

  if (isSubmitted) {
    return (
      <div id={CONTACT_SUCCESS_ANCHOR_ID}>
        <UnifiedSuccessMessage
          referenceId={contactReferenceId || ""}
          formType="contact"
          onStartNew={resetForm}
        />
      </div>
    );
  }

  return (
    <>
      <PowerSurge trigger={surgeTrigger} />

      <MultiStepFormWrapper
        title=""
        description=""
        steps={CONTACT_STEPS}
        currentStep={currentStep - 1}
        className="w-full max-w-3xl px-1 sm:px-0"
        progressAnchorId={CONTACT_PROGRESS_ANCHOR_ID}
        onStepClick={(stepIndex) => {
          const stepNumber = stepIndex + 1;
          if (stepNumber <= currentStep) {
            setCurrentStep(stepNumber);
          }
        }}
      >
        {currentStep === 1 && <ContactInfoStep key="step-1" />}
        {currentStep === 2 && <InquiryTypeStep key="step-2" />}
        {currentStep === 3 && <ReferenceLinkingStep key="step-3" />}
        {currentStep === 4 && <MessageDetailsStep key="step-4" />}
        {currentStep === 5 && <ContactReviewStep key="step-5" />}
      </MultiStepFormWrapper>
    </>
  );
}
