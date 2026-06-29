import type { ModreqView } from '@repo/ui/modreq/popup';
import type { CookieRule, HeaderRule } from '@repo/ui/modreq/types';

import { typeText } from './type-text';

const HEADER_ID = 'flow-header';
const COOKIE_ID = 'flow-cookie';

const headerTarget = {
  name: 'X-Debug-Token',
  value: 'modreq-demo',
} as const;

const cookieTarget = {
  name: 'session',
  value: 'replaced-value',
} as const;

export type FlowState = {
  view: ModreqView;
  headers: HeaderRule[];
  cookies: CookieRule[];
};

export function getFlowState(frame: number): FlowState {
  if (frame < 45) {
    return { view: { kind: 'home' }, headers: [], cookies: [] };
  }

  if (frame < 68) {
    return { view: { kind: 'pick-type' }, headers: [], cookies: [] };
  }

  if (frame < 166) {
    return {
      view: { kind: 'edit-header', ruleId: HEADER_ID },
      headers: [
        {
          id: HEADER_ID,
          enabled: true,
          name: typeText(headerTarget.name, 72, 98, frame),
          value: typeText(headerTarget.value, 102, 135, frame),
          urlFilter: '*',
        },
      ],
      cookies: [],
    };
  }

  const savedHeader: HeaderRule = {
    id: HEADER_ID,
    enabled: true,
    ...headerTarget,
  };

  if (frame < 244) {
    return { view: { kind: 'home' }, headers: [savedHeader], cookies: [] };
  }

  if (frame < 268) {
    return { view: { kind: 'pick-type' }, headers: [savedHeader], cookies: [] };
  }

  if (frame < 354) {
    return {
      view: { kind: 'edit-cookie', ruleId: COOKIE_ID },
      headers: [savedHeader],
      cookies: [
        {
          id: COOKIE_ID,
          enabled: true,
          name: typeText(cookieTarget.name, 274, 298, frame),
          value: typeText(cookieTarget.value, 302, 328, frame),
        },
      ],
    };
  }

  return {
    view: { kind: 'home' },
    headers: [savedHeader],
    cookies: [
      {
        id: COOKIE_ID,
        enabled: true,
        ...cookieTarget,
      },
    ],
  };
}

export const FLOW_DURATION_FRAMES = 420;
