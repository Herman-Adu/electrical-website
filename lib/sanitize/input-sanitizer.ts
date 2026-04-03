/**
 * INPUT SANITIZATION LAYER
 *
 * Prevents XSS attacks by sanitizing user inputs.
 * Used before storing or displaying user-generated content.
 */

export const sanitizeInput = {
  /**
   * Sanitize text input - removes HTML tags and dangerous characters
   */
  text: (input: string): string => {
    if (!input) return ""

    return input
      .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, "") // Remove script tags
      .replace(/<iframe\b[^<]*(?:(?!<\/iframe>)<[^<]*)*<\/iframe>/gi, "") // Remove iframe tags
      .replace(/on\w+\s*=\s*["'][^"']*["']/gi, "") // Remove event handlers
      .replace(/javascript:/gi, "") // Remove javascript: protocol
      .trim()
      .substring(0, 1000) // Limit length
  },

  /**
   * Sanitize email - strict validation
   */
  email: (input: string): string => {
    if (!input) return ""
    return input.toLowerCase().trim().substring(0, 254)
  },

  /**
   * Sanitize phone - remove all non-numeric characters except +
   */
  phone: (input: string): string => {
    if (!input) return ""
    return input
      .replace(/[^\d+\s()-]/g, "")
      .trim()
      .substring(0, 20)
  },

  /**
   * Sanitize address components
   */
  address: (input: string): string => {
    if (!input) return ""
    return input
      .replace(/<[^>]*>/g, "") // Remove HTML tags
      .trim()
      .substring(0, 200)
  },

  /**
   * Sanitize postcode - UK format only
   */
  postcode: (input: string): string => {
    if (!input) return ""
    return input
      .toUpperCase()
      .replace(/[^A-Z0-9\s]/g, "")
      .trim()
      .substring(0, 10)
  },
}
