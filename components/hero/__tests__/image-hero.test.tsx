/**
 * TDD: ImageHero base component tests
 * Covers:
 *   1.  Renders config.title and config.description
 *   2.  Renders background image with correct src from config.background
 *   3.  Renders HeroStatusBar with correct label
 *   4.  Renders inline white/transparent trust indicator cards when middle.type === 'trust-indicators'
 *       (NOT HeroTrustIndicators — image hero uses its own inline styling)
 *   5.  Renders buttons when middle.type === 'buttons'
 *   6.  Renders nothing in middle slot when middle.type === 'none'
 *   7.  Renders breadcrumbs
 *   8.  Renders HeroMetaBar with meta items
 *   9.  Renders HeroEyebrow with eyebrow text
 *   10. Renders HeroIconBadge
 */
import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import type { ImageHeroConfig } from "@/components/hero/hero-types";

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

vi.mock("next/image", () => ({
  default: ({
    src,
    alt,
    fill,
    priority,
    className,
    sizes,
    ...props
  }: {
    src: string;
    alt: string;
    fill?: boolean;
    priority?: boolean;
    className?: string;
    sizes?: string;
    [key: string]: unknown;
  }) => (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={src}
      alt={alt}
      data-fill={fill ? "true" : undefined}
      data-priority={priority ? "true" : undefined}
      className={className}
      data-sizes={sizes}
      data-testid="hero-bg-image"
      {...props}
    />
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

vi.mock("@/components/hero/hero-parallax-shell", () => ({
  HeroParallaxShell: ({
    content,
    background,
    decor,
    scrollIndicator,
  }: {
    content: React.ReactNode;
    background?: React.ReactNode;
    decor?: React.ReactNode;
    scrollIndicator?: React.ReactNode;
  }) => (
    <div data-testid="hero-parallax-shell">
      {background && <div data-testid="hero-background">{background}</div>}
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
  HERO_H1_TALL_IMAGE: "hero-h1-tall-image",
  HERO_H1_COMPACT_BLUEPRINT: "hero-h1-compact-blueprint",
  HERO_H1_CATEGORY_IMAGE: "hero-h1-category-image",
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

// ImageHero does NOT use HeroTrustIndicators — if it's imported we should know
vi.mock("@/components/shared/hero-trust-indicators", () => ({
  HeroTrustIndicators: ({
    items,
  }: {
    items: readonly { icon: string; title: string; description: string }[];
  }) => (
    <div data-testid="hero-trust-indicators-shared">
      {items.map((item) => (
        <div key={item.title}>{item.title}</div>
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

import { ImageHero } from "../image-hero";

// ---------------------------------------------------------------------------
// Fixture helpers
// ---------------------------------------------------------------------------

function makeConfig(
  overrides: Partial<ImageHeroConfig> = {},
): ImageHeroConfig {
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
    background: {
      type: "image",
      src: "/images/test-hero.jpg",
      alt: "Test hero background",
    },
    ...overrides,
  };
}

// ---------------------------------------------------------------------------
// Tests
// ---------------------------------------------------------------------------

describe("ImageHero", () => {
  describe("Core content rendering", () => {
    it("renders config.title", () => {
      render(<ImageHero config={makeConfig()} />);
      expect(screen.getByText("Hero Title")).toBeInTheDocument();
    });

    it("renders config.description", () => {
      render(<ImageHero config={makeConfig()} />);
      expect(screen.getByText("Hero description text.")).toBeInTheDocument();
    });

    it("renders within HeroParallaxShell", () => {
      render(<ImageHero config={makeConfig()} />);
      expect(screen.getByTestId("hero-parallax-shell")).toBeInTheDocument();
    });

    it("renders titleHighlight as a separate span when provided", () => {
      render(
        <ImageHero
          config={makeConfig({ title: "Main Title", titleHighlight: "Highlight Phrase" })}
        />,
      );
      expect(screen.getByText("Main Title")).toBeInTheDocument();
      expect(screen.getByText("Highlight Phrase")).toBeInTheDocument();
    });

    it("renders plain title without additional spans when titleHighlight is absent", () => {
      render(
        <ImageHero
          config={makeConfig({ title: "Plain Title", titleHighlight: undefined })}
        />,
      );
      expect(screen.getByText("Plain Title")).toBeInTheDocument();
    });
  });

  describe("Background image", () => {
    it("renders the background image via next/image", () => {
      render(<ImageHero config={makeConfig()} />);
      expect(screen.getByTestId("hero-bg-image")).toBeInTheDocument();
    });

    it("passes config.background.src as the image src", () => {
      render(
        <ImageHero
          config={makeConfig({
            background: {
              type: "image",
              src: "/images/custom-bg.jpg",
              alt: "Custom alt",
            },
          })}
        />,
      );
      expect(screen.getByTestId("hero-bg-image")).toHaveAttribute(
        "src",
        "/images/custom-bg.jpg",
      );
    });

    it("passes config.background.alt as the image alt", () => {
      render(
        <ImageHero
          config={makeConfig({
            background: {
              type: "image",
              src: "/images/test.jpg",
              alt: "Services hero background",
            },
          })}
        />,
      );
      expect(screen.getByTestId("hero-bg-image")).toHaveAttribute(
        "alt",
        "Services hero background",
      );
    });
  });

  describe("HeroStatusBar", () => {
    it("renders HeroStatusBar", () => {
      render(<ImageHero config={makeConfig()} />);
      expect(screen.getByTestId("hero-status-bar")).toBeInTheDocument();
    });

    it("passes config.statusLabel as label", () => {
      render(
        <ImageHero config={makeConfig({ statusLabel: "Image Hero" })} />,
      );
      expect(screen.getByTestId("status-label")).toHaveTextContent("Image Hero");
    });

    it("passes config.statusValue as status", () => {
      render(
        <ImageHero config={makeConfig({ statusValue: "ONLINE" })} />,
      );
      expect(screen.getByTestId("status-value")).toHaveTextContent("ONLINE");
    });
  });

  describe("HeroEyebrow", () => {
    it("renders HeroEyebrow", () => {
      render(<ImageHero config={makeConfig()} />);
      expect(screen.getByTestId("hero-eyebrow")).toBeInTheDocument();
    });

    it("passes config.eyebrow text", () => {
      render(
        <ImageHero config={makeConfig({ eyebrow: "Custom Eyebrow" })} />,
      );
      expect(screen.getByTestId("hero-eyebrow")).toHaveTextContent(
        "Custom Eyebrow",
      );
    });
  });

  describe("HeroIconBadge", () => {
    it("renders HeroIconBadge", () => {
      render(<ImageHero config={makeConfig()} />);
      expect(screen.getByTestId("hero-icon-badge")).toBeInTheDocument();
    });

    it("passes config.icon to HeroIconBadge", () => {
      render(<ImageHero config={makeConfig()} />);
      expect(screen.getByTestId("badge-icon")).toBeInTheDocument();
      expect(screen.getByTestId("fixture-icon")).toBeInTheDocument();
    });
  });

  describe("HeroMetaBar", () => {
    it("renders HeroMetaBar", () => {
      render(<ImageHero config={makeConfig()} />);
      expect(screen.getByTestId("hero-meta-bar")).toBeInTheDocument();
    });

    it("renders meta items", () => {
      render(
        <ImageHero
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
        <ImageHero
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
        <ImageHero
          config={makeConfig({
            breadcrumbs: [{ label: "Home", href: "/" }, { label: "Services" }],
          })}
        />,
      );
      const homeLink = screen.getByRole("link", { name: "Home" });
      expect(homeLink).toHaveAttribute("href", "/");
    });

    it("renders final breadcrumb without link when no href", () => {
      render(
        <ImageHero
          config={makeConfig({
            breadcrumbs: [{ label: "Home", href: "/" }, { label: "Services" }],
          })}
        />,
      );
      const servicesEl = screen.getByText("Services");
      expect(servicesEl.tagName).not.toBe("A");
    });
  });

  describe("Middle slot — trust-indicators (inline white/transparent cards)", () => {
    it("renders inline trust indicator cards when middle.type === 'trust-indicators'", () => {
      render(
        <ImageHero
          config={makeConfig({
            middle: {
              type: "trust-indicators",
              items: [
                { icon: "Activity", title: "Trust Item", description: "Trust description" },
              ],
            },
          })}
        />,
      );
      // Inline cards — NOT the shared HeroTrustIndicators component
      expect(screen.queryByTestId("hero-trust-indicators-shared")).not.toBeInTheDocument();
      // Inline card title should be visible
      expect(screen.getByText("Trust Item")).toBeInTheDocument();
    });

    it("renders multiple inline trust indicator cards", () => {
      render(
        <ImageHero
          config={makeConfig({
            middle: {
              type: "trust-indicators",
              items: [
                { icon: "Activity", title: "Expert Led", description: "Experts on board" },
                { icon: "BookOpen", title: "Editorial", description: "High standards" },
                { icon: "Shield", title: "Certified", description: "Fully certified" },
              ],
            },
          })}
        />,
      );
      expect(screen.getByText("Expert Led")).toBeInTheDocument();
      expect(screen.getByText("Editorial")).toBeInTheDocument();
      expect(screen.getByText("Certified")).toBeInTheDocument();
    });

    it("does NOT render shared HeroTrustIndicators for trust-indicators middle", () => {
      render(
        <ImageHero
          config={makeConfig({
            middle: {
              type: "trust-indicators",
              items: [{ icon: "Zap", title: "Fast", description: "" }],
            },
          })}
        />,
      );
      expect(
        screen.queryByTestId("hero-trust-indicators-shared"),
      ).not.toBeInTheDocument();
    });
  });

  describe("Middle slot — buttons", () => {
    it("renders button items when middle.type === 'buttons'", () => {
      render(
        <ImageHero
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
        <ImageHero
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

    it("does not render trust indicator cards when middle.type === 'buttons'", () => {
      render(
        <ImageHero
          config={makeConfig({
            middle: {
              type: "buttons",
              items: [{ label: "Go", href: "/go" }],
            },
          })}
        />,
      );
      expect(
        screen.queryByTestId("hero-trust-indicators-shared"),
      ).not.toBeInTheDocument();
    });
  });

  describe("Middle slot — none", () => {
    it("does not render trust indicators when middle.type === 'none'", () => {
      render(<ImageHero config={makeConfig({ middle: { type: "none" } })} />);
      expect(
        screen.queryByTestId("hero-trust-indicators-shared"),
      ).not.toBeInTheDocument();
    });

    it("does not render button links when middle.type === 'none'", () => {
      render(<ImageHero config={makeConfig({ middle: { type: "none" } })} />);
      // Only breadcrumb links should remain
      const links = screen.queryAllByRole("link");
      links.forEach((link) => {
        expect(["/", undefined]).toContain(link.getAttribute("href"));
      });
    });
  });

  describe("shouldReduceMotion prop", () => {
    it("renders without error when shouldReduceMotion is true", () => {
      render(
        <ImageHero config={makeConfig()} shouldReduceMotion={true} />,
      );
      expect(screen.getByTestId("hero-parallax-shell")).toBeInTheDocument();
      expect(screen.getByText("Hero Title")).toBeInTheDocument();
    });

    it("renders without error when shouldReduceMotion is false (default)", () => {
      render(<ImageHero config={makeConfig()} shouldReduceMotion={false} />);
      expect(screen.getByTestId("hero-parallax-shell")).toBeInTheDocument();
    });
  });
});
