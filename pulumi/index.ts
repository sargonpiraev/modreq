import { loadWorkspaceEnv } from './workspace-env.ts'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import {
  CWS_DEV_CONSOLE_URL,
  cwsPublicListingUrl,
  repoHasExtapp,
  repoHasWebapp,
} from '@sargonpiraev/pulumi-apps'
import { webapp } from '../apps/webapp/pulumi.ts'
import { cwsItemIdValue, cwsItemSlugValue, extapp } from '../apps/extapp/pulumi.ts'

/**
 * Official providers: GCP via shared Extapp (CWS item id; metrics scrape is meta chrome-vm).
 */
const __dirname = path.dirname(fileURLToPath(import.meta.url))
const repoRoot = path.resolve(__dirname, '..')
process.env.PATH = `${path.join(__dirname, 'node_modules', '.bin')}:${process.env.PATH ?? ''}`
loadWorkspaceEnv(__dirname)

if (!repoHasExtapp(repoRoot)) {
  throw new Error(
    'modreq expects apps/extapp — product analytics (CWS item → warehouse) are required'
  )
}

if (!repoHasWebapp(repoRoot)) {
  throw new Error(
    'modreq expects apps/webapp — product landing on GitHub Pages requires Webapp cluster'
  )
}

export const productCwsDatasetId = extapp.datasetId
export const cwsItemId = extapp.cwsItemId
export const cwsDevConsoleUrl = CWS_DEV_CONSOLE_URL
export const cwsListingUrl = cwsPublicListingUrl(cwsItemSlugValue, cwsItemIdValue)
export const gscSiteUrl = webapp.gscSiteUrl
export const gscExportDatasetId = webapp.datasetId
export const ga4MeasurementId = webapp.ga4MeasurementId
export const ga4PropertyId = webapp.ga4PropertyId
