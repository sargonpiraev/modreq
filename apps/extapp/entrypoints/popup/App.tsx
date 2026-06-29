import { useEffect, useState } from 'react';

import { ModreqPopup, type ModreqView } from '@repo/ui/modreq/popup';
import { cookieRules, headerRules } from '@/lib/storage';
import type { CookieRule, HeaderRule } from '@/lib/types';

function createId() {
  return crypto.randomUUID();
}

function App() {
  const [headers, setHeaders] = useState<HeaderRule[]>([]);
  const [cookies, setCookies] = useState<CookieRule[]>([]);
  const [loaded, setLoaded] = useState(false);
  const [view, setView] = useState<ModreqView>({ kind: 'home' });

  useEffect(() => {
    void Promise.all([headerRules.getValue(), cookieRules.getValue()]).then(
      ([nextHeaders, nextCookies]) => {
        setHeaders(nextHeaders);
        setCookies(nextCookies);
        setLoaded(true);
      },
    );
  }, []);

  useEffect(() => {
    if (!loaded) {
      return;
    }

    void headerRules.setValue(headers);
  }, [headers, loaded]);

  useEffect(() => {
    if (!loaded) {
      return;
    }

    void cookieRules.setValue(cookies);
  }, [cookies, loaded]);

  function startNewModification(type: 'header' | 'cookie') {
    if (type === 'header') {
      const id = createId();
      setHeaders((current) => [
        ...current,
        { id, enabled: true, name: '', value: '', urlFilter: '*' },
      ]);
      setView({ kind: 'edit-header', ruleId: id });
      return;
    }

    const id = createId();
    setCookies((current) => [...current, { id, enabled: true, name: '', value: '' }]);
    setView({ kind: 'edit-cookie', ruleId: id });
  }

  return (
    <ModreqPopup
      loaded={loaded}
      headers={headers}
      cookies={cookies}
      view={view}
      onHeadersChange={setHeaders}
      onCookiesChange={setCookies}
      onViewChange={setView}
      onStartNewModification={startNewModification}
      onApplyCookies={() => browser.runtime.sendMessage({ type: 'applyCookies' })}
    />
  );
}

export default App;
