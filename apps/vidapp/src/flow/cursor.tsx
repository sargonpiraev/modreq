import { interpolate, spring, useCurrentFrame, useCurrentScale, useVideoConfig } from 'remotion';
import type { RefObject } from 'react';

import {
  CURSOR_HOTSPOT,
  CURSOR_SIZE,
} from './cursor-path';
import { computeCursorPosition, isClickFrame } from './cursor-position';

type FlowCursorProps = {
  containerRef: RefObject<HTMLDivElement | null>;
};

export function FlowCursor({ containerRef }: FlowCursorProps) {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const scale = useCurrentScale();
  const clicking = isClickFrame(frame);

  const container = containerRef.current;
  const center = container
    ? computeCursorPosition(frame, container, scale)
    : { x: 190, y: 240 };

  const x = center.x - CURSOR_HOTSPOT.x;
  const y = center.y - CURSOR_HOTSPOT.y;

  const appear = spring({ frame, fps, config: { damping: 200 } });
  const press = clicking
    ? spring({ frame: frame % 3, fps, config: { damping: 200, stiffness: 400 } })
    : 0;
  const pressScale = interpolate(press, [0, 1], [1, 0.88]);

  return (
    <div
      className="pointer-events-none absolute left-0 top-0 z-50"
      style={{
        opacity: appear,
        transform: `translate(${x}px, ${y}px) scale(${pressScale})`,
      }}
    >
      <svg width={CURSOR_SIZE} height={CURSOR_SIZE} viewBox="0 0 24 24" fill="none">
        <path
          d="M5 3L5 17L9 13L13 21L15 20L11 12L16 12L5 3Z"
          fill="white"
          stroke="black"
          strokeWidth="1.2"
        />
      </svg>
      {clicking ? (
        <div
          className="absolute rounded-full bg-primary/35"
          style={{
            left: CURSOR_HOTSPOT.x,
            top: CURSOR_HOTSPOT.y,
            width: 32,
            height: 32,
            transform: 'translate(-50%, -50%)',
          }}
        />
      ) : null}
    </div>
  );
}
