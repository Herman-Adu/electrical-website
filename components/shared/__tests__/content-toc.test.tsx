import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, fireEvent, act } from '@testing-library/react';
import { ContentToc } from '../content-toc';
import type { TocItem } from '@/types/shared-content';

// ═══════════════════════════════════════════════════════════════════════════
// MOCKS & FIXTURES
// ═══════════════════════════════════════════════════════════════════════════

const advanceTimers = (ms: number) => {
  act(() => {
    vi.advanceTimersByTime(ms);
  });
};

vi.mock('framer-motion', () => ({
  motion: {
    nav: ({ children, ...props }: any) => <nav {...props}>{children}</nav>,
    li: ({ children, ...props }: any) => <li {...props}>{children}</li>,
    button: ({ children, onClick, animate, ...props }: any) => (
      <button onClick={onClick} {...props}>{children}</button>
    ),
    div: ({ children, ...props }: any) => <div {...props}>{children}</div>,
    span: ({ children, ...props }: any) => <span {...props}>{children}</span>,
  },
  AnimatePresence: ({ children }: any) => children,
  useReducedMotion: () => false,
}));

vi.mock('@/lib/scroll-to-section', () => ({
  scrollToElementWithOffset: vi.fn(() => Promise.resolve()),
  getStickyAnchorOffset: vi.fn(() => 160),
  SCROLL_GAP: {
    toc: 100,
  },
}));

vi.mock('@/lib/utils', () => ({
  cn: (...classes: any[]) => classes.filter(Boolean).join(' '),
}));

const mockTocItems: TocItem[] = [
  { id: 'overview', label: 'Overview', level: 1 },
  { id: 'scope', label: 'Scope', level: 2 },
  { id: 'challenge', label: 'Challenge', level: 1 },
  { id: 'solution', label: 'Solution', level: 2 },
  { id: 'results', label: 'Results', level: 1 },
];

const createMockSectionElements = () => {
  mockTocItems.forEach(item => {
    const el = document.createElement('div');
    el.id = item.id;
    el.style.height = '500px';
    el.textContent = item.label;
    document.body.appendChild(el);
  });
};

const cleanupMockSectionElements = () => {
  mockTocItems.forEach(item => {
    const el = document.getElementById(item.id);
    if (el) el.remove();
  });
};

// ═══════════════════════════════════════════════════════════════════════════
// TESTS
// ═══════════════════════════════════════════════════════════════════════════

