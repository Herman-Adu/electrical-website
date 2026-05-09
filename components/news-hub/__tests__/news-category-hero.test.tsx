/**
 * TDD: news-category-hero per-slug trust indicators tests
 * Covers:
 *   1. Renders without crashing for each slug
 *   2. HeroTrustIndicators renders (data-testid="hero-trust-indicators")
 *   3. Does NOT render "All News" button
 *   4. Does NOT render "All Categories" button
 *   5. Renders correct title/accentWord per slug
 *   6. useEffect replaced with React 19 lazy state init
 */
import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import type { NewsCategory } from '@/types/news';

// ---------------------------------------------------------------------------
// Mocks
// ---------------------------------------------------------------------------
vi.mock('next/link', () => ({
  default: ({ href, children, ...props }: { href: string; children: React.ReactNode; [key: string]: unknown }) => (
    <a href={href} {...props}>{children}</a>
  ),
}));

vi.mock('next/image', () => ({
  default: ({ src, alt, ...props }: { src: string; alt: string; [key: string]: unknown }) => (
    // eslint-disable-next-line @next/next/no-img-element
    <img src={src} alt={alt} {...props} />
  ),
}));

vi.mock('framer-motion', () => ({
  motion: {
    div: ({ children, className, ...rest }: React.HTMLAttributes<HTMLDivElement>) =>
      <div className={className} {...rest}>{children}</div>,
    nav: ({ children, className, ...rest }: React.HTMLAttributes<HTMLElement>) =>
      <nav className={className} {...rest}>{children}</nav>,
    button: ({ children, className, onClick, ...rest }: React.ButtonHTMLAttributes<HTMLButtonElement>) =>
      <button className={className} onClick={onClick} {...rest}>{children}</button>,
    h1: ({ children, className, ...rest }: React.HTMLAttributes<HTMLHeadingElement>) =>
      <h1 className={className} {...rest}>{children}</h1>,
    p: ({ children, className, ...rest }: React.HTMLAttributes<HTMLParagraphElement>) =>
      <p className={className} {...rest}>{children}</p>,
  },
  useReducedMotion: () => false,
  AnimatePresence: ({ children }: { children: React.ReactNode }) => <>{children}</>,
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
  HERO_H1_CATEGORY_IMAGE: 'hero-h1-category-image',
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
      {items.map((item, i) => (
        <div key={i} data-testid="trust-indicator-item">
          <span data-testid="trust-title">{item.title}</span>
          <span data-testid="trust-description">{item.description}</span>
          <span data-testid="trust-icon">{item.icon}</span>
        </div>
      ))}
    </div>
  ),
}));

vi.mock('lucide-react', () => ({
  Activity: () => <svg data-testid="icon-activity" />,
  ChevronDown: () => <svg data-testid="icon-chevron-down" />,
  Factory: () => <svg data-testid="icon-factory" />,
  FolderOpen: () => <svg data-testid="icon-folder-open" />,
  Handshake: () => <svg data-testid="icon-handshake" />,
  Home: () => <svg data-testid="icon-home" />,
  Lightbulb: () => <svg data-testid="icon-lightbulb" />,
  MessageSquareQuote: () => <svg data-testid="icon-message-square-quote" />,
}));

import { NewsCategoryHero } from '../news-category-hero';

// ---------------------------------------------------------------------------
// Fixtures
// ---------------------------------------------------------------------------
function makeCategory(slug: string, label: string): NewsCategory {
  return {
    slug: slug as NewsCategory['slug'],
    label,
    description: `Description for ${label}`,
  };
}

