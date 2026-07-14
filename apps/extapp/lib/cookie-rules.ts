import type { CookieRule } from '@/lib/types';

function isHttpUrl(url: string) {
  return url.startsWith('http://') || url.startsWith('https://');
}

export async function applyCookieRulesForUrl(rules: CookieRule[], url: string) {
  if (!isHttpUrl(url)) {
    return;
  }

  const enabledRules = rules.filter(
    (rule) => rule.enabled && rule.name.trim() && rule.value.trim(),
  );

  await Promise.all(
    enabledRules.map(async (rule) => {
      const name = rule.name.trim();
      const existing = await browser.cookies.get({ url, name });

      await browser.cookies.set({
        url,
        name,
        value: rule.value,
        path: existing?.path ?? '/',
        secure: existing?.secure,
        httpOnly: existing?.httpOnly,
        sameSite: existing?.sameSite,
        expirationDate: existing?.expirationDate,
        domain: existing?.domain,
      });
    }),
  );
}

export async function applyCookieRulesToActiveTab(rules: CookieRule[]) {
  const [tab] = await browser.tabs.query({ active: true, currentWindow: true });

  if (tab?.url) {
    await applyCookieRulesForUrl(rules, tab.url);
  }
}
