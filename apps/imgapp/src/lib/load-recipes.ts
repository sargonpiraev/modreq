import fs from 'node:fs';
import path from 'node:path';
import { pathToFileURL } from 'node:url';

import type { PromoTileDef } from './define-promo-tile';
import type { StoreScreenshotDef } from './define-store-screenshot';
import { storePromoTilesDir, storeScreenshotsDir } from './paths';

async function loadDirDefaults<T extends { code: string }>(
  dir: string,
  filterCode?: string,
): Promise<T[]> {
  const files = fs
    .readdirSync(dir)
    .filter((f) => f.endsWith('.ts'))
    .filter((f) => !f.startsWith('_'))
    .sort((a, b) => a.localeCompare(b));

  const defs: T[] = [];

  for (const file of files) {
    const code = file.replace(/\.ts$/, '');
    if (filterCode && code !== filterCode) continue;

    const mod = (await import(pathToFileURL(path.join(dir, file)).href)) as {
      default: T;
    };
    defs.push({ ...mod.default, code: mod.default.code ?? code });
  }

  return defs;
}

export function loadStoreScreenshots(filterCode?: string) {
  return loadDirDefaults<StoreScreenshotDef>(storeScreenshotsDir, filterCode);
}

export function loadPromoTiles(filterCode?: string) {
  return loadDirDefaults<PromoTileDef>(storePromoTilesDir, filterCode);
}
