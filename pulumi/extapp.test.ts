import assert from 'node:assert/strict'
import path from 'node:path'
import { describe, it, before } from 'node:test'
import { fileURLToPath } from 'node:url'
import * as pulumi from '@pulumi/pulumi'
import { EXTAPP_TYPE, Extapp, repoHasExtapp } from '@sargonpiraev/pulumi-apps'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const repoRoot = path.resolve(__dirname, '..')

const registered: Array<{ type: string; name: string }> = []

await pulumi.runtime.setMocks(
  {
    newResource(args: pulumi.runtime.MockResourceArgs) {
      registered.push({ type: args.type, name: args.name })
      return {
        id: `${args.name}_id`,
        state: args.inputs,
      }
    },
    call(args: pulumi.runtime.MockCallArgs) {
      return args.inputs
    },
  },
  'modreq-infra',
  'test',
  false
)

async function flushPulumiMocks(): Promise<void> {
  await new Promise<void>((resolve) => setImmediate(resolve))
  await new Promise<void>((resolve) => setImmediate(resolve))
}

function extappArgs(cwsItemId: string) {
  return {
    gcpProjectId: 'sargonpiraev',
    location: 'EU',
    datasetId: 'cws',
    cwsItemId,
    cwsItemSlug: 'modreq',
    productLabel: 'modreq',
    gcpServiceAccountKeyB64: Buffer.from('{}').toString('base64'),
  }
}

describe('modreq extapp product analytics (Pulumi mocks)', () => {
  before(() => {
    assert.equal(
      repoHasExtapp(repoRoot),
      true,
      'modreq must have apps/extapp so CWS analytics resources are required'
    )
  })

  it('registers shared Extapp ComponentResource when extapp exists', async () => {
    new Extapp('extapp', extappArgs('calgkmpccmankefjidecombecabommmm'))
    await flushPulumiMocks()

    const types = new Set(registered.map((r) => r.type))
    assert.ok(types.has(EXTAPP_TYPE), `expected ${EXTAPP_TYPE}, got: ${[...types].join(', ')}`)
    assert.ok(
      types.has('gcp:bigquery/dataset:Dataset'),
      `expected gcp:bigquery/dataset:Dataset child, got: ${[...types].join(', ')}`
    )
  })

  it('fails fast when CWS item id is missing (dashboard URL, not env)', () => {
    assert.throws(
      () => new Extapp('extapp-missing-item', extappArgs('')),
      /chrome\.google\.com\/webstore\/devconsole/
    )
  })
})
