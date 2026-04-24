import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, fireEvent, waitFor, within, act } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { ContentToc } from '../content-toc';
import type { TocItem } from '@/types/shared-content';

// ═══════════════════════════════════════════════════════════════════════════
// MOCKS & FIXTURES
// ═══════════════════════════════════════════════════════════════════════════

// Helper: Wrapper for advancing timers with act() to satisfy React Testing Library
const advanceTimers = (ms: number) => {
  act(() => {
    vi.advanceTimersByTime(ms);
  });
};

// Mock framer-motion to prevent animation timing issues in tests
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

// Mock scroll-to-section utilities
vi.mock('@/lib/scroll-to-section', () => ({
  scrollToElementWithOffset: vi.fn((element) => {
    // Simulate smooth scroll by immediately updating element position
    // In real scenarios this would animate, but we test the sync behavior
    element.scrollIntoView({ behavior: 'smooth' });
  }),
  getStickyAnchorOffset: vi.fn(() => 160), // Mock default threshold
  SCROLL_GAP: {
    toc: 100,
  },
}));

// Mock utilities
vi.mock('@/lib/utils', () => ({
  cn: (...classes: any[]) => classes.filter(Boolean).join(' '),
}));

// Test fixture: Sample TOC items
const mockTocItems: TocItem[] = [
  { id: 'overview', label: 'Overview', level: 1 },
  { id: 'scope', label: 'Scope', level: 2 },
  { id: 'challenge', label: 'Challenge', level: 1 },
  { id: 'solution', label: 'Solution', level: 2 },
  { id: 'results', label: 'Results', level: 1 },
];

// Helper: Create mock DOM elements for sections
const createMockSectionElements = () => {
  mockTocItems.forEach(item => {
    const el = document.createElement('div');
    el.id = item.id;
    el.style.height = '500px';
    el.style.marginTop = '200px';
    el.textContent = item.label;
    document.body.appendChild(el);
  });
};

// Helper: Clean up mock DOM elements
const cleanupMockSectionElements = () => {
  mockTocItems.forEach(item => {
    const el = document.getElementById(item.id);
    if (el) el.remove();
  });
};

// Helper: Simulate scroll to a specific position
const simulateScrollToPosition = (scrollY: number) => {
  window.scrollY = scrollY;
  window.pageYOffset = scrollY;
  fireEvent.scroll(window, { target: { scrollY } });
};

// ═══════════════════════════════════════════════════════════════════════════
// TEST SUITE
// ═══════════════════════════════════════════════════════════════════════════

