import { test, expect } from '@playwright/test';

const BASE_URL = 'http://localhost:5174';

test.describe('Authentication Flow', () => {
  test('valid login redirects to dashboard', async ({ page }) => {
    await page.goto(`${BASE_URL}/login`);
    
    await page.fill('input[id="username"]', 'e2e_user');
    await page.fill('input[id="password"]', 'e2e123');
    await page.click('button[type="submit"]');
    
    await expect(page).toHaveURL(/.*\/dashboard/, { timeout: 10000 });
    await expect(page.locator('h3')).toContainText('Welcome, e2e_user!');
  });

  test('invalid login shows error message', async ({ page }) => {
    await page.goto(`${BASE_URL}/login`);
    
    await page.fill('input[id="username"]', 'wrong');
    await page.fill('input[id="password"]', 'wrong');
    await page.click('button[type="submit"]');
    
    await expect(page.locator('text=Invalid username or password')).toBeVisible();
  });

  test('logout redirects to login', async ({ page }) => {
    await page.goto(`${BASE_URL}/login`);
    
    await page.fill('input[id="username"]', 'e2e_user');
    await page.fill('input[id="password"]', 'e2e123');
    await page.click('button[type="submit"]');
    
    await expect(page).toHaveURL(/.*\/dashboard/, { timeout: 10000 });
    
    await page.click('button:has-text("Log out")');
    
    await expect(page).toHaveURL(/.*\/login/, { timeout: 10000 });
  });
});
