"use server";

import { z } from "zod";
import { isNewsCategorySlug } from "@/data/news";
import { isProjectCategorySlug } from "@/data/projects";
import {
  newsHubSearchParamsSchema,
  projectsSearchParamsSchema,
  errorTestSearchParamsSchema,
  type NewsHubSearchParams,
  type ProjectsSearchParams,
  type ErrorTestSearchParams,
} from "@/lib/schemas/search-params";

/**
 * Server Action: Validate Projects Page Search Params
 *
 * Validates and coerces search parameters for the projects page.
 * Includes additional category validation against allowed categories.
 *
 * @param params - Raw search parameters from Next.js
 * @returns Validated and safe search parameters with type safety
 * @throws ZodError if validation fails
 */
export async function validateProjectsSearchParams(
  params: Record<string, string | string[] | undefined>,
): Promise<ProjectsSearchParams> {
  const validated = projectsSearchParamsSchema.parse(params);

  // Additional validation: ensure category is in allowed list if provided
  if (validated.category && !isProjectCategorySlug(validated.category)) {
    throw new z.ZodError([
      {
        code: "custom",
        message: `Invalid category: ${validated.category}. Must be one of: all, residential, commercial-lighting, power-boards`,
        path: ["category"],
      },
    ]);
  }

  return validated;
}

/**
 * Server Action: Validate News Hub Search Params
 */
export async function validateNewsHubSearchParams(
  params: Record<string, string | string[] | undefined>,
): Promise<NewsHubSearchParams> {
  const validated = newsHubSearchParamsSchema.parse(params);

  if (
    validated.category &&
    validated.category !== "all" &&
    !isNewsCategorySlug(validated.category)
  ) {
    throw new z.ZodError([
      {
        code: "custom",
        message: `Invalid news category: ${validated.category}. Must be one of: all, residential, industrial, partners, case-studies, insights, reviews`,
        path: ["category"],
      },
    ]);
  }

  return validated;
}

/**
 * Server Action: Validate Error Test Page Search Params
 *
 * Validates search parameters for the error-test page.
 *
 * @param params - Raw search parameters from Next.js
 * @returns Validated search parameters
 * @throws ZodError if validation fails
 */
export async function validateErrorTestSearchParams(
  params: Record<string, string | string[] | undefined>,
): Promise<ErrorTestSearchParams> {
  return errorTestSearchParamsSchema.parse(params);
}

/**
 * Safe wrapper: Validates projects params or returns empty object on error
 * Logs validation errors to console for debugging
 */
export async function safeValidateProjectsParams(
  params: Record<string, string | string[] | undefined>,
): Promise<ProjectsSearchParams> {
  try {
    return await validateProjectsSearchParams(params);
  } catch (error) {
    if (error instanceof z.ZodError) {
      console.warn(
        "[SearchParams] Validation error in projects params:",
        error.flatten(),
      );
      // Return params with defaults applied
      return { category: undefined };
    }
    throw error;
  }
}

/**
 * Safe wrapper: Validates news hub params or returns empty object on error
 */
export async function safeValidateNewsHubParams(
  params: Record<string, string | string[] | undefined>,
): Promise<NewsHubSearchParams> {
  try {
    return await validateNewsHubSearchParams(params);
  } catch (error) {
    if (error instanceof z.ZodError) {
      console.warn(
        "[SearchParams] Validation error in news hub params:",
        error.flatten(),
      );
      return { category: undefined };
    }
    throw error;
  }
}

/**
 * Safe wrapper: Validates error-test params or returns empty object on error
 */
export async function safeValidateErrorTestParams(
  params: Record<string, string | string[] | undefined>,
): Promise<ErrorTestSearchParams> {
  try {
    return await validateErrorTestSearchParams(params);
  } catch (error) {
    if (error instanceof z.ZodError) {
      console.warn(
        "[SearchParams] Validation error in error-test params:",
        error.flatten(),
      );
      return { trigger: undefined };
    }
    throw error;
  }
}
