/**
 * TDD: BlueprintHero base component tests
 * Covers:
 *   1.  Renders config.title and config.description
 *   2.  Renders HeroStatusBar with correct label/status
 *   3.  Renders HeroTrustIndicators when middle.type === 'trust-indicators'
 *   4.  Renders buttons when middle.type === 'buttons'
 *   5.  Renders nothing in middle slot when middle.type === 'none'
 *   6.  Renders circuitDecor when provided
 *   7.  Renders config.breadcrumbs
 *   8.  Renders HeroMetaBar with meta items
 *   9.  Renders HeroEyebrow with eyebrow text
 *   10. Renders HeroIconBadge
 */
import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import type { BlueprintHeroConfig } from "@/components/hero/hero-types";

// ---------------------------------------------------------------------------
// Mocks
// ---------------------------------------------------------------------------

vi.mock("next/link", () => ({
  default: ({
    href,
    children,
    ...props
  }: {
    href: string;
    children: React.ReactNode;
    [key: string]: unknown;
  }) => (
    <a href={href} {...props}>
      {children}
    </a>
  ),
}));

vi.mock("framer-motion", () => ({
  motion: {
    div: ({
      children,
      className,
      ...rest
    }: React.HTMLAttributes<HTMLDivElement>) => (
      <div className={className} {...rest}>
        {children}
      </div>
    ),
    nav: ({
      children,
      className,
      ...rest
    }: React.HTMLAttributes<HTMLElement>) => (
      <nav className={className} {...rest}>
        {children}
      </nav>
    ),
    h1: ({
      children,
      className,
      ...rest
    }: React.HTMLAttributes<HTMLHeadingElement>) => (
      <h1 className={className} {...rest}>
        {children}
      </h1>
    ),
    p: ({
      children,
      className,
      ...rest
    }: React.HTMLAttributes<HTMLParagraphElement>) => (
      <p className={className} {...rest}>
        {children}
      </p>
    ),
    button: ({
      children,
      className,
      onClick,
      ...rest
    }: React.ButtonHTMLAttributes<HTMLButtonElement>) => (
      <button className={className} onClick={onClick} {...rest}>
        {children}
      </button>
    ),
    path: (props: React.SVGProps<SVGPathElement>) => <path {...props} />,
    circle: (props: React.SVGProps<SVGCircleElement>) => <circle {...props} />,
    span: ({
      children,
      className,
      ...rest
    }: React.HTMLAttributes<HTMLSpanElement>) => (
      <span className={className} {...rest}>
        {children}
      </span>
    ),
  },
  useReducedMotion: () => false,
  AnimatePresence: ({ children }: { children: React.ReactNode }) => (
    <>{children}</>
  ),
}));

vi.mock("@/components/hero/blueprint-background", () => ({
  BlueprintBackground: () => <div data-testid="blueprint-background" />,
}));

vi.mock("@/components/hero/hero-parallax-shell", () => ({
  HeroParallaxShell: ({
    content,
    decor,
    scrollIndicator,
  }: {
    content: React.ReactNode;
    decor?: React.ReactNode;
    scrollIndicator?: React.ReactNode;
  }) => (
    <div data-testid="hero-parallax-shell">
      {decor && <div data-testid="hero-decor">{decor}</div>}
      <div data-testid="hero-content">{content}</div>
      {scrollIndicator && (
        <div data-testid="scroll-indicator">{scrollIndicator}</div>
      )}
    </div>
  ),
}));

vi.mock("@/components/hero/use-hero-parallax", () => ({
  useHeroParallax: () => ({
    sectionRef: { current: null },
    backgroundFrameStyle: {},
    contentStyle: {},
    shouldReduceMotion: false,
  }),
}));

vi.mock("@/components/hero/hero-tokens", () => ({
  HERO_H1_COMPACT_BLUEPRINT: "hero-h1-compact-blueprint",
  HERO_H1_TALL_BLUEPRINT: "hero-h1-tall-blueprint",
}));

vi.mock("@/lib/scroll-to-section", () => ({
  scrollToElementWithOffset: vi.fn(),
}));

