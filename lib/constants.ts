/**
 * Application Constants
 * 
 * Centralized location for all magic numbers, configuration values,
 * and shared constants used throughout the application.
 */

// Form Configuration
export const FORM_CONSTANTS = {
  /** Total number of steps in the quotation form (0-indexed: 0-6) */
  QUOTATION_FORM_STEPS: 7,
  QUOTATION_FORM_MIN_STEP: 0,
  QUOTATION_FORM_MAX_STEP: 6,
  /** Total number of steps in the contact form (1-indexed: 1-5) */
  CONTACT_FORM_STEPS: 5,
  CONTACT_FORM_MIN_STEP: 1,
  CONTACT_FORM_MAX_STEP: 5,
  /** Total number of steps in the general form (1-indexed: 1-5) */
  GENERAL_FORM_STEPS: 5,
  GENERAL_FORM_MIN_STEP: 1,
  GENERAL_FORM_MAX_STEP: 5,
  /** Maximum file size for uploads (5MB) */
  MAX_FILE_SIZE: 5 * 1024 * 1024,
  /** Allowed file types for uploads */
  ALLOWED_FILE_TYPES: ["image/jpeg", "image/png", "application/pdf"],
} as const

// Validation Limits
export const VALIDATION_LIMITS = {
  /** Maximum length for text inputs */
  TEXT_MAX_LENGTH: 1000,
  /** Maximum length for email */
  EMAIL_MAX_LENGTH: 254,
  /** Maximum length for phone */
  PHONE_MAX_LENGTH: 20,
  /** Maximum length for address */
  ADDRESS_MAX_LENGTH: 200,
  /** Maximum length for postcode */
  POSTCODE_MAX_LENGTH: 10,
  /** Minimum length for name */
  NAME_MIN_LENGTH: 2,
  /** Maximum length for name */
  NAME_MAX_LENGTH: 100,
  /** Minimum length for message */
  MESSAGE_MIN_LENGTH: 10,
  /** Maximum length for message */
  MESSAGE_MAX_LENGTH: 2000,
} as const

// Reference ID Prefixes
export const REFERENCE_PREFIXES = {
  /** Contact request reference prefix */
  CONTACT: "CR",
  /** Quotation request reference prefix */
  QUOTATION: "QR",
  /** Invoice reference prefix */
  INVOICE: "INV",
  /** Job reference prefix */
  JOB: "JOB",
} as const

// Rate Limiting Configuration
export const RATE_LIMITS = {
  /** Form submission: requests per window */
  FORM_SUBMISSION: {
    maxRequests: 5,
    windowMs: 60 * 1000, // 1 minute
  },
  /** Contact form: requests per window */
  CONTACT_FORM: {
    maxRequests: 3,
    windowMs: 60 * 1000, // 1 minute
  },
  /** Quotation request: requests per window */
  QUOTATION_REQUEST: {
    maxRequests: 3,
    windowMs: 5 * 60 * 1000, // 5 minutes
  },
} as const

// API Configuration
export const API_CONFIG = {
  /** Default timeout for API requests (ms) */
  DEFAULT_TIMEOUT: 30000,
  /** Maximum retry attempts */
  MAX_RETRIES: 3,
  /** Retry delay (ms) */
  RETRY_DELAY: 1000,
} as const

// UI Configuration
export const UI_CONFIG = {
  /** Toast auto-dismiss duration (ms) */
  TOAST_DURATION: 5000,
  /** Animation duration (ms) */
  ANIMATION_DURATION: 200,
  /** Debounce delay for search (ms) */
  SEARCH_DEBOUNCE: 300,
  /** Mobile breakpoint (px) */
  MOBILE_BREAKPOINT: 768,
  /** Tablet breakpoint (px) */
  TABLET_BREAKPOINT: 1024,
} as const

// Error Messages
export const ERROR_MESSAGES = {
  GENERIC: "An unexpected error occurred. Please try again.",
  VALIDATION_FAILED: "Please check the form for errors.",
  RATE_LIMITED: "Too many requests. Please wait a moment before trying again.",
  NETWORK_ERROR: "Network error. Please check your connection.",
  EMAIL_FAILED: "Failed to send email. Please try again later.",
  NOT_FOUND: "The requested resource was not found.",
  UNAUTHORIZED: "You are not authorized to perform this action.",
} as const

// Success Messages
export const SUCCESS_MESSAGES = {
  FORM_SUBMITTED: "Your request has been submitted successfully.",
  EMAIL_SENT: "Email sent successfully.",
  SAVED: "Changes saved successfully.",
} as const
