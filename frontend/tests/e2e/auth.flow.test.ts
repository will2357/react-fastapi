import { test, expect } from "@playwright/test";

const BASE_URL = "http://localhost:5174";

test.describe("Authentication Flow", () => {
  test("valid login redirects to dashboard", async ({ page }) => {
    await page.goto(`${BASE_URL}/login`);

    await page.fill('input[id="username"]', "e2e_user");
    await page.fill('input[id="password"]', "e2e123");
    await page.click('button[type="submit"]');

    await expect(page).toHaveURL(/.*\/dashboard/, { timeout: 10000 });
    await expect(page.getByRole("heading", { name: "Welcome, e2e_user!" })).toBeVisible();
  });

  test("invalid login shows error message", async ({ page }) => {
    await page.goto(`${BASE_URL}/login`);

    await page.fill('input[id="username"]', "wrong");
    await page.fill('input[id="password"]', "wrong");
    await page.click('button[type="submit"]');

    await expect(page.getByText(/incorrect username or password/i)).toBeVisible({ timeout: 15000 });
  });

  test("logout redirects to login", async ({ page }) => {
    await page.goto(`${BASE_URL}/login`);

    await page.fill('input[id="username"]', "e2e_user");
    await page.fill('input[id="password"]', "e2e123");
    await page.click('button[type="submit"]');

    await expect(page).toHaveURL(/.*\/dashboard/, { timeout: 10000 });

    await page.click('button:has-text("Log out")');

    await expect(page).toHaveURL(/.*\/login/, { timeout: 10000 });
  });
});

test.describe("Signup Flow", () => {
  test("signup form renders correctly", async ({ page }) => {
    await page.goto(`${BASE_URL}/signup`);

    await expect(page.locator('input[id="username"]')).toBeVisible();
    await expect(page.locator('input[id="email"]')).toBeVisible();
    await expect(page.locator('input[id="password"]')).toBeVisible();
    await expect(page.locator('input[id="confirmPassword"]')).toBeVisible();
    await expect(page.locator('button:has-text("Sign up")')).toBeVisible();
  });

  test("signup shows password mismatch error", async ({ page }) => {
    await page.goto(`${BASE_URL}/signup`);

    await page.fill('input[id="username"]', "testuser");
    await page.fill('input[id="email"]', "test@example.com");
    await page.fill('input[id="password"]', "password123");
    await page.fill('input[id="confirmPassword"]', "differentpassword");
    await page.click('button[type="submit"]');

    await expect(page.locator("text=Passwords do not match")).toBeVisible();
  });

  test("signup shows password too short error", async ({ page }) => {
    await page.goto(`${BASE_URL}/signup`);

    await page.fill('input[id="username"]', "testuser");
    await page.fill('input[id="email"]', "test@example.com");
    await page.fill('input[id="password"]', "short");
    await page.fill('input[id="confirmPassword"]', "short");
    await page.click('button[type="submit"]');

    await expect(page.locator("text=Password must be at least 6 characters")).toBeVisible();
  });

  test("has link to login page", async ({ page }) => {
    await page.goto(`${BASE_URL}/signup`);

    const loginLink = page.locator('a:has-text("Sign in")');
    await expect(loginLink).toBeVisible();
    await expect(loginLink).toHaveAttribute("href", "/login");
  });
});
