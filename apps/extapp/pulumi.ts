import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { Extapp } from '@sargonpiraev/pulumi-apps'
import { parseExtappEnv } from '@sargonpiraev/pulumi-apps/extapp/env'
import { loadWorkspaceEnv } from '../../pulumi/workspace-env.ts'

const pulumiDir = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../../pulumi')
process.env.PATH = `${path.join(pulumiDir, 'node_modules', '.bin')}:${process.env.PATH ?? ''}`
loadWorkspaceEnv(pulumiDir)
const env = parseExtappEnv()

export const cwsItemIdValue = 'calgkmpccmankefjidecombecabommmm'
export const cwsItemSlugValue = 'modreq'

export const extapp = new Extapp('extapp', {
  gcpProjectId: 'sargonpiraev',
  location: 'EU',
  datasetId: 'cws',
  cwsItemId: cwsItemIdValue,
  cwsItemSlug: cwsItemSlugValue,
  productLabel: 'modreq',
  gcpServiceAccountKeyB64: env.GCP_SERVICE_ACCOUNT_KEY,
  datasetDescription: 'Chrome Web Store product analytics (Developer Dashboard scrape)',
  adoptExisting: true,
  datasetImportId: 'projects/sargonpiraev/datasets/cws',
})
