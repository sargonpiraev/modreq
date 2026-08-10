import { expect, test } from './fixtures';
import {
  CWV_BUDGETS,
  enableCpuThrottle4x,
  installCwvCollectors,
  readCwvMetrics,
} from './lib/cwv';

test('home INP under CDP CPU 4x', async ({ page }) => {
  await installCwvCollectors(page);
  await enableCpuThrottle4x(page);

  await page.goto('/');
  await expect(page.getByRole('heading', { level: 1, name: 'modreq' })).toBeVisible();

  await page.getByRole('heading', { level: 1, name: 'modreq' }).click();
  await page.getByRole('link', { name: 'Add to Chrome' }).first().hover();
  await page.getByRole('heading', { level: 1, name: 'modreq' }).click();

  const metrics = await readCwvMetrics(page);
  expect(metrics.inp, 'expected an INP sample from interactions').not.toBeNull();
  expect(metrics.inp!).toBeLessThanOrEqual(CWV_BUDGETS.inpMs);
  expect(metrics.cls).toBeLessThanOrEqual(CWV_BUDGETS.cls);
});
