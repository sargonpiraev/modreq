import { test } from '@playwright/test'

async function placeholder() {
  await test.step('arrange', async () => {})
  await test.step('act', async () => {})
  await test.step('assert', async () => {})
}

test.describe('feat', { tag: '@feat' }, () => {
  test.skip('placeholder', placeholder)
})

test.describe('seokit', { tag: '@seokit' }, () => {
  test.skip('placeholder', placeholder)
})

test.describe('analytics', { tag: '@analytics' }, () => {
  test.skip('placeholder', placeholder)
})

test.describe('visual', { tag: '@visual' }, () => {
  test.skip('placeholder', placeholder)
})

test.describe('perf', { tag: '@perf' }, () => {
  test.skip('placeholder', placeholder)
})
