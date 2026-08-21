import { loadWorkspaceEnv } from './workspace-env.ts'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import * as pulumi from '@pulumi/pulumi'
import {
  createExtappProductAnalytics,
  cwsPublicListingUrl,
  CWS_DEV_CONSOLE_URL,
  repoHasExtapp,
} from './extapp-analytics.ts'
import { createWebappProductAnalytics, repoHasWebapp } from './webapp-analytics.ts'

/**
 * Official providers: GCP via shared Extapp (CWS listing → product_cws).
 * Meta telegram digest / warehouse readers still query product_cws — ownership
 * of the listing ETL lives here (migrated from meta pulumi/dwhapp).
 */
const __dirname = path.dirname(fileURLToPath(import.meta.url))
const repoRoot = path.resolve(__dirname, '..')
process.env.PATH = `${path.join(__dirname, 'node_modules', '.bin')}:${process.env.PATH ?? ''}`
loadWorkspaceEnv(__dirname)

if (!repoHasExtapp(repoRoot)) {
  throw new Error('modreq expects apps/extapp — product analytics (CWS → BQ) are required')
}

if (!repoHasWebapp(repoRoot)) {
  throw new Error(
    'modreq expects apps/webapp — product landing on GitHub Pages requires Webapp cluster'
  )
}

const cwsItemIdValue = 'calgkmpccmankefjidecombecabommmm'
const cwsItemSlugValue = 'modreq'

const extapp = createExtappProductAnalytics({
  gcpProjectId: 'sargonpiraev',
  location: 'EU',
  region: 'europe-west1',
  datasetId: 'product_cws',
  cwsItemId: cwsItemIdValue,
  cwsItemSlug: cwsItemSlugValue,
  gcpServiceAccountKeyB64: process.env.GCP_SERVICE_ACCOUNT_KEY!,
  adoptExisting: true,
})

const webappAnalytics = createWebappProductAnalytics({
  gcpProjectId: 'sargonpiraev',
  datasetId: 'searchconsole_modreq',
  location: 'EU',
  gscSiteUrl: 'https://sargonpiraev.github.io/modreq/',
  gscServiceAccountKeyB64: process.env.GOOGLE_SERVICE_ACCOUNT_KEY!,
  gcpServiceAccountKeyB64: process.env.GCP_SERVICE_ACCOUNT_KEY!,
  vercelApiToken: process.env.VERCEL_API_TOKEN!,
})

export const productCwsDatasetId = extapp.datasetId
export const cwsListingFunctionUrl = extapp.functionUrl
export const cwsListingScheduleJobName = extapp.scheduleJobName
export const cwsItemId = extapp.cwsItemId
export const cwsEtlRunnerEmail = extapp.loaderSa.email
export const cwsListingSchedule = pulumi.output('0 0 * * * Europe/Moscow')
export const cwsDevConsoleUrl = CWS_DEV_CONSOLE_URL
export const cwsListingUrl = cwsPublicListingUrl(cwsItemSlugValue, cwsItemIdValue)
export const gscSiteUrl = webappAnalytics.gscSiteUrl
export const gscExportDatasetId = webappAnalytics.datasetId
export const ga4MeasurementId = webappAnalytics.ga4MeasurementId
export const ga4PropertyId = webappAnalytics.ga4PropertyId
