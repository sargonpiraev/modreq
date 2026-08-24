import { defineConfig, devices } from '@playwright/test';

const baseURL = process.env.PLAYWRIGHT_BASE_URL ?? 'http://localhost:3010';

export default defineConfig({
  testDir: './e2e',
  snapshotPathTemplate:
    '{testDir}/{testFilePath}-snapshots/{arg}{-project}-linux{ext}',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: [['list'], ['html', { open: 'never' }]],
  timeout: 60_000,
  expect: {
    toHaveScreenshot: {
      maxDiffPixelRatio: 0.02,
    },
  },
  use: {
    baseURL,
    trace: 'on-first-retry',
  },
  projects: [
    {
      name: 'functional',
      testMatch: '**/*.functional.spec.ts',
      use: { ...devices['Desktop Chrome'] },
    },
    {
      name: 'seo',
      testMatch: '**/*.seo.spec.ts',
      use: { ...devices['Desktop Chrome'] },
    },
    {
      name: 'analytics',
      testMatch: '**/*.analytics.spec.ts',
      use: { ...devices['Desktop Chrome'] },
    },
    {
      name: 'visual',
      testMatch: '**/*.visual.spec.ts',
      use: { ...devices['Desktop Chrome'] },
    },
    {
      name: 'visual-mobile',
      testMatch: '**/*.visual.spec.ts',
      use: { ...devices['Pixel 5'] },
    },
    {
      name: 'cwv',
      testMatch: '**/*.cwv.spec.ts',
      use: { ...devices['Desktop Chrome'] },
    },
  ],
  webServer: {
    command: 'npx next dev --port 3010',
    url: baseURL,
    reuseExistingServer: !process.env.CI,
    timeout: 120_000,
  },
});
