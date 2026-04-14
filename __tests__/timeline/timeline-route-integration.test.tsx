import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { CompanyTimeline } from "@/components/about/company-timeline";
import { NewsArticleContent } from "@/components/news-hub/news-article-content";
import { ProjectTimeline } from "@/components/projects/project-timeline";
import {
  adaptNewsTimeline,
  adaptProjectTimeline,
} from "@/lib/timeline/adapters";
import type { NewsDetailContent } from "@/types/news";

describe("timeline route integration", () => {
  it("preserves about timeline anchor id as timeline", () => {
    const { container } = render(<CompanyTimeline />);

    expect(container.querySelector("section#timeline")).toBeInTheDocument();
  });

  it("renders project timeline with canonical items and timeline anchor", () => {
    const canonicalProjectTimeline = adaptProjectTimeline([
      {
        phase: "Phase 1",
        title: "Design",
        description: "Design package complete.",
        duration: "2 weeks",
        status: "completed",
      },
      {
        phase: "Phase 2",
        title: "Installation",
        description: "Installation in progress.",
        duration: "4 weeks",
        status: "in-progress",
      },
    ]);

    const { container } = render(
      <ProjectTimeline
        items={canonicalProjectTimeline.items}
        anchorId="timeline"
      />,
    );

    expect(container.querySelector("#timeline")).toBeInTheDocument();
    // Label appears twice: once in desktop-only column (hidden md:block) and once in mobile-only column (md:hidden)
    expect(screen.getAllByText("Phase 1")).toHaveLength(2);
    expect(screen.getByText("Installation")).toBeInTheDocument();
  });

  it("renders news timeline section only when canonical timeline items exist", () => {
    const detail: NewsDetailContent = {
      intro: ["Overview paragraph"],
      takeaways: ["Takeaway A"],
    };

    const canonicalNewsTimeline = adaptNewsTimeline([
      {
        phase: "Phase 01",
        title: "Planning",
        description: "Kickoff and planning completed.",
      },
    ]);

    const withTimeline = render(
      <NewsArticleContent
        detail={detail}
        timelineItems={canonicalNewsTimeline.items}
      />,
    );

    expect(
      withTimeline.container.querySelector("section#timeline"),
    ).toBeInTheDocument();
    expect(screen.getByText("Planning")).toBeInTheDocument();

    withTimeline.unmount();

    const withoutTimeline = render(<NewsArticleContent detail={detail} />);
    expect(
      withoutTimeline.container.querySelector("section#timeline"),
    ).not.toBeInTheDocument();
  });
});
