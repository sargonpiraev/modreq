export function typeText(
  full: string,
  startFrame: number,
  endFrame: number,
  frame: number,
): string {
  if (frame < startFrame) {
    return '';
  }

  if (frame >= endFrame) {
    return full;
  }

  const progress = (frame - startFrame) / (endFrame - startFrame);
  return full.slice(0, Math.max(1, Math.ceil(progress * full.length)));
}
