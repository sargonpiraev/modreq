import type { Meta, StoryObj } from '@storybook/react-vite';
import { useState } from 'react';

import { ModreqPopup, type ModreqView } from '@repo/ui/modreq/popup';
import { demoCookie, demoHeader } from '@repo/ui/modreq/demo-data';
import type { CookieRule, HeaderRule } from '@repo/ui/modreq/types';

function ModreqStory({
  initialHeaders,
  initialCookies,
  initialView,
}: {
  initialHeaders: HeaderRule[];
  initialCookies: CookieRule[];
  initialView: ModreqView;
}) {
  const [headers, setHeaders] = useState(initialHeaders);
  const [cookies, setCookies] = useState(initialCookies);
  const [view, setView] = useState(initialView);

  return (
    <ModreqPopup
      loaded
      headers={headers}
      cookies={cookies}
      view={view}
      onHeadersChange={setHeaders}
      onCookiesChange={setCookies}
      onViewChange={setView}
      onStartNewModification={(type) => {
        if (type === 'header') {
          setHeaders((current) => [
            ...current,
            { id: crypto.randomUUID(), enabled: true, name: '', value: '', urlFilter: '*' },
          ]);
          return;
        }

        setCookies((current) => [
          ...current,
          { id: crypto.randomUUID(), enabled: true, name: '', value: '' },
        ]);
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
  args: { initialHeaders: [], initialCookies: [], initialView: { kind: 'home' } },
};

export const PickType: Story = {
  args: { initialHeaders: [], initialCookies: [], initialView: { kind: 'pick-type' } },
};

export const HeaderApplied: Story = {
  args: { initialHeaders: [demoHeader], initialCookies: [], initialView: { kind: 'home' } },
};

export const CookieApplied: Story = {
  args: { initialHeaders: [], initialCookies: [demoCookie], initialView: { kind: 'home' } },
};

export const BothRules: Story = {
  args: {
    initialHeaders: [demoHeader],
    initialCookies: [demoCookie],
    initialView: { kind: 'home' },
  },
};
