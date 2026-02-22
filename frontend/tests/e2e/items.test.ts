import { test, expect } from "@playwright/test";

// TODO: Replace with your own feature tests
// This is a placeholder E2E test file - remove or replace with your feature tests

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

  test("can create new item", async ({ page }) => {
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

  test("can enter edit mode", async ({ page }) => {
    await page.goto(`${BASE_URL}/login`);

    await page.fill('input[id="username"]', "e2e_user");
    await page.fill('input[id="password"]', "e2e123");
    await page.click('button[type="submit"]');

    await expect(page).toHaveURL(/.*\/dashboard/, { timeout: 10000 });

    // Create an item first
    const uniqueName = `Edit Test ${Date.now()}`;
    await page.fill('input[id="itemName"]', uniqueName);
    await page.fill('input[id="itemPrice"]', "10.00");
    await page.click('button:has-text("Add Item")');
    await expect(page.locator(`text=${uniqueName}`)).toBeVisible({ timeout: 5000 });

    // Click edit button
    await page.locator('svg.lucide-pencil').first().click();

    // Verify edit form appears with save/cancel buttons
    await expect(page.locator('button:has-text("Save")')).toBeVisible();
    await expect(page.locator('button:has-text("Cancel")')).toBeVisible();
  });
});
