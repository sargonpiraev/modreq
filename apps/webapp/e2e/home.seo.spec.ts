import { expect, test } from './seokit';

test('landing metadata', async ({ page }) => {
  await page.goto('/');

  await expect(page).toHaveMetadata({
    lang: 'en',
    title: 'modreq — Modify HTTP Headers',
    description: /Free Chrome extension to replace or append HTTP request headers/,
  });
});
