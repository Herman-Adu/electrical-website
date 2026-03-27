import { z } from "zod";

/**
 * Zod schema for contact form validation
 *
 * **Validation Rules:**
 * - name: 2-100 characters, trimmed
 * - email: Valid email format, max 255 chars, trimmed, lowercased
 * - company: Optional, max 100 chars, trimmed, defaults to empty string
 * - projectType: Required enum from 5 predefined types
 * - message: 10-5000 characters, trimmed
 *
 * **Used For:**
 * - Client-side validation (ShadcnUI forms)
 * - Server-side verification (submitContactInquiry action)
 * - Type inference (ContactFormData type)
 *
 * **Security:**
 * - .trim() removes leading/trailing whitespace
 * - .toLowerCase() normalizes emails for consistency
 * - Max length constraints prevent buffer overflow attacks
 * - Enum validation prevents unexpected project types
 *
 * @see ContactFormData - Inferred TypeScript type
 * @see submitContactInquiry - Uses this schema to validate form data
 */
export const contactFormSchema = z.object({
  name: z
    .string()
    .min(2, "Name must be at least 2 characters")
    .max(100, "Name must be less than 100 characters")
    .trim(),

  email: z
    .string()
    .email("Please enter a valid email address")
    .max(255, "Email must be less than 255 characters")
    .toLowerCase()
    .trim(),

  company: z
    .string()
    .max(100, "Company name must be less than 100 characters")
    .trim()
    .optional()
    .default(""),

  projectType: z.enum(
    ["commercial", "industrial", "maintenance", "consultation", "other"],
    { message: "Please select a valid project type" },
  ),

  message: z
    .string()
    .min(10, "Message must be at least 10 characters")
    .max(5000, "Message must be less than 5000 characters")
    .trim(),
});

/**
 * TypeScript type inferred from contactFormSchema
 *
 * Provides full type safety throughout the contact form flow:
 * ```typescript
 * name: string
 * email: string
 * company: string
 * projectType: 'commercial' | 'industrial' | 'maintenance' | 'consultation' | 'other'
 * message: string
 * ```
 *
 * @example
 * import { type ContactFormData } from '@/lib/schemas/contact';
 *
 * const handleSubmit = (data: ContactFormData) => {
 *   console.log(data.name, data.email);
 * };
 */
export type ContactFormData = z.infer<typeof contactFormSchema>;

/**
 * Response type for contact form submission
 *
 * **Success case:**
 * - success: true
 * - referenceCode: Unique tracking ID for the inquiry
 * - message: Human-readable confirmation with response time estimate
 *
 * **Error cases:**
 * - success: false
 * - error: Human-readable error message
 * - field?: Name of the field with validation error (optional, only if applicable)
 *
 * @example
 * ```typescript
 * // Success
 * {
 *   success: true,
 *   referenceCode: "NEX-VO3XYRA",
 *   message: "Your inquiry has been received. Reference: NEX-VO3XYRA. Our team will respond within 24 hours."
 * }
 *
 * // Validation error
 * {
 *   success: false,
 *   error: "Please enter a valid email address",
 *   field: "email"
 * }
 *
 * // System error
 * {
 *   success: false,
 *   error: "Too many submissions. Please try again in an hour."
 * }
 * ```
 */
export type ContactResponse =
  | {
      success: true;
      referenceCode: string;
      message: string;
    }
  | {
      success: false;
      error: string;
      field?: keyof ContactFormData;
    };
