import { defineConfig, devices } from '@playwright/test';

const backendUrl = 'http://localhost:8001';
const frontendUrl = 'http://localhost:5174';

export default defineConfig({
  testDir: './tests/e2e',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: 'list',
  use: {
    baseURL: frontendUrl,
    trace: 'on-first-retry',
  },
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
  ],
  webServer: [
    {
      command: `cd ../backend && CORS_ORIGINS='["${frontendUrl}"]' SECRET_KEY='test-secret-key' .venv/bin/python -m uvicorn app.main:app --port 8001`,
      url: `${backendUrl}/docs`,
      reuseExistingServer: !process.env.CI,
      timeout: 120 * 1000,
    },
    {
      command: 'npm run test:server',
      url: frontendUrl,
      reuseExistingServer: !process.env.CI,
      timeout: 120 * 1000,
    },
  ],
});
