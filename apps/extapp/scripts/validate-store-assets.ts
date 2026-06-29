import { existsSync, readFileSync } from 'node:fs';
import { dirname, extname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

import storeConfig from '../store.config';
import { StoreConfigSchema, type ImageAssetSpec } from '../store.config.schema';

const appRoot = resolve(dirname(fileURLToPath(import.meta.url)), '..');

const PNG_SIGNATURE = Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]);

type PngInfo = { width: number; height: number; hasAlpha: boolean };

function readPng(file: string): PngInfo {
  const buf = readFileSync(file);
  if (!buf.subarray(0, 8).equals(PNG_SIGNATURE)) {
    throw new Error('not a valid PNG');
  }

  const width = buf.readUInt32BE(16);
  const height = buf.readUInt32BE(20);
  const colorType = buf.readUInt8(25);
  const hasAlpha = colorType === 4 || colorType === 6;

  return { width, height, hasAlpha };
}

const problems: string[] = [];
const ok: string[] = [];

function checkAsset(label: string, asset: ImageAssetSpec) {
  const abs = resolve(appRoot, asset.source);

  if (!existsSync(abs)) {
    problems.push(`${label}: missing file ${asset.source}`);
    return;
  }

  if (extname(abs).toLowerCase() !== '.png') {
    ok.push(`${label}: ${asset.source} (non-PNG, dimensions not checked)`);
    return;
  }

  const png = readPng(abs);

  if (png.width !== asset.width || png.height !== asset.height) {
    problems.push(
      `${label}: ${asset.source} is ${png.width}x${png.height}, expected ${asset.width}x${asset.height}`,
    );
  }

  if (asset.noAlpha && png.hasAlpha) {
    problems.push(`${label}: ${asset.source} has an alpha channel (CWS requires 24-bit, no alpha)`);
  }

  if (problems.every((p) => !p.startsWith(`${label}:`))) {
    ok.push(`${label}: ${asset.source} (${png.width}x${png.height})`);
  }
}

const parsed = StoreConfigSchema.safeParse(storeConfig);
if (!parsed.success) {
  console.error('store.config.ts failed schema validation:\n');
  console.error(parsed.error.format());
  process.exit(1);
}

const { graphicAssets } = parsed.data.storeListing;

checkAsset('storeIcon', graphicAssets.storeIcon);
graphicAssets.screenshots.forEach((s, i) => checkAsset(`screenshots[${i}]`, s));
checkAsset('smallPromoTile', graphicAssets.smallPromoTile);
if (graphicAssets.marqueePromoTile) {
  checkAsset('marqueePromoTile', graphicAssets.marqueePromoTile);
}

for (const line of ok) {
  console.log(`\u2713 ${line}`);
}

if (problems.length > 0) {
  console.error('\nStore asset validation failed:');
  for (const p of problems) {
    console.error(`  \u2717 ${p}`);
  }
  process.exit(1);
}

console.log('\nAll store assets valid.');
