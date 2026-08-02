import { expect, test } from './fixtures';
import {
  addRedirectRule,
  ECHO_GET_URL,
  ECHO_REDIRECT_SOURCE_URL,
  openPopup,
  ruleRow,
} from './helpers';

test.describe('redirects via echo server', () => {
  test('redirects matching requests to another URL', async ({ context, extensionId }) => {
    const popup = await context.newPage();
    await openPopup(popup, extensionId);

    await addRedirectRule(popup, {
      urlFilter: ECHO_REDIRECT_SOURCE_URL,
      redirectUrl: ECHO_GET_URL,
    });

    const page = await context.newPage();

    await expect(async () => {
      await page.goto(ECHO_REDIRECT_SOURCE_URL, { waitUntil: 'domcontentloaded' });
      expect(page.url()).toBe(ECHO_GET_URL);
      const body = await page.locator('body').innerText();
      expect(body).toContain('"url"');
      expect(body).toContain(ECHO_GET_URL);
    }).toPass({ timeout: 15_000 });
  });

  test('disabled redirect rule does not redirect', async ({ context, extensionId }) => {
    const popup = await context.newPage();
    await openPopup(popup, extensionId);

    await addRedirectRule(popup, {
      urlFilter: ECHO_REDIRECT_SOURCE_URL,
      redirectUrl: ECHO_GET_URL,
    });

    await ruleRow(popup, ECHO_REDIRECT_SOURCE_URL).getByRole('switch').click();

    const page = await context.newPage();

    await expect(async () => {
      await page.goto(ECHO_REDIRECT_SOURCE_URL, { waitUntil: 'domcontentloaded' });
      expect(page.url()).toBe(ECHO_REDIRECT_SOURCE_URL);
      const body = await page.locator('body').innerText();
      expect(body).toContain('modreq-redirect-source');
    }).toPass({ timeout: 15_000 });
  });

  test('deleted redirect rule stops redirecting', async ({ context, extensionId }) => {
    const popup = await context.newPage();
    await openPopup(popup, extensionId);

    await addRedirectRule(popup, {
      urlFilter: ECHO_REDIRECT_SOURCE_URL,
      redirectUrl: ECHO_GET_URL,
    });

    const page = await context.newPage();

    await expect(async () => {
      await page.goto(ECHO_REDIRECT_SOURCE_URL, { waitUntil: 'domcontentloaded' });
      expect(page.url()).toBe(ECHO_GET_URL);
    }).toPass({ timeout: 15_000 });

    await popup.bringToFront();
    await ruleRow(popup, ECHO_REDIRECT_SOURCE_URL).getByRole('button').last().click();
    await expect(popup.getByText(ECHO_REDIRECT_SOURCE_URL, { exact: true })).toHaveCount(0);

    await expect(async () => {
      await page.goto(ECHO_REDIRECT_SOURCE_URL, { waitUntil: 'domcontentloaded' });
      expect(page.url()).toBe(ECHO_REDIRECT_SOURCE_URL);
      const body = await page.locator('body').innerText();
      expect(body).toContain('modreq-redirect-source');
    }).toPass({ timeout: 15_000 });
  });
});
