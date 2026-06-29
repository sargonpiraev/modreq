export type FlowTarget =
  | 'add-empty'
  | 'pick-header'
  | 'pick-cookie'
  | 'editor-done'
  | 'add-footer';

export type CursorWaypoint = {
  frame: number;
  target: FlowTarget | '__start__';
  click?: boolean;
};

export const CURSOR_WAYPOINTS: CursorWaypoint[] = [
  { frame: 0, target: '__start__' },
  { frame: 28, target: 'add-empty' },
  { frame: 44, target: 'add-empty', click: true },

  { frame: 52, target: 'pick-header' },
  { frame: 68, target: 'pick-header', click: true },

  { frame: 150, target: 'editor-done' },
  { frame: 166, target: 'editor-done', click: true },

  { frame: 228, target: 'add-footer' },
  { frame: 244, target: 'add-footer', click: true },

  { frame: 252, target: 'pick-cookie' },
  { frame: 268, target: 'pick-cookie', click: true },

  { frame: 338, target: 'editor-done' },
  { frame: 354, target: 'editor-done', click: true },

  { frame: 380, target: 'add-footer' },
];

export const CURSOR_SIZE = 28;

/** Pointer tip position inside the 24×24 viewBox, scaled to CURSOR_SIZE. */
export const CURSOR_HOTSPOT = {
  x: (5 / 24) * CURSOR_SIZE,
  y: (3 / 24) * CURSOR_SIZE,
};

export const START_CURSOR = { x: 300, y: 180 };
