import { defineConfig, devices } from '@playwright/test';

const baseURL = process.env.PLAYWRIGHT_BASE_URL ?? 'http://localhost:3010';

const projectNames = [
  'functional',
  'seo',
  'analytics',
  'visual',
  'visual-mobile',
  'cwv',
] as const;

const projectDevices: Record<(typeof projectNames)[number], (typeof devices)[string]> = {
  functional: devices['Desktop Chrome'],
  seo: devices['Desktop Chrome'],
  analytics: devices['Desktop Chrome'],
  visual: devices['Desktop Chrome'],
  'visual-mobile': devices['Pixel 5'],
  cwv: devices['Desktop Chrome'],
};

export default defineConfig({
  testDir: './e2e',
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
  projects: projectNames.map((name) => ({
    name,
    testMatch: `**/*.${name.replace(/-mobile$/, '')}.spec.ts`,
    use: { ...projectDevices[name] },
  })),
  webServer: {
    command: 'npx next dev --port 3010',
    url: baseURL,
    reuseExistingServer: !process.env.CI,
    timeout: 120_000,
  },
});
