"use client"

import { AnimatePresence } from "framer-motion"
import { useEffect, useState } from "react"
import { useFormStore } from "../../hooks/use-form-store"
import { StepIndicator } from "@/components/molecules/step-indicator"
import { PowerSurge } from "@/components/animations/power-surge"
import { PersonalInfoStep } from "./personal-info-step"
import { ServiceDetailsStep } from "./service-details-step"
import { PropertyInfoStep } from "./property-info-step"
import { ScheduleStep } from "./schedule-step"
import { ReviewStep } from "./review-step"

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
]

export function MultiStepFormContainer() {
  const { currentStep, goToStep, isStepComplete } = useFormStore()
  const [previousStep, setPreviousStep] = useState(currentStep)
  const [surgeTrigger, setSurgeTrigger] = useState(0)

  const completedSteps = STEPS.filter((step) => step.number < currentStep).map((step) => step.number)

  useEffect(() => {
    if (currentStep > previousStep) {
      setSurgeTrigger((prev) => prev + 1)
    }
    setPreviousStep(currentStep)
  }, [currentStep, previousStep])

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return <PersonalInfoStep />
      case 2:
        return <ServiceDetailsStep />
      case 3:
        return <PropertyInfoStep />
      case 4:
        return <ScheduleStep />
      case 5:
        return <ReviewStep />
      default:
        return null
    }
  }

  return (
    <div className="space-y-8">
      <PowerSurge trigger={surgeTrigger} />

      <StepIndicator
        steps={STEPS}
        currentStep={currentStep}
        completedSteps={completedSteps}
        onStepClick={(step) => {
          if (step <= currentStep) {
            goToStep(step)
          }
        }}
      />

      {/* Step Content with Animation */}
      <div className="max-w-4xl mx-auto w-full">
        <div className="bg-card border border-border rounded-lg p-6 sm:p-8 min-h-[500px] relative overflow-hidden">
          <div className="absolute inset-0 opacity-5 pointer-events-none">
            <div className="absolute inset-0 bg-gradient-to-br from-accent/20 via-transparent to-accent/20" />
          </div>

          <div className="relative">
            <AnimatePresence mode="wait">
              <div key={currentStep}>{renderStep()}</div>
            </AnimatePresence>
          </div>
        </div>

        <div className="p-4 bg-accent/10 border border-accent/30 rounded-lg mt-6">
          <p className="text-sm font-semibold text-foreground mb-2">Electric Animation System</p>
          <ul className="text-sm text-muted-foreground space-y-1">
            <li>• Light bulb powers up as you progress through steps</li>
            <li>• Lightning arcs flow between completed steps</li>
            <li>• Electric current animates around active step border</li>
            <li>• Small sparks burst when current completes the circuit</li>
            <li>• Power surge flash effect on step completion</li>
            <li>• All animations respect prefers-reduced-motion</li>
          </ul>
        </div>
      </div>
    </div>
  )
}
