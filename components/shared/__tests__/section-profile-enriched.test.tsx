import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { SectionProfile } from '../section-profile';
import type { SectionProfileData } from '@/types/sections';

// Mock next/image
vi.mock('next/image', () => ({
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  default: (props: any) => {
    const { fill, priority, sizes, ...rest } = props;
    return <img {...rest} />;
  },
}));

// Mock framer-motion
vi.mock('framer-motion', () => ({
  motion: {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    div: ({ children, ...props }: any) => <div {...props}>{children}</div>,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    h2: ({ children, ...props }: any) => <h2 {...props}>{children}</h2>,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    p: ({ children, ...props }: any) => <p {...props}>{children}</p>,
  },
  useScroll: () => ({ scrollYProgress: { on: vi.fn() } }),
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  useTransform: (_source: any, _input: any, output: any) =>
    Array.isArray(output) ? output[0] : output,
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

// Minimal valid SectionProfileData — required fields only
const baseData: SectionProfileData = {
  label: 'Commercial Installations',
  name: 'NexGen Commercial',
  bio: ['We deliver commercial electrical solutions.'],
  image: {
    src: '/images/commercial-hero.jpg',
    alt: 'Commercial installation',
  },
};

describe('SectionProfile — enriched fields (TDD: red before Task 4)', () => {
  describe('highlights grid', () => {
    it('renders highlight titles when highlights prop is provided', () => {
      const data: SectionProfileData = {
        ...baseData,
        highlights: [
          {
            icon: 'Zap',
            title: 'Motor Control',
            description: 'Full integration',
          },
          {
            icon: 'Shield',
            title: 'Safety Systems',
            description: 'BS 7671 compliance',
          },
        ],
      };

      render(<SectionProfile data={data} />);

      expect(screen.getByText('Motor Control')).toBeInTheDocument();
      expect(screen.getByText('Safety Systems')).toBeInTheDocument();
    });
  });

  describe('quote block', () => {
    it('renders quote text when quote prop is provided', () => {
      const data: SectionProfileData = {
        ...baseData,
        quote: 'This is a test quote',
      };

      render(<SectionProfile data={data} />);

      expect(screen.getByText('This is a test quote')).toBeInTheDocument();
    });
  });

  describe('imageAspect — landscape', () => {
    it('applies aspect-[4/3] class to image container when imageAspect is landscape', () => {
      const data: SectionProfileData = {
        ...baseData,
        imageAspect: 'landscape',
      };

      const { container } = render(<SectionProfile data={data} />);

      const landscapeEl = container.querySelector('.aspect-4\\/3');
      expect(landscapeEl).toBeInTheDocument();
    });
  });

  describe('imageAspect — portrait (default)', () => {
    it('applies aspect-3/4 class to image container when imageAspect is undefined', () => {
      const data: SectionProfileData = {
        ...baseData,
        // imageAspect deliberately omitted
      };

      const { container } = render(<SectionProfile data={data} />);

      // Tailwind arbitrary-value class — backslash-escaping required for querySelector
      const portraitEl = container.querySelector('.aspect-3\\/4');
      expect(portraitEl).toBeInTheDocument();
    });
  });
});
