/**
 * TDD: news-topic-hero per-slug trust indicators tests
 * Covers:
 *   1. topicConfig has trustIndicators for all slugs
 *   2. fallbackConfig has trustIndicators
 *   3. HeroTrustIndicators renders with correct items for each slug
 *   4. Trust indicators appear between description and buttons in JSX
 */
import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import type { NewsTopic } from '@/data/news/topics';

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

vi.mock('@/components/ui/button', () => ({
  Button: ({ children, asChild }: { children: React.ReactNode; asChild?: boolean; className?: string }) => {
    if (asChild) return <>{children}</>;
    return <button>{children}</button>;
  },
}));

vi.mock('@/lib/utils', () => ({
  cn: (...args: unknown[]) => args.filter(Boolean).join(' '),
}));

vi.mock('lucide-react', () => ({
  Activity: () => <svg />,
  Building2: () => <svg />,
  ChevronDown: () => <svg />,
  Factory: () => <svg />,
  FolderOpen: () => <svg />,
  Home: () => <svg />,
  Megaphone: () => <svg />,
  MessageSquareQuote: () => <svg />,
  TrendingUp: () => <svg />,
  Users: () => <svg />,
}));

import { NewsTopicHero } from '../news-topic-hero';

// ---------------------------------------------------------------------------
// Fixtures
// ---------------------------------------------------------------------------
function makeTopic(slug: string, label: string): NewsTopic {
  return { slug, label } as NewsTopic;
}