// ---------------------------------------------------------------------------
// Tests
// ---------------------------------------------------------------------------
describe('NewsCategoryHero', () => {
  describe('Renders without crashing for each slug', () => {
    const slugs: Array<{ slug: string; label: string }> = [
      { slug: 'partners', label: 'Partners' },
      { slug: 'case-studies', label: 'Case Studies' },
      { slug: 'insights', label: 'Insights' },
      { slug: 'reviews', label: 'Reviews' },
      { slug: 'residential', label: 'Residential' },
      { slug: 'industrial', label: 'Industrial' },
    ];

    slugs.forEach(({ slug, label }) => {
      it(`renders without crashing for slug: ${slug}`, () => {
        render(<NewsCategoryHero category={makeCategory(slug, label)} articleCount={5} />);
        expect(screen.getByTestId('hero-parallax-shell')).toBeInTheDocument();
      });
    });
  });

  describe('HeroTrustIndicators renders for all slugs', () => {
    const slugs: Array<{ slug: string; label: string }> = [
      { slug: 'partners', label: 'Partners' },
      { slug: 'case-studies', label: 'Case Studies' },
      { slug: 'insights', label: 'Insights' },
      { slug: 'reviews', label: 'Reviews' },
      { slug: 'residential', label: 'Residential' },
      { slug: 'industrial', label: 'Industrial' },
    ];

    slugs.forEach(({ slug, label }) => {
      it(`renders HeroTrustIndicators for slug: ${slug}`, () => {
        render(<NewsCategoryHero category={makeCategory(slug, label)} articleCount={5} />);
        expect(screen.getByTestId('hero-trust-indicators')).toBeInTheDocument();
      });

      it(`renders exactly 4 trust items for slug: ${slug}`, () => {
        render(<NewsCategoryHero category={makeCategory(slug, label)} articleCount={5} />);
        const items = screen.getAllByTestId('trust-indicator-item');
        expect(items).toHaveLength(4);
      });
    });

    it('renders HeroTrustIndicators for unknown (fallback) slug', () => {
      render(<NewsCategoryHero category={makeCategory('unknown', 'Unknown')} articleCount={0} />);
      expect(screen.getByTestId('hero-trust-indicators')).toBeInTheDocument();
    });

    it('renders exactly 4 trust items for unknown (fallback) slug', () => {
      render(<NewsCategoryHero category={makeCategory('unknown', 'Unknown')} articleCount={0} />);
      const items = screen.getAllByTestId('trust-indicator-item');
      expect(items).toHaveLength(4);
    });
  });

  describe('Does NOT render "All News" or "All Categories" buttons', () => {
    const slugs: Array<{ slug: string; label: string }> = [
      { slug: 'residential', label: 'Residential' },
      { slug: 'industrial', label: 'Industrial' },
      { slug: 'partners', label: 'Partners' },
      { slug: 'case-studies', label: 'Case Studies' },
      { slug: 'insights', label: 'Insights' },
      { slug: 'reviews', label: 'Reviews' },
    ];

    slugs.forEach(({ slug, label }) => {
      it(`does NOT render "All News" link for slug: ${slug}`, () => {
        render(<NewsCategoryHero category={makeCategory(slug, label)} articleCount={5} />);
        expect(screen.queryByText('All News')).not.toBeInTheDocument();
      });

      it(`does NOT render "All Categories" link for slug: ${slug}`, () => {
        render(<NewsCategoryHero category={makeCategory(slug, label)} articleCount={5} />);
        expect(screen.queryByText('All Categories')).not.toBeInTheDocument();
      });
    });
  });

  describe('Correct title and accentWord per slug', () => {
    it('residential: renders label "Residential" and accentWord "Living"', () => {
      render(<NewsCategoryHero category={makeCategory('residential', 'Residential')} articleCount={3} />);
      // Label appears in both breadcrumb span and h1 span
      const matches = screen.getAllByText('Residential');
      expect(matches.length).toBeGreaterThanOrEqual(1);
      expect(screen.getByText('Living')).toBeInTheDocument();
    });

    it('industrial: renders label "Industrial" and accentWord "Operations"', () => {
      render(<NewsCategoryHero category={makeCategory('industrial', 'Industrial')} articleCount={3} />);
      const matches = screen.getAllByText('Industrial');
      expect(matches.length).toBeGreaterThanOrEqual(1);
      expect(screen.getByText('Operations')).toBeInTheDocument();
    });

    it('partners: renders label "Partners" and accentWord "Partnerships"', () => {
      render(<NewsCategoryHero category={makeCategory('partners', 'Partners')} articleCount={3} />);
      // "Partners" appears in both breadcrumb and h1
      const partnerMatches = screen.getAllByText('Partners');
      expect(partnerMatches.length).toBeGreaterThanOrEqual(1);
      expect(screen.getByText('Partnerships')).toBeInTheDocument();
    });

    it('case-studies: renders label "Case Studies" and accentWord "Outcomes"', () => {
      render(<NewsCategoryHero category={makeCategory('case-studies', 'Case Studies')} articleCount={3} />);
      const matches = screen.getAllByText('Case Studies');
      expect(matches.length).toBeGreaterThanOrEqual(1);
      expect(screen.getByText('Outcomes')).toBeInTheDocument();
    });

    it('insights: renders label "Insights" and accentWord "Intelligence"', () => {
      render(<NewsCategoryHero category={makeCategory('insights', 'Insights')} articleCount={3} />);
      const matches = screen.getAllByText('Insights');
      expect(matches.length).toBeGreaterThanOrEqual(1);
      expect(screen.getByText('Intelligence')).toBeInTheDocument();
    });

    it('reviews: renders label "Reviews" and accentWord "Feedback"', () => {
      render(<NewsCategoryHero category={makeCategory('reviews', 'Reviews')} articleCount={3} />);
      const matches = screen.getAllByText('Reviews');
      expect(matches.length).toBeGreaterThanOrEqual(1);
      expect(screen.getByText('Feedback')).toBeInTheDocument();
    });
  });

  describe('Per-slug trust indicator labels', () => {
    it('residential: shows Smart Living, EV Charging, NICEIC Certified, 24-7 Support', () => {
      render(<NewsCategoryHero category={makeCategory('residential', 'Residential')} articleCount={3} />);
      expect(screen.getByText('Smart Living')).toBeInTheDocument();
      expect(screen.getByText('EV Charging')).toBeInTheDocument();
      expect(screen.getByText('NICEIC Certified')).toBeInTheDocument();
      expect(screen.getByText('24-7 Support')).toBeInTheDocument();
    });

    it('industrial: shows Industrial Grade, Maintenance Plans, Power Infrastructure, Safety Certified', () => {
      render(<NewsCategoryHero category={makeCategory('industrial', 'Industrial')} articleCount={3} />);
      expect(screen.getByText('Industrial Grade')).toBeInTheDocument();
      expect(screen.getByText('Maintenance Plans')).toBeInTheDocument();
      expect(screen.getByText('Power Infrastructure')).toBeInTheDocument();
      expect(screen.getByText('Safety Certified')).toBeInTheDocument();
    });

    it('partners: shows Strategic Partners, Accredited Network, Multi-sector, Due Diligence', () => {
      render(<NewsCategoryHero category={makeCategory('partners', 'Partners')} articleCount={3} />);
      expect(screen.getByText('Strategic Partners')).toBeInTheDocument();
      expect(screen.getByText('Accredited Network')).toBeInTheDocument();
      expect(screen.getByText('Multi-sector')).toBeInTheDocument();
      expect(screen.getByText('Due Diligence')).toBeInTheDocument();
    });

    it('case-studies: shows Real Outcomes, Verified Projects, Multi-sector, Live Results', () => {
      render(<NewsCategoryHero category={makeCategory('case-studies', 'Case Studies')} articleCount={3} />);
      expect(screen.getByText('Real Outcomes')).toBeInTheDocument();
      expect(screen.getByText('Verified Projects')).toBeInTheDocument();
      expect(screen.getByText('Multi-sector')).toBeInTheDocument();
      expect(screen.getByText('Live Results')).toBeInTheDocument();
    });

    it('insights: shows Market Intelligence, Industry Updates, Strategic Insights, Sector Coverage', () => {
      render(<NewsCategoryHero category={makeCategory('insights', 'Insights')} articleCount={3} />);
      expect(screen.getByText('Market Intelligence')).toBeInTheDocument();
      expect(screen.getByText('Industry Updates')).toBeInTheDocument();
      expect(screen.getByText('Strategic Insights')).toBeInTheDocument();
      expect(screen.getByText('Sector Coverage')).toBeInTheDocument();
    });

    it('reviews: shows Client Reviews, 5-Star Service, Community Trust, Customer First', () => {
      render(<NewsCategoryHero category={makeCategory('reviews', 'Reviews')} articleCount={3} />);
      expect(screen.getByText('Client Reviews')).toBeInTheDocument();
      expect(screen.getByText('5-Star Service')).toBeInTheDocument();
      expect(screen.getByText('Community Trust')).toBeInTheDocument();
      expect(screen.getByText('Customer First')).toBeInTheDocument();
    });

    it('fallback (unknown slug): shows Fully Certified, Expert Editorial, Live Updates, Sector Coverage', () => {
      render(<NewsCategoryHero category={makeCategory('unknown', 'Unknown')} articleCount={0} />);
      expect(screen.getByText('Fully Certified')).toBeInTheDocument();
      expect(screen.getByText('Expert Editorial')).toBeInTheDocument();
      expect(screen.getByText('Live Updates')).toBeInTheDocument();
      expect(screen.getByText('Sector Coverage')).toBeInTheDocument();
    });
  });

  describe('Article count renders correctly', () => {
    it('renders singular "Article" when count is 1', () => {
      render(<NewsCategoryHero category={makeCategory('insights', 'Insights')} articleCount={1} />);
      expect(screen.getByText('1 Article')).toBeInTheDocument();
    });

    it('renders plural "Articles" when count is > 1', () => {
      render(<NewsCategoryHero category={makeCategory('insights', 'Insights')} articleCount={7} />);
      expect(screen.getByText('7 Articles')).toBeInTheDocument();
    });
  });
});
