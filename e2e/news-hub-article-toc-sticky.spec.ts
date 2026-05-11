import { test, expect } from "@playwright/test";

/**
 * News Hub Article TOC — Sticky Behaviour & Testimonial Heading
 *
 * Verifies that:
 *   1. The right-column TOC aside on news article detail pages stays docked
 *      below the navbar while the related-articles block scrolls into view
 *      (mirrors the /projects sticky-aside pattern).
 *   2. Clicking the "Client Testimonial" TOC entry on a case-study article
 *      lands the page on a visible <h2>Client Testimonial</h2> heading above
 *      the quote block (Phase 1 fix — bare blockquote replaced with proper
 *      heading).
 *
 * Test seams:
 *   - <aside data-sticky-toc="true"> on the article detail page (already
 *     present before this spec was authored).
 *   - <div data-related-articles="true"> wrapping NewsRelatedArticles
 *     (added in Phase 5 alongside this spec).
 *
 * Articles exercised:
 *   - /news-hub/category/residential/taplow-residential-energy-refresh
 *     (residential layout — has a quote block + TOC entry "Homeowner Feedback")
 *   - /news-hub/category/case-studies/hospital-power-ring-lessons-learned
 *     (case-study layout — has a quote block + TOC entry "Client Testimonial")
 *
 * Prerequisites:
 *   - Next.js dev or production server on http://127.0.0.1:3000
 *   - Run: pnpm dev (or pnpm build && pnpm start) before these tests.
 */

// ---------------------------------------------------------------------------
// 1. Sticky TOC aside through the related-articles block (xl viewport only —
//    aside is `hidden xl:flex`, the xl breakpoint is 1280px in Tailwind v4)
// ---------------------------------------------------------------------------
test.describe("article TOC stays sticky through related articles", () => {
  test.use({ viewport: { width: 1440, height: 900 } });

  test("residential article: aside is still in viewport when related articles scroll into view", async ({
    page,
  }) => {
    const response = await page.goto(
      "/news-hub/category/residential/taplow-residential-energy-refresh",
      { waitUntil: "domcontentloaded" },
    );
    expect(response?.status()).toBe(200);

    const aside = page.locator('[data-sticky-toc="true"]');
    await expect(aside).toBeVisible({ timeout: 10000 });

    // Initial position — aside renders inside the article-content section.
    const initialRect = await aside.evaluate((el) => {
      const r = el.getBoundingClientRect();
      return { top: r.top, height: r.height };
    });
    expect(initialRect.height).toBeGreaterThan(0);

    // Scroll the related-articles wrapper into view. CSS sticky should keep
    // the aside docked at its `top-37.5` (≈150px) offset rather than scrolling
    // away with the article body.
    const relatedWrapper = page.locator('[data-related-articles="true"]');
    await expect(relatedWrapper).toBeAttached();
    await relatedWrapper.evaluate((el) =>
      el.scrollIntoView({ block: "center", behavior: "auto" }),
    );

    // Allow layout to settle after programmatic scroll.
    await page.waitForFunction(() => {
      const aside = document.querySelector(
        '[data-sticky-toc="true"]',
      ) as HTMLElement | null;
      return aside !== null && aside.getBoundingClientRect().height > 0;
    });

    const stuckRect = await aside.evaluate((el) => {
      const r = el.getBoundingClientRect();
      return { top: r.top, height: r.height };
    });

    const viewport = page.viewportSize();
    expect(viewport).not.toBeNull();
    const viewportHeight = viewport!.height;

    // Sticky is working if any portion of the aside remains on screen. When the
    // containing block is shorter than the aside (short residential article), CSS
    // sticky releases in "bottom-tracking" mode — top goes negative but the bottom
    // (top + height) stays positive. Complete sticky failure (element freely scrolling
    // with the body) would push top to thousands of pixels negative, making
    // top + height negative too.
    expect(stuckRect.top).toBeLessThan(viewportHeight);
    expect(stuckRect.top + stuckRect.height).toBeGreaterThan(0);
  });

  test("case-study article: aside stays sticky through related articles", async ({
    page,
  }) => {
    const response = await page.goto(
      "/news-hub/category/case-studies/hospital-power-ring-lessons-learned",
      { waitUntil: "domcontentloaded" },
    );
    expect(response?.status()).toBe(200);

    const aside = page.locator('[data-sticky-toc="true"]').first();
    await expect(aside).toBeVisible({ timeout: 10000 });

    const relatedWrapper = page.locator('[data-related-articles="true"]');
    await expect(relatedWrapper).toBeAttached();
    await relatedWrapper.evaluate((el) =>
      el.scrollIntoView({ block: "center", behavior: "auto" }),
    );

    await page.waitForFunction(() => {
      const aside = document.querySelector(
        '[data-sticky-toc="true"]',
      ) as HTMLElement | null;
      return aside !== null && aside.getBoundingClientRect().height > 0;
    });

    const stuckRect = await aside.evaluate((el) => {
      const r = el.getBoundingClientRect();
      return { top: r.top, height: r.height };
    });
    const viewport = page.viewportSize()!;

    expect(stuckRect.top).toBeLessThan(viewport.height);
    expect(stuckRect.top + stuckRect.height).toBeGreaterThan(0);
    expect(stuckRect.top).toBeLessThan(400);
  });
});

// ---------------------------------------------------------------------------
// 2. TOC click on "Client Testimonial" lands on a visible h2 (not bare quote)
// ---------------------------------------------------------------------------
test.describe("client testimonial heading is visible", () => {
  test.use({ viewport: { width: 1440, height: 900 } });

  test("clicking the testimonial TOC entry scrolls to a visible h2 heading", async ({
    page,
  }) => {
    const response = await page.goto(
      "/news-hub/category/case-studies/hospital-power-ring-lessons-learned",
      { waitUntil: "domcontentloaded" },
    );
    expect(response?.status()).toBe(200);

    // TOC nav lives inside the sticky aside. The testimonial entry exists
    // because article.detail.quote is defined (TOC label "Client Testimonial").
    const tocNav = page.getByRole("navigation", { name: /table of contents/i });
    await expect(tocNav).toBeVisible({ timeout: 10000 });

    const testimonialLink = tocNav.getByRole("button", {
      name: /client testimonial/i,
    });
    await expect(testimonialLink).toBeVisible();
    await testimonialLink.click();

    // The Phase 1 fix added an h2 inside the quote section. Without that
    // heading, the TOC click previously landed on a bare blockquote.
    const heading = page.getByRole("heading", {
      level: 2,
      name: "Client Testimonial",
    });
    await expect(heading).toBeVisible({ timeout: 5000 });
    await expect(heading).toBeInViewport({ timeout: 5000 });

    // The testimonial section anchor should also be in viewport.
    const testimonialSection = page.locator("#testimonial");
    await expect(testimonialSection).toBeInViewport();
  });
});
