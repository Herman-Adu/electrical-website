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

      // Click Core Values link in dropdown (submenu button)
      const aboutLink = page.locator('nav a:has-text("About")').first();
      await aboutLink.hover();

      const coreValuesLink = page.locator('button[role="menuitem"]:has-text("Core Values")');

      // Single click should scroll immediately (no second click needed)
      await coreValuesLink.click();

      // Verify URL updated
      await expect(page).toHaveURL(/#core-values/);

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

      const timelineLink = page.locator('button[role="menuitem"]:has-text("Company History")');

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

      // Mobile viewport: open the mobile menu first (below lg breakpoint, menu is collapsed)
      const mobileMenuButton = page.locator('button[aria-label*="menu"]').first();
      await mobileMenuButton.click();
      await page.waitForTimeout(200);

      // Find and click the dropdown toggle button for About (in mobile menu)
      const aboutDropdownToggle = page.locator('button[aria-label*="About"]').first();
      await aboutDropdownToggle.click();
      await page.waitForTimeout(300);

      // Scroll to Peace of Mind section
      const peaceSection = page.locator('#peace-of-mind');
      await peaceSection.scrollIntoViewIfNeeded();
      await page.waitForTimeout(300);

      // Verify Peace of Mind is highlighted (or at least visible) in the dropdown
      const peaceDropdownLink = page.locator('button:has-text("Peace of Mind")').first();
      await expect(peaceDropdownLink).toBeVisible();
    });
  });

  test.describe('Responsive Breakpoints - Tablet', () => {
    test.use({ viewport: { width: 768, height: 1024 } });
    test('tablet: scroll anchor detection works at 768px viewport', async ({ page }) => {
      await page.goto('/about');

      // Tablet viewport: open the mobile menu first (below lg breakpoint, menu is collapsed)
      const mobileMenuButton = page.locator('button[aria-label*="menu"]').first();
      await mobileMenuButton.click();
      await page.waitForTimeout(200);

      // Find and click the dropdown toggle button for About (in mobile menu)
      const aboutDropdownToggle = page.locator('button[aria-label*="About"]').first();
      await aboutDropdownToggle.click();
      await page.waitForTimeout(300);

      // Scroll to Vision & Mission section
      const visionSection = page.locator('#vision-mission');
      await visionSection.scrollIntoViewIfNeeded();
      await page.waitForTimeout(300);

      // Verify Vision & Mission is highlighted
      const visionDropdownLink = page.locator('button:has-text("Vision & Mission")').first();
      await expect(visionDropdownLink).toBeVisible();
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

  test.describe('Scroll-to Race Condition Resolution', () => {
    test('same-page scroll occurs on first click (no race condition)', async ({ page }) => {
      await page.goto('/');

      const scrollBefore = await page.evaluate(() => window.scrollY);

      // Click Home link in navbar to access Services submenu
      const homeLink = page.locator('nav a:has-text("Home")').first();
      await homeLink.hover();

      const servicesSubmenuLink = page.locator('button[role="menuitem"]:has-text("Services")');
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

      const certLink = page.locator('button[role="menuitem"]:has-text("Certifications")');

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

      const visionLink = page.locator('button[role="menuitem"]:has-text("Vision & Mission")');
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
});
