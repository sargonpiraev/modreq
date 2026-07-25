import { execSync } from 'node:child_process';
import { copyFileSync, mkdirSync, rmSync } from 'node:fs';
import path from 'node:path';

import type { Browser } from 'playwright';

import type { StoreScreenshotDef } from './define-store-screenshot';
import {
  outStoreScreenshotsDir,
  storeChromeDir,
  webappScreenshotsDir,
} from './paths';

const popupViewport = { width: 380, height: 560 } as const;

function publish(file: string, source: string) {
  mkdirSync(storeChromeDir, { recursive: true });
  mkdirSync(webappScreenshotsDir, { recursive: true });
  copyFileSync(source, path.join(storeChromeDir, file));
  copyFileSync(source, path.join(webappScreenshotsDir, file));
}

export async function runStoreScreenshot(
  browser: Browser,
  baseUrl: string,
  def: StoreScreenshotDef,
): Promise<void> {
  mkdirSync(outStoreScreenshotsDir, { recursive: true });

  const page = await browser.newPage();
  await page.setViewportSize(popupViewport);
  await page.goto(`${baseUrl}/iframe.html?id=${def.storyId}&viewMode=story`);
  await page.getByText(def.waitFor).waitFor({ timeout: 10_000 });

  const rawPath = path.join(outStoreScreenshotsDir, `${def.file}-raw.png`);
  const outPath = path.join(outStoreScreenshotsDir, `${def.file}.png`);

  await page.locator('#shot').screenshot({ path: rawPath });
  await page.close();

  execSync(
    `magick -size 1280x800 'xc:#0f1117' '${rawPath}' -gravity center -composite '${outPath}'`,
    { stdio: 'inherit' },
  );
  rmSync(rawPath, { force: true });

  publish(`${def.file}.png`, outPath);
  console.log(`✓ ${def.file}.png`);
}
