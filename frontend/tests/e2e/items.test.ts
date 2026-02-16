import { test, expect } from "@playwright/test";

const BASE_URL = "http://localhost:5174";

test.describe("Items", () => {
  test("items section is visible on dashboard", async ({ page }) => {
    await page.goto(`${BASE_URL}/login`);

    await page.fill('input[id="username"]', "e2e_user");
    await page.fill('input[id="password"]', "e2e123");
    await page.click('button[type="submit"]');

    await expect(page).toHaveURL(/.*\/dashboard/, { timeout: 10000 });

    await expect(page.getByRole("heading", { name: "Items" })).toBeVisible();
    await expect(page.locator('input[id="itemName"]')).toBeVisible();
    await expect(page.locator('input[id="itemPrice"]')).toBeVisible();
    await expect(page.locator('button:has-text("Add Item")')).toBeVisible();
  });

  test("can create and view new item", async ({ page }) => {
    await page.goto(`${BASE_URL}/login`);

    await page.fill('input[id="username"]', "e2e_user");
    await page.fill('input[id="password"]', "e2e123");
    await page.click('button[type="submit"]');

    await expect(page).toHaveURL(/.*\/dashboard/, { timeout: 10000 });

    const uniqueName = `Test Item ${Date.now()}`;
    await page.fill('input[id="itemName"]', uniqueName);
    await page.fill('input[id="itemPrice"]', "19.99");
    await page.click('button:has-text("Add Item")');

    await expect(page.locator(`text=${uniqueName}`)).toBeVisible({ timeout: 5000 });
    await expect(page.locator("text=$19.99")).toBeVisible();
  });
});
