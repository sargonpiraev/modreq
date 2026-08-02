import type {
  CookieRule,
  HeaderRule,
  RedirectRule,
  ResponseHeaderRule,
} from './types';

export const demoHeader: HeaderRule = {
  id: 'demo-header',
  enabled: true,
  name: 'X-Debug-Token',
  value: 'modreq-demo',
  operation: 'set',
};

export const demoCookie: CookieRule = {
  id: 'demo-cookie',
  enabled: true,
  name: 'session',
  value: 'replaced-value',
};

export const demoRedirect: RedirectRule = {
  id: 'demo-redirect',
  enabled: true,
  urlFilter: '*://api.prod.example/*',
  redirectUrl: 'https://api.staging.example/',
};

export const demoResponseHeader: ResponseHeaderRule = {
  id: 'demo-response-header',
  enabled: true,
  name: 'Access-Control-Allow-Origin',
  value: '*',
  operation: 'set',
  urlFilter: '*',
};
