import { z } from "zod";

/**
 * Contact Form Validation Schema
 *
 * Used for both client-side validation and server-side verification.
 * Ensures data integrity and type safety throughout the contact flow.
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

export type ContactFormData = z.infer<typeof contactFormSchema>;

/**
 * Server-side response type for contact submission
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
