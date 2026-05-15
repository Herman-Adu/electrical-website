/**
 * TDD: contact-hero tests (Phase 7 — refactored with ContactCircuit)
 * Covers:
 *   1. Renders without crashing
 *   2. Key content (title, description) appears in output
 *   3. HeroTrustIndicators renders with dynamic trustIndicators prop
 *   4. ContactCircuit is rendered (decor slot)
 *   5. badge.text appears in eyebrow
 *   6. hero.description appears in paragraph
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
  HERO_H1_COMPACT_BLUEPRINT: 'hero-h1-compact-blueprint',
}));

vi.mock('@/lib/scroll-to-section', () => ({
  scrollToElementWithOffset: vi.fn(),
}));

vi.mock('@/components/shared', () => ({
  HeroTrustIndicators: ({ items }: { items: readonly { icon: string; title: string; description: string }[] }) => (
    <div data-testid="hero-trust-indicators">
      {items.map((item, i) => (
        <div key={i} data-testid="trust-indicator-item">
          <span data-testid="trust-label">{item.title}</span>
          <span data-testid="trust-value">{item.description}</span>
        </div>
      ))}
    </div>
  ),
}));

vi.mock('@/components/hero/circuits/contact-circuit', () => ({
  ContactCircuit: ({ shouldReduceMotion }: { shouldReduceMotion: boolean }) => (
    <div data-testid="contact-circuit" data-reduce-motion={String(shouldReduceMotion)} />
  ),
}));

vi.mock('lucide-react', () => ({
  Activity: () => <svg data-testid="icon-activity" />,
  ChevronDown: () => <svg data-testid="icon-chevron-down" />,
}));

import { ContactHero } from '../contact-hero';

// ---------------------------------------------------------------------------
// Fixtures
// ---------------------------------------------------------------------------
const mockHero = {
  badge: {
    icon: 'Phone' as const,
    text: 'Get In Touch',
  },
  title: 'Contact Nexgen',
  description: 'Reach our expert team for all electrical enquiries.',
};

import type { IconName } from '@/types/sections';

const mockTrustIndicators: Array<{ icon: IconName; title: string; description: string }> = [
  { icon: 'Shield' as IconName, title: 'NICEIC Approved', description: 'Fully certified' },
  { icon: 'Clock' as IconName, title: '24/7 Support', description: 'Always available' },
  { icon: 'Award' as IconName, title: '10+ Years', description: 'Industry experience' },
  { icon: 'Zap' as IconName, title: 'Fast Response', description: 'Same day service' },
];

// ---------------------------------------------------------------------------
// Tests
// ---------------------------------------------------------------------------
describe('ContactHero', () => {
  describe('Renders without crashing', () => {
    it('renders the hero parallax shell', () => {
      render(<ContactHero hero={mockHero} trustIndicators={mockTrustIndicators} />);
      expect(screen.getByTestId('hero-parallax-shell')).toBeInTheDocument();
    });
  });

  describe('Key content preserved', () => {
    it('renders Contact headline', () => {
      render(<ContactHero hero={mockHero} trustIndicators={mockTrustIndicators} />);
      expect(screen.getByText('Contact')).toBeInTheDocument();
    });

    it('renders Nexgen Electrical headline', () => {
      render(<ContactHero hero={mockHero} trustIndicators={mockTrustIndicators} />);
      expect(screen.getByText('Nexgen Electrical')).toBeInTheDocument();
    });

    it('renders Innovations headline', () => {
      render(<ContactHero hero={mockHero} trustIndicators={mockTrustIndicators} />);
      expect(screen.getByText('Innovations')).toBeInTheDocument();
    });

    it('renders hero.description in paragraph', () => {
      render(<ContactHero hero={mockHero} trustIndicators={mockTrustIndicators} />);
      expect(screen.getByText(mockHero.description)).toBeInTheDocument();
    });

    it('renders hero.badge.text in eyebrow', () => {
      render(<ContactHero hero={mockHero} trustIndicators={mockTrustIndicators} />);
      expect(screen.getByText(mockHero.badge.text)).toBeInTheDocument();
    });
  });

  describe('ContactCircuit decor rendered', () => {
    it('renders ContactCircuit in decor slot', () => {
      render(<ContactHero hero={mockHero} trustIndicators={mockTrustIndicators} />);
      expect(screen.getByTestId('contact-circuit')).toBeInTheDocument();
    });
  });

  describe('Trust indicators — dynamic prop', () => {
    it('renders HeroTrustIndicators component', () => {
      render(<ContactHero hero={mockHero} trustIndicators={mockTrustIndicators} />);
      expect(screen.getByTestId('hero-trust-indicators')).toBeInTheDocument();
    });

    it('renders all 4 trust indicator items', () => {
      render(<ContactHero hero={mockHero} trustIndicators={mockTrustIndicators} />);
      const items = screen.getAllByTestId('trust-indicator-item');
      expect(items).toHaveLength(4);
    });

    it('renders NICEIC Approved trust indicator', () => {
      render(<ContactHero hero={mockHero} trustIndicators={mockTrustIndicators} />);
      // NICEIC Approved appears in both trust indicators and meta bar, so use getAllByText
      const matches = screen.getAllByText('NICEIC Approved');
      expect(matches.length).toBeGreaterThanOrEqual(1);
    });

    it('renders 24/7 Support trust indicator', () => {
      render(<ContactHero hero={mockHero} trustIndicators={mockTrustIndicators} />);
      expect(screen.getByText('24/7 Support')).toBeInTheDocument();
    });
  });

  describe('Meta bar preserved', () => {
    it('renders Est. 2009', () => {
      render(<ContactHero hero={mockHero} trustIndicators={mockTrustIndicators} />);
      expect(screen.getByText('Est. 2009')).toBeInTheDocument();
    });

    it('renders NICEIC Approved (appears in meta bar)', () => {
      render(<ContactHero hero={mockHero} trustIndicators={mockTrustIndicators} />);
      // NICEIC Approved appears in both trust indicators and meta bar
      const matches = screen.getAllByText('NICEIC Approved');
      expect(matches.length).toBeGreaterThanOrEqual(2);
    });

    it('renders London & Home Counties in meta bar', () => {
      render(<ContactHero hero={mockHero} trustIndicators={mockTrustIndicators} />);
      expect(screen.getByText('London & Home Counties')).toBeInTheDocument();
    });
  });

  describe('Scroll indicator', () => {
    it('renders Start Enquiry scroll indicator', () => {
      render(<ContactHero hero={mockHero} trustIndicators={mockTrustIndicators} />);
      expect(screen.getByText('Start Enquiry')).toBeInTheDocument();
    });
  });
});
