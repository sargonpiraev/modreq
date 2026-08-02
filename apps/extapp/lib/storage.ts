import type {
  CookieRule,
  HeaderRule,
  RedirectRule,
  ResponseHeaderRule,
} from '@/lib/types';

export const headerRules = storage.defineItem<HeaderRule[]>('local:headerRules', {
  fallback: [],
});

export const cookieRules = storage.defineItem<CookieRule[]>('local:cookieRules', {
  fallback: [],
});

export const redirectRules = storage.defineItem<RedirectRule[]>('local:redirectRules', {
  fallback: [],
});

export const responseHeaderRules = storage.defineItem<ResponseHeaderRule[]>(
  'local:responseHeaderRules',
  {
    fallback: [],
  },
);
