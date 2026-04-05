/**
 * QUOTATION FORM STORE
 *
 * Zustand store for managing quotation form state.
 * Persists data to localStorage for recovery.
 */

import { create } from "zustand";
import { persist } from "zustand/middleware";
import { FORM_CONSTANTS } from "@/lib/constants";
import type {
  QuotationContactInput,
  QuotationProjectTypeInput,
  QuotationScopeInput,
  QuotationSiteInput,
  QuotationBudgetInput,
  QuotationAdditionalInput,
} from "../schemas/quotation-schemas";

interface QuotationFormState {
  // Step data
  contact: Partial<QuotationContactInput>;
  projectType: Partial<QuotationProjectTypeInput>;
  scope: Partial<QuotationScopeInput>;
  site: Partial<QuotationSiteInput>;
  budget: Partial<QuotationBudgetInput>;
  additional: Partial<QuotationAdditionalInput>;

  // Navigation
  currentStep: number;
  isSubmitting: boolean;
  isComplete: boolean;

  // Turnstile state (ephemeral, never persisted)
  turnstileToken: string | null;
  turnstileError: string | null;

  // Actions
  updateContact: (data: Partial<QuotationContactInput>) => void;
  updateProjectType: (data: Partial<QuotationProjectTypeInput>) => void;
  updateScope: (data: Partial<QuotationScopeInput>) => void;
  updateSite: (data: Partial<QuotationSiteInput>) => void;
  updateBudget: (data: Partial<QuotationBudgetInput>) => void;
  updateAdditional: (data: Partial<QuotationAdditionalInput>) => void;

  nextStep: () => void;
  previousStep: () => void;
  goToStep: (step: number) => void;

  setSubmitting: (isSubmitting: boolean) => void;
  setComplete: (isComplete: boolean) => void;
  setTurnstileToken: (token: string | null) => void;
  setTurnstileError: (error: string | null) => void;

  resetForm: () => void;
  getCompleteFormData: () => {
    contact: Partial<QuotationContactInput>;
    projectType: Partial<QuotationProjectTypeInput>;
    scope: Partial<QuotationScopeInput>;
    site: Partial<QuotationSiteInput>;
    budget: Partial<QuotationBudgetInput>;
    additional: Partial<QuotationAdditionalInput>;
    turnstileToken: string;
  };
}

const initialState = {
  contact: {},
  projectType: {},
  scope: { services: [] },
  site: {},
  budget: {},
  additional: { complianceRequirements: [] },
  currentStep: 0,
  isSubmitting: false,
  isComplete: false,
  turnstileToken: null,
  turnstileError: null,
};

export const useQuotationStore = create<QuotationFormState>()(
  persist(
    (set, get) => ({
      ...initialState,

      updateContact: (data) =>
        set((state) => ({
          contact: { ...state.contact, ...data },
        })),

      updateProjectType: (data) =>
        set((state) => ({
          projectType: { ...state.projectType, ...data },
        })),

      updateScope: (data) =>
        set((state) => ({
          scope: { ...state.scope, ...data },
        })),

      updateSite: (data) =>
        set((state) => ({
          site: { ...state.site, ...data },
        })),

      updateBudget: (data) =>
        set((state) => ({
          budget: { ...state.budget, ...data },
        })),

      updateAdditional: (data) =>
        set((state) => ({
          additional: { ...state.additional, ...data },
        })),

      nextStep: () =>
        set((state) => ({
          currentStep: Math.min(
            state.currentStep + 1,
            FORM_CONSTANTS.QUOTATION_FORM_MAX_STEP,
          ),
        })),

      previousStep: () =>
        set((state) => ({
          currentStep: Math.max(
            state.currentStep - 1,
            FORM_CONSTANTS.QUOTATION_FORM_MIN_STEP,
          ),
        })),

      goToStep: (step) =>
        set({
          currentStep: Math.max(
            FORM_CONSTANTS.QUOTATION_FORM_MIN_STEP,
            Math.min(step, FORM_CONSTANTS.QUOTATION_FORM_MAX_STEP),
          ),
        }),

      setSubmitting: (isSubmitting) => set({ isSubmitting }),

      setComplete: (isComplete) => set({ isComplete }),

      setTurnstileToken: (token) =>
        set({
          turnstileToken: token,
          turnstileError: null,
        }),

      setTurnstileError: (error) =>
        set({
          turnstileError: error,
        }),

      resetForm: () => set(initialState),

      getCompleteFormData: () => {
        const state = get();
        return {
          contact: state.contact,
          projectType: state.projectType,
          scope: state.scope,
          site: state.site,
          budget: state.budget,
          additional: state.additional,
          turnstileToken: state.turnstileToken || "",
        };
      },
    }),
    {
      name: "quotation-form-storage",
      partialize: (state) => ({
        contact: state.contact,
        projectType: state.projectType,
        scope: state.scope,
        site: state.site,
        budget: state.budget,
        additional: state.additional,
        currentStep: state.currentStep,
      }),
    },
  ),
);
