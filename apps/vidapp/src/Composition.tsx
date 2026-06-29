import { useRef } from 'react';
import { AbsoluteFill, useCurrentFrame } from 'remotion';

import { ModreqPopup } from '@repo/ui/modreq/popup';
import { MODREQ_POPUP_HEIGHT, MODREQ_POPUP_WIDTH } from '@repo/ui/modreq/layout';

import { FlowCursor } from './flow/cursor';
import { getFlowState } from './flow/get-state';

const noop = () => {};

export const MyComposition: React.FC = () => {
  const frame = useCurrentFrame();
  const popupRef = useRef<HTMLDivElement>(null);
  const { view, headers, cookies } = getFlowState(frame);

  return (
    <AbsoluteFill className="dark items-center justify-center bg-[#0f1117]">
      <div
        ref={popupRef}
        className="relative overflow-hidden rounded-2xl shadow-2xl ring-1 ring-white/10"
        style={{ width: MODREQ_POPUP_WIDTH, height: MODREQ_POPUP_HEIGHT }}
      >
        <ModreqPopup
          loaded
          headers={headers}
          cookies={cookies}
          view={view}
          onHeadersChange={noop}
          onCookiesChange={noop}
          onViewChange={noop}
          onStartNewModification={noop}
        />
        <FlowCursor containerRef={popupRef} />
      </div>
    </AbsoluteFill>
  );
};
