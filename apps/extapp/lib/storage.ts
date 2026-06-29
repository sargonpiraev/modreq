import type { CookieRule, HeaderRule } from '@/lib/types';

export const headerRules = storage.defineItem<HeaderRule[]>('local:headerRules', {
  fallback: [],
});

export const cookieRules = storage.defineItem<CookieRule[]>('local:cookieRules', {
  fallback: [],
});