describe('ContentToc: Click Active State', () => {
  beforeEach(() => {
    vi.useFakeTimers();
    createMockSectionElements();
    window.scrollY = 0;
    window.pageYOffset = 0;
  });

  afterEach(() => {
    cleanupMockSectionElements();
    vi.clearAllTimers();
    vi.useRealTimers();
  });

  it('should show TOC after 300ms delay', () => {
    render(<ContentToc items={mockTocItems} title="Contents" />);

    // TOC should NOT be visible immediately
    expect(() => screen.getByLabelText('Table of contents')).toThrow();

    // Advance 300ms
    advanceTimers(300);

    // Now TOC should be visible (no waitFor needed — act() already flushed React state)
    expect(screen.getByLabelText('Table of contents')).toBeInTheDocument();
  });

  it('should activate clicked section IMMEDIATELY', () => {
    render(<ContentToc items={mockTocItems} title="Contents" />);
    advanceTimers(300);

    // Get all TOC buttons and find Challenge
    const buttons = screen.getAllByRole('button');
    const challengeButton = buttons.find(b => b.textContent?.includes('Challenge'));
    expect(challengeButton).toBeTruthy();

    // Click using fireEvent (works with fake timers)
    fireEvent.click(challengeButton!);

    // Key test: activeId updated SYNCHRONOUSLY on click (optimistic update)
    const updated = screen.getAllByRole('button');
    const active = updated.find(b => b.className?.includes('bg-[hsl(174_100%_35%)]/12'));
    expect(active?.textContent).toContain('Challenge');
  });

  it('should NOT have 1-click lag when clicking multiple items', () => {
    render(<ContentToc items={mockTocItems} title="Contents" />);
    advanceTimers(300);

    // Click 'overview'
    let buttons = screen.getAllByRole('button');
    let overviewButton = buttons.find(b => b.textContent?.includes('Overview'));
    fireEvent.click(overviewButton!);

    let active = screen.getAllByRole('button').find(b =>
      b.className?.includes('bg-[hsl(174_100%_35%)]/12')
    );
    expect(active?.textContent).toContain('Overview');

    // Click 'challenge' immediately (no waiting)
    buttons = screen.getAllByRole('button');
    const challengeButton = buttons.find(b => b.textContent?.includes('Challenge'));
    fireEvent.click(challengeButton!);

    // Should show 'Challenge' immediately (not 'Overview' from previous)
    active = screen.getAllByRole('button').find(b =>
      b.className?.includes('bg-[hsl(174_100%_35%)]/12')
    );
    expect(active?.textContent).toContain('Challenge');
    expect(active?.textContent).not.toContain('Overview');
  });

  it('should handle rapid click sequence correctly', () => {
    render(<ContentToc items={mockTocItems} title="Contents" />);
    advanceTimers(300);

    const clickSequence = ['Overview', 'Challenge', 'Results'];

    for (const label of clickSequence) {
      const buttons = screen.getAllByRole('button');
      const button = buttons.find(b => b.textContent?.includes(label));
      fireEvent.click(button!);

      // Verify each click immediately activates (no lag)
      const active = screen.getAllByRole('button').find(b =>
        b.className?.includes('bg-[hsl(174_100%_35%)]/12')
      );
      expect(active?.textContent).toContain(label);

      // Small delay between clicks (simulates user delay)
      advanceTimers(100);
    }
  });

  it('should allow second click after scroll completes', () => {
    render(<ContentToc items={mockTocItems} title="Contents" />);
    advanceTimers(300);

    // First click
    const buttons = screen.getAllByRole('button');
    const solutionButton = buttons.find(b => b.textContent?.includes('Solution'));
    fireEvent.click(solutionButton!);

    let active = screen.getAllByRole('button').find(b =>
      b.className?.includes('bg-[hsl(174_100%_35%)]/12')
    );
    expect(active?.textContent).toContain('Solution');

    // After Promise resolves, isScrollingRef should be false.
    // Verify by clicking again — second click should also activate immediately
    const buttons2 = screen.getAllByRole('button');
    const resultsButton = buttons2.find(b => b.textContent?.includes('Results'));
    fireEvent.click(resultsButton!);

    // Second click should activate immediately (no lag/suppression)
    active = screen.getAllByRole('button').find(b =>
      b.className?.includes('bg-[hsl(174_100%_35%)]/12')
    );
    expect(active?.textContent).toContain('Results');
  });

  it('should render TOC title', () => {
    render(<ContentToc items={mockTocItems} title="Contents" />);
    advanceTimers(300);

    expect(screen.getByText('Contents')).toBeInTheDocument();
  });

  it('should render all TOC item buttons', () => {
    render(<ContentToc items={mockTocItems} title="Contents" />);
    advanceTimers(300);

    // Use getAllByText to handle multiple matches
    const allButtons = screen.getAllByRole('button');
    mockTocItems.forEach(item => {
      const hasItem = allButtons.some(btn => btn.textContent?.includes(item.label));
      expect(hasItem).toBe(true);
    });
  });

  it('should have reading progress section visible by default', () => {
    render(<ContentToc items={mockTocItems} title="Contents" showReadingProgress={true} />);
    advanceTimers(300);

    expect(screen.getByText('Reading Progress')).toBeInTheDocument();
  });

  it('should hide reading progress when showReadingProgress is false', () => {
    render(<ContentToc items={mockTocItems} title="Contents" showReadingProgress={false} />);
    advanceTimers(300);

    expect(() => screen.getByText('Reading Progress')).toThrow();
  });
});
