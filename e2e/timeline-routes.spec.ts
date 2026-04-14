import { test, expect } from "@playwright/test";
import { getCategorySlugs, getProjectSlugsByCategory } from "@/data/projects";
import {
  getNewsArticleSlugsByCategory,
  getNewsCategorySlugs,
} from "@/data/news";

function getFirstProjectDetailRoute(): string {
  const categorySlug = getCategorySlugs()[0];
  if (!categorySlug) {
    throw new Error(
      "No project category slug available for timeline route smoke test",
    );
  }

  const projectSlug = getProjectSlugsByCategory(categorySlug)[0];
  if (!projectSlug) {
    throw new Error(
      `No project slug available for category ${categorySlug} in timeline route smoke test`,
    );
  }

  return `/projects/category/${categorySlug}/${projectSlug}`;
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
    const route = getFirstProjectDetailRoute();
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
