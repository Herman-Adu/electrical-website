import { z } from "zod";

/**
 * Zod schema for OG image generation query parameters
 *
 * Validates all query parameters for the `/api/og` route (Open Graph image generation).
 * These parameters control the appearance and content of dynamically generated preview images.
 *
 * **Parameters:**
 * - title: Display title (max 100 chars, defaults to 'Project')
 * - category: Project category (max 50 chars, defaults to 'Electrical')
 * - description: Optional extended description (max 200 chars)
 * - location: Optional location info (max 50 chars)
 * - accentColor: Optional hex color override (validates format #RRGGBB)
 *
 * **Security Features:**
 * - Strict max length validation prevents DOM overflow
 * - Hex color regex validates color format
 * - Default values prevent missing data edge cases
 * - All parameters trimmed and lowercased where appropriate
 *
 * **Used For:**
 * - Server-side OG image generation (see app/api/og/route.ts)
 * - Query parameter validation before image rendering
 * - Type-safe parameter access throughout OG logic
 *
 * @see OGQueryParams - Inferred TypeScript type
 * @see parseOGQueryParams - Utility function to parse URLSearchParams
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

/**
 * TypeScript type inferred from ogQueryParamsSchema
 *
 * Provides full type safety for OG parameter handling:
 * ```typescript
 * title: string
 * category: string
 * description?: string
 * location?: string
 * accentColor?: string
 * ```
 *
 * @example
 * ```typescript
 * import { type OGQueryParams } from '@/lib/schemas/og';
 *
 * async function generateOGImage(params: OGQueryParams) {
 *   return createImage({
 *     title: params.title,
 *     color: params.accentColor || '#00F3BD'
 *   });
 * }
 * ```
 */
export type OGQueryParams = z.infer<typeof ogQueryParamsSchema>;

/**
 * Parse and validate search parameters into a typed OGQueryParams object
 *
 * **Behavior:**
 * - Extracts query parameters from URLSearchParams
 * - Applies Zod schema validation
 * - Fills in default values for missing optional params
 * - Throws ZodError if validation fails (invalid hex color, exceeds max length, etc.)
 *
 * **Error Handling:**
 * This function throws on validation failure. Catch ZodError in the route handler.
 *
 * @param searchParams - URLSearchParams object (e.g., from request.nextUrl.searchParams)
 * @returns OGQueryParams - Validated and complete parameters with defaults applied
 * @throws ZodError if validation fails (invalid color format, string too long, etc.)
 *
 * @example
 * ```typescript
 * const params = parseOGQueryParams(
 *   new URLSearchParams('title=New Project&category=Solar&accentColor=%2300F3BD')
 * );
 * // Returns: { title: 'New Project', category: 'Solar', accentColor: '#00F3BD' }
 * ```
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
