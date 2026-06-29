import { execSync, spawn } from 'node:child_process';
import { existsSync, mkdirSync, rmSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

import { chromium } from 'playwright';

const __dirname = dirname(fileURLToPath(import.meta.url));
const appDir = resolve(__dirname, '..');
const outDir = resolve(appDir, '../extapp/store/chrome');

/** Must match store.config.ts → storeListing.graphicAssets.screenshots[].source */
const screenshots = [
  {
    file: 'screenshot-1280x800-empty-home',
    storyId: 'store-screenshots--home',
    waitFor: 'No modifications yet',
  },
  {
    file: 'screenshot-1280x800-pick-modification-type',
    storyId: 'store-screenshots--pick-type',
    waitFor: 'What do you want to change?',
  },
  {
    file: 'screenshot-1280x800-header-rule',
    storyId: 'store-screenshots--header-applied',
    waitFor: 'X-Debug-Token',
  },
  {
    file: 'screenshot-1280x800-cookie-rule',
    storyId: 'store-screenshots--cookie-applied',
    waitFor: 'session',
  },
  {
    file: 'screenshot-1280x800-header-and-cookie-rules',
    storyId: 'store-screenshots--both-rules',
    waitFor: 'Request headers',
  },
] as const;

const port = 6007;

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
  for (const shot of screenshots) {
    rmSync(resolve(outDir, `${shot.file}.png`), { force: true });
  }

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
    const page = await browser.newPage();
    await page.setViewportSize({ width: 380, height: 560 });

    for (const shot of screenshots) {
      await page.goto(`http://127.0.0.1:${port}/iframe.html?id=${shot.storyId}&viewMode=story`);
      await page.getByText(shot.waitFor).waitFor({ timeout: 10_000 });

      const rawPath = resolve(outDir, `${shot.file}-raw.png`);
      await page.locator('#shot').screenshot({ path: rawPath });

      const storePath = resolve(outDir, `${shot.file}.png`);
      execSync(
        `magick -size 1280x800 'xc:#0f1117' '${rawPath}' -gravity center -composite '${storePath}'`,
        { stdio: 'inherit' },
      );
      rmSync(rawPath, { force: true });

      console.log(`\u2713 ${shot.file}.png`);
    }

    await browser.close();
  } finally {
    storybook.kill('SIGTERM');
  }

  console.log(`\nSaved to ${outDir}`);
}

void main();
