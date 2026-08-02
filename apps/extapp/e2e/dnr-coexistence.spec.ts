import { expect, test } from './fixtures';
import {
  addHeaderRule,
  addRedirectRule,
  addResponseHeaderRule,
  ECHO_GET_URL,
  ECHO_REDIRECT_SOURCE_URL,
  headerValues,
  openPopup,
  readEchoHeaders,
} from './helpers';

/**
 * Shared DNR sync replaces the whole dynamic ruleset.
 * Ensure request headers + response headers + redirects all stay active together.
 */
test.describe('DNR rule coexistence via echo server', () => {
  test('keeps request header, response header, and redirect active together', async ({
    context,
    extensionId,
  }) => {
    const popup = await context.newPage();
    await openPopup(popup, extensionId);

    const requestHeaderName = 'X-Modreq-Coexist-Req';
    const requestHeaderValue = `req-${Date.now()}`;
    const responseHeaderName = 'X-Modreq-Coexist-Res';
    const responseHeaderValue = `res-${Date.now()}`;

    await addHeaderRule(popup, {
      name: requestHeaderName,
      value: requestHeaderValue,
      operation: 'set',
    });

    await addResponseHeaderRule(popup, {
      name: responseHeaderName,
      value: responseHeaderValue,
      urlFilter: '*://httpbingo.org/*',
      operation: 'set',
    });

    await addRedirectRule(popup, {
      urlFilter: ECHO_REDIRECT_SOURCE_URL,
      redirectUrl: ECHO_GET_URL,
    });

    const page = await context.newPage();

    await expect(async () => {
      const echo = await readEchoHeaders(page);
      expect(headerValues(echo.headers, requestHeaderName)).toContain(requestHeaderValue);
    }).toPass({ timeout: 15_000 });

    await expect(async () => {
      const response = await page.goto(ECHO_GET_URL, { waitUntil: 'domcontentloaded' });
      expect(response).not.toBeNull();
      const headers = response!.headers();
      const match = Object.entries(headers).find(
        ([key]) => key.toLowerCase() === responseHeaderName.toLowerCase(),
      );
      expect(match?.[1]).toBe(responseHeaderValue);
    }).toPass({ timeout: 15_000 });

    await expect(async () => {
      await page.goto(ECHO_REDIRECT_SOURCE_URL, { waitUntil: 'domcontentloaded' });
      expect(page.url()).toBe(ECHO_GET_URL);
    }).toPass({ timeout: 15_000 });
  });
});
