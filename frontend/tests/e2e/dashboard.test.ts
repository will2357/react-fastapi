import { test, expect } from "@playwright/test";

const BASE_URL = "http://localhost:5174";

test.describe("Dashboard", () => {
  test("unauthenticated user is redirected to login", async ({ page }) => {
    await page.goto(`${BASE_URL}/dashboard`);

    await expect(page).toHaveURL(/.*\/login/, { timeout: 10000 });
  });

  test("authenticated user sees username", async ({ page }) => {
    await page.goto(`${BASE_URL}/login`);

    await page.fill('input[id="username"]', "e2e_user");
    await page.fill('input[id="password"]', "e2e123");
    await page.click('button[type="submit"]');

    await expect(page).toHaveURL(/.*\/dashboard/, { timeout: 10000 });
    await expect(page.getByRole("heading", { name: "Welcome, e2e_user!" })).toBeVisible();
  });

  test("dashboard shows protected content message", async ({ page }) => {
    await page.goto(`${BASE_URL}/login`);

    await page.fill('input[id="username"]', "e2e_user");
    await page.fill('input[id="password"]', "e2e123");
    await page.click('button[type="submit"]');

    await expect(page).toHaveURL(/.*\/dashboard/, { timeout: 10000 });
    await expect(
      page.locator("text=You are now logged in and can access protected content")
    ).toBeVisible();
  });
});
