/**
 * TDD: HeroStatusBar atom tests
 * Covers:
 *   1. Correct class applied per colorScheme
 *   2. variants prop threaded through to motion.div
 *   3. label and status rendered
 *   4. Activity icon rendered
 */
import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";

// ---------------------------------------------------------------------------
// Mocks
// ---------------------------------------------------------------------------
vi.mock("framer-motion", () => ({
  motion: {
    div: ({
      children,
      className,
      variants,
      ...rest
    }: React.HTMLAttributes<HTMLDivElement> & {
      variants?: unknown;
    }) => (
      <div
        className={className}
        data-has-variants={variants !== undefined ? "true" : "false"}
        {...rest}
      >
        {children}
      </div>
    ),
  },
}));

vi.mock("lucide-react", () => ({
  Activity: ({
    className,
    size,
  }: {
    className?: string;
    size?: number;
  }) => (
    <svg
      data-testid="icon-activity"
      className={className}
      data-size={size}
    />
  ),
}));

import { HeroStatusBar } from "../hero-status-bar";

// ---------------------------------------------------------------------------
// Tests
// ---------------------------------------------------------------------------
describe("HeroStatusBar", () => {
  describe("Rendering", () => {
    it("renders the label text", () => {
      render(
        <HeroStatusBar
          label="News Hub"
          status="SYSTEMS_READY"
          colorScheme="blueprint"
        />,
      );
      expect(screen.getByText(/News Hub/)).toBeInTheDocument();
    });

    it("renders the status text", () => {
      render(
        <HeroStatusBar
          label="Status"
          status="INITIALIZING"
          colorScheme="blueprint"
        />,
      );
      expect(screen.getByText(/INITIALIZING/)).toBeInTheDocument();
    });

    it("renders the Activity icon", () => {
      render(
        <HeroStatusBar
          label="Status"
          status="READY"
          colorScheme="blueprint"
        />,
      );
      expect(screen.getByTestId("icon-activity")).toBeInTheDocument();
    });
  });

  describe("colorScheme — blueprint", () => {
    it("applies blueprint border class", () => {
      const { container } = render(
        <HeroStatusBar
          label="Status"
          status="READY"
          colorScheme="blueprint"
        />,
      );
      const inner = container.querySelector(".border-l-2");
      expect(inner).not.toBeNull();
      expect(inner!.className).toMatch(/border-foreground/);
    });

    it("applies blueprint text class", () => {
      render(
        <HeroStatusBar
          label="Status"
          status="READY"
          colorScheme="blueprint"
        />,
      );
      const span = screen.getByText(/Status/);
      expect(span.className).toMatch(/text-foreground/);
    });
  });

  describe("colorScheme — image", () => {
    it("applies image border-white class", () => {
      const { container } = render(
        <HeroStatusBar
          label="Category"
          status="READY"
          colorScheme="image"
        />,
      );
      const inner = container.querySelector(".border-l-2");
      expect(inner).not.toBeNull();
      expect(inner!.className).toMatch(/border-white/);
    });

    it("applies image text-white class", () => {
      render(
        <HeroStatusBar
          label="Category"
          status="READY"
          colorScheme="image"
        />,
      );
      const span = screen.getByText(/Category/);
      expect(span.className).toMatch(/text-white/);
    });
  });

  describe("Typography", () => {
    it("applies font-mono and tracking classes to the label span", () => {
      render(
        <HeroStatusBar
          label="Status"
          status="READY"
          colorScheme="blueprint"
        />,
      );
      const span = screen.getByText(/Status/);
      expect(span.className).toMatch(/font-mono/);
      expect(span.className).toMatch(/tracking-\[0\.3em\]/);
      expect(span.className).toMatch(/uppercase/);
    });
  });

  describe("variants prop", () => {
    it("threads variants through to the root motion.div when provided", () => {
      const testVariants = {
        hidden: { opacity: 0 },
        visible: { opacity: 1 },
      };
      const { container } = render(
        <HeroStatusBar
          label="Status"
          status="READY"
          colorScheme="blueprint"
          variants={testVariants}
        />,
      );
      const root = container.firstChild as HTMLElement;
      expect(root.dataset.hasVariants).toBe("true");
    });

    it("works without variants prop (undefined)", () => {
      const { container } = render(
        <HeroStatusBar
          label="Status"
          status="READY"
          colorScheme="blueprint"
        />,
      );
      expect(container.firstChild).toBeTruthy();
    });
  });
});
