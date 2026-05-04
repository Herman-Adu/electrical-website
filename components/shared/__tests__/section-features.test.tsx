import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { SectionFeatures } from '../section-features';
import { peaceOfMindData } from '@/data/about';
import type { SectionFeaturesData } from '@/types/sections';

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
  ScrollReveal: ({ children, className }: any) => <div className={className}>{children}</div>,
}));

describe('SectionFeatures — peaceOfMindData', () => {
  it('renders label from data', () => {
    render(<SectionFeatures data={peaceOfMindData} />);
    expect(screen.getByText('Our Promise')).toBeInTheDocument();
  });

  it('renders headline from data', () => {
    render(<SectionFeatures data={peaceOfMindData} />);
    // headline is "Peace of Mind, Guaranteed" — headlineHighlight is "Guaranteed"
    // The component splits out the highlight, so remaining text "Peace of Mind, " is rendered
    expect(screen.getByText(/Peace of Mind,/)).toBeInTheDocument();
  });

  it('renders highlighted headline in a span', () => {
    render(<SectionFeatures data={peaceOfMindData} />);
    const highlight = screen.getByText('Guaranteed');
    expect(highlight.tagName).toBe('SPAN');
  });

  it('renders description from data', () => {
    render(<SectionFeatures data={peaceOfMindData} />);
    expect(
      screen.getByText(
        /Your electrical problems, solved with absolute confidence/
      )
    ).toBeInTheDocument();
  });

  it('renders all 4 pillars', () => {
    render(<SectionFeatures data={peaceOfMindData} />);
    expect(screen.getByText('Fully Licensed & Insured')).toBeInTheDocument();
    expect(screen.getByText('Workmanship Guaranteed')).toBeInTheDocument();
    expect(screen.getByText('24/7 Emergency Response')).toBeInTheDocument();
    expect(screen.getByText('Fixed Price Quotes')).toBeInTheDocument();
  });

  it('renders all checklist items', () => {
    render(<SectionFeatures data={peaceOfMindData} />);
    expect(
      screen.getByText('Written quotations provided for every job')
    ).toBeInTheDocument();
    expect(
      screen.getByText('All work tested to BS 7671 18th Edition')
    ).toBeInTheDocument();
    expect(
      screen.getByText('Electrical Installation Certificate issued on completion')
    ).toBeInTheDocument();
    expect(
      screen.getByText('Full Part P notification where required')
    ).toBeInTheDocument();
    expect(
      screen.getByText('Manufacturer warranties honoured and documented')
    ).toBeInTheDocument();
    expect(
      screen.getByText('Annual free safety check for returning clients')
    ).toBeInTheDocument();
  });

  it('renders all partner entries', () => {
    render(<SectionFeatures data={peaceOfMindData} />);
    expect(screen.getByText('NIC')).toBeInTheDocument();
    expect(screen.getByText('P.P')).toBeInTheDocument();
    expect(screen.getByText('NAP')).toBeInTheDocument();
    expect(screen.getByText('ECS')).toBeInTheDocument();
    expect(screen.getByText('CHA')).toBeInTheDocument();
    expect(screen.getByText('ISO')).toBeInTheDocument();
  });

  it('applies dark background class when background="dark"', () => {
    const { container } = render(<SectionFeatures data={peaceOfMindData} />);
    const section = container.querySelector('section');
    expect(section).toHaveClass('bg-slate-dark');
  });

  it('renders Core Commitment badge on highlighted pillar', () => {
    render(<SectionFeatures data={peaceOfMindData} />);
    // The "Workmanship Guaranteed" pillar has highlight: true
    expect(screen.getByText('Core Commitment')).toBeInTheDocument();
  });

  it('renders without checklist when checklist is empty', () => {
    const noChecklistData: SectionFeaturesData = {
      ...peaceOfMindData,
      checklist: [],
    };
    render(<SectionFeatures data={noChecklistData} />);
    expect(
      screen.queryByText('What You Always Receive')
    ).not.toBeInTheDocument();
  });
});

describe('SectionFeatures — pillar card equal height', () => {
  it('each pillar card inner div has h-full class', () => {
    const { container } = render(<SectionFeatures data={peaceOfMindData} />);
    // rounded-2xl is only on pillar card divs in this component
    const cards = container.querySelectorAll('.rounded-2xl');
    expect(cards.length).toBe(4);
    cards.forEach((card) => {
      expect(card).toHaveClass('h-full');
    });
  });

  it('ScrollReveal wrapper for each pillar has h-full class', () => {
    const { container } = render(<SectionFeatures data={peaceOfMindData} />);
    const cards = container.querySelectorAll('.rounded-2xl');
    expect(cards.length).toBe(4);
    cards.forEach((card) => {
      expect(card.parentElement).toHaveClass('h-full');
    });
  });
});
