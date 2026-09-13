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

function readAppPulumi(appType: string): string {
  const file = path.join(repoRoot, 'apps', appType, 'pulumi.ts')
  return fs.existsSync(file) ? fs.readFileSync(file, 'utf8') : ''
}

describe('apps/*/pulumi.ts app-type clusters', () => {
  it('instantiates Webapp/Extapp/Mobapp in apps/<type>/pulumi.ts when the matching apps/ dir exists', () => {
    const indexSrc = stripTsComments(indexSource)
    if (repoHasWebapp(repoRoot) || repoHasApp(repoRoot, 'docapp')) {
      assert.match(
        stripTsComments(readAppPulumi('webapp')),
        /\bnew\s+Webapp\s*\(/,
        'apps/webapp (or apps/docapp) requires new Webapp(...) in apps/webapp/pulumi.ts'
      )
      assert.doesNotMatch(
        indexSrc,
        /\bnew\s+Webapp\s*\(/,
        'new Webapp(...) must not live in pulumi/index.ts'
      )
    }
    if (repoHasExtapp(repoRoot)) {
      assert.match(
        stripTsComments(readAppPulumi('extapp')),
        /\bnew\s+Extapp\s*\(/,
        'apps/extapp requires new Extapp(...) in apps/extapp/pulumi.ts'
      )
      assert.doesNotMatch(
        indexSrc,
        /\bnew\s+Extapp\s*\(/,
        'new Extapp(...) must not live in pulumi/index.ts'
      )
    }
    if (repoHasMobapp(repoRoot)) {
      assert.match(
        stripTsComments(readAppPulumi('mobapp')),
        /\bnew\s+Mobapp\s*\(/,
        'apps/mobapp requires new Mobapp(...) in apps/mobapp/pulumi.ts'
      )
      assert.doesNotMatch(
        indexSrc,
        /\bnew\s+Mobapp\s*\(/,
        'new Mobapp(...) must not live in pulumi/index.ts'
      )
    }
  })
})
