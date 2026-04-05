/**
 * Contact Form Zustand Store
 *
 * Manages state for the multi-step contact form
 * with persistence to localStorage
 */

import { create } from "zustand";
import { persist } from "zustand/middleware";
import { FORM_CONSTANTS } from "@/lib/constants";
import type {
  ContactInfoInput,
  InquiryTypeInput,
  ReferenceLinkingInput,
  MessageDetailsInput,
  CompleteContactFormInput,
} from "../schemas/contact-schemas";

interface ContactFormState {
  // Current step (1-5)
  currentStep: number;

  // Form data by step
  contactInfo: Partial<ContactInfoInput>;
  inquiryType: Partial<InquiryTypeInput>;
  referenceLinking: Partial<ReferenceLinkingInput>;
  messageDetails: Partial<MessageDetailsInput>;

  // Turnstile state (ephemeral, never persisted)
  turnstileToken: string | null;
  turnstileError: string | null;

  // Submission state
  isSubmitting: boolean;
  isSubmitted: boolean;
  submissionError: string | null;
  contactReferenceId: string | null;

  // Actions
  setCurrentStep: (step: number) => void;
  nextStep: () => void;
  prevStep: () => void;

  updateContactInfo: (data: Partial<ContactInfoInput>) => void;
  updateInquiryType: (data: Partial<InquiryTypeInput>) => void;
  updateReferenceLinking: (data: Partial<ReferenceLinkingInput>) => void;
  updateMessageDetails: (data: Partial<MessageDetailsInput>) => void;
  setTurnstileToken: (token: string | null) => void;
  setTurnstileError: (error: string | null) => void;

  getCompleteFormData: () => CompleteContactFormInput;

  setSubmitting: (isSubmitting: boolean) => void;
  setSubmitted: (isSubmitted: boolean, referenceId?: string) => void;
  setSubmissionError: (error: string | null) => void;

  resetForm: () => void;
}

const initialState = {
  currentStep: 1,
  contactInfo: {},
  inquiryType: {
    inquiryType: "general-inquiry" as const,
    sector: "not-applicable" as const,
    priority: "normal" as const,
  },
  referenceLinking: {
    hasExistingReference: false,
    referenceType: "none" as const,
  },
  messageDetails: {
    preferredContactMethod: "either" as const,
    bestTimeToContact: "anytime" as const,
    newsletterOptIn: false,
  },
  turnstileToken: null,
  turnstileError: null,
  isSubmitting: false,
  isSubmitted: false,
  submissionError: null,
  contactReferenceId: null,
};

export const useContactStore = create<ContactFormState>()(
  persist(
    (set, get) => ({
      ...initialState,

      setCurrentStep: (step) => set({ currentStep: step }),

      nextStep: () =>
        set((state) => ({
          currentStep: Math.min(
            state.currentStep + 1,
            FORM_CONSTANTS.CONTACT_FORM_MAX_STEP,
          ),
        })),

      prevStep: () =>
        set((state) => ({
          currentStep: Math.max(
            state.currentStep - 1,
            FORM_CONSTANTS.CONTACT_FORM_MIN_STEP,
          ),
        })),

      updateContactInfo: (data) =>
        set((state) => ({
          contactInfo: { ...state.contactInfo, ...data },
        })),

      updateInquiryType: (data) =>
        set((state) => ({
          inquiryType: { ...state.inquiryType, ...data },
        })),

      updateReferenceLinking: (data) =>
        set((state) => ({
          referenceLinking: { ...state.referenceLinking, ...data },
        })),

      updateMessageDetails: (data) =>
        set((state) => ({
          messageDetails: { ...state.messageDetails, ...data },
        })),

      setTurnstileToken: (token) =>
        set({
          turnstileToken: token,
          turnstileError: null,
        }),

      setTurnstileError: (error) =>
        set({
          turnstileError: error,
        }),

      getCompleteFormData: () => {
        const state = get();
        return {
          contactInfo: state.contactInfo as ContactInfoInput,
          inquiryType: state.inquiryType as InquiryTypeInput,
          referenceLinking: state.referenceLinking as ReferenceLinkingInput,
          messageDetails: state.messageDetails as MessageDetailsInput,
          turnstileToken: state.turnstileToken || "",
        };
      },

      setSubmitting: (isSubmitting) => set({ isSubmitting }),

      setSubmitted: (isSubmitted, referenceId) =>
        set(
          isSubmitted
            ? {
                // On success: persist reset so navigating away and back shows a blank form
                isSubmitted: true,
                contactReferenceId: referenceId || null,
                currentStep: 1,
                contactInfo: initialState.contactInfo,
                inquiryType: initialState.inquiryType,
                referenceLinking: initialState.referenceLinking,
                messageDetails: initialState.messageDetails,
              }
            : {
                isSubmitted: false,
                contactReferenceId: referenceId || null,
              },
        ),

      setSubmissionError: (error) => set({ submissionError: error }),

      resetForm: () =>
        set({
          ...initialState,
          turnstileToken: null,
          turnstileError: null,
        }),
    }),
    {
      name: "contact-form-storage",
      partialize: (state) => ({
        currentStep: state.currentStep,
        contactInfo: state.contactInfo,
        inquiryType: state.inquiryType,
        referenceLinking: state.referenceLinking,
        messageDetails: state.messageDetails,
      }),
    },
  ),
);
