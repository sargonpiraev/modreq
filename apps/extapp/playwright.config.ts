import { defineConfig } from '@playwright/test'

/** Real popup size from layout / product popup viewport. */
const EXTENSION_POPUP_VIEWPORT = { width: 380, height: 560 } as const

export default defineConfig({
  testDir: 'e2e',
  snapshotPathTemplate: '{testDir}/{testFilePath}-snapshots/{arg}{-project}-linux{ext}',
  fullyParallel: false,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: 1,
  reporter: process.env.CI ? 'github' : 'list',
  timeout: 60_000,
  expect: {
    toHaveScreenshot: {
      maxDiffPixelRatio: 0.02,
    },
  },
  use: {
    trace: 'on-first-retry',
  },
  projects: [
    {
      name: 'desktop',
      use: {
        viewport: EXTENSION_POPUP_VIEWPORT,
      },
    },
  ],
})
