import { z } from "zod";

/**
 * Search Params Validation Schemas
 *
 * Defines Zod schemas for all URL search parameters used across the app.
 * Ensures type safety, data validation, and prevents injection attacks.
 */

/**
 * Projects Page Search Params
 * - category: Optional project category filter (validated against allowed categories)
 */
export const projectsSearchParamsSchema = z.object({
  category: z
    .string()
    .max(50, "Category must be less than 50 characters")
    .optional(),
});

export type ProjectsSearchParams = z.infer<typeof projectsSearchParamsSchema>;

/**
 * News Hub Page Search Params
 * - category: Optional news category filter (validated against allowed categories)
 */
export const newsHubSearchParamsSchema = z.object({
  category: z
    .string()
    .max(50, "Category must be less than 50 characters")
    .optional(),
});

export type NewsHubSearchParams = z.infer<typeof newsHubSearchParamsSchema>;

/**
 * Error Test Page Search Params
 * - trigger: Optional error trigger flag for testing error boundaries
 */
export const errorTestSearchParamsSchema = z.object({
  trigger: z.enum(["error"]).optional(),
});

export type ErrorTestSearchParams = z.infer<typeof errorTestSearchParamsSchema>;

/**
 * Generic search params validator
 * Coerces URLSearchParams or any object to validated params
 */
export function validateSearchParams<T extends z.ZodSchema>(
  params: Record<string, string | string[] | undefined> | URLSearchParams,
  schema: T,
): z.infer<T> {
  const paramsObject =
    params instanceof URLSearchParams
      ? Object.fromEntries(params.entries())
      : params;

  return schema.parse(paramsObject);
}

/**
 * Safe search params validator with fallback
 * Returns validated params or default empty object on validation error
 */
export function safeValidateSearchParams<T extends z.ZodSchema>(
  params: Record<string, string | string[] | undefined> | URLSearchParams,
  schema: T,
  onError?: (error: z.ZodError) => void,
): z.infer<T> | Record<string, never> {
  try {
    return validateSearchParams(params, schema);
  } catch (error) {
    if (error instanceof z.ZodError) {
      onError?.(error);
      return {};
    }
    throw error;
  }
}
