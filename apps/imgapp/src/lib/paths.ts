import path from 'node:path';
import { fileURLToPath } from 'node:url';

const imgappRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../..');

/** modreq monorepo root (parent of `apps/`). */
export const repoRoot = path.resolve(imgappRoot, '../..');

export const imgappSrcDir = path.join(imgappRoot, 'src');
export const storeScreenshotsDir = path.join(imgappSrcDir, 'store-screenshots');
export const storePromoTilesDir = path.join(imgappSrcDir, 'store-promo-tiles');

export const outStoreScreenshotsDir = path.join(imgappRoot, 'out/store-screenshots');
export const outStorePromoTilesDir = path.join(imgappRoot, 'out/store-promo-tiles');

/** Chrome Web Store listing assets (source of truth for submit). */
export const storeChromeDir = path.join(repoRoot, 'apps/extapp/store/chrome');

/** Landing page copies. */
export const webappScreenshotsDir = path.join(repoRoot, 'apps/webapp/public/screenshots');

/** Storybook app that hosts the capture stories. */
export const wuiappDir = path.join(repoRoot, 'apps/wuiapp');
