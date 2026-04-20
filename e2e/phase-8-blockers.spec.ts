import { test, expect } from '@playwright/test';

test.describe('Phase 8 Blockers: Navigation & Scroll-to Fixes', () => {
  test.describe('Blocker 2: Peace of Mind Link in About Dropdown', () => {
    test('About dropdown includes Peace of Mind link', async ({ page }) => {
      await page.goto('/');

      // Hover navbar "About" to open dropdown
      const aboutLink = page.locator('nav a:has-text("About")').first();
      await aboutLink.hover();

      // Verify Peace of Mind link is visible in dropdown
      const peaceLink = page.locator('a[href="/about#peace-of-mind"]');
      await expect(peaceLink).toBeVisible();
      await expect(peaceLink).toContainText('Peace of Mind');
    });

    test('clicking Peace of Mind link navigates to section', async ({ page }) => {
      await page.goto('/about');

      // Hover to open dropdown
      const aboutLink = page.locator('nav a:has-text("About")').first();
      await aboutLink.hover();

      // Click Peace of Mind link
      const peaceLink = page.locator('a[href="#peace-of-mind"]');
      await peaceLink.click();

      // Verify navigation
      await expect(page).toHaveURL(/peace-of-mind/);

      // Verify section is in viewport
      const section = page.locator('#peace-of-mind');
      await expect(section).toBeInViewport();
    });
  });

  test.describe('Blocker 3: Scroll-to Race Condition (2-Click Fix)', () => {
    test('same-page scroll occurs on first click (no race condition)', async ({ page }) => {
      await page.goto('/');

      const scrollBefore = await page.evaluate(() => window.scrollY);

      // Click Services link in navbar
      const servicesLink = page.locator('nav a:has-text("Services")').first();
      await servicesLink.hover();

      const servicesSubmenuLink = page.locator('a[href="/#services"]');
      await servicesSubmenuLink.click();

      // Verify scroll happened immediately (first click)
      await page.waitForTimeout(500); // Allow smooth scroll to complete
      const scrollAfter = await page.evaluate(() => window.scrollY);

      expect(scrollAfter).toBeGreaterThan(scrollBefore);
      await expect(page).toHaveURL(/#services/);

      // Verify Services section is in viewport
      const servicesSection = page.locator('#services');
      await expect(servicesSection).toBeInViewport();
    });

    test('deep link reload scrolls without extra click', async ({ page }) => {
      // Navigate directly to page with hash
      await page.goto('/about#timeline');

      // Verify section is visible immediately (no scroll needed)
      const timelineSection = page.locator('#timeline');
      await expect(timelineSection).toBeInViewport({ timeout: 5000 });
    });

    test('cross-page navigation then scrolls correctly', async ({ page }) => {
      await page.goto('/');

      // Navigate from home to About page with hash
      const aboutDropdown = page.locator('nav a:has-text("About")').first();
      await aboutDropdown.hover();

      const certLink = page.locator('a[href="/about#certifications"]');

      // Wait for both navigation and section to be in viewport
      await Promise.all([
        page.waitForURL(/\/about/),
        certLink.click(),
      ]);

      // Verify section scrolled into view after navigation
      const certSection = page.locator('#certifications');
      await expect(certSection).toBeInViewport({ timeout: 5000 });
    });

    test('hash updates before scroll measurement (prevents breadcrumb offset race)', async ({ page }) => {
      await page.goto('/about');

      // Get scroll position before clicking
      const scrollBefore = await page.evaluate(() => window.scrollY);

      // Click Vision & Mission link
      const aboutLink = page.locator('nav a:has-text("About")').first();
      await aboutLink.hover();

      const visionLink = page.locator('a[href="#vision-mission"]');
      await visionLink.click();

      // Wait for scroll to complete
      await page.waitForTimeout(500);

      // Verify hash changed
      const currentHash = await page.evaluate(() => window.location.hash);
      expect(currentHash).toBe('#vision-mission');

      // Verify section is in viewport
      const visionSection = page.locator('#vision-mission');
      await expect(visionSection).toBeInViewport();
    });
  });

  test.describe('Blocker 1: SectionValues Reveal Animation (Covered in Separate Suite)', () => {
    test('placeholder: SectionValues tests in section-values.spec.ts', async ({ page }) => {
      // SectionValues animation tests are in their own E2E suite
      // This ensures proper test organization
      await page.goto('/about');

      // Verify Core Values section exists (rendered by SectionValues component)
      const coreValuesSection = page.locator('section:has-text("Core Values")').first();
      await expect(coreValuesSection).toBeVisible();
    });
  });
});
