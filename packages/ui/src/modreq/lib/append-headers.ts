/**
 * Chrome DNR only allows `append` for this request-header allowlist.
 * Names are case-sensitive per Chrome docs.
 * @see https://developer.chrome.com/docs/extensions/reference/api/declarativeNetRequest
 */
export const APPENDABLE_REQUEST_HEADERS = [
  'accept',
  'accept-encoding',
  'accept-language',
  'access-control-request-headers',
  'cache-control',
  'connection',
  'content-language',
  'cookie',
  'forwarded',
  'if-match',
  'if-none-match',
  'keep-alive',
  'range',
  'te',
  'trailer',
  'transfer-encoding',
  'upgrade',
  'user-agent',
  'via',
  'want-digest',
  'x-forwarded-for',
] as const;

const appendableHeaderSet = new Set<string>(APPENDABLE_REQUEST_HEADERS);

export function isAppendableRequestHeader(name: string) {
  return appendableHeaderSet.has(name.trim());
}
