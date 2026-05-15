import { test, expect } from "@playwright/test";
import {
  getCategorySlugs,
  getProjectByCategoryAndSlug,
  getProjectSlugsByCategory,
} from "@/data/projects";
import {
  getNewsArticleSlugsByCategory,
  getNewsCategorySlugs,
} from "@/data/news";

function getFirstProjectWithTimelineRoute(): string | null {
  for (const categorySlug of getCategorySlugs()) {
    for (const projectSlug of getProjectSlugsByCategory(categorySlug)) {
      const project = getProjectByCategoryAndSlug(categorySlug, projectSlug);
      if (project?.detail?.timeline?.length) {
        return `/projects/category/${categorySlug}/${projectSlug}`;
      }
    }
  }
  return null;
}

function getFirstNewsDetailRoute(): string {
  const categorySlug = getNewsCategorySlugs()[0];
  if (!categorySlug) {
    throw new Error(
      "No news category slug available for timeline route smoke test",
    );
  }

  const articleSlug = getNewsArticleSlugsByCategory(categorySlug)[0];
  if (!articleSlug) {
    throw new Error(
      `No news article slug available for category ${categorySlug} in timeline route smoke test`,
    );
  }

  return `/news-hub/category/${categorySlug}/${articleSlug}`;
}

test.describe("timeline route smoke", () => {
  test("about route exposes timeline anchor", async ({ page }) => {
    const response = await page.goto("/about", {
      waitUntil: "domcontentloaded",
    });
    expect(response?.status()).toBe(200);

    const timelineSection = page.locator("section#timeline").first();
    await expect(timelineSection).toBeVisible({ timeout: 15000 });
  });

  test("project detail route exposes timeline anchor section", async ({
    page,
  }) => {
    const route = getFirstProjectWithTimelineRoute();
    if (!route) {
      // No real project has detail.timeline data yet — self-heals when one is added.
      test.skip();
      return;
    }

    const response = await page.goto(route, { waitUntil: "domcontentloaded" });
    expect(response?.status()).toBe(200);

    const timelineAnchor = page.locator("#timeline").first();
    await expect(timelineAnchor).toBeVisible({ timeout: 15000 });

    const timelineNodes = page.locator("[data-timeline-node]");
    expect(await timelineNodes.count()).toBeGreaterThan(0);

    const lastNode = timelineNodes.last();
    await lastNode.scrollIntoViewIfNeeded();
    await expect(lastNode).toBeVisible();
  });

  test("news detail route exposes timeline anchor section", async ({
    page,
  }) => {
    const route = getFirstNewsDetailRoute();
    const response = await page.goto(route, { waitUntil: "domcontentloaded" });
    expect(response?.status()).toBe(200);

    const timelineSection = page.locator("section#timeline").first();
    await expect(timelineSection).toBeVisible({ timeout: 15000 });

    const timelineNodes = timelineSection.locator("[data-timeline-node]");
    expect(await timelineNodes.count()).toBeGreaterThan(0);

    const lastNode = timelineNodes.last();
    await lastNode.scrollIntoViewIfNeeded();
    await expect(lastNode).toBeVisible();
  });
});
