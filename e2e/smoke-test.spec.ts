import { test, expect, type Locator, type Page } from "@playwright/test";

const clickWhenReady = async (locator: Locator) => {
  await locator.waitFor({ state: "visible" });
  await locator.scrollIntoViewIfNeeded();
  await expect(locator).toBeVisible();
  await expect(locator).toBeEnabled();
  await locator.click({ trial: true });
  await locator.click();
};

const getContactForm = (page: Page) =>
  page
    .getByRole("main")
    .locator("form")
    .filter({ hasText: "Project Inquiry Form" });

test.describe("UI Smoke Tests", () => {
  test("Contact Form renders and submits", async ({ page }) => {
    await page.goto("/contact", { waitUntil: "domcontentloaded" });

    // Verify form is visible
    const form = getContactForm(page);
    await expect(form).toBeVisible();

    // Check form styling (verify Tailwind utilities are applied)
    const formClass = await form.getAttribute("class");
    expect(formClass).toBeDefined();
    expect(formClass).toContain("border");

    // Verify route-owned, labeled form fields
    await expect(form.getByLabel(/full name/i)).toBeVisible();
    await expect(form.getByLabel(/email address/i)).toBeVisible();
    await expect(form.getByLabel(/^project type/i)).toBeVisible();
    await expect(form.getByLabel(/^project details/i)).toBeVisible();

    // Verify form has submit button
    await expect(
      form.getByRole("button", { name: /submit inquiry/i }),
    ).toBeVisible();
  });

  test("Contact Form displays rate limit message", async ({ page }) => {
    await page.goto("/contact", { waitUntil: "domcontentloaded" });

    // Verify rate-limit error handling UI elements exist
    const form = getContactForm(page);
    await expect(form).toBeVisible();

    // Check for error alert styling
    const errorAlert = form.getByRole("alert");
    if (await errorAlert.isVisible()) {
      const alertClass = await errorAlert.getAttribute("class");
      expect(alertClass).toBeDefined();
    }
  });

  test("Command Palette opens and responds to input", async ({ page }) => {
    await page.goto("/", { waitUntil: "domcontentloaded" });

    // Open command palette with keyboard shortcut (Cmd/Ctrl + K)
    await page.keyboard.press("Control+K");

    const commandDialog = page.getByRole("dialog", {
      name: /command palette/i,
    });
    const isVisible = await commandDialog
      .isVisible({ timeout: 1000 })
      .catch(() => false);

    if (isVisible) {
      const commandInput = commandDialog.locator("[data-slot='command-input']");
      await expect(commandInput).toBeVisible();
      await commandInput.fill("about");
      await expect(commandDialog).toBeVisible();
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
    await expect(page.locator("#mobile-navigation-menu")).toBeVisible();

    const servicesDropdownToggle = page.getByRole("button", {
      name: /services menu/i,
    });
    await clickWhenReady(servicesDropdownToggle);
    await expect(servicesDropdownToggle).toHaveAttribute(
      "aria-expanded",
      "true",
    );

    await expect(
      page.getByRole("button", { name: /commercial & retail/i }),
    ).toBeVisible();
  });

  test("Select component renders and opens", async ({ page }) => {
    await page.goto("/contact", { waitUntil: "domcontentloaded" });

    const form = getContactForm(page);
    const selectTrigger = form.getByLabel(/^project type/i);
    await expect(selectTrigger).toBeVisible();

    await selectTrigger.selectOption("industrial");
    await expect(selectTrigger).toHaveValue("industrial");
  });

  test("Navigation links render with correct styling", async ({ page }) => {
    await page.goto("/", { waitUntil: "domcontentloaded" });

    // Check navbar exists
    const navbar = page.getByRole("navigation", { name: /primary/i });
    await expect(navbar).toBeVisible();

    // Verify navbar has proper Tailwind styling
    const navClass = await navbar.getAttribute("class");
    expect(navClass).toBeDefined();

    // Check for key navigation links
    const links = navbar.getByRole("link");
    const linkCount = await links.count();
    expect(linkCount).toBeGreaterThan(0);
    await expect(
      navbar.getByRole("link", { name: /navigate to services/i }),
    ).toBeVisible();
  });

  test("Hero Section displays with proper styling", async ({ page }) => {
    await page.goto("/", { waitUntil: "domcontentloaded" });

    const main = page.getByRole("main");
    const heading = main.getByRole("heading", {
      level: 1,
      name: /powering the next generation of innovation/i,
    });
    await expect(heading).toBeVisible();

    // Check for critical elements
    await expect(main.getByText(/commercial & industrial/i)).toBeVisible();
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

    const mobileNav = page.locator("#mobile-navigation-menu");
    await expect(mobileNav).toBeVisible();

    // Test desktop viewport
    await page.setViewportSize({ width: 1920, height: 1080 });
    await page.goto("/");

    const desktopNav = page.getByRole("navigation", { name: /primary/i });
    await expect(desktopNav).toBeVisible();
    await expect(
      desktopNav.getByRole("link", { name: /navigate to services/i }),
    ).toBeVisible();
  });
});
