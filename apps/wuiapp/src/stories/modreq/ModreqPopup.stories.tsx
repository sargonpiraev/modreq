import type { Meta, StoryObj } from '@storybook/react-vite';
import { useState } from 'react';

import { ModreqPopup, type ModreqView } from '@repo/ui/modreq/popup';
import {
  demoCookie,
  demoHeader,
  demoRedirect,
  demoResponseHeader,
} from '@repo/ui/modreq/demo-data';
import type {
  CookieRule,
  HeaderRule,
  RedirectRule,
  ResponseHeaderRule,
} from '@repo/ui/modreq/types';

function ModreqStory({
  initialHeaders = [],
  initialCookies = [],
  initialRedirects = [],
  initialResponseHeaders = [],
  initialView,
}: {
  initialHeaders?: HeaderRule[];
  initialCookies?: CookieRule[];
  initialRedirects?: RedirectRule[];
  initialResponseHeaders?: ResponseHeaderRule[];
  initialView: ModreqView;
}) {
  const [headers, setHeaders] = useState(initialHeaders);
  const [cookies, setCookies] = useState(initialCookies);
  const [redirects, setRedirects] = useState(initialRedirects);
  const [responseHeaders, setResponseHeaders] = useState(initialResponseHeaders);
  const [view, setView] = useState(initialView);

  return (
    <ModreqPopup
      loaded
      headers={headers}
      cookies={cookies}
      redirects={redirects}
      responseHeaders={responseHeaders}
      view={view}
      onHeadersChange={setHeaders}
      onCookiesChange={setCookies}
      onRedirectsChange={setRedirects}
      onResponseHeadersChange={setResponseHeaders}
      onViewChange={setView}
      onStartNewModification={(type) => {
        if (type === 'header') {
          const id = crypto.randomUUID();
          setHeaders((current) => [
            ...current,
            {
              id,
              enabled: true,
              name: '',
              value: '',
              operation: 'set',
              urlFilter: '*',
            },
          ]);
          setView({ kind: 'edit-header', ruleId: id });
          return;
        }

        if (type === 'cookie') {
          const id = crypto.randomUUID();
          setCookies((current) => [
            ...current,
            { id, enabled: true, name: '', value: '' },
          ]);
          setView({ kind: 'edit-cookie', ruleId: id });
          return;
        }

        if (type === 'redirect') {
          const id = crypto.randomUUID();
          setRedirects((current) => [
            ...current,
            { id, enabled: true, urlFilter: '', redirectUrl: '' },
          ]);
          setView({ kind: 'edit-redirect', ruleId: id });
          return;
        }

        const id = crypto.randomUUID();
        setResponseHeaders((current) => [
          ...current,
          {
            id,
            enabled: true,
            name: '',
            value: '',
            operation: 'set',
            urlFilter: '*',
          },
        ]);
        setView({ kind: 'edit-response-header', ruleId: id });
      }}
    />
  );
}

const meta = {
  title: 'Store/Screenshots',
  component: ModreqStory,
  tags: ['store-screenshot'],
} satisfies Meta<typeof ModreqStory>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Home: Story = {
  args: { initialView: { kind: 'home' } },
};

export const PickType: Story = {
  args: { initialView: { kind: 'pick-type' } },
};

export const HeaderEditor: Story = {
  args: {
    initialHeaders: [demoHeader],
    initialView: { kind: 'edit-header', ruleId: demoHeader.id },
  },
};

export const HeaderApplied: Story = {
  args: { initialHeaders: [demoHeader], initialView: { kind: 'home' } },
};

export const CookieApplied: Story = {
  args: { initialCookies: [demoCookie], initialView: { kind: 'home' } },
};

export const BothRules: Story = {
  args: {
    initialHeaders: [demoHeader],
    initialCookies: [demoCookie],
    initialView: { kind: 'home' },
  },
};

export const RedirectEditor: Story = {
  args: {
    initialRedirects: [demoRedirect],
    initialView: { kind: 'edit-redirect', ruleId: demoRedirect.id },
  },
};

export const ResponseHeaderEditor: Story = {
  args: {
    initialResponseHeaders: [demoResponseHeader],
    initialView: { kind: 'edit-response-header', ruleId: demoResponseHeader.id },
  },
};
