/**
 * TDD: HeroIconBadge atom tests
 * Covers:
 *   1. Correct class applied per colorScheme
 *   2. variants prop threaded through to root motion.div
 *   3. icon children rendered
 *   4. glow ring rendered
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
      animate,
      transition,
      ...rest
    }: React.HTMLAttributes<HTMLDivElement> & {
      variants?: unknown;
      animate?: unknown;
      transition?: unknown;
    }) => (
      <div
        className={className}
        data-has-variants={variants !== undefined ? "true" : "false"}
        data-testid={
          animate !== undefined ? "glow-ring" : undefined
        }
        {...rest}
      >
        {children}
      </div>
    ),
  },
}));

import { HeroIconBadge } from "../hero-icon-badge";

// ---------------------------------------------------------------------------
// Tests
// ---------------------------------------------------------------------------
describe("HeroIconBadge", () => {
  describe("Rendering", () => {
    it("renders icon children", () => {
      render(
        <HeroIconBadge colorScheme="blueprint">
          <svg data-testid="test-icon" />
        </HeroIconBadge>,
      );
      expect(screen.getByTestId("test-icon")).toBeInTheDocument();
    });

    it("renders a glow ring element", () => {
      render(
        <HeroIconBadge colorScheme="blueprint">
          <svg />
        </HeroIconBadge>,
      );
      expect(screen.getByTestId("glow-ring")).toBeInTheDocument();
    });
  });

  describe("colorScheme — blueprint", () => {
    it("applies blueprint border class (border-electric-cyan/50)", () => {
      const { container } = render(
        <HeroIconBadge colorScheme="blueprint">
          <svg />
        </HeroIconBadge>,
      );
      // The inner badge container (w-16 h-16 rounded-xl)
      const badge = container.querySelector(".w-16");
      expect(badge).not.toBeNull();
      expect(badge!.className).toMatch(/border-electric-cyan/);
    });
  });

  describe("colorScheme — image", () => {
    it("applies image border-white class", () => {
      const { container } = render(
        <HeroIconBadge colorScheme="image">
          <svg />
        </HeroIconBadge>,
      );
      const badge = container.querySelector(".w-16");
      expect(badge).not.toBeNull();
      expect(badge!.className).toMatch(/border-white/);
    });
  });

  describe("Badge structure", () => {
    it("has backdrop-blur-sm class on badge container", () => {
      const { container } = render(
        <HeroIconBadge colorScheme="blueprint">
          <svg />
        </HeroIconBadge>,
      );
      const badge = container.querySelector(".backdrop-blur-sm");
      expect(badge).not.toBeNull();
    });

    it("has bg-white/10 class on badge container", () => {
      const { container } = render(
        <HeroIconBadge colorScheme="blueprint">
          <svg />
        </HeroIconBadge>,
      );
      const badge = container.querySelector(".w-16");
      expect(badge!.className).toMatch(/bg-white\/10/);
    });
  });

  describe("variants prop", () => {
    it("threads variants through to the root motion.div when provided", () => {
      const testVariants = {
        hidden: { opacity: 0 },
        visible: { opacity: 1 },
      };
      const { container } = render(
        <HeroIconBadge colorScheme="blueprint" variants={testVariants}>
          <svg />
        </HeroIconBadge>,
      );
      const root = container.firstChild as HTMLElement;
      expect(root.dataset.hasVariants).toBe("true");
    });

    it("works without variants prop", () => {
      const { container } = render(
        <HeroIconBadge colorScheme="blueprint">
          <svg />
        </HeroIconBadge>,
      );
      expect(container.firstChild).toBeTruthy();
    });
  });
});
