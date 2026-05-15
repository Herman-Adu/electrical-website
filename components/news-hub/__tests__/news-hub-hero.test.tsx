/**
 * TDD: news-hub-hero tests (Phase 7 — refactored with HubCircuit)
 * Covers:
 *   1. Renders without crashing
 *   2. Key content (title, description) appears in output
 *   3. HeroTrustIndicators renders with NEWS_HUB_TRUST_INDICATORS
 *   4. HubCircuit is rendered (decor slot)
 *   5. totalArticles prop appears in meta bar
 *   6. useCyclingText called with correct statuses
 */
import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';

// ---------------------------------------------------------------------------
// Mocks
// ---------------------------------------------------------------------------
vi.mock('framer-motion', () => ({
  motion: {
    div: ({ children, className, ...rest }: React.HTMLAttributes<HTMLDivElement>) =>
      <div className={className} {...rest}>{children}</div>,
    button: ({ children, className, onClick, ...rest }: React.ButtonHTMLAttributes<HTMLButtonElement>) =>
      <button className={className} onClick={onClick} {...rest}>{children}</button>,
    h1: ({ children, className, ...rest }: React.HTMLAttributes<HTMLHeadingElement>) =>
      <h1 className={className} {...rest}>{children}</h1>,
    p: ({ children, className, ...rest }: React.HTMLAttributes<HTMLParagraphElement>) =>
      <p className={className} {...rest}>{children}</p>,
    path: (props: React.SVGProps<SVGPathElement>) => <path {...props} />,
    circle: (props: React.SVGProps<SVGCircleElement>) => <circle {...props} />,
    line: (props: React.SVGProps<SVGLineElement>) => <line {...props} />,
  },
  useReducedMotion: () => false,
  AnimatePresence: ({ children }: { children: React.ReactNode }) => <>{children}</>,
}));

vi.mock('next/image', () => ({
  default: ({ src, alt, ...props }: { src: string; alt: string; [key: string]: unknown }) => (
    // eslint-disable-next-line @next/next/no-img-element
    <img src={src} alt={alt} {...(props as React.ImgHTMLAttributes<HTMLImageElement>)} />
  ),
}));

vi.mock('@/components/hero/hero-parallax-shell', () => ({
  HeroParallaxShell: ({ content, decor, scrollIndicator }: { content: React.ReactNode; decor?: React.ReactNode; scrollIndicator?: React.ReactNode }) => (
    <div data-testid="hero-parallax-shell">
      {decor && <div data-testid="hero-decor">{decor}</div>}
      <div data-testid="hero-content">{content}</div>
      {scrollIndicator && <div data-testid="scroll-indicator">{scrollIndicator}</div>}
    </div>
  ),
}));

vi.mock('@/components/hero/use-hero-parallax', () => ({
  useHeroParallax: () => ({
    sectionRef: { current: null },
    backgroundFrameStyle: {},
    contentStyle: {},
    shouldReduceMotion: false,
  }),
}));

vi.mock('@/components/hero/hero-tokens', () => ({
  HERO_H1_TALL_BLUEPRINT: 'hero-h1-tall-blueprint',
}));

vi.mock('@/lib/scroll-to-section', () => ({
  scrollToElementWithOffset: vi.fn(),
}));

vi.mock('@/lib/hooks/use-cycling-text', () => ({
  useCyclingText: vi.fn((items: string[], _interval?: number) => ({
    currentText: items?.[0] ?? '',
    cycleIndex: 0,
    isAnimating: false,
  })),
}));

vi.mock('@/components/shared', () => ({
  HeroTrustIndicators: ({ items }: { items: readonly { icon: string; title: string; description: string }[] }) => (
    <div data-testid="hero-trust-indicators">
      {items.map((item) => (
        <div key={item.title} data-testid="trust-indicator-item">
          <span data-testid="trust-label">{item.title}</span>
          <span data-testid="trust-value">{item.description}</span>
        </div>
      ))}
    </div>
  ),
}));

vi.mock('@/components/hero/circuits/hub-circuit', () => ({
  HubCircuit: ({ shouldReduceMotion }: { shouldReduceMotion: boolean }) => (
    <div data-testid="hub-circuit" data-reduce-motion={String(shouldReduceMotion)} />
  ),
}));

vi.mock('lucide-react', () => ({
  Activity: () => <svg data-testid="icon-activity" />,
  ChevronDown: () => <svg data-testid="icon-chevron-down" />,
}));