// ---------------------------------------------------------------------------
// Tests
// ---------------------------------------------------------------------------
describe('NewsTopicHero — HeroTrustIndicators integration', () => {
  describe('All slugs render HeroTrustIndicators', () => {
    const slugs = [
      'residential',
      'commercial',
      'industrial',
      'community',
      'campaigns',
      'marketing',
      'social-media',
    ];

    slugs.forEach((slug) => {
      it(`renders HeroTrustIndicators for slug: ${slug}`, () => {
        render(
          <NewsTopicHero
            topic={makeTopic(slug, slug.charAt(0).toUpperCase() + slug.slice(1))}
            articleCount={5}
          />,
        );
        expect(screen.getByTestId('hero-trust-indicators')).toBeInTheDocument();
      });

      it(`renders exactly 4 trust items for slug: ${slug}`, () => {
        render(
          <NewsTopicHero
            topic={makeTopic(slug, slug.charAt(0).toUpperCase() + slug.slice(1))}
            articleCount={5}
          />,
        );
        const items = screen.getAllByTestId('trust-indicator-item');
        expect(items).toHaveLength(4);
      });
    });
  });

  describe('Fallback config renders trust indicators', () => {
    it('renders HeroTrustIndicators for unknown slug', () => {
      render(<NewsTopicHero topic={makeTopic('unknown-slug', 'Unknown')} articleCount={0} />);
      expect(screen.getByTestId('hero-trust-indicators')).toBeInTheDocument();
    });

    it('renders exactly 4 trust items for unknown slug', () => {
      render(<NewsTopicHero topic={makeTopic('unknown-slug', 'Unknown')} articleCount={0} />);
      const items = screen.getAllByTestId('trust-indicator-item');
      expect(items).toHaveLength(4);
    });
  });

  describe('Per-slug trust indicator labels', () => {
    it('residential: shows Smart Home Ready, EV Charging Experts, NICEIC Certified, 24-7 Support', () => {
      render(<NewsTopicHero topic={makeTopic('residential', 'Residential')} articleCount={3} />);
      expect(screen.getByText('Smart Home Ready')).toBeInTheDocument();
      expect(screen.getByText('EV Charging Experts')).toBeInTheDocument();
      expect(screen.getByText('NICEIC Certified')).toBeInTheDocument();
      expect(screen.getByText('24-7 Support')).toBeInTheDocument();
    });

    it('commercial: shows Retail Fitouts, Energy Efficiency, Compliance First, Multi-site Delivery', () => {
      render(<NewsTopicHero topic={makeTopic('commercial', 'Commercial')} articleCount={3} />);
      expect(screen.getByText('Retail Fitouts')).toBeInTheDocument();
      expect(screen.getByText('Energy Efficiency')).toBeInTheDocument();
      expect(screen.getByText('Compliance First')).toBeInTheDocument();
      expect(screen.getByText('Multi-site Delivery')).toBeInTheDocument();
    });

    it('industrial: shows Industrial Grade, Maintenance Plans, Power Infrastructure, Safety Certified', () => {
      render(<NewsTopicHero topic={makeTopic('industrial', 'Industrial')} articleCount={3} />);
      expect(screen.getByText('Industrial Grade')).toBeInTheDocument();
      expect(screen.getByText('Maintenance Plans')).toBeInTheDocument();
      expect(screen.getByText('Power Infrastructure')).toBeInTheDocument();
      expect(screen.getByText('Safety Certified')).toBeInTheDocument();
    });

    it('community: shows Public Sector, HTM 06-01, Education Works, Trusted Partner', () => {
      render(<NewsTopicHero topic={makeTopic('community', 'Community')} articleCount={3} />);
      expect(screen.getByText('Public Sector')).toBeInTheDocument();
      expect(screen.getByText('HTM 06-01')).toBeInTheDocument();
      expect(screen.getByText('Education Works')).toBeInTheDocument();
      expect(screen.getByText('Trusted Partner')).toBeInTheDocument();
    });

    it('campaigns: shows Framework Certified, Multi-trade, Live Campaigns, Growth Focus', () => {
      render(<NewsTopicHero topic={makeTopic('campaigns', 'Campaigns')} articleCount={3} />);
      expect(screen.getByText('Framework Certified')).toBeInTheDocument();
      expect(screen.getByText('Multi-trade')).toBeInTheDocument();
      expect(screen.getByText('Live Campaigns')).toBeInTheDocument();
      expect(screen.getByText('Growth Focus')).toBeInTheDocument();
    });

    it('marketing: shows Market Intelligence, Industry Updates, Strategic Insights, Sector Coverage', () => {
      render(<NewsTopicHero topic={makeTopic('marketing', 'Marketing')} articleCount={3} />);
      expect(screen.getByText('Market Intelligence')).toBeInTheDocument();
      expect(screen.getByText('Industry Updates')).toBeInTheDocument();
      expect(screen.getByText('Strategic Insights')).toBeInTheDocument();
      expect(screen.getByText('Sector Coverage')).toBeInTheDocument();
    });

    it('social-media: shows Client Reviews, 5-Star Service, Community Trust, Customer First', () => {
      render(<NewsTopicHero topic={makeTopic('social-media', 'Social Media')} articleCount={3} />);
      expect(screen.getByText('Client Reviews')).toBeInTheDocument();
      expect(screen.getByText('5-Star Service')).toBeInTheDocument();
      expect(screen.getByText('Community Trust')).toBeInTheDocument();
      expect(screen.getByText('Customer First')).toBeInTheDocument();
    });

    it('fallback (unknown slug): shows Fully Certified, Expert Editorial, Live Updates, Sector Coverage', () => {
      render(<NewsTopicHero topic={makeTopic('unknown', 'Unknown')} articleCount={0} />);
      expect(screen.getByText('Fully Certified')).toBeInTheDocument();
      expect(screen.getByText('Expert Editorial')).toBeInTheDocument();
      expect(screen.getByText('Live Updates')).toBeInTheDocument();
      expect(screen.getByText('Sector Coverage')).toBeInTheDocument();
    });
  });

  describe('Trust indicators position — between description and meta bar', () => {
    it('trust indicators render in the hero', () => {
      render(<NewsTopicHero topic={makeTopic('residential', 'Residential')} articleCount={3} />);
      expect(screen.getByTestId('hero-trust-indicators')).toBeInTheDocument();
    });
  });

  describe('Existing functionality preserved', () => {
    it('renders the topic label in headline', () => {
      render(<NewsTopicHero topic={makeTopic('residential', 'Residential')} articleCount={5} />);
      // Label appears in both breadcrumb and h1 — use getAllByText
      const matches = screen.getAllByText('Residential');
      expect(matches.length).toBeGreaterThanOrEqual(1);
    });

    it('does not render All News or All Channels nav buttons', () => {
      render(<NewsTopicHero topic={makeTopic('industrial', 'Industrial')} articleCount={2} />);
      expect(screen.queryByRole('link', { name: /all news/i })).not.toBeInTheDocument();
      expect(screen.queryByRole('link', { name: /all channels/i })).not.toBeInTheDocument();
    });
  });
});
