import { chromium } from "playwright";

const pages = [
  { url: "http://localhost:3000", name: "Home (Smart Living, Illumination)" },
  { url: "http://localhost:3000/about", name: "About (Section Profile)" },
  {
    url: "http://localhost:3000/projects",
    name: "Projects (Dashboard, Schematic)",
  },
  { url: "http://localhost:3000/services", name: "Services (CTA Power)" },
];

async function testHydration() {
  const browser = await chromium.launch({ headless: true });
  const context = await browser.createBrowserContext();

  console.log("🔍 Testing for hydration warnings across affected routes...\n");

  let totalWarnings = 0;

  for (const page of pages) {
    const browserPage = await context.newPage();
    const warnings = [];
    const errors = [];

    browserPage.on("console", (msg) => {
      const text = msg.text();
      if (text.includes("Hydration")) {
        warnings.push(`  ⚠ ${text}`);
      }
      if (msg.type() === "error") {
        errors.push(`  ❌ ${text}`);
      }
    });

    try {
      await browserPage.goto(page.url, {
        waitUntil: "networkidle",
        timeout: 30000,
      });
      await browserPage.waitForTimeout(2000); // Wait for any deferred messages

      const warningCount = warnings.length;
      totalWarnings += warningCount;

      console.log(`✓ ${page.name}`);
      if (warningCount === 0) {
        console.log("  ✅ No hydration warnings detected");
      } else {
        console.log(`  ⚠ Found ${warningCount} hydration warning(s):`);
        warnings.forEach((w) => console.log(w));
      }

      if (errors.length > 0) {
        console.log(`  Errors detected:`);
        errors.forEach((e) => console.log(e));
      }
    } catch (err) {
      console.log(`✗ ${page.name}`);
      console.log(`  Error: ${err.message}`);
    }

    await browserPage.close();
    console.log("");
  }

  console.log(
    `\n📊 Summary: ${totalWarnings} total hydration warnings across all pages`,
  );
  console.log(
    totalWarnings === 0
      ? "✅ All pages passed hydration check!"
      : "⚠ Some warnings detected - review above",
  );

  await context.close();
  await browser.close();
}

testHydration().catch(console.error);
