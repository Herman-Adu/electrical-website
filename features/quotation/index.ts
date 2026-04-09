/**
 * FEATURE: Quotation
 * Public API - All imports from this feature should use this barrel file.
 *
 * Usage: import { QuotationFormContainer } from "@/features/quotation"
 */

// Components (Atomic Design Structure)
export { QuotationFormContainer } from "./components/organisms/quotation-form-container";
export { ProjectTypeStep } from "./components/organisms/quotation-steps/project-type-step";
export { ProjectScopeStep } from "./components/organisms/quotation-steps/project-scope-step";
export { BudgetTimelineStep } from "./components/organisms/quotation-steps/budget-timeline-step";
export { AdditionalRequirementsStep } from "./components/organisms/quotation-steps/additional-requirements-step";
export { QuotationReviewStep } from "./components/organisms/quotation-steps/quotation-review-step";

// Hooks
export { useQuotationStore } from "./hooks/use-quotation-store";

// Schemas & Types
export {
  completeQuotationSchema,
  quotationProjectTypeSchema,
  quotationScopeSchema,
  quotationBudgetSchema,
  quotationAdditionalSchema,
  type CompleteQuotationInput,
  type QuotationContactInput,
  type QuotationProjectTypeInput,
  type QuotationScopeInput,
  type QuotationSiteInput,
  type QuotationBudgetInput,
  type QuotationAdditionalInput,
} from "./schemas/quotation-schemas";

// API / Actions
export { submitQuotationRequest } from "./api/quotation-request";
