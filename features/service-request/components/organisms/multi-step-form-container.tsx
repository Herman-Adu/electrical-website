"use client";

import { AnimatePresence } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import { useFormStore } from "../../hooks/use-form-store";
import { StepIndicator } from "@/components/molecules/step-indicator";
import { PowerSurge } from "@/components/animations/power-surge";
import { scrollToElementWithOffset } from "@/lib/scroll-to-section";
import { PersonalInfoStep } from "./personal-info-step";
import { ServiceDetailsStep } from "./service-details-step";
import { PropertyInfoStep } from "./property-info-step";
import { ScheduleStep } from "./schedule-step";
import { ReviewStep } from "./review-step";

const STEPS = [
  {
    number: 1,
    label: "Personal Info",
    description: "Contact details",
  },
  {
    number: 2,
    label: "Service Details",
    description: "What you need",
  },
  {
    number: 3,
    label: "Property Info",
    description: "Location details",
  },
  {
    number: 4,
    label: "Schedule",
    description: "Pick a time",
  },
  {
    number: 5,
    label: "Review",
    description: "Confirm & submit",
  },
];

const SERVICE_PROGRESS_ANCHOR_ID = "service-form-progress-anchor";
const SERVICE_SCROLL_TOP_GAP = 28;

export function MultiStepFormContainer() {
  const { currentStep, goToStep, isStepComplete } = useFormStore();
  const [previousStep, setPreviousStep] = useState(currentStep);
  const [surgeTrigger, setSurgeTrigger] = useState(0);
  const previousStepRef = useRef<number | null>(null);

  const completedSteps = STEPS.filter((step) => step.number < currentStep).map(
    (step) => step.number,
  );

  useEffect(() => {
    if (currentStep > previousStep) {
      setSurgeTrigger((prev) => prev + 1);
    }
    setPreviousStep(currentStep);
  }, [currentStep, previousStep]);

  useEffect(() => {
    if (previousStepRef.current === null) {
      previousStepRef.current = currentStep;
      return;
    }

    if (previousStepRef.current !== currentStep) {
      const progressAnchor = document.getElementById(
        SERVICE_PROGRESS_ANCHOR_ID,
      );
      if (progressAnchor) {
        requestAnimationFrame(() => {
          scrollToElementWithOffset(progressAnchor, {
            baseGap: SERVICE_SCROLL_TOP_GAP,
            extraOffset: 0,
          });
        });
      }
    }

    previousStepRef.current = currentStep;
  }, [currentStep]);

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return <PersonalInfoStep />;
      case 2:
        return <ServiceDetailsStep />;
      case 3:
        return <PropertyInfoStep />;
      case 4:
        return <ScheduleStep />;
      case 5:
        return <ReviewStep />;
      default:
        return null;
    }
  };

  return (
    <div className="space-y-8">
      <PowerSurge trigger={surgeTrigger} />

      <div id={SERVICE_PROGRESS_ANCHOR_ID}>
        <StepIndicator
          steps={STEPS}
          currentStep={currentStep}
          completedSteps={completedSteps}
          onStepClick={(step) => {
            if (step <= currentStep) {
              goToStep(step);
            }
          }}
        />
      </div>

      {/* Step Content with Animation */}
      <div className="bg-card border border-border rounded-lg p-6 sm:p-8  relative overflow-hidden">
        <div className="absolute inset-0 opacity-5 pointer-events-none">
          <div className="absolute inset-0 bg-gradient-to-br from-accent/20 via-transparent to-accent/20" />
        </div>

        <div className="relative">
          <AnimatePresence mode="wait">
            <div key={currentStep}>{renderStep()}</div>
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
