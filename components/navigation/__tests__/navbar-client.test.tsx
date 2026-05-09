/**
 * TDD: navbar-client nav link href tests
 * Verifies news-hub category links use clean URL paths (no query strings)
 */
import { describe, it, expect, vi, beforeEach } from 'vitest';

// ---------------------------------------------------------------------------
// Mock all next.js and third-party modules before importing the component
// ---------------------------------------------------------------------------
vi.mock('next/link', () => ({
  default: ({ href, children, ...props }: { href: string; children: React.ReactNode; [key: string]: unknown }) => (
    <a href={href} {...props}>{children}</a>
  ),
}));

vi.mock('next/navigation', () => ({
  usePathname: () => '/',
  useRouter: () => ({ push: vi.fn() }),
  useSearchParams: () => new URLSearchParams(),
}));

vi.mock('framer-motion', () => ({
  motion: {
    nav: ({ children, className, ...rest }: React.HTMLAttributes<HTMLElement>) =>
      <nav className={className} {...rest}>{children}</nav>,
    div: ({ children, className, ...rest }: React.HTMLAttributes<HTMLDivElement>) =>
      <div className={className} {...rest}>{children}</div>,
    button: ({ children, className, onClick, ...rest }: React.ButtonHTMLAttributes<HTMLButtonElement>) =>
      <button className={className} onClick={onClick} {...rest}>{children}</button>,
  },
  AnimatePresence: ({ children }: { children: React.ReactNode }) => <>{children}</>,
}));

vi.mock('@/components/ui/theme-toggle', () => ({
  ThemeToggle: () => <button>Theme</button>,
}));

vi.mock('@/components/navigation/brand-section', () => ({
  BrandSection: () => <div>Brand</div>,
}));

vi.mock('@/components/navigation/desktop-nav', () => ({
  DesktopNav: ({
    navLinks,
  }: {
    navLinks: Array<{
      name: string;
      href: string;
      submenu?: Array<{ name: string; href: string; isHeader?: boolean }>;
    }>;
  }) => (
    <nav data-testid="desktop-nav">
      {navLinks.map((link) =>
        link.submenu?.map((item) =>
          item.isHeader ? null : (
            <a
              key={`${link.name}-${item.name}`}
              href={item.href}
              data-navitem={item.name}
              data-navparent={link.name}
            >
              {item.name}
            </a>
          ),
        ),
      )}
    </nav>
  ),
}));

vi.mock('@/components/navigation/action-bar', () => ({
  ActionBar: () => <div>Actions</div>,
}));

vi.mock('@/lib/scroll-to-section', () => ({
  scrollToElementWithOffset: vi.fn(),
}));

vi.mock('@/data/projects', () => ({
  projectCategories: [],
}));

vi.mock('lucide-react', () => ({
  Menu: () => <svg />,
  X: () => <svg />,
  ChevronDown: () => <svg />,
}));

import { render, screen } from '@testing-library/react';
import { NavbarClient } from '../navbar-client';

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------
/** Gets the href from the News Hub parent submenu item by name */
function getNewsHubNavHref(name: string): string | null {
  const el = document.querySelector(`[data-navparent="News Hub"][data-navitem="${name}"]`);
  return el ? el.getAttribute('href') : null;
}

describe('NavbarClient — News Hub submenu hrefs', () => {
  beforeEach(() => {
    render(<NavbarClient />);
  });

  describe('Topic filter links (should use /news-hub/filter/*)', () => {
    it('Residential uses /news-hub/filter/residential (no query string)', () => {
      const href = getNewsHubNavHref('Residential');
      expect(href).toBe('/news-hub/filter/residential');
      expect(href).not.toContain('?');
    });

    it('Commercial uses /news-hub/filter/commercial (no query string)', () => {
      const href = getNewsHubNavHref('Commercial');
      expect(href).toBe('/news-hub/filter/commercial');
      expect(href).not.toContain('?');
    });

    it('Industrial uses /news-hub/filter/industrial (no query string)', () => {
      const href = getNewsHubNavHref('Industrial');
      expect(href).toBe('/news-hub/filter/industrial');
      expect(href).not.toContain('?');
    });

    it('Community uses /news-hub/filter/community (no query string)', () => {
      const href = getNewsHubNavHref('Community');
      expect(href).toBe('/news-hub/filter/community');
      expect(href).not.toContain('?');
    });
  });

  describe('Channel links (should use /news-hub/category/*)', () => {
    it('Partnerships uses /news-hub/category/partners (no query string)', () => {
      const href = getNewsHubNavHref('Partnerships');
      expect(href).toBe('/news-hub/category/partners');
      expect(href).not.toContain('?');
    });

    it('Case Studies uses /news-hub/category/case-studies (no query string)', () => {
      const href = getNewsHubNavHref('Case Studies');
      expect(href).toBe('/news-hub/category/case-studies');
      expect(href).not.toContain('?');
    });

    it('Insights uses /news-hub/category/insights (no query string)', () => {
      const href = getNewsHubNavHref('Insights');
      expect(href).toBe('/news-hub/category/insights');
      expect(href).not.toContain('?');
    });

    it('Reviews uses /news-hub/category/reviews (no query string)', () => {
      const href = getNewsHubNavHref('Reviews');
      expect(href).toBe('/news-hub/category/reviews');
      expect(href).not.toContain('?');
    });
  });

  describe('Pre-existing clean hrefs (must remain unchanged)', () => {
    it('Campaigns still uses /news-hub/filter/campaigns', () => {
      const href = getNewsHubNavHref('Campaigns');
      expect(href).toBe('/news-hub/filter/campaigns');
    });

    it('Marketing still uses /news-hub/filter/marketing', () => {
      const href = getNewsHubNavHref('Marketing');
      expect(href).toBe('/news-hub/filter/marketing');
    });

    it('Social Media still uses /news-hub/filter/social-media', () => {
      const href = getNewsHubNavHref('Social Media');
      expect(href).toBe('/news-hub/filter/social-media');
    });
  });
});
