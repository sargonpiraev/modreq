import { defineConfig } from '@playwright/test';

import harness from './playwright.harness.json' with { type: 'json' };

/** Real popup size from entrypoints/popup/style.css (html/body/#root). */
const EXTENSION_POPUP_VIEWPORT = { width: 380, height: 560 } as const;

export default defineConfig({
  testDir: 'e2e',
  fullyParallel: false,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: 1,
  reporter: process.env.CI ? 'github' : 'list',
  timeout: 60_000,
  use: {
    trace: 'on-first-retry',
  },
  projects: harness.projects.map((name) => ({
    name,
    testMatch: `**/*.${name}.spec.ts`,
    ...(name === 'visual'
      ? {
          use: {
            viewport: EXTENSION_POPUP_VIEWPORT,
          },
        }
      : {}),
  })),
});
