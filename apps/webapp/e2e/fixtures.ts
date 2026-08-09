import { test as base, expect } from '@playwright/test';

/** Block Chrome Web Store and other third-party beacons (narrow integration). */
export const test = base.extend({
  page: async ({ page }, use) => {
    await page.route(
      /(?:chromewebstore\.google\.com|google-analytics\.com|googletagmanager\.com)/i,
      async (route) => {
        await route.fulfill({ status: 204, body: '' });
      },
    );
    await use(page);
  },
});

export { expect };
