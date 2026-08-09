import { expect, test } from './fixtures';
import {
  addResponseHeaderRule,
  ECHO_GET_URL,
  openPopup,
  ruleRow,
} from './helpers';

function responseHeaderValue(
  headers: Record<string, string>,
  name: string,
): string | undefined {
  const match = Object.entries(headers).find(
    ([key]) => key.toLowerCase() === name.toLowerCase(),
  );
  return match?.[1];
}

test.describe('response headers via echo server', () => {
  test('sets a custom response header on matching responses', async ({
    context,
    extensionId,
  }) => {
    const popup = await context.newPage();
    await openPopup(popup, extensionId);

    const headerName = 'X-Modreq-Response';
    const headerValue = `response-${Date.now()}`;

    await addResponseHeaderRule(popup, {
      name: headerName,
      value: headerValue,
      urlFilter: '*://httpbingo.org/*',
      operation: 'set',
    });

    const page = await context.newPage();

    await expect(async () => {
      const response = await page.goto(ECHO_GET_URL, { waitUntil: 'domcontentloaded' });
      expect(response).not.toBeNull();
      expect(responseHeaderValue(response!.headers(), headerName)).toBe(headerValue);
    }).toPass({ timeout: 15_000 });
  });

  test('disabled response header rule is not applied', async ({ context, extensionId }) => {
    const popup = await context.newPage();
    await openPopup(popup, extensionId);

    const headerName = 'X-Modreq-Response-Off';
    const headerValue = `off-${Date.now()}`;

    await addResponseHeaderRule(popup, {
      name: headerName,
      value: headerValue,
      urlFilter: '*://httpbingo.org/*',
      operation: 'set',
    });

    await ruleRow(popup, headerName).getByRole('switch').click();

    const page = await context.newPage();

    await expect(async () => {
      const response = await page.goto(ECHO_GET_URL, { waitUntil: 'domcontentloaded' });
      expect(response).not.toBeNull();
      expect(responseHeaderValue(response!.headers(), headerName)).toBeUndefined();
    }).toPass({ timeout: 15_000 });
  });

  test('deleted response header rule stops applying', async ({ context, extensionId }) => {
    const popup = await context.newPage();
    await openPopup(popup, extensionId);

    const headerName = 'X-Modreq-Response-Deleted';
    const headerValue = `deleted-${Date.now()}`;

    await addResponseHeaderRule(popup, {
      name: headerName,
      value: headerValue,
      urlFilter: '*://httpbingo.org/*',
      operation: 'set',
    });

    const page = await context.newPage();

    await expect(async () => {
      const response = await page.goto(ECHO_GET_URL, { waitUntil: 'domcontentloaded' });
      expect(response).not.toBeNull();
      expect(responseHeaderValue(response!.headers(), headerName)).toBe(headerValue);
    }).toPass({ timeout: 15_000 });

    await popup.bringToFront();
    await ruleRow(popup, headerName).getByRole('button').last().click();
    await expect(popup.getByText(headerName, { exact: true })).toHaveCount(0);

    await expect(async () => {
      const response = await page.goto(ECHO_GET_URL, { waitUntil: 'domcontentloaded' });
      expect(response).not.toBeNull();
      expect(responseHeaderValue(response!.headers(), headerName)).toBeUndefined();
    }).toPass({ timeout: 15_000 });
  });
});
