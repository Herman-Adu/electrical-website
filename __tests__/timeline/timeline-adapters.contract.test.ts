import { describe, expect, it } from "vitest";
import {
  timelineItemSchema,
  timelineSectionDataSchema,
} from "@/lib/schemas/timeline";
import {
  adaptCompanyTimeline,
  adaptNewsTimeline,
  adaptProjectTimeline,
  TimelineAdapterError,
} from "@/lib/timeline/adapters";

describe("timeline canonical schema contract", () => {
  it("applies safe defaults for canonical item fields", () => {
    const parsed = timelineItemSchema.parse({
      id: "news-phase-1",
      source: "news",
      variant: "list",
      order: 0,
      label: "Phase 01",
      title: "Survey",
      description: "Initial survey completed",
    });

    expect(parsed.highlight).toBe(false);
  });

  it("rejects unknown keys on canonical objects", () => {
    const result = timelineItemSchema.safeParse({
      id: "news-phase-1",
      source: "news",
      variant: "list",
      order: 0,
      label: "Phase 01",
      title: "Survey",
      description: "Initial survey completed",
      unknownKey: "not-allowed",
    });

    expect(result.success).toBe(false);
  });
});

describe("timeline adapters contract", () => {
  it("adapts company milestones to canonical story variant", () => {
    const result = adaptCompanyTimeline([
      {
        year: "2009",
        title: "Company Founded",
        desc: "Two-man domestic team started in South London.",
        highlight: true,
      },
      {
        year: "2011",
        title: "NICEIC Approved",
        desc: "Achieved approved contractor status.",
      },
    ]);

    expect(result.source).toBe("company");
    expect(result.variant).toBe("story");
    expect(result.anchorId).toBe("timeline");
    expect(result.items).toHaveLength(2);
    expect(result.items[0]?.label).toBe("2009");
    expect(result.items[0]?.description).toContain("Two-man");
    expect(result.items[0]?.highlight).toBe(true);
    expect(result.items[1]?.highlight).toBe(false);
    expect(result.items[0]?.id).not.toBe(result.items[1]?.id);
    expect(() => timelineSectionDataSchema.parse(result)).not.toThrow();
  });

  it("adapts project phases to canonical status variant", () => {
    const result = adaptProjectTimeline([
      {
        phase: "Phase 1",
        title: "Design & Survey",
        description: "Site walkdown and design package completion.",
        duration: "2 weeks",
        status: "completed",
      },
      {
        phase: "Phase 2",
        title: "Installation",
        description: "Cable routes, board install and commissioning prep.",
        duration: "4 weeks",
        status: "in-progress",
      },
    ]);

    expect(result.source).toBe("project");
    expect(result.variant).toBe("status");
    expect(result.items[0]?.status).toBe("completed");
    expect(result.items[1]?.status).toBe("in-progress");
    expect(result.items[0]?.duration).toBe("2 weeks");
    expect(() => timelineSectionDataSchema.parse(result)).not.toThrow();
  });

  it("adapts news timeline items to canonical list variant", () => {
    const result = adaptNewsTimeline([
      {
        phase: "Phase 01",
        title: "Planning",
        description: "Stakeholder planning and mobilisation.",
      },
      {
        phase: "Phase 02",
        title: "Execution",
        description: "On-site implementation and staged signoff.",
        duration: "3 weeks",
      },
    ]);

    expect(result.source).toBe("news");
    expect(result.variant).toBe("list");
    expect(result.anchorId).toBe("timeline");
    expect(result.items[0]?.duration).toBeUndefined();
    expect(result.items[1]?.duration).toBe("3 weeks");
    expect(result.items[0]?.status).toBeUndefined();
    expect(() => timelineSectionDataSchema.parse(result)).not.toThrow();
  });

  it("strips markup from project timeline text fields", () => {
    const result = adaptProjectTimeline([
      {
        phase: "<em>Phase 1</em>",
        title: "<strong>Design</strong>",
        description:
          "Prep <script>alert('xss')</script><a href=\"#\">window</a> checks.",
        duration: "<span>2 weeks</span>",
        status: "completed",
      },
    ]);

    expect(result.items[0]?.label).toBe("Phase 1");
    expect(result.items[0]?.title).toBe("Design");
    expect(result.items[0]?.description).toBe("Prep window checks.");
    expect(result.items[0]?.duration).toBe("2 weeks");
    expect(result.items[0]?.description).not.toContain("<");
    expect(result.items[0]?.description).not.toContain("alert('xss')");
  });

  it("strips markup from news timeline text fields", () => {
    const result = adaptNewsTimeline([
      {
        phase: "<em>Phase 01</em>",
        title: "<strong>Planning</strong>",
        description:
          "Prep <script>alert('xss')</script><a href=\"#\">window</a> checks.",
        duration: "<span>3 weeks</span>",
      },
    ]);

    expect(result.items[0]?.label).toBe("Phase 01");
    expect(result.items[0]?.title).toBe("Planning");
    expect(result.items[0]?.description).toBe("Prep window checks.");
    expect(result.items[0]?.duration).toBe("3 weeks");
    expect(result.items[0]?.description).not.toContain("<");
    expect(result.items[0]?.description).not.toContain("alert('xss')");
  });

  it("throws typed adapter error on invalid company timeline input", () => {
    expect(() =>
      adaptCompanyTimeline([
        {
          year: "2024",
          title: "",
          desc: "Invalid because title is empty.",
        },
      ]),
    ).toThrow(TimelineAdapterError);
  });

  it("throws typed adapter error on invalid project status", () => {
    expect(() =>
      adaptProjectTimeline([
        {
          phase: "Phase 1",
          title: "Invalid status",
          description: "Should fail strict status enum",
          duration: "1 week",
          status: "unknown" as "completed",
        },
      ]),
    ).toThrow(TimelineAdapterError);
  });
});
