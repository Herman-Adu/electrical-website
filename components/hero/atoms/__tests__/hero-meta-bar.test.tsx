/**
 * TDD: HeroMetaBar atom tests
 * Covers:
 *   1. Correct class applied per colorScheme
 *   2. variants prop threaded through to root motion.div
 *   3. All items rendered
 *   4. Pipe separators rendered between items (count = items.length - 1)
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

import { HeroMetaBar } from "../hero-meta-bar";

// ---------------------------------------------------------------------------
// Tests
// ---------------------------------------------------------------------------
const BLUEPRINT_ITEMS = ["Est. 2024", "Commercial & Industrial", "24/7 Operations"] as const;
const IMAGE_ITEMS = ["NICEIC Approved", "Part P Certified", "24/7 Emergency", "4 Active Articles"] as const;

describe("HeroMetaBar", () => {
  describe("Rendering — blueprint", () => {
    it("renders all items", () => {
      render(<HeroMetaBar items={BLUEPRINT_ITEMS} colorScheme="blueprint" />);
      expect(screen.getByText("Est. 2024")).toBeInTheDocument();
      expect(screen.getByText("Commercial & Industrial")).toBeInTheDocument();
      expect(screen.getByText("24/7 Operations")).toBeInTheDocument();
    });

    it("renders pipe separators (items.length - 1)", () => {
      render(<HeroMetaBar items={BLUEPRINT_ITEMS} colorScheme="blueprint" />);
      const pipes = screen.getAllByText("|");
      // 3 items → 2 separators
      expect(pipes).toHaveLength(2);
    });
  });

  describe("Rendering — image", () => {
    it("renders all 4 items", () => {
      render(<HeroMetaBar items={IMAGE_ITEMS} colorScheme="image" />);
      expect(screen.getByText("NICEIC Approved")).toBeInTheDocument();
      expect(screen.getByText("Part P Certified")).toBeInTheDocument();
      expect(screen.getByText("24/7 Emergency")).toBeInTheDocument();
      expect(screen.getByText("4 Active Articles")).toBeInTheDocument();
    });

    it("renders 3 pipe separators for 4 items", () => {
      render(<HeroMetaBar items={IMAGE_ITEMS} colorScheme="image" />);
      const pipes = screen.getAllByText("|");
      expect(pipes).toHaveLength(3);
    });
  });

  describe("colorScheme — blueprint", () => {
    it("applies text-foreground/80 class", () => {
      const { container } = render(
        <HeroMetaBar items={BLUEPRINT_ITEMS} colorScheme="blueprint" />,
      );
      const root = container.firstChild as HTMLElement;
      expect(root.className).toMatch(/text-foreground\/80/);
    });
  });

  describe("colorScheme — image", () => {
    it("applies text-white/80 class", () => {
      const { container } = render(
        <HeroMetaBar items={IMAGE_ITEMS} colorScheme="image" />,
      );
      const root = container.firstChild as HTMLElement;
      expect(root.className).toMatch(/text-white\/80/);
    });
  });

  describe("Typography", () => {
    it("has font-mono class on root", () => {
      const { container } = render(
        <HeroMetaBar items={BLUEPRINT_ITEMS} colorScheme="blueprint" />,
      );
      const root = container.firstChild as HTMLElement;
      expect(root.className).toMatch(/font-mono/);
    });

    it("has uppercase class on root", () => {
      const { container } = render(
        <HeroMetaBar items={BLUEPRINT_ITEMS} colorScheme="blueprint" />,
      );
      const root = container.firstChild as HTMLElement;
      expect(root.className).toMatch(/uppercase/);
    });

    it("has tracking-[0.2em] on root", () => {
      const { container } = render(
        <HeroMetaBar items={BLUEPRINT_ITEMS} colorScheme="blueprint" />,
      );
      const root = container.firstChild as HTMLElement;
      expect(root.className).toMatch(/tracking-\[0\.2em\]/);
    });
  });

  describe("Pipe separators", () => {
    it("pipe spans have hidden sm:inline classes", () => {
      render(<HeroMetaBar items={BLUEPRINT_ITEMS} colorScheme="blueprint" />);
      const pipes = screen.getAllByText("|");
      pipes.forEach((pipe) => {
        expect(pipe.className).toMatch(/hidden/);
        expect(pipe.className).toMatch(/sm:inline/);
      });
    });

    it("pipe spans have opacity-40 class", () => {
      render(<HeroMetaBar items={BLUEPRINT_ITEMS} colorScheme="blueprint" />);
      const pipes = screen.getAllByText("|");
      pipes.forEach((pipe) => {
        expect(pipe.className).toMatch(/opacity-40/);
      });
    });
  });

  describe("Edge cases", () => {
    it("renders a single item with no separators", () => {
      render(<HeroMetaBar items={["Only Item"]} colorScheme="blueprint" />);
      expect(screen.getByText("Only Item")).toBeInTheDocument();
      expect(screen.queryAllByText("|")).toHaveLength(0);
    });

    it("renders empty items without crashing", () => {
      expect(() =>
        render(<HeroMetaBar items={[]} colorScheme="blueprint" />),
      ).not.toThrow();
    });
  });

  describe("variants prop", () => {
    it("threads variants through to root motion.div", () => {
      const testVariants = {
        hidden: { opacity: 0 },
        visible: { opacity: 1 },
      };
      const { container } = render(
        <HeroMetaBar
          items={BLUEPRINT_ITEMS}
          colorScheme="blueprint"
          variants={testVariants}
        />,
      );
      const root = container.firstChild as HTMLElement;
      expect(root.dataset.hasVariants).toBe("true");
    });

    it("works without variants prop", () => {
      const { container } = render(
        <HeroMetaBar items={BLUEPRINT_ITEMS} colorScheme="blueprint" />,
      );
      expect(container.firstChild).toBeTruthy();
    });
  });
});
