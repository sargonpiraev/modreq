import { test as base, chromium, type BrowserContext } from '@playwright/test'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const extappRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
const pathToExtension = path.join(extappRoot, '.output/chrome-mv3')

export const test = base.extend<{
  context: BrowserContext
  extensionId: string
}>({
  // Playwright requires object destructuring; no fixtures are used here.
  // eslint-disable-next-line no-empty-pattern -- launchPersistentContext owns the browser
  context: async ({}, use) => {
    // channel: 'chromium' enables extension loading in headless (CI / Docker).
    const context = await chromium.launchPersistentContext('', {
      channel: 'chromium',
      args: [
        `--disable-extensions-except=${pathToExtension}`,
        `--load-extension=${pathToExtension}`,
      ],
    })
    await use(context)
    await context.close()
  },
  extensionId: async ({ context }, use) => {
    let [serviceWorker] = context.serviceWorkers()
    if (!serviceWorker) {
      serviceWorker = await context.waitForEvent('serviceworker')
    }

    const extensionId = serviceWorker.url().split('/')[2]
    await use(extensionId)
  },
})

export const expect = test.expect
