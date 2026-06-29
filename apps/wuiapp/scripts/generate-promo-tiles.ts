import { spawn } from 'node:child_process';
import { existsSync, mkdirSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

import { chromium } from 'playwright';

const __dirname = dirname(fileURLToPath(import.meta.url));
const appDir = resolve(__dirname, '..');
const outDir = resolve(appDir, '../extapp/store/chrome');

const tiles = [
  {
    name: 'promo-tile-small-440x280',
    id: 'store-promotiles--small',
    width: 440,
    height: 280,
    waitFor: 'modreq',
  },
  {
    name: 'promo-tile-marquee-1400x560',
    id: 'store-promotiles--marquee',
    width: 1400,
    height: 560,
    waitFor: 'Modify HTTP request headers',
  },
] as const;

const port = 6008;

async function waitForStorybook() {
  const deadline = Date.now() + 90_000;

  while (Date.now() < deadline) {
    try {
      const res = await fetch(`http://127.0.0.1:${port}/iframe.html`);
      if (res.ok) {
        return;
      }
    } catch {
      // retry
    }

    await new Promise((r) => setTimeout(r, 500));
  }

  throw new Error('Storybook did not start in time');
}

async function main() {
  mkdirSync(outDir, { recursive: true });

  const localBin = resolve(appDir, 'node_modules/.bin/storybook');
  const rootBin = resolve(appDir, '../../node_modules/.bin/storybook');
  const storybookBin = existsSync(localBin) ? localBin : rootBin;

  const storybook = spawn(
    storybookBin,
    ['dev', '-p', String(port), '--ci', '--quiet', '--no-open'],
    { cwd: appDir, stdio: 'inherit' },
  );

  try {
    await waitForStorybook();

    const browser = await chromium.launch({ headless: true });

    for (const tile of tiles) {
      const page = await browser.newPage();
      await page.setViewportSize({ width: tile.width, height: tile.height });
      await page.goto(`http://127.0.0.1:${port}/iframe.html?id=${tile.id}&viewMode=story`);
      await page.getByText(tile.waitFor).first().waitFor({ timeout: 10_000 });

      const storePath = resolve(outDir, `${tile.name}.png`);
      await page.locator('#shot').screenshot({ path: storePath, omitBackground: false });
      await page.close();

      console.log(`\u2713 ${tile.name}.png`);
    }

    await browser.close();
  } finally {
    storybook.kill('SIGTERM');
  }

  console.log(`\nSaved to ${outDir}`);
}

void main();