vi.mock("@/lib/hooks/use-cycling-text", () => ({
  useCyclingText: vi.fn((items: string[], _interval?: number) => ({
    currentText: items?.[0] ?? "",
    cycleIndex: 0,
    isAnimating: false,
  })),
}));

vi.mock("@/components/shared/hero-trust-indicators", () => ({
  HeroTrustIndicators: ({
    items,
  }: {
    items: readonly { icon: string; title: string; description: string }[];
  }) => (
    <div data-testid="hero-trust-indicators">
      {items.map((item) => (
        <div key={item.title} data-testid="trust-indicator-item">
          <span data-testid="trust-title">{item.title}</span>
          <span data-testid="trust-description">{item.description}</span>
        </div>
      ))}
    </div>
  ),
}));

vi.mock("@/components/hero/atoms", () => ({
  HeroStatusBar: ({
    label,
    status,
  }: {
    label: string;
    status: string;
    colorScheme: string;
    variants?: unknown;
  }) => (
    <div data-testid="hero-status-bar">
      <span data-testid="status-label">{label}</span>
      <span data-testid="status-value">{status}</span>
    </div>
  ),
  HeroIconBadge: ({
    icon,
  }: {
    icon?: React.ReactNode;
    colorScheme: string;
    variants?: unknown;
  }) => (
    <div data-testid="hero-icon-badge">
      {icon && <span data-testid="badge-icon">{icon}</span>}
    </div>
  ),
  HeroEyebrow: ({
    text,
  }: {
    text: string;
    colorScheme: string;
    variants?: unknown;
  }) => <div data-testid="hero-eyebrow">{text}</div>,
  HeroMetaBar: ({
    items,
  }: {
    items: readonly string[];
    colorScheme: string;
    variants?: unknown;
  }) => (
    <div data-testid="hero-meta-bar">
      {items.map((item) => (
        <span key={item} data-testid="meta-item">
          {item}
        </span>
      ))}
    </div>
  ),
}));

vi.mock("@/lib/utils", () => ({
  cn: (...args: unknown[]) => args.filter(Boolean).join(" "),
}));

vi.mock("lucide-react", () => ({
  Activity: () => <svg data-testid="icon-activity" />,
  ChevronDown: () => <svg data-testid="icon-chevron-down" />,
}));

import { BlueprintHero } from "../blueprint-hero";

// ---------------------------------------------------------------------------
// Fixture helpers
// ---------------------------------------------------------------------------

function makeConfig(
  overrides: Partial<BlueprintHeroConfig> = {},
): BlueprintHeroConfig {
  return {
    statusLabel: "Status Label",
    statusValue: "SYSTEMS_READY",
    breadcrumbs: [
      { label: "Home", href: "/" },
      { label: "Services" },
    ],
    icon: <svg data-testid="fixture-icon" />,
    eyebrow: "Eyebrow Text",
    title: "Hero Title",
    description: "Hero description text.",
    meta: ["NICEIC Approved", "Part P Certified"],
    middle: { type: "none" },
    background: { type: "blueprint" },
    ...overrides,
  };
}

// ---------------------------------------------------------------------------
// Tests
// ---------------------------------------------------------------------------

