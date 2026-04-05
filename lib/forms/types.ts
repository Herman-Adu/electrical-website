/**
 * GENERIC MULTI-STEP FORM TYPES
 *
 * These types define the configuration-driven form infrastructure
 * that both electrical service and quotation forms will use.
 */

import type { ReactNode } from "react";

// Generic step configuration
export interface FormStepConfig {
  id: string;
  title: string;
  description?: string;
  icon?: ReactNode;
}

// Form configuration
export interface MultiStepFormConfig {
  id: string;
  title: string;
  description: string;
  steps: FormStepConfig[];
  storageKey: string;
}

// Generic form state
export interface FormStepState {
  currentStep: number;
  totalSteps: number;
  isComplete: boolean;
}

export type FormFieldErrors<TField extends string = string> = Partial<
  Record<TField, string[]>
>;

export interface TurnstileFormState {
  turnstileToken: string | null;
  turnstileError: string | null;
}

export interface MultiStepActionState<
  TSuccessData = { referenceId: string },
  TField extends string = string,
> {
  success: boolean;
  error?: string;
  fieldErrors?: FormFieldErrors<TField>;
  data?: TSuccessData;
}

export interface MultiStepFormDefinition<TStepId extends string = string> {
  id: string;
  title: string;
  description?: string;
  steps: Array<FormStepConfig & { id: TStepId }>;
}

// Step component props interface
export interface StepComponentProps<T = Record<string, unknown>> {
  onNext: () => void;
  onPrevious: () => void;
  onUpdate: (data: Partial<T>) => void;
  formData: T;
  isFirstStep: boolean;
  isLastStep: boolean;
}

// Form submission result
export interface FormSubmissionResult {
  success: boolean;
  error?: string;
  fieldErrors?: Record<string, string[]>;
  data?: {
    referenceId: string;
    message: string;
  };
}

export type MultiStepSubmissionResult<
  TData = FormSubmissionResult["data"],
  TField extends string = string,
> = {
  success: boolean;
  error?: string;
  fieldErrors?: FormFieldErrors<TField>;
  data?: TData;
};

// Contact information - shared across forms
export interface ContactInfo {
  fullName: string;
  email: string;
  phone: string;
  company?: string;
}

// Address information - shared across forms
export interface AddressInfo {
  addressLine1: string;
  addressLine2?: string;
  city: string;
  county?: string;
  postcode: string;
}

// Schedule preferences - shared across forms
export interface SchedulePreferences {
  preferredDate: string;
  alternativeDate?: string;
  preferredTime: string;
  flexibleScheduling: boolean;
}
