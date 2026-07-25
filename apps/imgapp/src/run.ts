/**
 * imgapp — capture store stills from wuiapp Storybook.
 *
 * Usage (from modreq root):
 *   npm run screenshots
 *   npm run promo-tiles
 *   npm run shots --workspace=imgapp
 *   npm run shots --workspace=imgapp -- screenshots header-editor
 *
 * Prerequisites:
 *   npx playwright install chromium
 *   ImageMagick (`magick`) for 1280×800 store screenshot compositing
 */

import { chromium } from 'playwright';

import { runPromoTile } from './lib/capture-promo-tile';
import { runStoreScreenshot } from './lib/capture-store-screenshot';
import { loadPromoTiles, loadStoreScreenshots } from './lib/load-recipes';
import { withStorybook } from './lib/storybook';

type Kind = 'screenshots' | 'promo-tiles' | 'all';

function parseArgs(argv: string[]): { kind: Kind; filter?: string } {
  const [a, b] = argv;
  if (a === 'screenshots' || a === 'promo-tiles') {
    return { kind: a, filter: b };
  }
  if (a === 'all' || a === undefined) {
    return { kind: 'all', filter: b };
  }
  // `npm run shots -- header-editor` → filter only screenshots
  return { kind: 'screenshots', filter: a };
}

async function main() {
  const { kind, filter } = parseArgs(process.argv.slice(2));

  let ran = 0;

  if (kind === 'screenshots' || kind === 'all') {
    const defs = await loadStoreScreenshots(filter);
    if (defs.length === 0 && kind === 'screenshots') {
      console.error(
        filter
          ? `No store-screenshots/<code>.ts matched "${filter}".`
          : 'No files in src/store-screenshots/.',
      );
      process.exit(1);
    }

    if (defs.length > 0) {
      console.log(`Capturing ${defs.length} store screenshot(s)…`);
      await withStorybook(6007, async (baseUrl) => {
        const browser = await chromium.launch({ headless: true });
        try {
          for (const def of defs) {
            await runStoreScreenshot(browser, baseUrl, def);
          }
        } finally {
          await browser.close();
        }
      });
      ran += defs.length;
    }
  }

  if (kind === 'promo-tiles' || kind === 'all') {
    const defs = await loadPromoTiles(kind === 'all' ? undefined : filter);
    if (defs.length === 0 && kind === 'promo-tiles') {
      console.error(
        filter
          ? `No store-promo-tiles/<code>.ts matched "${filter}".`
          : 'No files in src/store-promo-tiles/.',
      );
      process.exit(1);
    }

    if (defs.length > 0) {
      console.log(`Capturing ${defs.length} promo tile(s)…`);
      await withStorybook(6008, async (baseUrl) => {
        const browser = await chromium.launch({ headless: true });
        try {
          for (const def of defs) {
            await runPromoTile(browser, baseUrl, def);
          }
        } finally {
          await browser.close();
        }
      });
      ran += defs.length;
    }
  }

  if (ran === 0) {
    console.error('Nothing to capture.');
    process.exit(1);
  }
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
