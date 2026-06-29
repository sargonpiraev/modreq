import type { CookieRule, HeaderRule } from './types';

export const demoHeader: HeaderRule = {
  id: 'demo-header',
  enabled: true,
  name: 'X-Debug-Token',
  value: 'modreq-demo',
};

export const demoCookie: CookieRule = {
  id: 'demo-cookie',
  enabled: true,
  name: 'session',
  value: 'replaced-value',
};
