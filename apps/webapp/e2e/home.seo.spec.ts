import { expect, test } from './seokit'

test.describe('home.seo.spec.ts', { tag: '@seokit' }, () => {
  test('landing metadata', async ({ page }) => {
    await page.goto('/')

    await expect(page).toHaveMetadata({
      lang: 'en',
      title: 'modreq — Modify HTTP Headers',
      description: /Free Chrome extension to replace or append HTTP request headers/,
    })
  })
})
