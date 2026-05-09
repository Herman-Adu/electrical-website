import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import type { TrustIndicatorItem } from '../hero-trust-indicators';
import { HeroTrustIndicators } from '../hero-trust-indicators';

vi.mock('framer-motion', () => ({
  motion: {
    div: ({ children, className, ...rest }: React.HTMLAttributes<HTMLDivElement>) => (
      <div className={className} {...rest}>{children}</div>
    ),
  },
}));

vi.mock('../icon-map', () => ({
  getIcon: () => (): React.JSX.Element => <svg data-testid="mock-icon" />,
}));

const MOCK_ITEMS: readonly TrustIndicatorItem[] = [
  { icon: 'Shield', title: 'Safe & Secure',  description: 'NICEIC certified engineers' },
  { icon: 'Clock',  title: 'Fast Response',  description: '24/7 availability' },
  { icon: 'Mail',   title: 'Direct Contact', description: 'Reach us anytime' },
  { icon: 'MessageSquare', title: 'Live Support', description: 'Expert guidance on-demand' },
] as const satisfies readonly TrustIndicatorItem[];

describe('HeroTrustIndicators', () => {
  describe('Rendering', () => {
    it('renders the correct number of cards', () => {
      render(<HeroTrustIndicators items={MOCK_ITEMS} />);
      const cards = screen.getAllByRole('article');
      expect(cards).toHaveLength(4);
    });

    it('renders all card titles', () => {
      render(<HeroTrustIndicators items={MOCK_ITEMS} />);
      expect(screen.getByText('Safe & Secure')).toBeInTheDocument();
      expect(screen.getByText('Fast Response')).toBeInTheDocument();
      expect(screen.getByText('Direct Contact')).toBeInTheDocument();
      expect(screen.getByText('Live Support')).toBeInTheDocument();
    });

    it('renders all card descriptions', () => {
      render(<HeroTrustIndicators items={MOCK_ITEMS} />);
      expect(screen.getByText('NICEIC certified engineers')).toBeInTheDocument();
      expect(screen.getByText('24/7 availability')).toBeInTheDocument();
      expect(screen.getByText('Reach us anytime')).toBeInTheDocument();
      expect(screen.getByText('Expert guidance on-demand')).toBeInTheDocument();
    });

    it('renders an icon for each card', () => {
      render(<HeroTrustIndicators items={MOCK_ITEMS} />);
      expect(screen.getAllByTestId('mock-icon')).toHaveLength(4);
    });

    it('renders without crashing when items array is empty', () => {
      expect(() => render(<HeroTrustIndicators items={[]} />)).not.toThrow();
    });
  });

  describe('className prop', () => {
    it('applies custom className to the grid container', () => {
      const { container } = render(
        <HeroTrustIndicators items={MOCK_ITEMS} className="test-custom-class" />
      );
      expect(container.firstChild).toHaveClass('test-custom-class');
    });

    it('preserves default grid classes when className is provided', () => {
      const { container } = render(
        <HeroTrustIndicators items={MOCK_ITEMS} className="extra-class" />
      );
      expect(container.firstChild).toHaveClass('grid');
    });
  });

  describe('Card structure', () => {
    it('each card has corner bracket decorators', () => {
      render(<HeroTrustIndicators items={MOCK_ITEMS} />);
      const cards = screen.getAllByRole('article');
      cards.forEach((card) => {
        const corners = card.querySelectorAll('[aria-hidden="true"]');
        expect(corners.length).toBeGreaterThanOrEqual(2);
      });
    });

    it('renders title with electric-cyan class', () => {
      render(<HeroTrustIndicators items={MOCK_ITEMS} />);
      const title = screen.getByText('Safe & Secure');
      expect(title.className).toContain('electric-cyan');
    });
  });

  describe('Type safety', () => {
    it('TrustIndicatorItem accepts valid IconName values', () => {
      const item: TrustIndicatorItem = {
        icon: 'Mail',
        title: 'Test Title',
        description: 'Test description',
      };
      expect(item.icon).toBe('Mail');
    });
  });
});
