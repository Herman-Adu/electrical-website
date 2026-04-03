/**
 * ORGANISM: ContactFormContainer
 *
 * Orchestrates the multi-step contact form
 */

"use client";

import { AnimatePresence } from "framer-motion";
import { useContactStore } from "../../hooks/use-contact-store";
import { ContactInfoStep } from "./contact-steps/contact-info-step";
import { InquiryTypeStep } from "./contact-steps/inquiry-type-step";
import { ReferenceLinkingStep } from "./contact-steps/reference-linking-step";
import { MessageDetailsStep } from "./contact-steps/message-details-step";
import { ContactReviewStep } from "./contact-steps/contact-review-step";
import { ContactSuccessMessage } from "../molecules/contact-success-message";

const steps = [
  { number: 1, title: "Contact Info", description: "Your details" },
  { number: 2, title: "Inquiry Type", description: "How can we help" },
  { number: 3, title: "Reference", description: "Link to existing" },
  { number: 4, title: "Message", description: "Your inquiry" },
  { number: 5, title: "Review", description: "Confirm & submit" },
];

export function ContactFormContainer() {
  const { currentStep, isSubmitted, contactReferenceId, setCurrentStep } =
    useContactStore();

  if (isSubmitted) {
    return <ContactSuccessMessage referenceId={contactReferenceId} />;
  }

  return (
    <div className="w-full max-w-2xl mx-auto px-1 sm:px-0">
      {/* Progress Indicator */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          {steps.map((step, index) => {
            const isClickable = step.number <= currentStep;

            return (
              <div
                key={step.number}
                className="flex items-center flex-1 last:flex-none"
              >
                <button
                  type="button"
                  onClick={() => isClickable && setCurrentStep(step.number)}
                  disabled={!isClickable}
                  className={`flex flex-col items-center transition-all shrink-0 ${
                    isClickable
                      ? "cursor-pointer hover:scale-105"
                      : "cursor-default"
                  }`}
                >
                  <div
                    className={`w-8 h-8 sm:w-10 sm:h-10 rounded-full flex items-center justify-center text-xs sm:text-sm font-medium transition-all ${
                      step.number < currentStep
                        ? "bg-accent text-accent-foreground"
                        : step.number === currentStep
                          ? "bg-accent text-accent-foreground ring-2 sm:ring-4 ring-accent/20"
                          : "bg-muted text-muted-foreground"
                    } ${isClickable ? "hover:ring-2 hover:ring-accent/50" : ""}`}
                  >
                    {step.number < currentStep ? (
                      <svg
                        className="w-4 h-4 sm:w-5 sm:h-5"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M5 13l4 4L19 7"
                        />
                      </svg>
                    ) : (
                      step.number
                    )}
                  </div>
                  <span className="text-xs mt-2 text-center hidden sm:block max-w-17.5">
                    <span
                      className={
                        step.number === currentStep
                          ? "text-accent font-medium"
                          : "text-muted-foreground"
                      }
                    >
                      {step.title}
                    </span>
                  </span>
                </button>
                {index < steps.length - 1 && (
                  <div
                    className={`flex-1 h-0.5 mx-1 sm:mx-2 min-w-2 transition-colors ${
                      step.number < currentStep ? "bg-accent" : "bg-border"
                    }`}
                  />
                )}
              </div>
            );
          })}
        </div>

        {/* Current Step Title (Mobile) */}
        <div className="text-center sm:hidden">
          <p className="text-sm font-medium text-foreground">
            Step {currentStep}: {steps[currentStep - 1].title}
          </p>
          <p className="text-xs text-muted-foreground">
            {steps[currentStep - 1].description}
          </p>
        </div>
      </div>

      {/* Form Steps */}
      <div className="bg-card/80 backdrop-blur-sm rounded-xl border border-border/50 p-6 sm:p-8">
        <AnimatePresence mode="wait">
          {currentStep === 1 && <ContactInfoStep key="step-1" />}
          {currentStep === 2 && <InquiryTypeStep key="step-2" />}
          {currentStep === 3 && <ReferenceLinkingStep key="step-3" />}
          {currentStep === 4 && <MessageDetailsStep key="step-4" />}
          {currentStep === 5 && <ContactReviewStep key="step-5" />}
        </AnimatePresence>
      </div>
    </div>
  );
}
