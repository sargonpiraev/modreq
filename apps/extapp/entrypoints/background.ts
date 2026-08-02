import { applyCookieRulesToActiveTab } from '@/lib/cookie-rules';
import { applyDnrRules } from '@/lib/dnr-rules';
import {
  cookieRules,
  headerRules,
  redirectRules,
  responseHeaderRules,
} from '@/lib/storage';

async function syncDnrRules() {
  const [headers, responseHeaders, redirects] = await Promise.all([
    headerRules.getValue(),
    responseHeaderRules.getValue(),
    redirectRules.getValue(),
  ]);

  await applyDnrRules({ headers, responseHeaders, redirects });
}

export default defineBackground(() => {
  void syncDnrRules();

  headerRules.watch(() => {
    void syncDnrRules();
  });
  responseHeaderRules.watch(() => {
    void syncDnrRules();
  });
  redirectRules.watch(() => {
    void syncDnrRules();
  });

  browser.runtime.onMessage.addListener((message) => {
    if (message?.type === 'applyCookies') {
      return cookieRules.getValue().then(applyCookieRulesToActiveTab);
    }
  });
});
