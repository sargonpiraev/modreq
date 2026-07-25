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
