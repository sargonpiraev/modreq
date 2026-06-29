import type { HeaderRule } from '@/lib/types';
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

export async function applyHeaderRules(rules: HeaderRule[]) {
  const existing = await browser.declarativeNetRequest.getDynamicRules();
  const removeRuleIds = existing.map((rule) => rule.id);

  const addRules = rules
    .filter((rule) => rule.enabled && rule.name.trim() && rule.value.trim())
    .map((rule) => ({
      id: ruleIdFromString(rule.id),
      priority: 1,
      action: {
        type: 'modifyHeaders' as const,
        requestHeaders: [
          {
            header: rule.name.trim(),
            operation: 'append' as const,
            value: rule.value,
          },
        ],
      },
      condition: {
        urlFilter: rule.urlFilter?.trim() || '*',
        resourceTypes: [...resourceTypes],
      },
    }));

  await browser.declarativeNetRequest.updateDynamicRules({
    removeRuleIds,
    addRules,
  });
}