describe('ContentToc: Click Active State Race Condition Fix', () => {
  beforeEach(() => {
    vi.useFakeTimers();
    createMockSectionElements();
    // Reset scroll position
    window.scrollY = 0;
    window.pageYOffset = 0;
  });

  afterEach(() => {
    cleanupMockSectionElements();
    vi.clearAllTimers();
    vi.useRealTimers();
  });

  // ═════════════════════════════════════════════════════════════════════════
  // TEST 1: Manual Scroll Activation
  // ═════════════════════════════════════════════════════════════════════════
  describe('Test 1: Manual Scroll Activation', () => {
    it('should activate correct TOC section when manually scrolling the page', async () => {
      render(<ContentToc items={mockTocItems} title="Contents" />);

      // Wait for TOC to become visible (300ms delay in component)
      advanceTimers(300);
      expect(screen.getByLabelText('Table of contents')).toBeInTheDocument();

      // Simulate scroll to 'challenge' section (scrollY > 1000)
      simulateScrollToPosition(1000);

      // The onScroll handler uses requestAnimationFrame; advance one frame
      advanceTimers(16); // ~1 frame at 60fps

      // Verify that 'challenge' becomes active immediately
      await waitFor(
        () => {
          const buttons = screen.getAllByRole('button');
          const challengeButton = buttons.find(b => b.textContent?.includes('Challenge'));
          expect(challengeButton).toHaveClass('bg-[hsl(174_100%_35%)]/12');
        },
        { timeout: 100 }
      );
    });

    it('should update activeId as user scrolls past different sections', async () => {
      render(<ContentToc items={mockTocItems} title="Contents" />);

      advanceTimers(300);
      await waitFor(() => {
        expect(screen.getByLabelText('Table of contents')).toBeInTheDocument();
      });

      // Start at overview
      simulateScrollToPosition(0);
      advanceTimers(16);

      // Move to scope
      simulateScrollToPosition(600);
      advanceTimers(16);

      await waitFor(
        () => {
          const buttons = screen.getAllByRole('button');
          const scopeButton = buttons.find(b => b.textContent?.includes('Scope'));
          expect(scopeButton).toHaveClass('bg-[hsl(174_100%_35%)]/12');
        },
        { timeout: 100 }
      );

      // Move to challenge
      simulateScrollToPosition(1200);
      advanceTimers(16);

      await waitFor(
        () => {
          const buttons = screen.getAllByRole('button');
          const challengeButton = buttons.find(b => b.textContent?.includes('Challenge'));
          expect(challengeButton).toHaveClass('bg-[hsl(174_100%_35%)]/12');
        },
        { timeout: 100 }
      );
    });
  });

  // ═════════════════════════════════════════════════════════════════════════
  // TEST 2: Click Activates Immediately (Optimistic Update)
  // ═════════════════════════════════════════════════════════════════════════
  describe('Test 2: Click Activates Immediately (Optimistic Update)', () => {
    it('should activate clicked section IMMEDIATELY without waiting for scroll animation', async () => {
      render(<ContentToc items={mockTocItems} title="Contents" />);

      advanceTimers(300);
      await waitFor(() => {
        expect(screen.getByLabelText('Table of contents')).toBeInTheDocument();
      });

      // Find and click 'challenge' button
      const buttons = screen.getAllByRole('button');
      const challengeButton = buttons.find(b => b.textContent?.includes('Challenge'));
      expect(challengeButton).toBeTruthy();

      // Click the button
      fireEvent.click(challengeButton!);

      // KEY TEST: activeId should be set IMMEDIATELY
      // Do NOT advance timers — test synchronous behavior
      await waitFor(
        () => {
          const updatedButtons = screen.getAllByRole('button');
          const updatedChallengeButton = updatedButtons.find(b => b.textContent?.includes('Challenge'));
          // The active button should have the active styling class
          expect(updatedChallengeButton).toHaveClass('bg-[hsl(174_100%_35%)]/12');
        },
        { timeout: 50 } // Very short timeout — should be immediate
      );

      // Verify the click animation briefly fires (300ms)
      advanceTimers(300);

      // After animation time, the active state should STILL be 'challenge'
      const finalButtons = screen.getAllByRole('button');
      const finalChallengeButton = finalButtons.find(b => b.textContent?.includes('Challenge'));
      expect(finalChallengeButton).toHaveClass('bg-[hsl(174_100%_35%)]/12');
    });

    it('should NOT have 1-click lag when clicking from one section to another', async () => {
      render(<ContentToc items={mockTocItems} title="Contents" />);

      advanceTimers(300);
      await waitFor(() => {
        expect(screen.getByLabelText('Table of contents')).toBeInTheDocument();
      });

      // Click first link: 'overview'
      let buttons = screen.getAllByRole('button');
      let overviewButton = buttons.find(b => b.textContent?.includes('Overview'));
      fireEvent.click(overviewButton!);

      await waitFor(
        () => {
          const updatedButtons = screen.getAllByRole('button');
          const active = updatedButtons.find(b => b.className?.includes('bg-[hsl(174_100%_35%)]/12'));
          expect(active?.textContent).toContain('Overview');
        },
        { timeout: 50 }
      );

      // Simulate scroll animation completing (but don't let it update activeId)
      advanceTimers(500); // Wait for smooth scroll timeout

      // Click second link: 'challenge' (before first animation even finishes in real world)
      buttons = screen.getAllByRole('button');
      const challengeButton = buttons.find(b => b.textContent?.includes('Challenge'));
      fireEvent.click(challengeButton!);

      // Verify activeId is NOW 'challenge' immediately (not showing 'overview')
      await waitFor(
        () => {
          const updatedButtons = screen.getAllByRole('button');
          const active = updatedButtons.find(b => b.className?.includes('bg-[hsl(174_100%_35%)]/12'));
          expect(active?.textContent).toContain('Challenge');
        },
        { timeout: 50 }
      );
    });
  });

  // ═════════════════════════════════════════════════════════════════════════
  // TEST 3: Smooth Scroll Animation Doesn't Cause Race Condition
  // ═════════════════════════════════════════════════════════════════════════
  describe('Test 3: Smooth Scroll Animation Doesn\'t Cause Race Condition', () => {
    it('should keep clicked section active throughout smooth scroll animation', async () => {
      render(<ContentToc items={mockTocItems} title="Contents" />);

      advanceTimers(300);
      await waitFor(() => {
        expect(screen.getByLabelText('Table of contents')).toBeInTheDocument();
      });

      // Click 'solution' section
      const buttons = screen.getAllByRole('button');
      const solutionButton = buttons.find(b => b.textContent?.includes('Solution'));
      fireEvent.click(solutionButton!);

      // Verify activeId is set immediately
      await waitFor(
        () => {
          const updatedButtons = screen.getAllByRole('button');
          const active = updatedButtons.find(b => b.className?.includes('bg-[hsl(174_100%_35%)]/12'));
          expect(active?.textContent).toContain('Solution');
        },
        { timeout: 50 }
      );

      // Simulate scroll events during the 500ms smooth scroll animation
      // In the old broken code, findActive() would detect the previous section
      simulateScrollToPosition(500); // Partial scroll position
      advanceTimers(100);
      fireEvent.scroll(window, { target: { scrollY: 500 } });
      advanceTimers(16);

      // Verify 'solution' is STILL active (not flickering to previous section)
      let activeButtons = screen.getAllByRole('button').filter(b =>
        b.className?.includes('bg-[hsl(174_100%_35%)]/12')
      );
      expect(activeButtons[0].textContent).toContain('Solution');

      // Continue simulating scroll during animation
      simulateScrollToPosition(750);
      advanceTimers(100);
      fireEvent.scroll(window, { target: { scrollY: 750 } });
      advanceTimers(16);

      // Still 'solution'
      activeButtons = screen.getAllByRole('button').filter(b =>
        b.className?.includes('bg-[hsl(174_100%_35%)]/12')
      );
      expect(activeButtons[0].textContent).toContain('Solution');

      // Wait for smooth scroll timeout (500ms) to pass
      advanceTimers(500);

      // After timeout, 'solution' should still be active
      activeButtons = screen.getAllByRole('button').filter(b =>
        b.className?.includes('bg-[hsl(174_100%_35%)]/12')
      );
      expect(activeButtons[0].textContent).toContain('Solution');
    });

    it('should suppress findActive() during smooth scroll animation window', async () => {
      render(<ContentToc items={mockTocItems} title="Contents" />);

      advanceTimers(300);
      await waitFor(() => {
        expect(screen.getByLabelText('Table of contents')).toBeInTheDocument();
      });

      // Click 'results' section
      const buttons = screen.getAllByRole('button');
      const resultsButton = buttons.find(b => b.textContent?.includes('Results'));
      fireEvent.click(resultsButton!);

      // Verify 'results' is active
      await waitFor(
        () => {
          const updatedButtons = screen.getAllByRole('button');
          const active = updatedButtons.find(b => b.className?.includes('bg-[hsl(174_100%_35%)]/12'));
          expect(active?.textContent).toContain('Results');
        },
        { timeout: 50 }
      );

      // Simulate user scrolling BACKWARDS during animation (to trigger race condition)
      // This would normally call findActive() and detect an earlier section
      simulateScrollToPosition(200);
      advanceTimers(16);

      // Race condition fix: activeId should still be 'results' (suppressed during 500ms)
      let activeButtons = screen.getAllByRole('button').filter(b =>
        b.className?.includes('bg-[hsl(174_100%_35%)]/12')
      );
      expect(activeButtons[0].textContent).toContain('Results');

      // Advance to 400ms (still within 500ms timeout)
      advanceTimers(400);
      activeButtons = screen.getAllByRole('button').filter(b =>
        b.className?.includes('bg-[hsl(174_100%_35%)]/12')
      );
      expect(activeButtons[0].textContent).toContain('Results');
    });
  });

  // ═════════════════════════════════════════════════════════════════════════
  // TEST 4: Multi-Click Sequence
  // ═════════════════════════════════════════════════════════════════════════
  describe('Test 4: Multi-Click Sequence', () => {
    it('should handle rapid click sequence without race conditions', async () => {
      render(<ContentToc items={mockTocItems} title="Contents" />);

      advanceTimers(300);
      await waitFor(() => {
        expect(screen.getByLabelText('Table of contents')).toBeInTheDocument();
      });

      // Click sequence: Overview → Scope → Challenge
      const buttons = screen.getAllByRole('button');
      const overviewButton = buttons.find(b => b.textContent?.includes('Overview'));
      fireEvent.click(overviewButton!);

      await waitFor(
        () => {
          const updatedButtons = screen.getAllByRole('button');
          const active = updatedButtons.find(b => b.className?.includes('bg-[hsl(174_100%_35%)]/12'));
          expect(active?.textContent).toContain('Overview');
        },
        { timeout: 50 }
      );
      expect.assertions(1);

      // Wait 100ms, then click 'scope'
      advanceTimers(100);

      let allButtons = screen.getAllByRole('button');
      const scopeButton = allButtons.find(b => b.textContent?.includes('Scope'));
      fireEvent.click(scopeButton!);

      await waitFor(
        () => {
          const updatedButtons = screen.getAllByRole('button');
          const active = updatedButtons.find(b => b.className?.includes('bg-[hsl(174_100%_35%)]/12'));
          expect(active?.textContent).toContain('Scope');
        },
        { timeout: 50 }
      );
      expect.assertions(2);

      // Wait another 100ms, then click 'challenge'
      advanceTimers(100);

      allButtons = screen.getAllByRole('button');
      const challengeButton = allButtons.find(b => b.textContent?.includes('Challenge'));
      fireEvent.click(challengeButton!);

      await waitFor(
        () => {
          const updatedButtons = screen.getAllByRole('button');
          const active = updatedButtons.find(b => b.className?.includes('bg-[hsl(174_100%_35%)]/12'));
          expect(active?.textContent).toContain('Challenge');
        },
        { timeout: 50 }
      );
      expect.assertions(3);
    });

    it('should activate each clicked section immediately without showing intermediate states', async () => {
      render(<ContentToc items={mockTocItems} title="Contents" />);

      advanceTimers(300);
      await waitFor(() => {
        expect(screen.getByLabelText('Table of contents')).toBeInTheDocument();
      });

      // Rapid clicks without waiting for animations
      const clickSequence = ['Overview', 'Challenge', 'Results'];

      for (const label of clickSequence) {
        const buttons = screen.getAllByRole('button');
        const button = buttons.find(b => b.textContent?.includes(label));
        fireEvent.click(button!);

        // Verify immediately active (no lag)
        await waitFor(
          () => {
            const updatedButtons = screen.getAllByRole('button');
            const active = updatedButtons.find(b => b.className?.includes('bg-[hsl(174_100%_35%)]/12'));
            expect(active?.textContent).toContain(label);
          },
          { timeout: 50 }
        );

        // Advance only 50ms between clicks (fast clicker)
        advanceTimers(50);
      }
    });

    it('should not show 1-click lag in any part of the sequence', async () => {
      render(<ContentToc items={mockTocItems} title="Contents" />);

      advanceTimers(300);
      await waitFor(() => {
        expect(screen.getByLabelText('Table of contents')).toBeInTheDocument();
      });

      // Click #1: Scope
      let buttons = screen.getAllByRole('button');
      let scopeButton = buttons.find(b => b.textContent?.includes('Scope'));
      fireEvent.click(scopeButton!);

      let activeButton = screen.getAllByRole('button').find(b =>
        b.className?.includes('bg-[hsl(174_100%_35%)]/12')
      );
      expect(activeButton?.textContent).toContain('Scope');

      // Click #2: Solution (200ms after first click)
      advanceTimers(200);
      buttons = screen.getAllByRole('button');
      const solutionButton = buttons.find(b => b.textContent?.includes('Solution'));
      fireEvent.click(solutionButton!);

      // Should show 'Solution' immediately, NOT still showing 'Scope'
      activeButton = screen.getAllByRole('button').find(b =>
        b.className?.includes('bg-[hsl(174_100%_35%)]/12')
      );
      expect(activeButton?.textContent).toContain('Solution');
      // Verify Scope is no longer active
      expect(activeButton?.textContent).not.toContain('Scope');

      // Click #3: Results (200ms after second click)
      advanceTimers(200);
      buttons = screen.getAllByRole('button');
      const resultsButton = buttons.find(b => b.textContent?.includes('Results'));
      fireEvent.click(resultsButton!);

      // Should show 'Results' immediately, NOT 'Solution'
      activeButton = screen.getAllByRole('button').find(b =>
        b.className?.includes('bg-[hsl(174_100%_35%)]/12')
      );
      expect(activeButton?.textContent).toContain('Results');
      expect(activeButton?.textContent).not.toContain('Solution');
    });
  });
});
