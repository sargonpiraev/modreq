import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { Extapp } from '@sargonpiraev/pulumi-apps'
import { parseExtappEnv } from '@sargonpiraev/pulumi-apps/extapp/env'
import { loadWorkspaceEnv } from '../../pulumi/workspace-env.ts'
import { FileArchive } from '../../pulumi/file-archive.ts'

const pulumiDir = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../../pulumi')
process.env.PATH = `${path.join(pulumiDir, 'node_modules', '.bin')}:${process.env.PATH ?? ''}`
loadWorkspaceEnv(pulumiDir)
const env = parseExtappEnv()

export const cwsItemIdValue = 'calgkmpccmankefjidecombecabommmm'
export const cwsItemSlugValue = 'modreq'

export const extapp = new Extapp('extapp', {
  gcpProjectId: 'sargonpiraev',
  location: 'EU',
  region: 'europe-west1',
  datasetId: 'cws',
  cwsItemId: cwsItemIdValue,
  cwsItemSlug: cwsItemSlugValue,
  productLabel: 'modreq',
  loaderAccountId: 'cws-etl-runner',
  gcpServiceAccountKeyB64: env.GCP_SERVICE_ACCOUNT_KEY,
  sourceArchive: new FileArchive(path.join(pulumiDir, 'functions/cws-listing/deploy')),
  sourceBucketName: 'sargonpiraev-cws-listing-source',
  functionName: 'cws-listing-etl',
  schedulerJobName: 'cws-listing-daily',
  schedulerAccountId: 'cws-listing-scheduler',
  datasetDescription: 'Chrome Web Store product analytics (modreq listing + dashboard CSV ETL)',
  adoptExisting: true,
  datasetImportId: 'projects/sargonpiraev/datasets/cws',
})
