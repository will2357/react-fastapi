import { test, expect } from "@playwright/test";

const BASE_URL = "http://localhost:5174";

test.describe("Complete Signup Flow E2E", () => {
  test("signup with duplicate username shows error", async ({ page }) => {
    await page.goto(`${BASE_URL}/signup`);

    await page.fill('input[id="username"]', "e2e_user");
    await page.fill('input[id="email"]', "new@example.com");
    await page.fill('input[id="password"]', "password123");
    await page.fill('input[id="confirmPassword"]', "password123");
    await page.click('button[type="submit"]');

    await expect(page.locator("text=Username already taken")).toBeVisible({ timeout: 10000 });
  });

  test("signup with duplicate email shows error", async ({ page }) => {
    await page.goto(`${BASE_URL}/signup`);

    await page.fill('input[id="username"]', `unique_${Date.now()}`);
    await page.fill('input[id="email"]', "e2e@example.com");
    await page.fill('input[id="password"]', "password123");
    await page.fill('input[id="confirmPassword"]', "password123");
    await page.click('button[type="submit"]');

    await expect(page.locator("text=Email already registered")).toBeVisible({ timeout: 10000 });
  });

  test("confirm signup with invalid token shows error", async ({ page }) => {
    await page.goto(`${BASE_URL}/confirm-signup?token=invalid_token_12345`);

    await expect(page.locator("text=Confirmation Failed")).toBeVisible({ timeout: 10000 });
  });

  test("confirm signup without token shows error", async ({ page }) => {
    await page.goto(`${BASE_URL}/confirm-signup`);

    await expect(page.locator("text=Confirmation Failed")).toBeVisible();
    await expect(page.locator("text=Invalid confirmation link")).toBeVisible();
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

  test("login page shows confirmation success message when confirmed=true", async ({ page }) => {
    await page.goto(`${BASE_URL}/login?confirmed=true`);

    await expect(page.locator("text=Account confirmed! Please sign in.")).toBeVisible();
  });

  test("signup form has all required fields", async ({ page }) => {
    await page.goto(`${BASE_URL}/signup`);

    await expect(page.locator('input[id="username"]')).toBeVisible();
    await expect(page.locator('input[id="email"]')).toBeVisible();
    await expect(page.locator('input[id="password"]')).toBeVisible();
    await expect(page.locator('input[id="confirmPassword"]')).toBeVisible();
    await expect(page.locator('button:has-text("Sign up")')).toBeVisible();
  });

  test("signup page has link to login", async ({ page }) => {
    await page.goto(`${BASE_URL}/signup`);

    const loginLink = page.locator('a:has-text("Sign in")');
    await expect(loginLink).toBeVisible();
    await expect(loginLink).toHaveAttribute("href", "/login");
  });

  test("login page has link to signup", async ({ page }) => {
    await page.goto(`${BASE_URL}/login`);

    const signupLink = page.locator('a:has-text("Sign up")');
    await expect(signupLink).toBeVisible();
    await expect(signupLink).toHaveAttribute("href", "/signup");
  });
});
