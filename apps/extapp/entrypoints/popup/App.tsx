import { useEffect, useState } from 'react';

import { ModreqPopup, type ModreqView } from '@repo/ui/modreq/popup';
import {
  cookieRules,
  headerRules,
  redirectRules,
  responseHeaderRules,
} from '@/lib/storage';
import type {
  CookieRule,
  HeaderRule,
  RedirectRule,
  ResponseHeaderRule,
} from '@/lib/types';

function createId() {
  return crypto.randomUUID();
}

function App() {
  const [headers, setHeaders] = useState<HeaderRule[]>([]);
  const [cookies, setCookies] = useState<CookieRule[]>([]);
  const [redirects, setRedirects] = useState<RedirectRule[]>([]);
  const [responseHeaders, setResponseHeaders] = useState<ResponseHeaderRule[]>([]);
  const [loaded, setLoaded] = useState(false);
  const [view, setView] = useState<ModreqView>({ kind: 'home' });

  useEffect(() => {
    void Promise.all([
      headerRules.getValue(),
      cookieRules.getValue(),
      redirectRules.getValue(),
      responseHeaderRules.getValue(),
    ]).then(([nextHeaders, nextCookies, nextRedirects, nextResponseHeaders]) => {
      setHeaders(
        nextHeaders.map((rule) => ({
          ...rule,
          operation: rule.operation ?? 'set',
        })),
      );
      setCookies(nextCookies);
      setRedirects(nextRedirects);
      setResponseHeaders(
        nextResponseHeaders.map((rule) => ({
          ...rule,
          operation: rule.operation ?? 'set',
        })),
      );
      setLoaded(true);
    });
  }, []);

  useEffect(() => {
    if (!loaded) return;
    void headerRules.setValue(headers);
  }, [headers, loaded]);

  useEffect(() => {
    if (!loaded) return;
    void cookieRules.setValue(cookies);
  }, [cookies, loaded]);

  useEffect(() => {
    if (!loaded) return;
    void redirectRules.setValue(redirects);
  }, [redirects, loaded]);

  useEffect(() => {
    if (!loaded) return;
    void responseHeaderRules.setValue(responseHeaders);
  }, [responseHeaders, loaded]);

  function startNewModification(
    type: 'header' | 'cookie' | 'redirect' | 'response-header',
  ) {
    if (type === 'header') {
      const id = createId();
      setHeaders((current) => [
        ...current,
        { id, enabled: true, name: '', value: '', operation: 'set', urlFilter: '*' },
      ]);
      setView({ kind: 'edit-header', ruleId: id });
      return;
    }

    if (type === 'cookie') {
      const id = createId();
      setCookies((current) => [...current, { id, enabled: true, name: '', value: '' }]);
      setView({ kind: 'edit-cookie', ruleId: id });
      return;
    }

    if (type === 'redirect') {
      const id = createId();
      setRedirects((current) => [
        ...current,
        { id, enabled: true, urlFilter: '', redirectUrl: '' },
      ]);
      setView({ kind: 'edit-redirect', ruleId: id });
      return;
    }

    const id = createId();
    setResponseHeaders((current) => [
      ...current,
      { id, enabled: true, name: '', value: '', operation: 'set', urlFilter: '*' },
    ]);
    setView({ kind: 'edit-response-header', ruleId: id });
  }

  return (
    <ModreqPopup
      loaded={loaded}
      headers={headers}
      cookies={cookies}
      redirects={redirects}
      responseHeaders={responseHeaders}
      view={view}
      onHeadersChange={setHeaders}
      onCookiesChange={setCookies}
      onRedirectsChange={setRedirects}
      onResponseHeadersChange={setResponseHeaders}
      onViewChange={setView}
      onStartNewModification={startNewModification}
      onApplyCookies={async () => {
        await cookieRules.setValue(cookies);
        await browser.runtime.sendMessage({ type: 'applyCookies' });
      }}
    />
  );
}

export default App;
