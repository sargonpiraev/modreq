import { interpolate } from 'remotion';

import {
  CURSOR_WAYPOINTS,
  START_CURSOR,
  type CursorWaypoint,
} from './cursor-path';
import { getTargetCenter, type Point } from './measure-target';

function getActiveSegment(frame: number): [CursorWaypoint, CursorWaypoint] {
  for (let i = 0; i < CURSOR_WAYPOINTS.length - 1; i += 1) {
    const from = CURSOR_WAYPOINTS[i]!;
    const to = CURSOR_WAYPOINTS[i + 1]!;

    if (frame >= from.frame && frame <= to.frame) {
      return [from, to];
    }
  }

  const last = CURSOR_WAYPOINTS.at(-1)!;
  const prev = CURSOR_WAYPOINTS.at(-2)!;
  return [prev, last];
}

export function computeCursorPosition(
  frame: number,
  container: HTMLElement,
  scale: number,
): Point {
  if (frame >= CURSOR_WAYPOINTS.at(-1)!.frame) {
    const last = CURSOR_WAYPOINTS.at(-1)!;
    return getTargetCenter(container, last.target, scale);
  }

  const [from, to] = getActiveSegment(frame);
  const fromPos = getTargetCenter(container, from.target, scale);
  const toPos = getTargetCenter(container, to.target, scale);

  const progress = interpolate(frame, [from.frame, to.frame], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  if (!fromPos) {
    return toPos ?? START_CURSOR;
  }

  if (!toPos) {
    return fromPos;
  }

  return {
    x: interpolate(progress, [0, 1], [fromPos.x, toPos.x]),
    y: interpolate(progress, [0, 1], [fromPos.y, toPos.y]),
  };
}

export function isClickFrame(frame: number) {
  return CURSOR_WAYPOINTS.some(
    (point) => point.click && frame >= point.frame && frame <= point.frame + 2,
  );
}
