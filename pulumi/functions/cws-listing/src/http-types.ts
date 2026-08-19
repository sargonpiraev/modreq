export type Request = {
  method?: string;
  body?: unknown;
};

export type Response = {
  status: (code: number) => Response;
  json: (body: unknown) => void;
};
