import { describe, expect, it, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { ProjectFilterBar } from "@/components/projects/project-filter-bar";
import type { ProjectCategory } from "@/types/projects";

const mockSectors: ProjectCategory[] = [
  { slug: "residential", label: "Residential", description: "", isSector: true },
  { slug: "commercial", label: "Commercial", description: "", isSector: true },
  { slug: "industrial", label: "Industrial", description: "", isSector: true },
  { slug: "community", label: "Community", description: "", isSector: true },
];

const mockCounts: Record<string, number> = {
  all: 10,
  residential: 3,
  commercial: 4,
  industrial: 2,
  community: 1,
};

describe("ProjectFilterBar", () => {
  it("renders All Projects button", () => {
    render(
      <ProjectFilterBar
        categories={mockSectors}
        activeSlug="all"
        counts={mockCounts}
        onSelect={vi.fn()}
      />
    );
    expect(screen.getByRole("button", { name: /All Projects/i })).toBeInTheDocument();
  });

  it("renders a button for each sector", () => {
    render(
      <ProjectFilterBar
        categories={mockSectors}
        activeSlug="all"
        counts={mockCounts}
        onSelect={vi.fn()}
      />
    );
    expect(screen.getByRole("button", { name: /Residential/i })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /Commercial/i })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /Industrial/i })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /Community/i })).toBeInTheDocument();
  });

  it("calls onSelect with the slug when a sector button is clicked", () => {
    const onSelect = vi.fn();
    render(
      <ProjectFilterBar
        categories={mockSectors}
        activeSlug="all"
        counts={mockCounts}
        onSelect={onSelect}
      />
    );
    fireEvent.click(screen.getByRole("button", { name: /Residential/i }));
    expect(onSelect).toHaveBeenCalledWith("residential");
  });

  it("shows project count badge next to each sector", () => {
    render(
      <ProjectFilterBar
        categories={mockSectors}
        activeSlug="all"
        counts={mockCounts}
        onSelect={vi.fn()}
      />
    );
    expect(screen.getByText("3")).toBeInTheDocument(); // residential count
  });

  it("calls onSelect with 'all' when All Projects button is clicked", () => {
    const onSelect = vi.fn();
    render(
      <ProjectFilterBar
        categories={mockSectors}
        activeSlug="residential"
        counts={mockCounts}
        onSelect={onSelect}
      />
    );
    fireEvent.click(screen.getByRole("button", { name: /All Projects/i }));
    expect(onSelect).toHaveBeenCalledWith("all");
  });

  it("marks the active sector button as pressed and inactive buttons as not pressed", () => {
    render(
      <ProjectFilterBar
        categories={mockSectors}
        activeSlug="residential"
        counts={mockCounts}
        onSelect={vi.fn()}
      />
    );
    const residentialBtn = screen.getByRole("button", { name: /Residential/i });
    const allBtn = screen.getByRole("button", { name: /All Projects/i });
    expect(residentialBtn.getAttribute("aria-pressed")).toBe("true");
    expect(allBtn.getAttribute("aria-pressed")).toBe("false");
  });
});
