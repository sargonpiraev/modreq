import { expect, test } from './fixtures';

test('landing shows brand and primary CTA', async ({ page }) => {
  await page.goto('/');

  await expect(page.getByRole('heading', { level: 1, name: 'modreq' })).toBeVisible();
  await expect(
    page.getByRole('link', { name: 'Add to Chrome' }).first(),
  ).toBeVisible();
  await expect(page.getByText('Modify HTTP headers and cookies in Chrome.')).toBeVisible();
});
