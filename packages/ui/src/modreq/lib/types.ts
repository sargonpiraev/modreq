export type HeaderRule = {
  id: string;
  enabled: boolean;
  name: string;
  value: string;
  urlFilter?: string;
};

export type CookieRule = {
  id: string;
  enabled: boolean;
  name: string;
  value: string;
};
