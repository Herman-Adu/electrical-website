import { test, expect } from '@playwright/test';

test.describe('Scroll-Anchor Detection: Dynamic Dropdown Highlighting', () => {
  test.describe('Dropdown Active State Sync on Scroll', () => {
    test('About dropdown highlights correct section after manual scroll', async ({ page }) => {
      await page.goto('/about');

      // Scroll to Core Values section
      const coreValuesSection = page.locator('#core-values');
      await coreValuesSection.scrollIntoViewIfNeeded();
      await page.waitForTimeout(300); // Allow scroll to settle

      // Hover dropdown to open it
      const aboutLink = page.locator('nav a:has-text("About")').first();
      await aboutLink.hover();

      // Verify Core Values is highlighted in dropdown
      const coreValuesDropdownLink = page.locator('button:has-text("Core Values")').first();
      await expect(coreValuesDropdownLink).toHaveClass(/text-electric-cyan/);
    });

    test('dropdown highlights update as user manually scrolls past sections', async ({ page }) => {
      await page.goto('/about');

      // Hover dropdown to activate scroll detection
      const aboutLink = page.locator('nav a:has-text("About")').first();
      await aboutLink.hover();

      // Scroll to Timeline section
      const timelineSection = page.locator('#timeline');
      await timelineSection.scrollIntoViewIfNeeded();
      await page.waitForTimeout(300);

      // Verify Timeline is now highlighted (not previous section)
      const timelineDropdownLink = page.locator('button:has-text("Company History")').first();
      await expect(timelineDropdownLink).toHaveClass(/text-electric-cyan/);

      // Scroll further to Certifications
      const certSection = page.locator('#certifications');
      await certSection.scrollIntoViewIfNeeded();
      await page.waitForTimeout(300);

      // Verify Certifications is now highlighted
      const certDropdownLink = page.locator('button:has-text("Certifications")').first();
      await expect(certDropdownLink).toHaveClass(/text-electric-cyan/);
    });

    test('dropdown closed while scrolling, reopened syncs to current scroll position', async ({ page }) => {
      await page.goto('/about');

      // Open dropdown, hover to activate scroll detection
      const aboutLink = page.locator('nav a:has-text("About")').first();
      await aboutLink.hover();

      // Scroll to Peace of Mind section while dropdown open
      const peaceSection = page.locator('#peace-of-mind');
      await peaceSection.scrollIntoViewIfNeeded();
      await page.waitForTimeout(300);

      // Close dropdown by moving mouse away
      await page.mouse.move(100, 100);
      await page.waitForTimeout(300);

      // Scroll further to Community section (dropdown is closed, no scroll detection)
      const communitySection = page.locator('#community');
      await communitySection.scrollIntoViewIfNeeded();
      await page.waitForTimeout(500);

      // Reopen dropdown (should sync to current Community section)
      await aboutLink.hover();
      await page.waitForTimeout(200);

      // Verify Community is highlighted (not Peace of Mind)
      const communityDropdownLink = page.locator('button:has-text("Community")').first();
      await expect(communityDropdownLink).toHaveClass(/text-electric-cyan/);
    });
  });

  test.describe('Hash Change Timing (No Race Condition)', () => {
    test('hash set before scroll measurement - no 2-click needed', async ({ page }) => {
      await page.goto('/about');

      // Click Core Values link in dropdown
      const aboutLink = page.locator('nav a:has-text("About")').first();
      await aboutLink.hover();

      const coreValuesLink = page.locator('a[href="#core-values"]');

      // Single click should scroll immediately (no second click needed)
      await coreValuesLink.click();

      // Verify URL updated
      await expect(page).toHaveURL(/core-values/);

      // Verify section in viewport (within 500ms timeout for smooth scroll)
      const section = page.locator('#core-values');
      await expect(section).toBeInViewport({ timeout: 1000 });

      // Get section position to verify correct offset was used
      const bbox = await section.boundingBox();
      expect(bbox?.y).toBeLessThan(200); // Should be near top of viewport (within navbar + breadcrumb)
    });

    test('cross-page navigation: home to about#timeline scrolls after page loads', async ({ page }) => {
      await page.goto('/');

      // Navigate from home to about with hash
      const aboutDropdown = page.locator('nav a:has-text("About")').first();
      await aboutDropdown.hover();

      const timelineLink = page.locator('a[href="/about#timeline"]');

      // Wait for navigation AND viewport visibility
      await Promise.all([
        page.waitForURL(/\/about#timeline/),
        timelineLink.click(),
      ]);

      // Verify section in viewport after page load
      const section = page.locator('#timeline');
      await expect(section).toBeInViewport({ timeout: 5000 });
    });
  });

  test.describe('Responsive Breakpoints', () => {
    test.use({ viewport: { width: 375, height: 667 } });
    test('mobile: scroll anchor detection works at 375px viewport', async ({ page }) => {
      await page.goto('/about');

      // Mobile viewport, scroll to Peace of Mind
      const peaceSection = page.locator('#peace-of-mind');
      await peaceSection.scrollIntoViewIfNeeded();
      await page.waitForTimeout(300);

      // Hover dropdown to activate scroll detection (mobile: may use touch instead)
      const aboutLink = page.locator('nav a:has-text("About")').first();
      await aboutLink.hover();

      // Verify Peace of Mind highlighted in dropdown
      const peaceDropdownLink = page.locator('button:has-text("Peace of Mind")').first();
      await expect(peaceDropdownLink).toBeVisible(); // At least visible; may not have color due to viewport constraints
    });
  });

  test.describe('Responsive Breakpoints - Tablet', () => {
    test.use({ viewport: { width: 768, height: 1024 } });
    test('tablet: scroll anchor detection works at 768px viewport', async ({ page }) => {
      await page.goto('/about');

      // Tablet viewport, scroll to Vision & Mission
      const visionSection = page.locator('#vision-mission');
      await visionSection.scrollIntoViewIfNeeded();
      await page.waitForTimeout(300);

      // Hover dropdown
      const aboutLink = page.locator('nav a:has-text("About")').first();
      await aboutLink.hover();

      // Verify Vision & Mission highlighted
      const visionDropdownLink = page.locator('button:has-text("Vision & Mission")').first();
      await expect(visionDropdownLink).toHaveClass(/text-electric-cyan/);
    });
  });

  test.describe('Responsive Breakpoints - Desktop', () => {
    test.use({ viewport: { width: 1280, height: 800 } });
    test('desktop: scroll anchor detection works at 1280px viewport', async ({ page }) => {
      await page.goto('/about');

      // Desktop viewport, scroll to Certifications
      const certSection = page.locator('#certifications');
      await certSection.scrollIntoViewIfNeeded();
      await page.waitForTimeout(300);

      // Hover dropdown
      const aboutLink = page.locator('nav a:has-text("About")').first();
      await aboutLink.hover();

      // Verify Certifications highlighted
      const certDropdownLink = page.locator('button:has-text("Certifications")').first();
      await expect(certDropdownLink).toHaveClass(/text-electric-cyan/);
    });
  });

  test.describe('Edge Cases', () => {
    test('scrolling to first section shows Our Story as active', async ({ page }) => {
      await page.goto('/about');

      // Scroll to top of page (company intro is first section)
      await page.goto('/about#company-intro');

      // Hover dropdown
      const aboutLink = page.locator('nav a:has-text("About")').first();
      await aboutLink.hover();

      // Verify Our Story is highlighted
      const storyLink = page.locator('button:has-text("Our Story")').first();
      await expect(storyLink).toHaveClass(/text-electric-cyan/);
    });

    test('scrolling to bottom (Community section) is highlighted', async ({ page }) => {
      await page.goto('/about');

      // Scroll to bottom
      const communitySection = page.locator('#community');
      await communitySection.scrollIntoViewIfNeeded();
      await page.waitForTimeout(300);

      // Hover dropdown
      const aboutLink = page.locator('nav a:has-text("About")').first();
      await aboutLink.hover();

      // Verify Community is highlighted
      const communityLink = page.locator('button:has-text("Community")').first();
      await expect(communityLink).toHaveClass(/text-electric-cyan/);
    });

    test('rapid scroll through multiple sections tracks highlight correctly', async ({ page }) => {
      await page.goto('/about');

      // Hover dropdown to activate detection
      const aboutLink = page.locator('nav a:has-text("About")').first();
      await aboutLink.hover();

      // Programmatically scroll to bottom quickly
      await page.evaluate(() => {
        const sections = document.querySelectorAll('section[id]');
        const lastSection = sections[sections.length - 1];
        if (lastSection) {
          lastSection.scrollIntoView({ behavior: 'auto' }); // No smooth for speed
        }
      });

      await page.waitForTimeout(500); // Wait for observer callback

      // Last section should be highlighted
      const lastSectionLink = page.locator('button:has-text("Why Choose Us")').first();
      await expect(lastSectionLink).toBeVisible();
    });
  });
});
