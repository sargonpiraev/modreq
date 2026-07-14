import { applyCookieRulesToActiveTab } from '@/lib/cookie-rules';
import { applyHeaderRules } from '@/lib/header-rules';
import { cookieRules, headerRules } from '@/lib/storage';

export default defineBackground(() => {
  void headerRules.getValue().then(applyHeaderRules);

  headerRules.watch((rules) => {
    void applyHeaderRules(rules);
  });

  browser.runtime.onMessage.addListener((message) => {
    if (message?.type === 'applyCookies') {
      return cookieRules.getValue().then(applyCookieRulesToActiveTab);
    }
  });
});