describe("BlueprintHero", () => {
  describe("Core content rendering", () => {
    it("renders config.title", () => {
      render(<BlueprintHero config={makeConfig()} />);
      expect(screen.getByText("Hero Title")).toBeInTheDocument();
    });

    it("renders config.description", () => {
      render(<BlueprintHero config={makeConfig()} />);
      expect(screen.getByText("Hero description text.")).toBeInTheDocument();
    });

    it("renders within HeroParallaxShell", () => {
      render(<BlueprintHero config={makeConfig()} />);
      expect(screen.getByTestId("hero-parallax-shell")).toBeInTheDocument();
    });
  });

  describe("HeroStatusBar", () => {
    it("renders HeroStatusBar", () => {
      render(<BlueprintHero config={makeConfig()} />);
      expect(screen.getByTestId("hero-status-bar")).toBeInTheDocument();
    });

    it("passes config.statusLabel as label", () => {
      render(
        <BlueprintHero config={makeConfig({ statusLabel: "News Hub" })} />,
      );
      expect(screen.getByTestId("status-label")).toHaveTextContent("News Hub");
    });

    it("passes config.statusValue as status", () => {
      render(
        <BlueprintHero config={makeConfig({ statusValue: "ONLINE" })} />,
      );
      expect(screen.getByTestId("status-value")).toHaveTextContent("ONLINE");
    });
  });

  describe("HeroEyebrow", () => {
    it("renders HeroEyebrow", () => {
      render(<BlueprintHero config={makeConfig()} />);
      expect(screen.getByTestId("hero-eyebrow")).toBeInTheDocument();
    });

    it("passes config.eyebrow text", () => {
      render(
        <BlueprintHero config={makeConfig({ eyebrow: "Custom Eyebrow" })} />,
      );
      expect(screen.getByTestId("hero-eyebrow")).toHaveTextContent(
        "Custom Eyebrow",
      );
    });
  });

  describe("HeroIconBadge", () => {
    it("renders HeroIconBadge", () => {
      render(<BlueprintHero config={makeConfig()} />);
      expect(screen.getByTestId("hero-icon-badge")).toBeInTheDocument();
    });

    it("passes config.icon to HeroIconBadge", () => {
      render(<BlueprintHero config={makeConfig()} />);
      expect(screen.getByTestId("badge-icon")).toBeInTheDocument();
      expect(screen.getByTestId("fixture-icon")).toBeInTheDocument();
    });
  });

  describe("HeroMetaBar", () => {
    it("renders HeroMetaBar", () => {
      render(<BlueprintHero config={makeConfig()} />);
      expect(screen.getByTestId("hero-meta-bar")).toBeInTheDocument();
    });

    it("renders meta items", () => {
      render(
        <BlueprintHero
          config={makeConfig({ meta: ["NICEIC Approved", "Part P Certified"] })}
        />,
      );
      const items = screen.getAllByTestId("meta-item");
      expect(items).toHaveLength(2);
      expect(items[0]).toHaveTextContent("NICEIC Approved");
      expect(items[1]).toHaveTextContent("Part P Certified");
    });
  });

  describe("Breadcrumbs", () => {
    it("renders breadcrumb items", () => {
      render(
        <BlueprintHero
          config={makeConfig({
            breadcrumbs: [{ label: "Home", href: "/" }, { label: "About" }],
          })}
        />,
      );
      expect(screen.getByText("Home")).toBeInTheDocument();
      expect(screen.getByText("About")).toBeInTheDocument();
    });

    it("renders breadcrumb link with href", () => {
      render(
        <BlueprintHero
          config={makeConfig({
            breadcrumbs: [{ label: "Home", href: "/" }, { label: "Services" }],
          })}
        />,
      );
      const homeLink = screen.getByRole("link", { name: "Home" });
      expect(homeLink).toHaveAttribute("href", "/");
    });

    it("renders final breadcrumb without link", () => {
      render(
        <BlueprintHero
          config={makeConfig({
            breadcrumbs: [{ label: "Home", href: "/" }, { label: "Services" }],
          })}
        />,
      );
      // "Services" has no href — should not be an anchor
      const servicesEl = screen.getByText("Services");
      expect(servicesEl.tagName).not.toBe("A");
    });
  });

  describe("Middle slot — trust-indicators", () => {
    it("renders HeroTrustIndicators when middle.type === 'trust-indicators'", () => {
      render(
        <BlueprintHero
          config={makeConfig({
            middle: {
              type: "trust-indicators",
              items: [
                {
                  icon: "Activity",
                  title: "Trust Item",
                  description: "Trust description",
                },
              ],
            },
          })}
        />,
      );
      expect(screen.getByTestId("hero-trust-indicators")).toBeInTheDocument();
    });

    it("passes the correct items to HeroTrustIndicators", () => {
      render(
        <BlueprintHero
          config={makeConfig({
            middle: {
              type: "trust-indicators",
              items: [
                {
                  icon: "Activity",
                  title: "Expert Led",
                  description: "Experts on board",
                },
                {
                  icon: "BookOpen",
                  title: "Editorial",
                  description: "High standards",
                },
              ],
            },
          })}
        />,
      );
      const items = screen.getAllByTestId("trust-indicator-item");
      expect(items).toHaveLength(2);
      expect(screen.getByText("Expert Led")).toBeInTheDocument();
      expect(screen.getByText("Editorial")).toBeInTheDocument();
    });
  });

  describe("Middle slot — buttons", () => {
    it("renders button items when middle.type === 'buttons'", () => {
      render(
        <BlueprintHero
          config={makeConfig({
            middle: {
              type: "buttons",
              items: [
                { label: "Get Started", href: "/start" },
                { label: "Learn More", href: "/learn" },
              ],
            },
          })}
        />,
      );
      expect(
        screen.getByRole("link", { name: "Get Started" }),
      ).toBeInTheDocument();
      expect(
        screen.getByRole("link", { name: "Learn More" }),
      ).toBeInTheDocument();
    });

    it("button links have correct hrefs", () => {
      render(
        <BlueprintHero
          config={makeConfig({
            middle: {
              type: "buttons",
              items: [{ label: "Contact", href: "/contact" }],
            },
          })}
        />,
      );
      expect(screen.getByRole("link", { name: "Contact" })).toHaveAttribute(
        "href",
        "/contact",
      );
    });

    it("does not render HeroTrustIndicators when middle.type === 'buttons'", () => {
      render(
        <BlueprintHero
          config={makeConfig({
            middle: {
              type: "buttons",
              items: [{ label: "Go", href: "/go" }],
            },
          })}
        />,
      );
      expect(
        screen.queryByTestId("hero-trust-indicators"),
      ).not.toBeInTheDocument();
    });
  });

  describe("Middle slot — none", () => {
    it("does not render HeroTrustIndicators when middle.type === 'none'", () => {
      render(<BlueprintHero config={makeConfig({ middle: { type: "none" } })} />);
      expect(
        screen.queryByTestId("hero-trust-indicators"),
      ).not.toBeInTheDocument();
    });

    it("does not render button links when middle.type === 'none'", () => {
      render(<BlueprintHero config={makeConfig({ middle: { type: "none" } })} />);
      // Breadcrumb links should still exist but no button-style CTA links
      const links = screen.queryAllByRole("link");
      // Only breadcrumb links remain (Home href="/")
      links.forEach((link) => {
        expect(["/", undefined]).toContain(link.getAttribute("href"));
      });
    });
  });

  describe("circuitDecor slot", () => {
    it("renders circuitDecor when provided", () => {
      render(
        <BlueprintHero
          config={makeConfig()}
          circuitDecor={<div data-testid="circuit-decor">Circuit</div>}
        />,
      );
      expect(screen.getByTestId("circuit-decor")).toBeInTheDocument();
    });

    it("does not render circuitDecor slot when not provided", () => {
      render(<BlueprintHero config={makeConfig()} />);
      expect(screen.queryByTestId("circuit-decor")).not.toBeInTheDocument();
    });
  });

  describe("titleHighlight", () => {
    it("renders plain title when no titleHighlight", () => {
      render(
        <BlueprintHero
          config={makeConfig({ title: "Plain Title", titleHighlight: undefined })}
        />,
      );
      expect(screen.getByText("Plain Title")).toBeInTheDocument();
    });

    it("renders title and titleHighlight separately when provided", () => {
      render(
        <BlueprintHero
          config={makeConfig({
            title: "Hero",
            titleHighlight: "Highlight",
          })}
        />,
      );
      expect(screen.getByText("Hero")).toBeInTheDocument();
      expect(screen.getByText("Highlight")).toBeInTheDocument();
    });
  });

  describe("shouldReduceMotion prop", () => {
    it("renders without error when shouldReduceMotion is true", () => {
      render(
        <BlueprintHero config={makeConfig()} shouldReduceMotion={true} />,
      );
      expect(screen.getByTestId("hero-parallax-shell")).toBeInTheDocument();
      expect(screen.getByText("Hero Title")).toBeInTheDocument();
    });

    it("renders without error when shouldReduceMotion is false (default)", () => {
      render(<BlueprintHero config={makeConfig()} shouldReduceMotion={false} />);
      expect(screen.getByTestId("hero-parallax-shell")).toBeInTheDocument();
    });
  });
});
