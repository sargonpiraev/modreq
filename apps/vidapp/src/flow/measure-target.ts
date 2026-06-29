import type { FlowTarget } from './cursor-path';
import { START_CURSOR } from './cursor-path';

export type Point = { x: number; y: number };

const targetCache = new Map<FlowTarget | '__start__', Point>();

export function getTargetCenter(
  container: HTMLElement,
  targetId: FlowTarget | '__start__',
  scale: number,
): Point {
  if (targetId === '__start__') {
    return START_CURSOR;
  }

  const el = container.querySelector(`[data-flow-target="${targetId}"]`);
  if (el) {
    const containerRect = container.getBoundingClientRect();
    const rect = el.getBoundingClientRect();
    const center = {
      x: (rect.left + rect.width / 2 - containerRect.left) / scale,
      y: (rect.top + rect.height / 2 - containerRect.top) / scale,
    };
    targetCache.set(targetId, center);
    return center;
  }

  return targetCache.get(targetId) ?? START_CURSOR;
}

export function resetTargetCache() {
  targetCache.clear();
}
