import { chromium } from "@playwright/test";

async function run() {
  const base = "http://localhost:3000";
  const project =
    "/projects/category/commercial-lighting/riverside-commercial-retrofit";
  const news =
    "/news-hub/category/residential/taplow-residential-energy-refresh";
  const results = [];

  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage();

  const fail = (name, msg) => results.push({ name, ok: false, msg });
  const pass = (name, msg) => results.push({ name, ok: true, msg });

  try {
    await page.setViewportSize({ width: 375, height: 812 });
    await page.goto(base + project, {
      waitUntil: "domcontentloaded",
      timeout: 30000,
    });
    await page.waitForSelector("[data-timeline-row]", { timeout: 15000 });

    const mobile = await page.evaluate(async () => {
      const row = document.querySelector("[data-timeline-row]");
      if (!row) return { ok: false, msg: "no timeline row" };

      const node = row.querySelector("[data-timeline-node]");
      const content = row.querySelector(".col-start-2");
      const mobileLabel = row.querySelector(".md\\:hidden");
      const segment = row.querySelector('[aria-hidden="true"]');
      const segAnimated = segment?.querySelector(":scope > div:nth-child(2)");

      const nodeRect = node?.getBoundingClientRect();
      const contentRect = content?.getBoundingClientRect();
      const leftSpine = Boolean(
        nodeRect && contentRect && nodeRect.left < contentRect.left,
      );

      const before = segAnimated
        ? getComputedStyle(segAnimated).transform
        : null;
      window.scrollBy({ top: 700, behavior: "instant" });
      await new Promise((resolve) => setTimeout(resolve, 600));
      const after = segAnimated
        ? getComputedStyle(segAnimated).transform
        : null;
      const changed = Boolean(before && after && before !== after);

      return {
        ok: leftSpine && Boolean(mobileLabel) && changed,
        msg: JSON.stringify({
          leftSpine,
          hasMobileLabel: Boolean(mobileLabel),
          before,
          after,
          changed,
        }),
      };
    });

    if (mobile.ok) pass("mobile-project-layout-animation", mobile.msg);
    else fail("mobile-project-layout-animation", mobile.msg);

    await page.setViewportSize({ width: 1366, height: 900 });
    await page.goto(base + project, {
      waitUntil: "domcontentloaded",
      timeout: 30000,
    });
    await page.waitForSelector("[data-timeline-row]", { timeout: 15000 });

    const desktop = await page.evaluate(() => {
      const row = document.querySelector("[data-timeline-row]");
      if (!row) return { ok: false, msg: "no timeline row" };

      const label = row.firstElementChild;
      const nodeCol = label?.nextElementSibling;
      const card = nodeCol?.nextElementSibling;

      const labelVisible = Boolean(
        label && getComputedStyle(label).display !== "none",
      );
      const labelRect = label?.getBoundingClientRect();
      const nodeRect = nodeCol
        ?.querySelector("[data-timeline-node]")
        ?.getBoundingClientRect();
      const cardRect = card?.getBoundingClientRect();
      const ordered = Boolean(
        labelRect &&
        nodeRect &&
        cardRect &&
        labelRect.left < nodeRect.left &&
        nodeRect.left < cardRect.left,
      );

      return {
        ok: labelVisible && ordered,
        msg: JSON.stringify({ labelVisible, ordered }),
      };
    });

    if (desktop.ok) pass("desktop-project-layout", desktop.msg);
    else fail("desktop-project-layout", desktop.msg);

    await page.goto(base + news, {
      waitUntil: "domcontentloaded",
      timeout: 30000,
    });
    await page.waitForSelector("section#timeline", { timeout: 15000 });

    const newsCheck = await page.evaluate(async () => {
      const section = document.querySelector("section#timeline");
      const nodes =
        section?.querySelectorAll("[data-timeline-node]")?.length ?? 0;
      const anim = section?.querySelector(".origin-top");
      const before = anim ? getComputedStyle(anim).transform : null;
      window.scrollBy({ top: 700, behavior: "instant" });
      await new Promise((resolve) => setTimeout(resolve, 600));
      const after = anim ? getComputedStyle(anim).transform : null;

      return {
        ok: Boolean(section && nodes > 0 && anim && before !== after),
        msg: JSON.stringify({ nodes, before, after }),
      };
    });

    if (newsCheck.ok) pass("news-timeline-animation", newsCheck.msg);
    else fail("news-timeline-animation", newsCheck.msg);

    await page.goto(base + "/about#timeline", {
      waitUntil: "domcontentloaded",
      timeout: 30000,
    });
    await page.waitForSelector("section#timeline", { timeout: 15000 });

    const aboutCheck = await page.evaluate(async () => {
      const section = document.querySelector("section#timeline");
      const nodes =
        section?.querySelectorAll("[data-timeline-node]")?.length ?? 0;
      const anim = section?.querySelector(".origin-top");
      const before = anim ? getComputedStyle(anim).transform : null;
      window.scrollBy({ top: 700, behavior: "instant" });
      await new Promise((resolve) => setTimeout(resolve, 600));
      const after = anim ? getComputedStyle(anim).transform : null;

      return {
        ok: Boolean(section && nodes > 0 && anim && before !== after),
        msg: JSON.stringify({ nodes, before, after }),
      };
    });

    if (aboutCheck.ok) pass("about-timeline-animation", aboutCheck.msg);
    else fail("about-timeline-animation", aboutCheck.msg);
  } catch (error) {
    fail("script-error", String(error?.stack || error));
  } finally {
    await browser.close();
  }

  console.log(JSON.stringify(results, null, 2));
  if (results.some((result) => !result.ok)) {
    process.exit(1);
  }
}

run();
