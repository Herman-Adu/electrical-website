/**
 * Contact Feature - Public API
 * 
 * Export all public components, hooks, and types for the contact feature
 */

// Components (Atomic Design Structure)
export { ContactFormContainer } from "./components/organisms/contact-form-container"
export { ContactSuccessMessage } from "./components/molecules/contact-success-message"
export { ContactInfoStep } from "./components/organisms/contact-steps/contact-info-step"
export { InquiryTypeStep } from "./components/organisms/contact-steps/inquiry-type-step"
export { ReferenceLinkingStep } from "./components/organisms/contact-steps/reference-linking-step"
export { MessageDetailsStep } from "./components/organisms/contact-steps/message-details-step"
export { ContactReviewStep } from "./components/organisms/contact-steps/contact-review-step"

// Actions
export { submitContactRequest } from "./api/contact-request"

// Schemas & Types
export {
  contactInfoSchema,
  inquiryTypeSchema,
  referenceLinkingSchema,
  messageDetailsSchema,
  completeContactFormSchema,
  serverContactFormSchema,
  type ContactInfoInput,
  type InquiryTypeInput,
  type ReferenceLinkingInput,
  type MessageDetailsInput,
  type CompleteContactFormInput,
  type ServerContactFormInput,
} from "./schemas/contact-schemas"

// Hooks
export { useContactStore } from "./hooks/use-contact-store"

// Email Service (internal, but exported for testing)
export { sendContactEmails } from "./api/contact-email-service"
