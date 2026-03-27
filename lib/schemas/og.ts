import { z } from "zod";

/**
 * OG Route Query Parameter Validation Schema
 *
 * Validates all query parameters for the /api/og dynamic image generator
 * Ensures data integrity and prevents injection attacks
 */

export const ogQueryParamsSchema = z.object({
  title: z
    .string()
    .max(100, "Title must be less than 100 characters")
    .default("Project"),

  category: z
    .string()
    .max(50, "Category must be less than 50 characters")
    .default("Electrical"),

  description: z
    .string()
    .max(200, "Description must be less than 200 characters")
    .optional(),

  location: z
    .string()
    .max(50, "Location must be less than 50 characters")
    .optional(),

  // Additional parameters for future extensibility
  accentColor: z
    .string()
    .regex(/^#[0-9A-F]{6}$/i, "Invalid hex color format")
    .optional(),
});

export type OGQueryParams = z.infer<typeof ogQueryParamsSchema>;

/**
 * Parses and validates search parameters from a URL
 * Returns validated params or throws validation error
 */
export function parseOGQueryParams(
  searchParams: URLSearchParams,
): OGQueryParams {
  const params = {
    title: searchParams.get("title") ?? undefined,
    category: searchParams.get("category") ?? undefined,
    description: searchParams.get("description") ?? undefined,
    location: searchParams.get("location") ?? undefined,
    accentColor: searchParams.get("accentColor") ?? undefined,
  };

  return ogQueryParamsSchema.parse(params);
}
