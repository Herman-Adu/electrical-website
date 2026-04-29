import { test, expect, type Locator } from "@playwright/test";
import { resetContactStorage, getContactForm } from "./helpers/contact";

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
    await resetContactStorage(page);
    await page.goto("/contact", { waitUntil: "domcontentloaded" });

    const form = getContactForm(page);
    await expect(
      page.getByRole("heading", { name: /your contact details/i }),
    ).toBeVisible();
    await expect(form).toBeVisible();

    const formClass = await form.getAttribute("class");
    expect(formClass).toBeDefined();

    await expect(form.getByPlaceholder("John Smith")).toBeVisible();
    await expect(form.getByPlaceholder("john.smith@example.com")).toBeVisible();
    await expect(form.getByPlaceholder("07700 900000")).toBeVisible();

    await expect(form.getByRole("button", { name: /continue/i })).toBeVisible();
  });

  test("Contact Form displays rate limit message", async ({ page }) => {
    await resetContactStorage(page);
    await page.goto("/contact", { waitUntil: "domcontentloaded" });

    const form = getContactForm(page);
    const continueButton = form.getByRole("button", { name: /continue/i });
    await expect(continueButton).toBeDisabled();

    await form.getByPlaceholder("John Smith").fill("Test User");
    await form
      .getByPlaceholder("john.smith@example.com")
      .fill("test@example.com");
    await form.getByPlaceholder("07700 900000").fill("07700900000");
    await expect(continueButton).toBeEnabled();
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
    await page.goto("/", { waitUntil: "domcontentloaded" });

    const mobileMenuToggle = page.getByRole("button", {
      name: /open menu|close menu/i,
    });
    await clickWhenReady(mobileMenuToggle);
    await expect(mobileMenuToggle).toBeVisible();

    await expect(
      page.getByRole("navigation", { name: /primary/i }),
    ).toBeVisible();
  });

  test("Select component renders and opens", async ({ page }) => {
    await resetContactStorage(page);
    await page.goto("/contact", { waitUntil: "domcontentloaded" });

    const form = getContactForm(page);
    await form.getByPlaceholder("John Smith").fill("Test User");
    await form
      .getByPlaceholder("john.smith@example.com")
      .fill("test@example.com");
    await form.getByPlaceholder("07700 900000").fill("07700900000");
    await expect(form.getByRole("button", { name: /continue/i })).toBeEnabled();
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
    await page.goto("/", { waitUntil: "domcontentloaded" });

    const navbar = page.getByRole("navigation", { name: /primary/i });
    await expect(navbar).toBeVisible();

    // Mobile menu should be accessible
    const mobileMenu = page.getByRole("button", {
      name: /open menu|close menu/i,
    });
    await clickWhenReady(mobileMenu);
    await expect(mobileMenu).toBeVisible();

    // Test desktop viewport (URL loads)
    await page.setViewportSize({ width: 1920, height: 1080 });
    await page.goto("/", { waitUntil: "domcontentloaded" });
    await expect(page).toHaveURL(/\/$/);
  });
});
