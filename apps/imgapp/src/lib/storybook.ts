import { spawn, type ChildProcess } from 'node:child_process';
import { existsSync } from 'node:fs';
import path from 'node:path';

import { wuiappDir } from './paths';

async function waitForStorybook(port: number) {
  const deadline = Date.now() + 90_000;

  while (Date.now() < deadline) {
    try {
      const res = await fetch(`http://127.0.0.1:${port}/iframe.html`);
      if (res.ok) return;
    } catch {
      // retry
    }
    await new Promise((r) => setTimeout(r, 500));
  }

  throw new Error(`Storybook did not start on port ${port}`);
}

function resolveStorybookBin() {
  const localBin = path.join(wuiappDir, 'node_modules/.bin/storybook');
  const rootBin = path.join(wuiappDir, '../../node_modules/.bin/storybook');
  return existsSync(localBin) ? localBin : rootBin;
}

/** Start wuiapp Storybook, run work, then stop it. */
export async function withStorybook<T>(
  port: number,
  fn: (baseUrl: string) => Promise<T>,
): Promise<T> {
  const storybookBin = resolveStorybookBin();
  const storybook: ChildProcess = spawn(
    storybookBin,
    ['dev', '-p', String(port), '--ci', '--quiet', '--no-open'],
    { cwd: wuiappDir, stdio: 'inherit' },
  );

  try {
    await waitForStorybook(port);
    return await fn(`http://127.0.0.1:${port}`);
  } finally {
    storybook.kill('SIGTERM');
  }
}
