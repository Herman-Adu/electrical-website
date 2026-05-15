import { describe, expect, it } from "vitest";
import {
  projectCategories,
  allProjects,
  isProjectCategorySlug,
} from "@/data/projects";

describe("project taxonomy — isSector flag", () => {
  it("exposes exactly 4 sector categories", () => {
    const sectors = projectCategories.filter((c) => c.isSector);
    expect(sectors).toHaveLength(4);
    const slugs = sectors.map((s) => s.slug);
    expect(slugs).toContain("residential");
    expect(slugs).toContain("commercial");
    expect(slugs).toContain("industrial");
    expect(slugs).toContain("community");
  });

  it("marks power-boards and commercial-lighting as non-sector", () => {
    const nonSectors = projectCategories.filter((c) => !c.isSector);
    const slugs = nonSectors.map((s) => s.slug);
    expect(slugs).toContain("power-boards");
    expect(slugs).toContain("commercial-lighting");
  });

  it("includes industrial as a valid category slug", () => {
    expect(isProjectCategorySlug("industrial")).toBe(true);
  });

  it("has at least 1 project in the industrial category", () => {
    const industrial = allProjects.filter((p) => p.category === "industrial");
    expect(industrial.length).toBeGreaterThanOrEqual(1);
  });

});
