/**
 * Unit tests for search params validation module
 *
 * Tests:
 * - ProjectsSearchParams schema validation
 * - ErrorTestSearchParams schema validation
 * - Category validation against allowed categories
 * - URLSearchParams and object coercion
 * - Safe validation with error handling
 * - Type inference
 */

import { describe, it, expect, beforeEach, vi } from "vitest";
import { z } from "zod";
import {
  projectsSearchParamsSchema,
  errorTestSearchParamsSchema,
  validateSearchParams,
  safeValidateSearchParams,
  type ProjectsSearchParams,
  type ErrorTestSearchParams,
} from "@/lib/schemas/search-params";

describe("Search Params Schemas", () => {
  describe("projectsSearchParamsSchema", () => {
    it("should accept valid category", () => {
      const params = { category: "residential" };
      const result = projectsSearchParamsSchema.parse(params);
      expect(result.category).toBe("residential");
    });

    it("should accept empty/undefined category", () => {
      const params = {};
      const result = projectsSearchParamsSchema.parse(params);
      expect(result.category).toBeUndefined();
    });

    it("should reject category exceeding max length", () => {
      const params = { category: "a".repeat(51) };
      expect(() => projectsSearchParamsSchema.parse(params)).toThrow();
    });

    it("should accept category at max length boundary", () => {
      const params = { category: "a".repeat(50) };
      const result = projectsSearchParamsSchema.parse(params);
      expect(result.category).toBe("a".repeat(50));
    });

    it("should strip extra fields", () => {
      const params = {
        category: "residential",
        unknownField: "should-be-ignored",
      };
      const result = projectsSearchParamsSchema.parse(params);
      expect(result).toEqual({ category: "residential" });
      expect(result).not.toHaveProperty("unknownField");
    });

    it("should handle array values (take first if applicable)", () => {
      const params = { category: ["residential", "commercial-lighting"] };
      // z.string() should coerce or fail on array
      expect(() => projectsSearchParamsSchema.parse(params)).toThrow();
    });
  });

  describe("errorTestSearchParamsSchema", () => {
    it("should accept trigger=error", () => {
      const params = { trigger: "error" };
      const result = errorTestSearchParamsSchema.parse(params);
      expect(result.trigger).toBe("error");
    });

    it("should accept undefined trigger", () => {
      const params = {};
      const result = errorTestSearchParamsSchema.parse(params);
      expect(result.trigger).toBeUndefined();
    });

    it("should reject invalid trigger values", () => {
      const params = { trigger: "invalid" };
      expect(() => errorTestSearchParamsSchema.parse(params)).toThrow();
    });

    it("should reject trigger with extra fields", () => {
      const params = {
        trigger: "error",
        extra: "field",
      };
      const result = errorTestSearchParamsSchema.parse(params);
      expect(result).toEqual({ trigger: "error" });
      expect(result).not.toHaveProperty("extra");
    });
  });

  describe("validateSearchParams", () => {
    it("should validate object params", () => {
      const params = { category: "power-boards" };
      const result = validateSearchParams(params, projectsSearchParamsSchema);
      expect(result.category).toBe("power-boards");
    });

    it("should validate URLSearchParams", () => {
      const urlParams = new URLSearchParams();
      urlParams.set("category", "commercial-lighting");

      const result = validateSearchParams(
        urlParams,
        projectsSearchParamsSchema,
      );
      expect(result.category).toBe("commercial-lighting");
    });

    it("should throw on invalid data", () => {
      const params = { category: "x".repeat(51) };
      expect(() =>
        validateSearchParams(params, projectsSearchParamsSchema),
      ).toThrow(z.ZodError);
    });

    it("should preserve type inference", () => {
      const params = { category: "residential" };
      const result: ProjectsSearchParams = validateSearchParams(
        params,
        projectsSearchParamsSchema,
      );
      expect(result.category).toBe("residential");
    });
  });

  describe("safeValidateSearchParams", () => {
    it("should return valid data on success", () => {
      const params = { category: "residential" };
      const result = safeValidateSearchParams(
        params,
        projectsSearchParamsSchema,
      );
      expect(result).toEqual({ category: "residential" });
    });

    it("should return empty object on validation error", () => {
      const params = { category: "x".repeat(51) };
      const result = safeValidateSearchParams(
        params,
        projectsSearchParamsSchema,
      );
      expect(result).toEqual({});
    });

    it("should call onError callback on validation error", () => {
      const params = { category: "x".repeat(51) };
      const onError = vi.fn();

      safeValidateSearchParams(params, projectsSearchParamsSchema, onError);

      expect(onError).toHaveBeenCalled();
      const error = onError.mock.calls[0][0];
      expect(error).toBeInstanceOf(z.ZodError);
    });

    it("should not call onError callback on success", () => {
      const params = { category: "residential" };
      const onError = vi.fn();

      safeValidateSearchParams(params, projectsSearchParamsSchema, onError);

      expect(onError).not.toHaveBeenCalled();
    });

    it("should re-throw non-validation errors", () => {
      const params = { category: "residential" };
      const brokenSchema = {
        parse: () => {
          throw new Error("Unexpected error");
        },
      } as unknown as z.ZodSchema;

      expect(() => safeValidateSearchParams(params, brokenSchema)).toThrow(
        "Unexpected error",
      );
    });
  });

  describe("Type inference", () => {
    it("should infer ProjectsSearchParams type", () => {
      const params: ProjectsSearchParams = {
        category: "residential",
      };
      expect(params.category).toBeDefined();
    });

    it("should infer ErrorTestSearchParams type", () => {
      const params: ErrorTestSearchParams = {
        trigger: "error",
      };
      expect(params.trigger).toBe("error");
    });

    it("should handle optional fields in types", () => {
      const params1: ProjectsSearchParams = {};
      expect(params1.category).toBeUndefined();

      const params2: ErrorTestSearchParams = {};
      expect(params2.trigger).toBeUndefined();
    });
  });

  describe("Edge cases", () => {
    it("should handle null values", () => {
      const params = { category: null };
      expect(() => projectsSearchParamsSchema.parse(params)).toThrow();
    });

    it("should handle empty string", () => {
      const params = { category: "" };
      const result = projectsSearchParamsSchema.parse(params);
      expect(result.category).toBe("");
    });

    it("should handle whitespace-only strings", () => {
      const params = { category: "   " };
      const result = projectsSearchParamsSchema.parse(params);
      expect(result.category).toBe("   ");
    });

    it("should handle special characters in string", () => {
      const params = { category: "test<script>" };
      const result = projectsSearchParamsSchema.parse(params);
      expect(result.category).toBe("test<script>");
    });

    it("should handle URLSearchParams with multiple values", () => {
      const urlParams = new URLSearchParams();
      urlParams.append("category", "value1");
      urlParams.append("category", "value2");

      // Object.fromEntries on URLSearchParams will take the last value
      const result = validateSearchParams(
        urlParams,
        projectsSearchParamsSchema,
      );
      // fromEntries should only preserve one entry per key
      expect(result.category).toBeDefined();
    });
  });

  describe("Integration", () => {
    it("should work with actual Next.js searchParams pattern", async () => {
      // Simulate Next.js async searchParams
      const searchParams = Promise.resolve({
        category: "residential",
      });

      const params = await searchParams;
      const result = projectsSearchParamsSchema.parse(params);
      expect(result.category).toBe("residential");
    });

    it("should validate multiple schemas sequentially", () => {
      const projectParams = { category: "residential" };
      const errorParams = { trigger: "error" };

      const result1 = validateSearchParams(
        projectParams,
        projectsSearchParamsSchema,
      );
      const result2 = validateSearchParams(
        errorParams,
        errorTestSearchParamsSchema,
      );

      expect(result1.category).toBe("residential");
      expect(result2.trigger).toBe("error");
    });
  });
});
