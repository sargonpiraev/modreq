import {
  applyCookieRules,
  applyCookieRulesToActiveTab,
  applyCookieRulesToTab,
} from '@/lib/cookie-rules';
import { applyHeaderRules } from '@/lib/header-rules';
import { cookieRules, headerRules } from '@/lib/storage';

export default defineBackground(() => {
  void headerRules.getValue().then(applyHeaderRules);
  void cookieRules.getValue().then(applyCookieRules);

  headerRules.watch((rules) => {
    void applyHeaderRules(rules);
  });

  cookieRules.watch((rules) => {
    void applyCookieRules(rules);
  });

  browser.tabs.onActivated.addListener(({ tabId }) => {
    void cookieRules.getValue().then((rules) => applyCookieRulesToTab(tabId, rules));
  });

  browser.tabs.onUpdated.addListener((tabId, changeInfo) => {
    if (changeInfo.status === 'complete') {
      void cookieRules.getValue().then((rules) => applyCookieRulesToTab(tabId, rules));
    }
  });

  browser.runtime.onMessage.addListener((message) => {
    if (message?.type === 'applyCookies') {
      return cookieRules.getValue().then(applyCookieRulesToActiveTab);
    }
  });
});
