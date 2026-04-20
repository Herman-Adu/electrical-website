import { describe, it, expect, beforeEach, vi } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { SectionValues } from '../section-values';
import type { SectionValuesData } from '@/types/sections';

// Mock framer-motion
vi.mock('framer-motion', () => ({
  motion: {
    div: ({ children, ...props }: any) => <div {...props}>{children}</div>,
  },
  useInView: () => true,
  useReducedMotion: () => false,
}));

// Mock useAnimatedBorders
vi.mock('@/lib/use-animated-borders', () => ({
  useAnimatedBorders: () => ({
    sectionRef: { current: null },
    lineScale: 1,
    shouldReduce: false,
  }),
  AnimatedBorders: () => <div data-testid="animated-borders" />,
}));

// Mock icon-map
vi.mock('../icon-map', () => ({
  getIcon: () => () => <svg data-testid="icon" />,
}));

// Mock ScrollReveal
vi.mock('@/components/ui/scroll-reveal', () => ({
  ScrollReveal: ({ children }: any) => <div>{children}</div>,
}));

// Mock data
const mockSectionValuesData: SectionValuesData = {
  sectionId: 'core-values',
  label: 'Core Values',
  headline: 'What Drives Us',
  headlineHighlight: 'Drives',
  description: 'Our core values guide every decision we make.',
  values: [
    {
      title: 'Innovation',
      short: 'Leading electrical solutions',
      full: 'We continuously innovate and advance our electrical engineering practices to deliver cutting-edge solutions that push the boundaries of what\'s possible.',
      icon: 'Zap',
      color: 'cyan',
    },
    {
      title: 'Reliability',
      short: 'Systems you can trust',
      full: 'Reliability is the foundation of every project. Our systems are engineered for longevity and backed by our commitment to uptime and performance.',
      icon: 'Shield',
      color: 'cyan',
    },
    {
      title: 'Sustainability',
      short: 'Environmental responsibility',
      full: 'We are committed to sustainable practices that minimize environmental impact through energy-efficient designs and renewable energy integration.',
      icon: 'Shield',
      color: 'amber',
    },
  ],
  tagline: 'Engineering Excellence Since 2009',
};

describe('SectionValues Component - CLS & A11y Tests', () => {
  describe('Rendering', () => {
    it('renders all value cards with correct count', () => {
      render(<SectionValues data={mockSectionValuesData} />);
      expect(screen.getAllByTestId('section-value-card')).toHaveLength(3);
    });

    it('renders headline with highlight', () => {
      render(<SectionValues data={mockSectionValuesData} />);
      expect(screen.getByText('Drives')).toHaveClass('text-electric-cyan');
    });
  });

  describe('CLS Prevention', () => {
    it('card height stable on hover (no layout shift)', async () => {
      const { container } = render(<SectionValues data={mockSectionValuesData} />);
      const card = screen.getAllByTestId('section-value-card')[0] as HTMLElement;

      const heightBefore = card.offsetHeight;
      fireEvent.mouseEnter(card);

      await waitFor(() => {
        const heightAfter = card.offsetHeight;
        expect(Math.abs(heightAfter - heightBefore)).toBeLessThan(2);
      }, { timeout: 500 });
    });

    it('both descriptions exist in DOM (pre-allocated)', () => {
      render(<SectionValues data={mockSectionValuesData} />);

      mockSectionValuesData.values.forEach(value => {
        expect(screen.getByText(value.full)).toBeInTheDocument();
        expect(screen.getByText(value.short)).toBeInTheDocument();
      });
    });

    it('full description hidden initially (opacity-0 absolute positioning)', () => {
      render(<SectionValues data={mockSectionValuesData} />);
      const cards = screen.getAllByTestId('section-value-card');
      const innovationCard = cards[0];
      const fullDescElement = innovationCard.querySelector('[id="value-Innovation"]') as HTMLElement;
      expect(fullDescElement).toHaveClass('opacity-0');
    });
  });

  describe('Accessibility - Keyboard', () => {
    it('card has role="button"', () => {
      render(<SectionValues data={mockSectionValuesData} />);
      const cards = screen.getAllByTestId('section-value-card');
      cards.forEach(card => {
        expect(card).toHaveAttribute('role', 'button');
      });
    });

    it('card has tabIndex={0} for focus', () => {
      render(<SectionValues data={mockSectionValuesData} />);
      const cards = screen.getAllByTestId('section-value-card');
      cards.forEach(card => {
        expect(card).toHaveAttribute('tabindex', '0');
      });
    });

    it('aria-expanded starts false', () => {
      render(<SectionValues data={mockSectionValuesData} />);
      const cards = screen.getAllByTestId('section-value-card');
      cards.forEach(card => {
        expect(card).toHaveAttribute('aria-expanded', 'false');
      });
    });

    it('Enter key toggles aria-expanded', async () => {
      const user = userEvent.setup();
      render(<SectionValues data={mockSectionValuesData} />);

      const card = screen.getAllByTestId('section-value-card')[0] as HTMLElement;
      card.focus();

      expect(card).toHaveAttribute('aria-expanded', 'false');

      await user.keyboard('{Enter}');

      await waitFor(() => {
        expect(card).toHaveAttribute('aria-expanded', 'true');
      });
    });

    it('Space key toggles aria-expanded', async () => {
      const user = userEvent.setup();
      render(<SectionValues data={mockSectionValuesData} />);

      const card = screen.getAllByTestId('section-value-card')[0] as HTMLElement;
      card.focus();

      expect(card).toHaveAttribute('aria-expanded', 'false');

      await user.keyboard(' ');

      await waitFor(() => {
        expect(card).toHaveAttribute('aria-expanded', 'true');
      });
    });
  });

  describe('Accessibility - Screen Readers', () => {
    it('has aria-describedby linking to description', () => {
      render(<SectionValues data={mockSectionValuesData} />);
      const cards = screen.getAllByTestId('section-value-card');
      cards.forEach(card => {
        expect(card).toHaveAttribute('aria-describedby');
      });
    });

    it('full description not hidden from screen readers', () => {
      render(<SectionValues data={mockSectionValuesData} />);

      mockSectionValuesData.values.forEach(value => {
        const fullDesc = screen.getByText(value.full);
        expect(fullDesc).not.toHaveAttribute('aria-hidden', 'true');
      });
    });
  });

  describe('Independent State', () => {
    it('each card maintains independent expanded state', async () => {
      const user = userEvent.setup();
      render(<SectionValues data={mockSectionValuesData} />);

      const cards = screen.getAllByTestId('section-value-card');

      await user.click(cards[0]);
      await waitFor(() => {
        expect(cards[0]).toHaveAttribute('aria-expanded', 'true');
        expect(cards[1]).toHaveAttribute('aria-expanded', 'false');
      });
    });
  });

  describe('Hover Behavior', () => {
    it('full description shown on hover via group-hover:opacity-100', () => {
      render(<SectionValues data={mockSectionValuesData} />);
      const card = screen.getAllByTestId('section-value-card')[0];

      // Component uses opacity-based hover via group-hover:opacity-100
      const fullDesc = card.querySelector('[id="value-Innovation"]') as HTMLElement;
      expect(fullDesc.className).toContain('group-hover:opacity-100');
    });
  });
});
