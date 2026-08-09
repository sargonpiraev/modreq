import type { Page, Route } from '@playwright/test';

const ANALYTICS_URL =
  /(?:google-analytics\.com|googletagmanager\.com|\/g\/collect|\/j\/collect)/i;

export type AnalyticsMock = {
  hits: string[];
};

/** Intercept analytics beacons so specs stay narrow (no real network). */
export async function mockAnalytics(page: Page): Promise<AnalyticsMock> {
  const hits: string[] = [];

  await page.route(ANALYTICS_URL, async (route: Route) => {
    hits.push(route.request().url());
    await route.fulfill({ status: 204, body: '' });
  });

  return { hits };
}
