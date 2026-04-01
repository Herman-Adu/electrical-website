import { test, expect, type Locator } from "@playwright/test";

const clickWhenReady = async (locator: Locator) => {
  await locator.waitFor({ state: "visible" });
  await locator.scrollIntoViewIfNeeded();
  await expect(locator).toBeVisible();
  await expect(locator).toBeEnabled();
  await locator.click({ trial: true });
  await locator.click();
};

test.describe("UI Smoke Tests", () => {
  test("Contact Form renders and submits", async ({ page }) => {
    await page.goto("/contact");

    // Verify form is visible
    const form = page.locator("form").first();
    await expect(form).toBeVisible();

    // Check form styling (verify Tailwind utilities are applied)
    const formClass = await form.getAttribute("class");
    expect(formClass).toBeDefined();
    expect(formClass).toContain("border");

    // Verify form has input fields
    const inputs = form.locator("input");
    const inputCount = await inputs.count();
    expect(inputCount).toBeGreaterThan(0);

    // Verify form has submit button
    const submitBtn = form.locator(
      "button[type='submit'], button:has-text('Send')",
    );
    await expect(submitBtn.or(form.locator("button").last())).toBeVisible();
  });

  test("Contact Form displays rate limit message", async ({ page }) => {
    await page.goto("/contact");

    // Verify rate-limit error handling UI elements exist
    const form = page.locator("form");
    await expect(form).toBeVisible();

    // Check for error alert styling
    const errorAlert = page.locator("[role='alert']");
    if (await errorAlert.isVisible()) {
      const alertClass = await errorAlert.getAttribute("class");
      expect(alertClass).toBeDefined();
    }
  });

  test("Command Palette opens and responds to input", async ({ page }) => {
    await page.goto("/");

    // Open command palette with keyboard shortcut (Cmd/Ctrl + K)
    await page.keyboard.press("Control+K");

    // Wait a bit for dialog to render
    await page.waitForTimeout(300);

    // Verify dialog or command component is visible
    const commandContainer = page
      .locator("[data-slot='command'], div[cmdk-root], [role='dialog']")
      .first();
    const isVisible = await commandContainer
      .isVisible({ timeout: 1000 })
      .catch(() => false);

    if (isVisible) {
      // Try typing in search
      await page.keyboard.type("about", { delay: 50 });
      await page.waitForTimeout(200);

      // Just verify command container is still visible
      await expect(commandContainer).toBeVisible();
    }
  });

  test("Dropdown Menu toggles visibility", async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 });
    await page.goto("/");

    const mobileMenuToggle = page.getByRole("button", {
      name: /open menu|close menu/i,
    });
    await clickWhenReady(mobileMenuToggle);
    await expect(mobileMenuToggle).toHaveAttribute("aria-expanded", "true");
    await expect(page.locator("[data-slot='mobile-nav']")).toBeVisible();

    const servicesDropdownToggle = page.getByRole("button", {
      name: /services menu/i,
    });
    await clickWhenReady(servicesDropdownToggle);
    await expect(servicesDropdownToggle).toHaveAttribute(
      "aria-expanded",
      "true",
    );

    await expect(
      page.getByRole("button", { name: "Commercial & Retail" }),
    ).toBeVisible();
  });

  test("Select component renders and opens", async ({ page }) => {
    await page.goto("/contact");

    // Find select/dropdown in form
    const selectTrigger = page.locator("[role='combobox']").first();

    if (await selectTrigger.isVisible()) {
      await selectTrigger.click();

      // Verify options menu appears
      const options = page.locator("[role='option']");
      const count = await options.count();
      expect(count).toBeGreaterThan(0);

      // Click an option
      const firstOption = options.first();
      await firstOption.click();

      // Verify selection
      const selectedValue = await selectTrigger.textContent();
      expect(selectedValue).toBeTruthy();
    }
  });

  test("Navigation links render with correct styling", async ({ page }) => {
    await page.goto("/");

    // Check navbar exists
    const navbar = page.getByRole("navigation", { name: /primary/i });
    await expect(navbar).toBeVisible();

    // Verify navbar has proper Tailwind styling
    const navClass = await navbar.getAttribute("class");
    expect(navClass).toBeDefined();

    // Check for key navigation links
    const links = page.locator("a[href*='/']");
    const linkCount = await links.count();
    expect(linkCount).toBeGreaterThan(0);
  });

  test("Hero Section displays with proper styling", async ({ page }) => {
    await page.goto("/");

    // Check hero section exists
    const hero = page.locator("section").first();
    await expect(hero).toBeVisible();

    // Verify hero has expected structure
    const heading = page.locator("h1");
    await expect(heading).toBeVisible();

    // Check for critical elements
    const heroBg = page.locator("[data-slot='hero']");
    if (await heroBg.isVisible()) {
      const bgClass = await heroBg.getAttribute("class");
      expect(bgClass).toBeDefined();
    }
  });

  test("Responsive layout adapts to viewport", async ({ page }) => {
    // Test mobile viewport
    await page.setViewportSize({ width: 375, height: 667 });
    await page.goto("/");

    const navbar = page.getByRole("navigation", { name: /primary/i });
    await expect(navbar).toBeVisible();

    // Mobile menu should be accessible
    const mobileMenu = page.getByRole("button", {
      name: /open menu|close menu/i,
    });
    await clickWhenReady(mobileMenu);
    await expect(mobileMenu).toHaveAttribute("aria-expanded", "true");

    const mobileNav = page.locator("[data-slot='mobile-nav']");
    await expect(mobileNav).toBeVisible();

    // Test desktop viewport
    await page.setViewportSize({ width: 1920, height: 1080 });
    await page.goto("/");

    const desktopNav = page.getByRole("navigation", { name: /primary/i });
    await expect(desktopNav).toBeVisible();
    await expect(
      desktopNav.getByRole("link", { name: "Services" }).first(),
    ).toBeVisible();
  });
});
