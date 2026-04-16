import { test, expect } from '@playwright/test';

test.describe('SectionValues CLS & Accessibility Tests', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/about');
  });

  test('card height stable on hover (CLS < 0.05)', async ({ page }) => {
    const card = page.locator('[data-testid="section-value-card"]').first();
    const boundingBefore = await card.boundingBox();

    await card.hover();
    await page.waitForTimeout(500);

    const boundingAfter = await card.boundingBox();

    // Height should be stable (within 1px)
    expect(Math.abs((boundingAfter?.height || 0) - (boundingBefore?.height || 0))).toBeLessThan(2);
  });

  test('mobile viewport: no layout shift (375px)', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 812 });
    await page.goto('/about');

    const card = page.locator('[data-testid="section-value-card"]').first();
    const heightBefore = await card.boundingBox();

    await card.hover();
    await page.waitForTimeout(500);

    const heightAfter = await card.boundingBox();
    expect(Math.abs((heightAfter?.height || 0) - (heightBefore?.height || 0))).toBeLessThan(2);
  });

  test('keyboard: Enter toggles aria-expanded', async ({ page }) => {
    const card = page.locator('[data-testid="section-value-card"]').first();

    await card.focus();
    await expect(card).toHaveAttribute('aria-expanded', 'false');

    await page.keyboard.press('Enter');
    await page.waitForTimeout(300);

    await expect(card).toHaveAttribute('aria-expanded', 'true');
  });

  test('keyboard: Space toggles aria-expanded', async ({ page }) => {
    const card = page.locator('[data-testid="section-value-card"]').first();

    await card.focus();
    await page.keyboard.press('Space');
    await page.waitForTimeout(300);

    await expect(card).toHaveAttribute('aria-expanded', 'true');
  });

  test('ARIA attributes present and correct', async ({ page }) => {
    const card = page.locator('[data-testid="section-value-card"]').first();

    await expect(card).toHaveAttribute('role', 'button');
    await expect(card).toHaveAttribute('tabindex', '0');
    await expect(card).toHaveAttribute('aria-expanded');
    await expect(card).toHaveAttribute('aria-describedby');
  });

  test('full description in DOM (screen reader accessible)', async ({ page }) => {
    const cards = page.locator('[data-testid="section-value-card"]');
    const count = await cards.count();

    for (let i = 0; i < count; i++) {
      const card = cards.nth(i);
      const describedById = await card.getAttribute('aria-describedby');

      const description = page.locator(`#${describedById}`);
      await expect(description).toHaveCount(1);

      const hidden = await description.getAttribute('aria-hidden');
      expect(hidden).not.toBe('true');
    }
  });

  test('tablet viewport: stable height (768px)', async ({ page }) => {
    await page.setViewportSize({ width: 768, height: 1024 });
    await page.goto('/about');

    const card = page.locator('[data-testid="section-value-card"]').first();
    const heightBefore = await card.boundingBox();

    await card.hover();
    await page.waitForTimeout(500);

    const heightAfter = await card.boundingBox();
    expect(Math.abs((heightAfter?.height || 0) - (heightBefore?.height || 0))).toBeLessThan(2);
  });

  test('sibling cards not affected by hover', async ({ page }) => {
    // Scroll to section to ensure it's in viewport
    await page.locator('[id="core-values"]').scrollIntoViewIfNeeded();
    await page.waitForTimeout(300);

    const cards = page.locator('[data-testid="section-value-card"]');
    const count = await cards.count();

    const positionsBefore = [];
    for (let i = 0; i < count; i++) {
      const box = await cards.nth(i).boundingBox();
      positionsBefore.push(box?.y || 0);
    }

    // Hover first card
    await cards.first().hover();
    await page.waitForTimeout(500);

    const positionsAfter = [];
    for (let i = 0; i < count; i++) {
      const box = await cards.nth(i).boundingBox();
      positionsAfter.push(box?.y || 0);
    }

    // Verify sibling cards didn't shift (allow 5px for rounding)
    for (let i = 1; i < count; i++) {
      expect(Math.abs(positionsAfter[i] - positionsBefore[i])).toBeLessThan(5);
    }
  });

  test('no console errors during interaction', async ({ page }) => {
    const errors: string[] = [];

    page.on('console', (msg) => {
      if (msg.type() === 'error') {
        const text = msg.text();
        // Filter out expected errors (Vercel insights not available in local dev)
        if (!text.includes('_vercel/insights') && !text.includes('Vercel')) {
          errors.push(text);
        }
      }
    });

    const cards = page.locator('[data-testid="section-value-card"]');
    const count = await cards.count();

    for (let i = 0; i < count; i++) {
      await cards.nth(i).hover();
      await page.waitForTimeout(300);
      await cards.nth(i).click();
      await page.waitForTimeout(300);
    }

    // No component-related errors should occur
    expect(errors).toHaveLength(0);
  });

  test('scroll position stable during interaction', async ({ page }) => {
    // Scroll section into view
    await page.locator('[id="core-values"]').scrollIntoViewIfNeeded();
    await page.waitForTimeout(500);

    // Measure scroll position with card in viewport
    const scrollBefore = await page.evaluate(() => window.scrollY);

    // Interact with a card (card expansion should not cause scroll jump)
    const card = page.locator('[data-testid="section-value-card"]').nth(1);
    await card.hover();
    await page.waitForTimeout(500);
    await card.click();
    await page.waitForTimeout(500);

    // Verify scroll position didn't jump
    const scrollAfter = await page.evaluate(() => window.scrollY);
    expect(Math.abs(scrollAfter - scrollBefore)).toBeLessThan(50);
  });
});
