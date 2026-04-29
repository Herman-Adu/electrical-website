import { type Page } from "@playwright/test";

export const resetContactStorage = async (page: Page) => {
  await page.addInitScript(() => {
    window.localStorage.removeItem("contact-form-storage");
  });
};

export const getContactForm = (page: Page) => page.locator("main form").first();
