import assert from 'node:assert/strict'
import fs from 'node:fs'
import path from 'node:path'
import { describe, it } from 'node:test'
import { fileURLToPath } from 'node:url'
import { repoHasApp, repoHasExtapp, repoHasMobapp, repoHasWebapp } from '@sargonpiraev/pulumi-apps'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const repoRoot = path.resolve(__dirname, '..')
const indexSource = fs.readFileSync(path.join(__dirname, 'index.ts'), 'utf8')

function stripTsComments(source: string): string {
  return source.replace(/\/\*[\s\S]*?\*\//g, '').replace(/\/\/.*$/gm, '')
}

describe('pulumi/index.ts app-type clusters', () => {
  it('instantiates Webapp/Extapp/Mobapp when the matching apps/ dir exists', () => {
    const src = stripTsComments(indexSource)
    const deferWebapp = (() => {
      const marker = path.join(__dirname, 'defer-webapp-cluster')
      return fs.existsSync(marker) && fs.readFileSync(marker, 'utf8').trim().length > 0
    })()
    if ((repoHasWebapp(repoRoot) || repoHasApp(repoRoot, 'docapp')) && !deferWebapp) {
      assert.match(
        src,
        /\b(?:createWebappProductAnalytics|new\s+Webapp)\s*\(/,
        'apps/webapp (or apps/docapp) requires createWebappProductAnalytics(...) or new Webapp(...) in pulumi/index.ts'
      )
    }
    if (repoHasExtapp(repoRoot)) {
      assert.match(
        src,
        /\b(?:createExtappProductAnalytics|new\s+Extapp)\s*\(/,
        'apps/extapp requires createExtappProductAnalytics(...) or new Extapp(...) in pulumi/index.ts'
      )
    }
    if (repoHasMobapp(repoRoot)) {
      assert.match(
        src,
        /\b(?:createMobappProductAnalytics|new\s+Mobapp)\s*\(/,
        'apps/mobapp requires createMobappProductAnalytics(...) or new Mobapp(...) in pulumi/index.ts'
      )
    }
  })
})
