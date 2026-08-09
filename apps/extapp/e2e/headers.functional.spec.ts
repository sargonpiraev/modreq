import { expect, test } from './fixtures';
import {
  addHeaderRule,
  headerValues,
  openPopup,
  readEchoHeaders,
  ruleRow,
} from './helpers';

test.describe('request headers via echo server', () => {
  test('replaces a custom request header', async ({ context, extensionId }) => {
    const popup = await context.newPage();
    await openPopup(popup, extensionId);

    const headerName = 'X-Modreq-E2E';
    const headerValue = `replace-${Date.now()}`;

    await addHeaderRule(popup, {
      name: headerName,
      value: headerValue,
      operation: 'set',
    });

    const page = await context.newPage();

    await expect(async () => {
      const echo = await readEchoHeaders(page);
      expect(headerValues(echo.headers, headerName)).toContain(headerValue);
    }).toPass({ timeout: 15_000 });
  });

  test('appends x-forwarded-for on matching requests', async ({ context, extensionId }) => {
    const popup = await context.newPage();
    await openPopup(popup, extensionId);

    const appendedIp = '203.0.113.50';

    await addHeaderRule(popup, {
      name: 'x-forwarded-for',
      value: appendedIp,
      operation: 'append',
    });

    const page = await context.newPage();

    await expect(async () => {
      const echo = await readEchoHeaders(page);
      const values = headerValues(echo.headers, 'x-forwarded-for');
      expect(values.some((value) => value.includes(appendedIp))).toBe(true);
    }).toPass({ timeout: 15_000 });
  });

  test('disabled header rule is not applied', async ({ context, extensionId }) => {
    const popup = await context.newPage();
    await openPopup(popup, extensionId);

    const headerName = 'X-Modreq-Disabled';
    const headerValue = `disabled-${Date.now()}`;

    await addHeaderRule(popup, {
      name: headerName,
      value: headerValue,
      operation: 'set',
    });

    await ruleRow(popup, headerName).getByRole('switch').click();

    const page = await context.newPage();

    await expect(async () => {
      const echo = await readEchoHeaders(page);
      expect(headerValues(echo.headers, headerName)).not.toContain(headerValue);
    }).toPass({ timeout: 15_000 });
  });

  test('deleted header rule stops applying', async ({ context, extensionId }) => {
    const popup = await context.newPage();
    await openPopup(popup, extensionId);

    const headerName = 'X-Modreq-Deleted';
    const headerValue = `deleted-${Date.now()}`;

    await addHeaderRule(popup, {
      name: headerName,
      value: headerValue,
      operation: 'set',
    });

    const page = await context.newPage();

    await expect(async () => {
      const echo = await readEchoHeaders(page);
      expect(headerValues(echo.headers, headerName)).toContain(headerValue);
    }).toPass({ timeout: 15_000 });

    await popup.bringToFront();
    await ruleRow(popup, headerName).getByRole('button').last().click();
    await expect(popup.getByText(headerName, { exact: true })).toHaveCount(0);

    await expect(async () => {
      const echo = await readEchoHeaders(page);
      expect(headerValues(echo.headers, headerName)).not.toContain(headerValue);
    }).toPass({ timeout: 15_000 });
  });

  test('shows warning when appending a non-allowlisted header', async ({
    context,
    extensionId,
  }) => {
    const popup = await context.newPage();
    await openPopup(popup, extensionId);

    await popup.getByRole('button', { name: 'Add modification' }).click();
    await popup.locator('[data-flow-target="pick-header"]').click();
    await popup.getByRole('tab', { name: 'Append' }).click();
    await popup.locator('#header-name').fill('X-Custom-No-Append');

    await expect(
      popup.getByText('Chrome won’t append X-Custom-No-Append. Switch to Replace.'),
    ).toBeVisible();
  });

  test('append of custom header does not inject it on echo', async ({
    context,
    extensionId,
  }) => {
    const popup = await context.newPage();
    await openPopup(popup, extensionId);

    const headerName = 'X-Modreq-No-Append';
    const headerValue = `no-append-${Date.now()}`;

    await addHeaderRule(popup, {
      name: headerName,
      value: headerValue,
      operation: 'append',
    });

    const page = await context.newPage();

    await expect(async () => {
      const echo = await readEchoHeaders(page);
      expect(headerValues(echo.headers, headerName)).not.toContain(headerValue);
    }).toPass({ timeout: 15_000 });
  });
});
