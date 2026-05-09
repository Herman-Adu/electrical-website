/**
 * TDD: ContactCircuit tests
 * Covers:
 *   1. Renders without crashing
 *   2. SVG has correct viewBox (0 0 1440 600)
 *   3. When shouldReduceMotion=true, animated paths have no animation duration
 *   4. When shouldReduceMotion=false, animated elements are present
 *   5. Filled circles render
 *   6. Scanline is present
 */
import { describe, it, expect, vi } from "vitest";
import { render } from "@testing-library/react";

// ---------------------------------------------------------------------------
// Mocks
// ---------------------------------------------------------------------------
vi.mock("framer-motion", () => ({
  motion: {
    path: ({
      animate,
      initial,
      transition,
      ...props
    }: React.SVGProps<SVGPathElement> & {
      animate?: unknown;
      initial?: unknown;
      transition?: unknown;
    }) => (
      <path
        {...props}
        data-animated={animate !== undefined ? "true" : "false"}
        data-transition={transition ? JSON.stringify(transition) : undefined}
      />
    ),
    circle: ({
      animate,
      initial,
      transition,
      ...props
    }: React.SVGProps<SVGCircleElement> & {
      animate?: unknown;
      initial?: unknown;
      transition?: unknown;
    }) => (
      <circle
        {...props}
        data-animated={animate !== undefined ? "true" : "false"}
        data-transition={transition ? JSON.stringify(transition) : undefined}
      />
    ),
    div: ({
      children,
      animate,
      transition,
      className,
      ...rest
    }: React.HTMLAttributes<HTMLDivElement> & {
      animate?: unknown;
      transition?: unknown;
    }) => (
      <div
        className={className}
        data-testid="scanline"
        data-animated={animate !== undefined ? "true" : "false"}
        {...rest}
      >
        {children}
      </div>
    ),
  },
  useReducedMotion: () => false,
}));

import { ContactCircuit } from "../contact-circuit";

// ---------------------------------------------------------------------------
// Tests
// ---------------------------------------------------------------------------
describe("ContactCircuit", () => {
  describe("Rendering", () => {
    it("renders without crashing", () => {
      const { container } = render(<ContactCircuit shouldReduceMotion={false} />);
      expect(container.firstChild).toBeTruthy();
    });

    it("renders an SVG element", () => {
      const { container } = render(<ContactCircuit shouldReduceMotion={false} />);
      const svg = container.querySelector("svg");
      expect(svg).not.toBeNull();
    });

    it("SVG has the correct viewBox (600 height)", () => {
      const { container } = render(<ContactCircuit shouldReduceMotion={false} />);
      const svg = container.querySelector("svg");
      expect(svg?.getAttribute("viewBox")).toBe("0 0 1440 600");
    });

    it("renders 2 motion paths", () => {
      const { container } = render(<ContactCircuit shouldReduceMotion={false} />);
      const paths = container.querySelectorAll("path[data-animated='true']");
      expect(paths.length).toBeGreaterThanOrEqual(2);
    });

    it("renders 4 filled junction circles", () => {
      const { container } = render(<ContactCircuit shouldReduceMotion={false} />);
      const circles = container.querySelectorAll("circle");
      expect(circles.length).toBeGreaterThanOrEqual(4);
    });

    it("renders a scanline element", () => {
      const { container } = render(<ContactCircuit shouldReduceMotion={false} />);
      const scanline = container.querySelector("[data-testid='scanline']");
      expect(scanline).not.toBeNull();
    });
  });

  describe("shouldReduceMotion=true — no animation", () => {
    it("paths have duration 0 in transition when shouldReduceMotion=true", () => {
      const { container } = render(<ContactCircuit shouldReduceMotion={true} />);
      const animatedPaths = container.querySelectorAll("path[data-transition]");
      animatedPaths.forEach((path) => {
        const transition = JSON.parse(path.getAttribute("data-transition") ?? "{}");
        if (transition.duration !== undefined) {
          expect(transition.duration).toBe(0);
        }
      });
    });

    it("scanline is not animated when shouldReduceMotion=true", () => {
      const { container } = render(<ContactCircuit shouldReduceMotion={true} />);
      const scanlines = container.querySelectorAll("[data-testid='scanline']");
      const hasActiveScanline = Array.from(scanlines).some(
        (el) => el.getAttribute("data-animated") === "true"
      );
      expect(hasActiveScanline).toBe(false);
    });
  });

  describe("shouldReduceMotion=false — animations present", () => {
    it("paths are animated when shouldReduceMotion=false", () => {
      const { container } = render(<ContactCircuit shouldReduceMotion={false} />);
      const animatedPaths = container.querySelectorAll("path[data-animated='true']");
      expect(animatedPaths.length).toBeGreaterThanOrEqual(2);
    });

    it("scanline is animated when shouldReduceMotion=false", () => {
      const { container } = render(<ContactCircuit shouldReduceMotion={false} />);
      const scanline = container.querySelector("[data-testid='scanline'][data-animated='true']");
      expect(scanline).not.toBeNull();
    });
  });
});