import { NewsHubHero } from '../news-hub-hero';
import { useCyclingText } from '@/lib/hooks/use-cycling-text';

// ---------------------------------------------------------------------------
// Tests
// ---------------------------------------------------------------------------
describe('NewsHubHero', () => {
  describe('Renders without crashing', () => {
    it('renders the hero parallax shell', () => {
      render(<NewsHubHero totalArticles={42} />);
      expect(screen.getByTestId('hero-parallax-shell')).toBeInTheDocument();
    });
  });

  describe('Key content preserved', () => {
    it('renders Editorial headline', () => {
      render(<NewsHubHero totalArticles={42} />);
      expect(screen.getByText('Editorial')).toBeInTheDocument();
    });

    it('renders Command Centre headline', () => {
      render(<NewsHubHero totalArticles={42} />);
      expect(screen.getByText('Command Centre')).toBeInTheDocument();
    });

    it('renders description text', () => {
      render(<NewsHubHero totalArticles={42} />);
      expect(screen.getByText(/Live editorial hub for campaigns/i)).toBeInTheDocument();
    });

    it('renders Editorial Systems eyebrow', () => {
      render(<NewsHubHero totalArticles={42} />);
      expect(screen.getByText('Editorial Systems')).toBeInTheDocument();
    });
  });

  describe('HubCircuit decor rendered', () => {
    it('renders HubCircuit in decor slot', () => {
      render(<NewsHubHero totalArticles={42} />);
      expect(screen.getByTestId('hub-circuit')).toBeInTheDocument();
    });
  });

  describe('Trust indicators', () => {
    it('renders HeroTrustIndicators component', () => {
      render(<NewsHubHero totalArticles={42} />);
      expect(screen.getByTestId('hero-trust-indicators')).toBeInTheDocument();
    });

    it('renders exactly 4 trust indicator items', () => {
      render(<NewsHubHero totalArticles={42} />);
      const items = screen.getAllByTestId('trust-indicator-item');
      expect(items).toHaveLength(4);
    });

    it('renders Expert-Led Insights trust indicator', () => {
      render(<NewsHubHero totalArticles={42} />);
      expect(screen.getByText('Expert-Led Insights')).toBeInTheDocument();
    });

    it('renders Editorial Standards trust indicator', () => {
      render(<NewsHubHero totalArticles={42} />);
      expect(screen.getByText('Editorial Standards')).toBeInTheDocument();
    });

    it('renders Live Campaign Feed trust indicator', () => {
      render(<NewsHubHero totalArticles={42} />);
      expect(screen.getByText('Live Campaign Feed')).toBeInTheDocument();
    });

    it('renders Full Sector Coverage trust indicator', () => {
      render(<NewsHubHero totalArticles={42} />);
      expect(screen.getByText('Full Sector Coverage')).toBeInTheDocument();
    });
  });

  describe('totalArticles prop', () => {
    it('renders totalArticles in meta bar', () => {
      render(<NewsHubHero totalArticles={99} />);
      expect(screen.getByText('99 Seeded Stories')).toBeInTheDocument();
    });

    it('renders meta items: Category-first Routing and SSR + SSG Delivery', () => {
      render(<NewsHubHero totalArticles={10} />);
      expect(screen.getByText('Category-first Routing')).toBeInTheDocument();
      expect(screen.getByText('SSR + SSG Delivery')).toBeInTheDocument();
    });
  });

  describe('useCyclingText integration', () => {
    it('calls useCyclingText with the correct statuses array', () => {
      render(<NewsHubHero totalArticles={5} />);
      expect(useCyclingText).toHaveBeenCalledWith(
        ['INITIALIZING', 'LOADING_EDITORIAL', 'INDEXING_STORIES', 'SYSTEMS_READY'],
        380,
      );
    });

    it('displays status text from useCyclingText', () => {
      render(<NewsHubHero totalArticles={5} />);
      // Mock returns 'INITIALIZING' as first item
      expect(screen.getByText(/News Hub \/\/ INITIALIZING/i)).toBeInTheDocument();
    });
  });

  describe('Scroll indicator', () => {
    it('renders Explore Stories scroll indicator', () => {
      render(<NewsHubHero totalArticles={5} />);
      expect(screen.getByText('Explore Stories')).toBeInTheDocument();
    });
  });
});
