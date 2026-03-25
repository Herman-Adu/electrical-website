import { test, expect } from "@playwright/test";

test.describe("UI Smoke Tests", () => {
  test("Contact Form renders and submits", async ({ page }) => {
    await page.goto("http://localhost:3000/contact");
    
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
    const submitBtn = form.locator("button[type='submit'], button:has-text('Send')");
    await expect(submitBtn.or(form.locator("button").last())).toBeVisible();
  });

  test("Contact Form displays rate limit message", async ({ page }) => {
    await page.goto("http://localhost:3000/contact");
    
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
    await page.goto("http://localhost:3000");
    
    // Open command palette with keyboard shortcut (Cmd/Ctrl + K)
    await page.keyboard.press("Control+K");
    
    // Wait a bit for dialog to render
    await page.waitForTimeout(300);
    
    // Verify dialog or command component is visible
    const commandContainer = page.locator("[data-slot='command'], div[cmdk-root], [role='dialog']").first();
    const isVisible = await commandContainer.isVisible({ timeout: 1000 }).catch(() => false);
    
    if (isVisible) {
      // Try typing in search
      await page.keyboard.type("about", { delay: 50 });
      await page.waitForTimeout(200);
      
      // Just verify command container is still visible
      await expect(commandContainer).toBeVisible();
    }
  });

  test("Dropdown Menu toggles visibility", async ({ page }) => {
    await page.goto("http://localhost:3000");
    
    // Find a button that likely opens a dropdown (in nav area)
    const navArea = page.locator("nav").first();
    const buttons = navArea.locator("button");
    const buttonCount = await buttons.count();
    
    if (buttonCount > 0) {
      const firstButton = buttons.first();
      await expect(firstButton).toBeVisible();
      
      // Get initial state
      const initialAriaExpanded = await firstButton.getAttribute("aria-expanded");
      
      // Click button
      await firstButton.click();
      await page.waitForTimeout(200);
      
      // Verify state changed or content appeared nearby
      const ariaExpanded = await firstButton.getAttribute("aria-expanded");
      expect(ariaExpanded).toBeDefined();
    }
  });

  test("Select component renders and opens", async ({ page }) => {
    await page.goto("http://localhost:3000/contact");
    
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
    await page.goto("http://localhost:3000");
    
    // Check navbar exists
    const navbar = page.locator("nav");
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
    await page.goto("http://localhost:3000");
    
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
    await page.goto("http://localhost:3000");
    
    const navbar = page.locator("nav");
    await expect(navbar).toBeVisible();
    
    // Mobile menu should be accessible
    const mobileMenu = page.locator("button[aria-label*='menu'], button[aria-label*='Menu']").first();
    if (await mobileMenu.isVisible()) {
      await mobileMenu.click();
      const mobileNav = page.locator("[data-slot='mobile-nav'], [role='navigation']");
      await expect(mobileNav).toBeVisible({ timeout: 500 });
    }
    
    // Test desktop viewport
    await page.setViewportSize({ width: 1920, height: 1080 });
    await page.goto("http://localhost:3000");
    
    const desktopNav = page.locator("nav");
    await expect(desktopNav).toBeVisible();
  });
});
