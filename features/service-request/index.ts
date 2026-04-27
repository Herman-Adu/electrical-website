/**
 * Service Request Feature - Public API
 *
 * All imports from this feature should go through this barrel file.
 * Internal implementation details are hidden behind this API.
 */

// Components (Atomic Design Structure)
export { ServiceRequestFormContainer } from "./components/organisms/service-request-form-container";
export { PersonalInfoStep } from "./components/organisms/service-request-steps/personal-info-step";
export { ServiceDetailsStep } from "./components/organisms/service-request-steps/service-details-step";
export { PropertyInfoStep } from "./components/organisms/service-request-steps/property-info-step";
export { ScheduleStep } from "./components/organisms/service-request-steps/schedule-step";
export { ReviewStep } from "./components/organisms/service-request-steps/review-step";
export { ReviewStepDisplay } from "./components/organisms/service-request-steps/review-step-display";

// Hooks
export { useFormStore } from "./hooks/use-form-store";

// API / Server Actions
export { submitServiceRequest } from "./api/service-request";
export { sendServiceRequestEmails } from "./api/email-service";

// Schemas & Types
export {
  personalInfoSchema,
  serviceDetailsSchema,
  propertyInfoSchema,
  schedulePreferencesSchema,
  type PersonalInfoInput,
  type ServiceDetailsInput,
  type PropertyInfoInput,
  type SchedulePreferencesInput,
  type ServiceRequestData,
  type CompleteFormInput,
} from "./schemas/schemas";
