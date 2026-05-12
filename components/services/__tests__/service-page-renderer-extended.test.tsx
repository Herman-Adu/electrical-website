import React from 'react';
import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { ServicePageRenderer } from '../service-page-renderer';
import type { ServicePageData } from '@/types/sections';

// ---------------------------------------------------------------------------
// Next.js mocks
// ---------------------------------------------------------------------------
vi.mock('next/image', () => ({
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  default: (props: any) => {
    const { fill, priority, sizes, ...rest } = props;
    return <img {...rest} />;
  },
}));

vi.mock('next/link', () => ({
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  default: ({ children, href, ...rest }: any) => (
    <a href={href} {...rest}>
      {children}
    </a>
  ),
}));

// ---------------------------------------------------------------------------
// Framer-motion mock
// ---------------------------------------------------------------------------
vi.mock('framer-motion', () => ({
  motion: new Proxy(
    {},
    {
      get: (_target, tag: string) =>
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        ({ children, ...props }: any) =>
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          React.createElement(tag as any, props, children),
    },
  ),
  useScroll: () => ({ scrollYProgress: { on: vi.fn() } }),
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  useTransform: (_source: any, _input: any, output: any) =>
    Array.isArray(output) ? output[0] : output,
  useReducedMotion: () => false,
  useInView: () => false,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  AnimatePresence: ({ children }: any) => children,
}));

// ---------------------------------------------------------------------------
// Shared-component mocks (prevent deep rendering of unrelated components)
// ---------------------------------------------------------------------------
vi.mock('@/components/shared', async () => {
  const React = await import('react');
  return {
    SectionProfile: () => <div data-testid="section-profile" />,
    SectionFeatures: () => <div data-testid="section-features" />,
    SectionValues: () => <div data-testid="section-values" />,
    SectionIntro: () => <div data-testid="section-intro" />,
    SectionCTA: () => <div data-testid="section-cta" />,
    ContentBreadcrumb: () => <nav data-testid="breadcrumb" />,
    HeroTrustIndicators: () => <div data-testid="trust-indicators" />,
    getIcon: () => () => <svg />,
    iconMap: {},
  };
});

vi.mock('@/components/sections/footer', () => ({
  Footer: () => <footer data-testid="footer" />,
}));

vi.mock('../service-page-hero', () => ({
  ServicePageHero: () => <div data-testid="service-page-hero" />,
}));

// ---------------------------------------------------------------------------
// ScrollReveal mock (used inside Features / Dashboard)
// ---------------------------------------------------------------------------
vi.mock('@/components/ui/scroll-reveal', () => ({
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  ScrollReveal: ({ children }: any) => <div>{children}</div>,
}));

// ---------------------------------------------------------------------------
// Dashboard sub-component mocks (prevent heavy live-animation rendering)
// ---------------------------------------------------------------------------
vi.mock('@/components/sections/dashboard/energy-metric', () => ({
  EnergyMetric: () => <div data-testid="energy-metric" />,
}));

vi.mock('@/components/sections/dashboard/system-terminal', () => ({
  SystemTerminal: () => <div data-testid="system-terminal" />,
}));

vi.mock('@/components/sections/dashboard/live-connections', () => ({
  LiveConnections: () => <div data-testid="live-connections" />,
}));

vi.mock('@/components/sections/dashboard/section-shell', () => ({
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  SectionShell: ({ children }: any) => <section>{children}</section>,
}));

vi.mock('@/components/sections/scheduler-card', () => ({
  SchedulerCard: () => <div data-testid="scheduler-card" />,
}));

// ---------------------------------------------------------------------------
// Hooks used within Features / Dashboard
// ---------------------------------------------------------------------------
vi.mock('@/lib/hooks/use-reduced-motion', () => ({
  useReducedMotion: () => false,
}));

vi.mock('@/lib/use-animated-borders', () => ({
  useAnimatedBorders: () => ({ sectionRef: { current: null }, lineScale: 1 }),
  AnimatedBorders: () => <div />,
}));

// ---------------------------------------------------------------------------
// Minimal ServicePageData fixture
// ---------------------------------------------------------------------------
const baseHero = {
  eyebrow: 'Commercial',
  headline: 'Commercial Electrical Services',
  headlineHighlight: 'Electrical',
  subheadline: 'Trusted commercial electrical contractors.',
};

const baseServiceData: ServicePageData = {
  slug: 'commercial',
  meta: {
    title: 'Commercial Electrical Services',
    description: 'Professional commercial electrical services.',
  },
  hero: baseHero,
  sections: [],
};

// ---------------------------------------------------------------------------
// Tests
// ---------------------------------------------------------------------------
describe('ServicePageRenderer — extended section types (TDD: red before Task 5)', () => {
  describe('features-animated section type', () => {
    it('renders Features component content for type features-animated', () => {
      const data: ServicePageData = {
        ...baseServiceData,
        // eslint-disable-next-line @typescript-eslint/no-explicit-any -- no dedicated type for features-animated/live-dashboard data yet
        sections: [{ type: 'features-animated', data: {} as any }],
      };

      render(<ServicePageRenderer data={data} />);

      // Features component renders "Intelligent Systems" heading
      expect(screen.getByText(/Intelligent/i)).toBeInTheDocument();
    });
  });

  describe('live-dashboard section type', () => {
    it('renders Dashboard component content for type live-dashboard', () => {
      const data: ServicePageData = {
        ...baseServiceData,
        // eslint-disable-next-line @typescript-eslint/no-explicit-any -- no dedicated type for features-animated/live-dashboard data yet
        sections: [{ type: 'live-dashboard', data: {} as any }],
      };

      render(<ServicePageRenderer data={data} />);

      // Dashboard component renders "Grid Intelligence" heading
      expect(screen.getByText(/Grid/i)).toBeInTheDocument();
    });
  });
});
