import type { BrowserContext, Page } from '@playwright/test';

import { expect } from './fixtures';

export const ECHO_HEADERS_URL = 'https://httpbingo.org/headers';
export const ECHO_COOKIES_URL = 'https://httpbingo.org/cookies';

export type EchoHeadersResponse = {
  headers: Record<string, string | string[]>;
};

export type EchoCookiesResponse = {
  cookies: Record<string, string>;
};

export async function openPopup(page: Page, extensionId: string) {
  await page.goto(`chrome-extension://${extensionId}/popup.html`);
  await expect(page.getByRole('button', { name: 'Add modification' })).toBeVisible();
}

export async function addHeaderRule(
  popup: Page,
  {
    name,
    value,
    operation = 'set',
  }: {
    name: string;
    value: string;
    operation?: 'set' | 'append';
  },
) {
  await popup.getByRole('button', { name: 'Add modification' }).click();
  await popup.locator('[data-flow-target="pick-header"]').click();

  if (operation === 'append') {
    await popup.getByRole('tab', { name: 'Append' }).click();
  } else {
    await popup.getByRole('tab', { name: 'Replace' }).click();
  }

  await popup.locator('#header-name').fill(name);
  await popup.locator('#header-value').fill(value);
  await popup.locator('[data-flow-target="editor-done"]').click();

  await expect(popup.getByText(name, { exact: true })).toBeVisible();
}

export async function fillNewCookieRule(
  popup: Page,
  {
    name,
    value,
  }: {
    name: string;
    value: string;
  },
) {
  await popup.getByRole('button', { name: 'Add modification' }).click();
  await popup.locator('[data-flow-target="pick-cookie"]').click();
  await popup.locator('#cookie-name').fill(name);
  await popup.locator('#cookie-value').fill(value);
}

export function headerValues(headers: EchoHeadersResponse['headers'], name: string) {
  const match = Object.entries(headers).find(
    ([key]) => key.toLowerCase() === name.toLowerCase(),
  );

  if (!match) {
    return [];
  }

  const value = match[1];
  return Array.isArray(value) ? value : [value];
}

export async function readEchoHeaders(page: Page): Promise<EchoHeadersResponse> {
  await page.goto(ECHO_HEADERS_URL, { waitUntil: 'domcontentloaded' });
  const text = await page.locator('body').innerText();
  return JSON.parse(text) as EchoHeadersResponse;
}

export async function readEchoCookies(page: Page): Promise<EchoCookiesResponse> {
  await page.goto(ECHO_COOKIES_URL, { waitUntil: 'domcontentloaded' });
  const text = await page.locator('body').innerText();
  return JSON.parse(text) as EchoCookiesResponse;
}

/** Applies cookie rules from storage to a concrete URL (popup-as-tab can't keep site active). */
export async function applyStoredCookiesToUrl(context: BrowserContext, url: string) {
  const [worker] = context.serviceWorkers();
  if (!worker) {
    throw new Error('Extension service worker is not available');
  }

  await worker.evaluate(async (targetUrl) => {
    const stored = await browser.storage.local.get(null);
    const rules =
      (stored.cookieRules as Array<{
        enabled: boolean;
        name: string;
        value: string;
      }> | undefined) ??
      (stored['local:cookieRules'] as Array<{
        enabled: boolean;
        name: string;
        value: string;
      }> | undefined) ??
      [];

    for (const rule of rules) {
      if (!rule.enabled || !rule.name.trim() || !rule.value.trim()) {
        continue;
      }

      const name = rule.name.trim();
      const existing = await browser.cookies.get({ url: targetUrl, name });
      await browser.cookies.set({
        url: targetUrl,
        name,
        value: rule.value,
        path: existing?.path ?? '/',
        secure: existing?.secure,
        httpOnly: existing?.httpOnly,
        sameSite: existing?.sameSite,
        expirationDate: existing?.expirationDate,
        domain: existing?.domain,
      });
    }
  }, url);
}

export function ruleRow(popup: Page, name: string) {
  return popup
    .locator('div.flex.items-center')
    .filter({ has: popup.getByRole('switch') })
    .filter({ hasText: name })
    .first();
}
