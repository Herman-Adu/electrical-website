import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
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

    it('renders all value titles', () => {
      render(<SectionValues data={mockSectionValuesData} />);
      expect(screen.getByText('Innovation')).toBeInTheDocument();
      expect(screen.getByText('Reliability')).toBeInTheDocument();
      expect(screen.getByText('Sustainability')).toBeInTheDocument();
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

    it('full description always visible in DOM', () => {
      render(<SectionValues data={mockSectionValuesData} />);

      mockSectionValuesData.values.forEach(value => {
        expect(screen.getByText(value.full)).toBeInTheDocument();
        expect(screen.getByText(value.full)).toBeVisible();
      });
    });

    it('short tagline visible for each card', () => {
      render(<SectionValues data={mockSectionValuesData} />);

      mockSectionValuesData.values.forEach(value => {
        expect(screen.getByText(value.short)).toBeInTheDocument();
        expect(screen.getByText(value.short)).toBeVisible();
      });
    });
  });

  describe('Content & Accessibility', () => {
    it('renders tagline when provided', () => {
      render(<SectionValues data={mockSectionValuesData} />);
      expect(screen.getByText('Engineering Excellence Since 2009')).toBeInTheDocument();
    });

    it('all full descriptions visible and readable', () => {
      render(<SectionValues data={mockSectionValuesData} />);

      mockSectionValuesData.values.forEach(value => {
        const element = screen.getByText(value.full);
        expect(element).toHaveClass('text-sm');
        expect(element).toHaveClass('text-muted-foreground');
      });
    });

    it('icon and title visible for each card', () => {
      render(<SectionValues data={mockSectionValuesData} />);
      const cards = screen.getAllByTestId('section-value-card');
      expect(cards).toHaveLength(mockSectionValuesData.values.length);

      cards.forEach((card) => {
        expect(card.querySelector('svg')).toBeInTheDocument();
      });
    });
  });

  describe('Hover Effects', () => {
    it('card has hover styling classes', () => {
      render(<SectionValues data={mockSectionValuesData} />);
      const cards = screen.getAllByTestId('section-value-card');

      cards.forEach(card => {
        expect(card.className).toContain('group');
        expect(card.className).toContain('hover:border-electric-cyan');
      });
    });

    it('bottom accent line present for hover effect', () => {
      render(<SectionValues data={mockSectionValuesData} />);
      const card = screen.getAllByTestId('section-value-card')[0];
      const accentLine = card.querySelector('div[style*="background"]');
      expect(accentLine).toBeInTheDocument();
    });
  });
});
