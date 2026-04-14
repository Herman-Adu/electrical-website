import { chromium } from "@playwright/test";

const base = "http://localhost:3000";
const pages = [
  {
    name: "project-mobile",
    url: "/projects/category/commercial-lighting/riverside-commercial-retrofit",
    viewport: { width: 375, height: 812 },
    check: "project-mobile",
  },
  {
    name: "project-desktop",
    url: "/projects/category/commercial-lighting/riverside-commercial-retrofit",
    viewport: { width: 1366, height: 900 },
    check: "project-desktop",
  },
  {
    name: "news-detail",
    url: "/news-hub/category/residential/taplow-residential-energy-refresh",
    viewport: { width: 1366, height: 900 },
    check: "generic-timeline",
  },
  {
    name: "about",
    url: "/about#timeline",
    viewport: { width: 1366, height: 900 },
    check: "generic-timeline",
  },
];

async function run() {
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage();
  const summary = [];

  try {
    for (const item of pages) {
      await page.setViewportSize(item.viewport);
      await page.goto(base + item.url, {
        waitUntil: "domcontentloaded",
        timeout: 30000,
      });

      const result = await page.evaluate(async (check) => {
        const collectTransforms = (root = document) =>
          Array.from(root.querySelectorAll(".origin-top"))
            .slice(0, 8)
            .map((element) => getComputedStyle(element).transform);

        const timelineSection = document.querySelector("section#timeline");
        const firstRow = document.querySelector("[data-timeline-row]");

        const before = collectTransforms(timelineSection ?? document);
        window.scrollBy({ top: 800, behavior: "instant" });
        await new Promise((resolve) => setTimeout(resolve, 700));
        const after = collectTransforms(timelineSection ?? document);

        const transformChanged = before.some(
          (value, index) => value !== after[index],
        );

        if (check === "project-mobile") {
          const node = firstRow?.querySelector("[data-timeline-node]");
          const content = firstRow?.querySelector(".col-start-2");
          const nodeRect = node?.getBoundingClientRect();
          const contentRect = content?.getBoundingClientRect();
          const leftSpine = Boolean(
            nodeRect && contentRect && nodeRect.left < contentRect.left,
          );
          return {
            ok: Boolean(leftSpine && transformChanged),
            details: { leftSpine, transformChanged, before, after },
          };
        }

        if (check === "project-desktop") {
          const label = firstRow?.firstElementChild;
          const nodeCol = label?.nextElementSibling;
          const card = nodeCol?.nextElementSibling;

          const labelVisible = Boolean(
            label && getComputedStyle(label).display !== "none",
          );
          const l = label?.getBoundingClientRect();
          const n = nodeCol
            ?.querySelector("[data-timeline-node]")
            ?.getBoundingClientRect();
          const c = card?.getBoundingClientRect();
          const ordered = Boolean(
            l && n && c && l.left < n.left && n.left < c.left,
          );

          return {
            ok: Boolean(labelVisible && ordered),
            details: { labelVisible, ordered, before, after },
          };
        }

        const hasSection = Boolean(timelineSection);
        return {
          ok: Boolean(hasSection && transformChanged),
          details: { hasSection, transformChanged, before, after },
        };
      }, item.check);

      summary.push({ name: item.name, ...result });
    }
  } finally {
    await browser.close();
  }

  console.log(JSON.stringify(summary, null, 2));
  if (summary.some((entry) => !entry.ok)) {
    process.exit(1);
  }
}

run();
