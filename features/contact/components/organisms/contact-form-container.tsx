/**
 * ORGANISM: ContactFormContainer
 *
 * Orchestrates the multi-step contact form
 */

"use client";

import { useEffect } from "react";
import { scrollToElementWithOffset } from "@/lib/scroll-to-section";
import { MultiStepFormWrapper } from "@/components/organisms/multi-step-form-wrapper";
import type { FormStepConfig } from "@/lib/forms/types";
import { useContactStore } from "../../hooks/use-contact-store";
import { ContactInfoStep } from "./contact-steps/contact-info-step";
import { InquiryTypeStep } from "./contact-steps/inquiry-type-step";
import { ReferenceLinkingStep } from "./contact-steps/reference-linking-step";
import { MessageDetailsStep } from "./contact-steps/message-details-step";
import { ContactReviewStep } from "./contact-steps/contact-review-step";
import { ContactSuccessMessage } from "../molecules/contact-success-message";

const CONTACT_STEPS: FormStepConfig[] = [
  { id: "contact-info", title: "Contact Info", description: "Your details" },
  { id: "inquiry-type", title: "Inquiry Type", description: "How can we help" },
  { id: "reference", title: "Reference", description: "Link to existing" },
  { id: "message", title: "Message", description: "Your inquiry" },
  { id: "review", title: "Review", description: "Confirm & submit" },
];

export function ContactFormContainer() {
  const { currentStep, isSubmitted, contactReferenceId, setCurrentStep } =
    useContactStore();

  useEffect(() => {
    const el = document.getElementById("contact-form-section");
    if (el) scrollToElementWithOffset(el);
  }, [currentStep]);

  if (isSubmitted) {
    return <ContactSuccessMessage referenceId={contactReferenceId} />;
  }

  return (
    <MultiStepFormWrapper
      title=""
      description=""
      steps={CONTACT_STEPS}
      currentStep={currentStep - 1}
      className="w-full max-w-3xl px-1 sm:px-0"
      progressAnchorId="contact-form-progress-anchor"
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
  );
}
