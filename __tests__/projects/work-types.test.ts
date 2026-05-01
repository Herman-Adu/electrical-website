import { describe, expect, it } from "vitest";
import { workTypes, getProjectsByWorkType } from "@/data/projects/work-types";
import { allProjects } from "@/data/projects";

describe("work type registry", () => {
  it("has 5 work types with unique slugs", () => {
    expect(workTypes).toHaveLength(5);
    const slugs = workTypes.map((w) => w.slug);
    const unique = new Set(slugs);
    expect(unique.size).toBe(5);
  });

  it("each work type has at least one tag", () => {
    workTypes.forEach((wt) => {
      expect(wt.tags.length).toBeGreaterThan(0);
    });
  });

  it("getProjectsByWorkType filters by tag overlap", () => {
    const powerBoardWt = workTypes.find((w) => w.slug === "power-boards");
    expect(powerBoardWt).toBeDefined();
    const results = getProjectsByWorkType(powerBoardWt!.slug, allProjects);
    results.forEach((p) => {
      const hasMatch = p.tags.some((t) =>
        powerBoardWt!.tags.includes(t)
      );
      expect(hasMatch).toBe(true);
    });
  });

  it("getProjectsByWorkType returns empty array for unknown slug", () => {
    const results = getProjectsByWorkType("nonexistent", allProjects);
    expect(results).toHaveLength(0);
  });
});
