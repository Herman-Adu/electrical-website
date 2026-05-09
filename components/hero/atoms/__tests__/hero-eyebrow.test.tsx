/**
 * TDD: HeroEyebrow atom tests
 * Covers:
 *   1. Correct class applied per colorScheme (blueprint vs image)
 *   2. variants prop threaded through to root motion.div
 *   3. text rendered
 *   4. horizontal line decorators rendered
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

import { HeroEyebrow } from "../hero-eyebrow";

// ---------------------------------------------------------------------------
// Tests
// ---------------------------------------------------------------------------
describe("HeroEyebrow", () => {
  describe("Rendering", () => {
    it("renders the text", () => {
      render(
        <HeroEyebrow text="Editorial Systems" colorScheme="blueprint" />,
      );
      expect(screen.getByText("Editorial Systems")).toBeInTheDocument();
    });

    it("renders two horizontal line decorators", () => {
      const { container } = render(
        <HeroEyebrow text="Test Label" colorScheme="blueprint" />,
      );
      // h-px elements are the line decorators
      const lines = container.querySelectorAll(".h-px");
      expect(lines.length).toBe(2);
    });
  });

  describe("colorScheme — blueprint", () => {
    it("applies electric-cyan/80 color to lines", () => {
      const { container } = render(
        <HeroEyebrow text="Label" colorScheme="blueprint" />,
      );
      const lines = container.querySelectorAll(".h-px");
      lines.forEach((line) => {
        expect(line.className).toMatch(/bg-electric-cyan\/80/);
      });
    });

    it("applies text-electric-cyan/80 to label text", () => {
      render(<HeroEyebrow text="Label" colorScheme="blueprint" />);
      const labelEl = screen.getByText("Label");
      expect(labelEl.className).toMatch(/text-electric-cyan\/80/);
    });
  });

  describe("colorScheme — image", () => {
    it("applies electric-cyan (full opacity) color to lines", () => {
      const { container } = render(
        <HeroEyebrow text="Label" colorScheme="image" />,
      );
      const lines = container.querySelectorAll(".h-px");
      lines.forEach((line) => {
        // Should have bg-electric-cyan without /80
        expect(line.className).toMatch(/bg-electric-cyan/);
        expect(line.className).not.toMatch(/bg-electric-cyan\/80/);
      });
    });

    it("applies text-electric-cyan (full opacity) to label text", () => {
      render(<HeroEyebrow text="Label" colorScheme="image" />);
      const labelEl = screen.getByText("Label");
      expect(labelEl.className).toMatch(/text-electric-cyan/);
      expect(labelEl.className).not.toMatch(/text-electric-cyan\/80/);
    });
  });

  describe("Layout", () => {
    it("has flex items-center justify-center layout", () => {
      const { container } = render(
        <HeroEyebrow text="Test" colorScheme="blueprint" />,
      );
      const root = container.firstChild as HTMLElement;
      expect(root.className).toMatch(/flex/);
      expect(root.className).toMatch(/items-center/);
    });

    it("has w-12 width on line decorators", () => {
      const { container } = render(
        <HeroEyebrow text="Test" colorScheme="blueprint" />,
      );
      const lines = container.querySelectorAll(".h-px");
      lines.forEach((line) => {
        expect(line.className).toMatch(/w-12/);
      });
    });
  });

  describe("variants prop", () => {
    it("threads variants through to the root motion.div when provided", () => {
      const testVariants = {
        hidden: { opacity: 0 },
        visible: { opacity: 1 },
      };
      const { container } = render(
        <HeroEyebrow
          text="Test"
          colorScheme="blueprint"
          variants={testVariants}
        />,
      );
      const root = container.firstChild as HTMLElement;
      expect(root.dataset.hasVariants).toBe("true");
    });

    it("works without variants prop", () => {
      const { container } = render(
        <HeroEyebrow text="Test" colorScheme="blueprint" />,
      );
      expect(container.firstChild).toBeTruthy();
    });
  });
});
