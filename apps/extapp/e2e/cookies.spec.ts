import { expect, test } from './fixtures';
import {
  applyStoredCookiesToUrl,
  ECHO_COOKIES_URL,
  fillNewCookieRule,
  openPopup,
  readEchoCookies,
} from './helpers';

test.describe('cookie overwrite via echo server', () => {
  test('replaces a cookie on the echo site', async ({ context, extensionId }) => {
    const site = await context.newPage();
    await site.goto(`${ECHO_COOKIES_URL}/set?session=old-value`, {
      waitUntil: 'domcontentloaded',
    });

    await expect(async () => {
      const echo = await readEchoCookies(site);
      expect(echo.cookies.session).toBe('old-value');
    }).toPass({ timeout: 15_000 });

    const popup = await context.newPage();
    await openPopup(popup, extensionId);

    const nextValue = `replaced-${Date.now()}`;
    await fillNewCookieRule(popup, {
      name: 'session',
      value: nextValue,
    });

    // Persist rule via Save & apply (active tab is popup — cookies API apply is done below).
    await popup.getByRole('button', { name: 'Save & apply' }).click();
    await expect(popup.getByText('session', { exact: true })).toBeVisible();

    await applyStoredCookiesToUrl(context, ECHO_COOKIES_URL);

    await expect(async () => {
      const echo = await readEchoCookies(site);
      expect(echo.cookies.session).toBe(nextValue);
    }).toPass({ timeout: 15_000 });
  });
});
