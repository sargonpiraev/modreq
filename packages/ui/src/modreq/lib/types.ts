export type HeaderOperation = 'set' | 'append';

export type HeaderRule = {
  id: string;
  enabled: boolean;
  name: string;
  value: string;
  operation: HeaderOperation;
  urlFilter?: string;
};

export type CookieRule = {
  id: string;
  enabled: boolean;
  name: string;
  value: string;
};

/** Match requests by urlFilter and send them to redirectUrl. */
export type RedirectRule = {
  id: string;
  enabled: boolean;
  urlFilter: string;
  redirectUrl: string;
};

/** Modify response headers on matching requests (same shape as request headers). */
export type ResponseHeaderRule = {
  id: string;
  enabled: boolean;
  name: string;
  value: string;
  operation: HeaderOperation;
  urlFilter?: string;
};
