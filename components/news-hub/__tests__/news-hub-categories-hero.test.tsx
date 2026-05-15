/**
 * TDD: news-hub-categories-hero tests
 * Covers:
 *   1. Button hrefs (correct /news-hub and /news-hub/filter/campaigns)
 *   2. useCyclingText replaces useEffect status cycling
 *   3. HeroTrustIndicators renders with CATEGORIES_TRUST_INDICATORS
 */
import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';

// ---------------------------------------------------------------------------
// Mocks
// ---------------------------------------------------------------------------
vi.mock('next/link', () => ({
  default: ({ href, children, ...props }: { href: string; children: React.ReactNode; [key: string]: unknown }) => (
    <a href={href} {...props}>{children}</a>
  ),
}));

vi.mock('framer-motion', () => ({
  motion: {
    div: ({ children, className, ...rest }: React.HTMLAttributes<HTMLDivElement>) =>
      <div className={className} {...rest}>{children}</div>,
    nav: ({ children, className, ...rest }: React.HTMLAttributes<HTMLElement>) =>
      <nav className={className} {...rest}>{children}</nav>,
    h1: ({ children, className, ...rest }: React.HTMLAttributes<HTMLHeadingElement>) =>
      <h1 className={className} {...rest}>{children}</h1>,
    p: ({ children, className, ...rest }: React.HTMLAttributes<HTMLParagraphElement>) =>
      <p className={className} {...rest}>{children}</p>,
    button: ({ children, className, onClick, ...rest }: React.ButtonHTMLAttributes<HTMLButtonElement>) =>
      <button className={className} onClick={onClick} {...rest}>{children}</button>,
    path: (props: React.SVGProps<SVGPathElement>) => <path {...props} />,
    line: (props: React.SVGProps<SVGLineElement>) => <line {...props} />,
    circle: (props: React.SVGProps<SVGCircleElement>) => <circle {...props} />,
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

vi.mock('@/components/hero/circuits/categories-circuit', () => ({
  CategoriesCircuit: ({ shouldReduceMotion }: { shouldReduceMotion: boolean }) => (
    <div data-testid="categories-circuit" data-reduce-motion={String(shouldReduceMotion)} />
  ),
}));

vi.mock('@/components/hero/hero-parallax-shell', () => ({
  HeroParallaxShell: ({ content, scrollIndicator }: { content: React.ReactNode; scrollIndicator?: React.ReactNode }) => (
    <div data-testid="hero-parallax-shell">
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
  HERO_H1_COMPACT_BLUEPRINT: 'hero-h1-compact-blueprint',
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

vi.mock('@/components/shared/hero-trust-indicators', () => ({
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

vi.mock('@/components/ui/button', () => ({
  Button: ({ children, asChild, ...props }: { children: React.ReactNode; asChild?: boolean; className?: string }) => {
    if (asChild) return <>{children}</>;
    return <button {...props}>{children}</button>;
  },
}));

vi.mock('@/lib/utils', () => ({
  cn: (...args: unknown[]) => args.filter(Boolean).join(' '),
}));

vi.mock('lucide-react', () => ({
  Activity: () => <svg data-testid="icon-activity" />,
  ChevronDown: () => <svg data-testid="icon-chevron-down" />,
  Layers: () => <svg data-testid="icon-layers" />,
}));

import { NewsHubCategoriesHero } from '../news-hub-categories-hero';
import { useCyclingText } from '@/lib/hooks/use-cycling-text';

// ---------------------------------------------------------------------------
// Tests
// ---------------------------------------------------------------------------
describe('NewsHubCategoriesHero', () => {
  describe('Button hrefs', () => {
    it('does not render Start a Campaign button', () => {
      render(<NewsHubCategoriesHero categoryCount={6} />);
      expect(screen.queryByRole('link', { name: /start a campaign/i })).not.toBeInTheDocument();
    });

    it('No button links to /projects', () => {
      render(<NewsHubCategoriesHero categoryCount={6} />);
      const links = screen.getAllByRole('link');
      links.forEach((link) => {
        expect(link.getAttribute('href')).not.toBe('/projects');
      });
    });
  });

  describe('useCyclingText integration (replaces useEffect)', () => {
    it('calls useCyclingText with the correct statuses array', () => {
      render(<NewsHubCategoriesHero categoryCount={6} />);
      expect(useCyclingText).toHaveBeenCalledWith(
        ['INITIALIZING', 'LOADING_LANES', 'SCANNING_CATEGORIES', 'SYSTEMS_READY'],
        380,
      );
    });

    it('displays the cycling status text from useCyclingText', () => {
      render(<NewsHubCategoriesHero categoryCount={6} />);
      // Mock returns 'INITIALIZING' as first status
      expect(screen.getByText(/News Hub \/\/ INITIALIZING/i)).toBeInTheDocument();
    });
  });

  describe('HeroTrustIndicators — CATEGORIES_TRUST_INDICATORS', () => {
    it('renders HeroTrustIndicators component', () => {
      render(<NewsHubCategoriesHero categoryCount={6} />);
      expect(screen.getByTestId('hero-trust-indicators')).toBeInTheDocument();
    });

    it('renders exactly 4 trust indicator items', () => {
      render(<NewsHubCategoriesHero categoryCount={6} />);
      const items = screen.getAllByTestId('trust-indicator-item');
      expect(items).toHaveLength(4);
    });

    it('renders Content Lanes trust indicator', () => {
      render(<NewsHubCategoriesHero categoryCount={6} />);
      expect(screen.getByText('Content Lanes')).toBeInTheDocument();
    });

    it('renders Expert Editorial trust indicator', () => {
      render(<NewsHubCategoriesHero categoryCount={6} />);
      expect(screen.getByText('Expert Editorial')).toBeInTheDocument();
    });

    it('renders Live Updates trust indicator', () => {
      render(<NewsHubCategoriesHero categoryCount={6} />);
      expect(screen.getByText('Live Updates')).toBeInTheDocument();
    });

    it('renders CMS Ready trust indicator', () => {
      render(<NewsHubCategoriesHero categoryCount={6} />);
      expect(screen.getByText('CMS Ready')).toBeInTheDocument();
    });

    it('trust indicators render in the hero', () => {
      render(<NewsHubCategoriesHero categoryCount={6} />);
      expect(screen.getByTestId('hero-trust-indicators')).toBeInTheDocument();
    });
  });

  describe('Existing functionality preserved', () => {
    it('renders Browse All Categories headline', () => {
      render(<NewsHubCategoriesHero categoryCount={6} />);
      expect(screen.getByText('Browse')).toBeInTheDocument();
      expect(screen.getByText('All Categories')).toBeInTheDocument();
    });

    it('renders description text', () => {
      render(<NewsHubCategoriesHero categoryCount={6} />);
      expect(screen.getByText(/Six dedicated editorial lanes/i)).toBeInTheDocument();
    });
  });
});
