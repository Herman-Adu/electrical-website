import { create } from "zustand";
import { persist } from "zustand/middleware";
import type {
  ServiceContactInput,
  ServiceDetailsInput,
  PropertyInfoInput,
} from "../schemas/service-request-schemas";

interface ServiceRequestStoreState {
  contact: Partial<ServiceContactInput>;
  serviceDetails: Partial<ServiceDetailsInput>;
  propertyInfo: Partial<PropertyInfoInput>;

  currentStep: number;
  isSubmitting: boolean;
  isComplete: boolean;

  turnstileToken: string | null;
  turnstileError: string | null;

  updateContact: (data: Partial<ServiceContactInput>) => void;
  updateServiceDetails: (data: Partial<ServiceDetailsInput>) => void;
  updatePropertyInfo: (data: Partial<PropertyInfoInput>) => void;

  nextStep: () => void;
  previousStep: () => void;
  goToStep: (step: number) => void;

  setSubmitting: (value: boolean) => void;
  setComplete: (value: boolean) => void;
  setTurnstileToken: (token: string | null) => void;
  setTurnstileError: (error: string | null) => void;

  resetForm: () => void;
  getCompleteFormData: () => {
    contact: Partial<ServiceContactInput>;
    serviceDetails: Partial<ServiceDetailsInput>;
    propertyInfo: Partial<PropertyInfoInput>;
    turnstileToken: string;
  };
}

const MAX_STEP = 3;
const MIN_STEP = 0;

const initialState = {
  contact: {},
  serviceDetails: {},
  propertyInfo: {
    preferredTimeSlot: "anytime" as const,
    flexibleScheduling: false,
  },
  currentStep: 0,
  isSubmitting: false,
  isComplete: false,
  turnstileToken: null,
  turnstileError: null,
};

export const useServiceRequestStore = create<ServiceRequestStoreState>()(
  persist(
    (set, get) => ({
      ...initialState,

      updateContact: (data) =>
        set((state) => ({
          contact: { ...state.contact, ...data },
        })),

      updateServiceDetails: (data) =>
        set((state) => ({
          serviceDetails: { ...state.serviceDetails, ...data },
        })),

      updatePropertyInfo: (data) =>
        set((state) => ({
          propertyInfo: { ...state.propertyInfo, ...data },
        })),

      nextStep: () =>
        set((state) => ({
          currentStep: Math.min(state.currentStep + 1, MAX_STEP),
        })),

      previousStep: () =>
        set((state) => ({
          currentStep: Math.max(state.currentStep - 1, MIN_STEP),
        })),

      goToStep: (step) =>
        set({
          currentStep: Math.max(MIN_STEP, Math.min(step, MAX_STEP)),
        }),

      setSubmitting: (isSubmitting) => set({ isSubmitting }),
      setComplete: (isComplete) => set({ isComplete }),

      setTurnstileToken: (token) =>
        set({
          turnstileToken: token,
          turnstileError: null,
        }),

      setTurnstileError: (turnstileError) => set({ turnstileError }),

      resetForm: () => set(initialState),

      getCompleteFormData: () => {
        const state = get();
        return {
          contact: state.contact,
          serviceDetails: state.serviceDetails,
          propertyInfo: state.propertyInfo,
          turnstileToken: state.turnstileToken || "",
        };
      },
    }),
    {
      name: "service-request-form-storage",
      partialize: (state) => ({
        contact: state.contact,
        serviceDetails: state.serviceDetails,
        propertyInfo: state.propertyInfo,
        currentStep: state.currentStep,
      }),
    },
  ),
);
