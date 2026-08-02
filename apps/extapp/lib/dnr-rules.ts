import type { HeaderRule, RedirectRule, ResponseHeaderRule } from '@/lib/types';
import { ruleIdFromString } from '@/lib/rule-id';

const resourceTypes = [
  'main_frame',
  'sub_frame',
  'xmlhttprequest',
  'script',
  'stylesheet',
  'image',
  'other',
] as const;

function toRequestHeaderRules(rules: HeaderRule[]) {
  return rules
    .filter((rule) => rule.enabled && rule.name.trim() && rule.value.trim())
    .map((rule) => ({
      id: ruleIdFromString(`req:${rule.id}`),
      priority: 1,
      action: {
        type: 'modifyHeaders' as const,
        requestHeaders: [
          {
            header: rule.name.trim(),
            operation: rule.operation ?? 'set',
            value: rule.value,
          },
        ],
      },
      condition: {
        urlFilter: rule.urlFilter?.trim() || '*',
        resourceTypes: [...resourceTypes],
      },
    }));
}

function toResponseHeaderRules(rules: ResponseHeaderRule[]) {
  return rules
    .filter((rule) => rule.enabled && rule.name.trim() && rule.value.trim())
    .map((rule) => ({
      id: ruleIdFromString(`res:${rule.id}`),
      priority: 1,
      action: {
        type: 'modifyHeaders' as const,
        responseHeaders: [
          {
            header: rule.name.trim(),
            operation: rule.operation ?? 'set',
            value: rule.value,
          },
        ],
      },
      condition: {
        urlFilter: rule.urlFilter?.trim() || '*',
        resourceTypes: [...resourceTypes],
      },
    }));
}

function toRedirectRules(rules: RedirectRule[]) {
  return rules
    .filter((rule) => rule.enabled && rule.urlFilter.trim() && rule.redirectUrl.trim())
    .map((rule) => ({
      id: ruleIdFromString(`redir:${rule.id}`),
      priority: 1,
      action: {
        type: 'redirect' as const,
        redirect: {
          url: rule.redirectUrl.trim(),
        },
      },
      condition: {
        urlFilter: rule.urlFilter.trim(),
        resourceTypes: [...resourceTypes],
      },
    }));
}

/** Replace all dynamic DNR rules from request headers + response headers + redirects. */
export async function applyDnrRules({
  headers,
  responseHeaders,
  redirects,
}: {
  headers: HeaderRule[];
  responseHeaders: ResponseHeaderRule[];
  redirects: RedirectRule[];
}) {
  const existing = await browser.declarativeNetRequest.getDynamicRules();
  const removeRuleIds = existing.map((rule) => rule.id);
  const addRules = [
    ...toRequestHeaderRules(headers),
    ...toResponseHeaderRules(responseHeaders),
    ...toRedirectRules(redirects),
  ];

  try {
    await browser.declarativeNetRequest.updateDynamicRules({
      removeRuleIds,
      addRules,
    });
  } catch (error) {
    console.error('[modreq] failed to apply DNR rules', error);
    throw error;
  }
}

/** @deprecated Use applyDnrRules — kept as thin wrapper for older call sites. */
export async function applyHeaderRules(rules: HeaderRule[]) {
  await applyDnrRules({ headers: rules, responseHeaders: [], redirects: [] });
}
