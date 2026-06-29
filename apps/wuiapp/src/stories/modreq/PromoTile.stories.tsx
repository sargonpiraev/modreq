import type { Meta, StoryObj } from '@storybook/react-vite';
import { useState } from 'react';

import { ModreqPopup, type ModreqView } from '@repo/ui/modreq/popup';
import { demoCookie, demoHeader } from '@repo/ui/modreq/demo-data';
import { MODREQ_POPUP_HEIGHT, MODREQ_POPUP_WIDTH } from '@repo/ui/modreq/layout';

function PopupDemo() {
  const [headers, setHeaders] = useState([demoHeader]);
  const [cookies, setCookies] = useState([demoCookie]);
  const [view, setView] = useState<ModreqView>({ kind: 'home' });

  return (
    <ModreqPopup
      loaded
      headers={headers}
      cookies={cookies}
      view={view}
      onHeadersChange={setHeaders}
      onCookiesChange={setCookies}
      onViewChange={setView}
      onStartNewModification={() => {}}
    />
  );
}

function ScaledPopupPreview({ maxWidth, maxHeight }: { maxWidth: number; maxHeight: number }) {
  const scale = Math.min(maxWidth / MODREQ_POPUP_WIDTH, maxHeight / MODREQ_POPUP_HEIGHT);
  const width = MODREQ_POPUP_WIDTH * scale;
  const height = MODREQ_POPUP_HEIGHT * scale;

  return (
    <div
      className="shrink-0 overflow-hidden rounded-xl border border-white/10 shadow-2xl"
      style={{ width, height }}
    >
      <div
        style={{
          width: MODREQ_POPUP_WIDTH,
          height: MODREQ_POPUP_HEIGHT,
          transform: `scale(${scale})`,
          transformOrigin: 'top left',
        }}
      >
        <PopupDemo />
      </div>
    </div>
  );
}

function SmallPromoTile() {
  const width = 440;
  const height = 280;
  const paddingX = 24;
  const paddingY = 16;
  const gap = 16;
  const textWidth = 176;
  const popupMaxWidth = width - paddingX * 2 - gap - textWidth;
  const popupMaxHeight = height - paddingY * 2;

  return (
    <div
      id="shot"
      className="dark flex items-center overflow-hidden bg-[#0f1117] text-foreground"
      style={{ width, height, gap, padding: `${paddingY}px ${paddingX}px` }}
    >
      <ScaledPopupPreview maxWidth={popupMaxWidth} maxHeight={popupMaxHeight} />
      <div className="min-w-0 flex-1">
        <p className="text-xl font-semibold tracking-tight">modreq</p>
        <p className="mt-1 text-xs leading-snug text-muted-foreground">
          Modify request headers and cookies on the fly
        </p>
      </div>
    </div>
  );
}

function MarqueePromoTile() {
  const width = 1400;
  const height = 560;
  const leftWidth = 480;
  const paddingRight = 48;
  const paddingY = 24;
  const popupMaxWidth = width - leftWidth - paddingRight;
  const popupMaxHeight = height - paddingY * 2;

  return (
    <div
      id="shot"
      className="dark flex items-center overflow-hidden bg-[#0f1117] text-foreground"
      style={{ width, height }}
    >
      <div
        className="flex shrink-0 flex-col justify-center px-14"
        style={{ width: leftWidth, height }}
      >
        <p className="text-5xl font-semibold tracking-tight">modreq</p>
        <p className="mt-4 text-xl leading-relaxed text-muted-foreground">
          Modify HTTP request headers and cookies without leaving the browser
        </p>
        <ul className="mt-8 space-y-2 text-lg text-muted-foreground">
          <li>Append custom headers to any request</li>
          <li>Replace cookies per site</li>
          <li>Toggle rules on and off instantly</li>
        </ul>
      </div>
      <div className="flex flex-1 items-center justify-center" style={{ paddingRight, paddingBlock: paddingY }}>
        <ScaledPopupPreview maxWidth={popupMaxWidth} maxHeight={popupMaxHeight} />
      </div>
    </div>
  );
}

const meta = {
  title: 'Store/PromoTiles',
  parameters: { skipShotDecorator: true, layout: 'fullscreen' },
  tags: ['store-promo'],
} satisfies Meta;

export default meta;
type Story = StoryObj<typeof meta>;

export const Small: Story = {
  render: () => <SmallPromoTile />,
};

export const Marquee: Story = {
  render: () => <MarqueePromoTile />,
};
