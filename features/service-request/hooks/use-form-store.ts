/**
 * FORM STATE MANAGEMENT WITH ZUSTAND
 *
 * This store manages the entire multi-step form state using Zustand.
 * Zustand was chosen over useReducer for several reasons:
 *
 * 1. Cleaner API - No need for action types and reducer boilerplate
 * 2. Easy persistence - Can sync to localStorage automatically
 * 3. Better performance - Components only re-render when their specific slice changes
 * 4. DevTools support - Easy debugging with Redux DevTools
 *
 * ARCHITECTURE:
 * - State is divided into 5 step categories matching the form flow
 * - Each step has its own update function for type safety
 * - Navigation methods (nextStep, prevStep, goToStep) handle step transitions
 * - Reset function clears all data (useful for "start over" functionality)
 */

import { create } from "zustand";
import { persist } from "zustand/middleware";
import { FORM_CONSTANTS } from "@/lib/constants";

// Step 1: Personal Information
export interface PersonalInfo {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
}

// Step 2: Service Details
export interface ServiceDetails {
  serviceType: string;
  urgency: "routine" | "urgent" | "emergency";
  description: string;
}

// Step 3: Property Information
export interface PropertyInfo {
  address: string;
  city: string;
  state: string;
  zipCode: string;
  propertyType: "residential" | "commercial";
  accessInstructions?: string;
}

// Step 4: Schedule Preferences
export interface SchedulePreferences {
  preferredDate: string;
  preferredTimeSlot: "morning" | "afternoon" | "evening";
  alternativeDate?: string;
  flexibleScheduling: boolean;
}

// Complete form data structure
export interface FormData {
  personalInfo: PersonalInfo;
  serviceDetails: ServiceDetails;
  propertyInfo: PropertyInfo;
  schedulePreferences: SchedulePreferences;
  gdprConsent: boolean;
}

// Store state interface
interface FormStore {
  // Current step (1-5)
  currentStep: number;

  // Form data for each step
  data: FormData;

  // Actions
  updatePersonalInfo: (data: Partial<PersonalInfo>) => void;
  updateServiceDetails: (data: Partial<ServiceDetails>) => void;
  updatePropertyInfo: (data: Partial<PropertyInfo>) => void;
  updateSchedulePreferences: (data: Partial<SchedulePreferences>) => void;
  updateGdprConsent: (accepted: boolean) => void;

  // Navigation
  nextStep: () => void;
  prevStep: () => void;
  goToStep: (step: number) => void;

  // Utility
  resetForm: () => void;
  isStepComplete: (step: number) => boolean;
}

// Initial state
const initialData: FormData = {
  personalInfo: {
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
  },
  serviceDetails: {
    serviceType: "",
    urgency: "routine",
    description: "",
  },
  propertyInfo: {
    address: "",
    city: "",
    state: "",
    zipCode: "",
    propertyType: "residential",
    accessInstructions: "",
  },
  schedulePreferences: {
    preferredDate: "",
    preferredTimeSlot: "morning",
    alternativeDate: "",
    flexibleScheduling: false,
  },
  gdprConsent: false,
};

/**
 * ZUSTAND STORE CREATION
 *
 * The persist middleware automatically saves form data to localStorage.
 * This means users won't lose their progress if they refresh the page.
 */
export const useFormStore = create<FormStore>()(
  persist(
    (set, get) => ({
      currentStep: 1,
      data: initialData,

      updatePersonalInfo: (data) =>
        set((state) => ({
          data: {
            ...state.data,
            personalInfo: { ...state.data.personalInfo, ...data },
          },
        })),

      updateServiceDetails: (data) =>
        set((state) => ({
          data: {
            ...state.data,
            serviceDetails: { ...state.data.serviceDetails, ...data },
          },
        })),

      updatePropertyInfo: (data) =>
        set((state) => ({
          data: {
            ...state.data,
            propertyInfo: { ...state.data.propertyInfo, ...data },
          },
        })),

      updateSchedulePreferences: (data) =>
        set((state) => ({
          data: {
            ...state.data,
            schedulePreferences: { ...state.data.schedulePreferences, ...data },
          },
        })),

      updateGdprConsent: (accepted) =>
        set((state) => ({
          data: {
            ...state.data,
            gdprConsent: accepted,
          },
        })),

      nextStep: () =>
        set((state) => ({
          currentStep: Math.min(
            state.currentStep + 1,
            FORM_CONSTANTS.GENERAL_FORM_MAX_STEP,
          ),
        })),

      prevStep: () =>
        set((state) => ({
          currentStep: Math.max(
            state.currentStep - 1,
            FORM_CONSTANTS.GENERAL_FORM_MIN_STEP,
          ),
        })),

      goToStep: (step) =>
        set(() => ({
          currentStep: Math.max(
            FORM_CONSTANTS.GENERAL_FORM_MIN_STEP,
            Math.min(step, FORM_CONSTANTS.GENERAL_FORM_MAX_STEP),
          ),
        })),

      resetForm: () =>
        set(() => ({
          currentStep: 1,
          data: initialData,
        })),

      /**
       * Validates if a step has minimum required data
       * Used to enable/disable navigation and show completion indicators
       */
      isStepComplete: (step) => {
        const { data } = get();

        switch (step) {
          case 1:
            return !!(
              data.personalInfo.firstName &&
              data.personalInfo.lastName &&
              data.personalInfo.email &&
              data.personalInfo.phone
            );
          case 2:
            return !!(
              data.serviceDetails.serviceType && data.serviceDetails.description
            );
          case 3:
            return !!(
              data.propertyInfo.address &&
              data.propertyInfo.city &&
              data.propertyInfo.state &&
              data.propertyInfo.zipCode
            );
          case 4:
            return !!(
              data.schedulePreferences.preferredDate &&
              data.schedulePreferences.preferredTimeSlot
            );
          case 5:
            // Review step is always "complete" if reached
            return true;
          default:
            return false;
        }
      },
    }),
    {
      name: "electrical-service-form", // localStorage key
    },
  ),
);
