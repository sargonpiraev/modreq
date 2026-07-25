import { copyFileSync, mkdirSync } from 'node:fs';
import path from 'node:path';

import type { Browser } from 'playwright';

import type { PromoTileDef } from './define-promo-tile';
import { outStorePromoTilesDir, storeChromeDir } from './paths';

export async function runPromoTile(
  browser: Browser,
  baseUrl: string,
  def: PromoTileDef,
): Promise<void> {
  mkdirSync(outStorePromoTilesDir, { recursive: true });
  mkdirSync(storeChromeDir, { recursive: true });

  const page = await browser.newPage();
  await page.setViewportSize({ width: def.width, height: def.height });
  await page.goto(`${baseUrl}/iframe.html?id=${def.storyId}&viewMode=story`);
  await page.getByText(def.waitFor).first().waitFor({ timeout: 10_000 });

  const outPath = path.join(outStorePromoTilesDir, `${def.file}.png`);
  await page.locator('#shot').screenshot({ path: outPath, omitBackground: false });
  await page.close();

  copyFileSync(outPath, path.join(storeChromeDir, `${def.file}.png`));
  console.log(`✓ ${def.file}.png`);
}
