import { defineConfig } from '@playwright/test';

/** Real popup size from layout / product popup viewport. */
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
  projects: [
    {
      name: 'functional',
      testMatch: '**/*.functional.spec.ts',
    },
    {
      name: 'visual',
      testMatch: '**/*.visual.spec.ts',
      use: {
        viewport: EXTENSION_POPUP_VIEWPORT,
      },
    },
  ],
});
