import { expect, test } from './fixtures'

test.describe('home.visual.spec.ts', { tag: '@visual' }, () => {
  test.describe('page type: landing', () => {
    test('desktop', async ({ page }, testInfo) => {
      test.skip(testInfo.project.name !== 'desktop', 'desktop only')

      await page.goto('/')
      await expect(page.getByRole('heading', { level: 1, name: 'modreq' })).toBeVisible()
      await expect(page).toHaveScreenshot('landing-desktop.png', { fullPage: true })
    })

    test('mobile', async ({ page }, testInfo) => {
      test.skip(testInfo.project.name !== 'mobile', 'mobile only')

      await page.goto('/')
      await expect(page.getByRole('heading', { level: 1, name: 'modreq' })).toBeVisible()
      await expect(page).toHaveScreenshot('landing-mobile.png', { fullPage: true })
    })
  })
})
