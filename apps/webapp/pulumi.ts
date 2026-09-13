import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { Webapp, pageTypesFromOrigin } from '@sargonpiraev/pulumi-apps'
import { parseWebappEnv } from '@sargonpiraev/pulumi-apps/webapp/env'
import { loadWorkspaceEnv } from '../../pulumi/workspace-env.ts'

const pulumiDir = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../../pulumi')
process.env.PATH = `${path.join(pulumiDir, 'node_modules', '.bin')}:${process.env.PATH ?? ''}`
loadWorkspaceEnv(pulumiDir)
const env = parseWebappEnv()

export const webapp = new Webapp('webapp', {
  productId: 'modreq',
  gcpProjectId: 'sargonpiraev',
  datasetId: 'searchconsole_modreq',
  location: 'EU',
  gscSiteUrl: 'https://sargonpiraev.github.io/modreq/',
  gscServiceAccountKeyB64: env.GOOGLE_SERVICE_ACCOUNT_KEY,
  gcpServiceAccountKeyB64: env.GCP_SERVICE_ACCOUNT_KEY,
  datasetDescription: 'GSC bulk export for sargonpiraev.github.io/modreq',
  datasetLabels: {
    product: 'modreq',
    source: 'gsc',
    domain: 'product',
  },
  importGscExportTables: true,
  importAnalyticsDataset: false,
  pageTypes: pageTypesFromOrigin({
    origin: 'https://sargonpiraev.github.io/modreq',
    localePrefix: 'none',
    paths: [{ id: 'home', pathname: '/?' }],
  }),
  vercel: {
    apiToken: env.VERCEL_API_TOKEN,
    name: 'modreq',
    gitRepository: 'sargonpiraev/modreq',
  },
})
