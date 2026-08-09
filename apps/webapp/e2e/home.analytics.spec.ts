import { expect, test } from './fixtures';
import { mockAnalytics } from './lib/analytics';

test('analytics collect endpoint can be mocked', async ({ page }) => {
  const analytics = await mockAnalytics(page);

  await page.goto('/');
  await expect(page.getByRole('heading', { level: 1, name: 'modreq' })).toBeVisible();

  // Harness demo when GA is not wired: synthetic beacon hits the mock.
  await page.evaluate(() => {
    void fetch('https://www.google-analytics.com/g/collect?v=2&tid=G-TEST', {
      mode: 'no-cors',
    });
  });

  await expect.poll(() => analytics.hits.length).toBeGreaterThan(0);
});
