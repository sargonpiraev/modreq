import { Webapp, WEBAPP_TYPE, repoHasWebapp } from '@sargonpiraev/pulumi-apps'

export { Webapp, WEBAPP_TYPE, repoHasWebapp }

export type ModreqWebappArgs = {
  gcpProjectId: string
  datasetId: string
  location: string
  gscSiteUrl: string
  gscServiceAccountKeyB64: string
  gcpServiceAccountKeyB64: string
  vercelApiToken: string
}

/**
 * modreq `apps/webapp` cluster — landing on GitHub Pages
 * (`https://sargonpiraev.github.io/modreq/`).
 */
export function createWebappProductAnalytics(args: ModreqWebappArgs): Webapp {
  return new Webapp('webapp-analytics', {
    gcpProjectId: args.gcpProjectId,
    datasetId: args.datasetId,
    location: args.location,
    gscSiteUrl: args.gscSiteUrl,
    gscServiceAccountKeyB64: args.gscServiceAccountKeyB64,
    gcpServiceAccountKeyB64: args.gcpServiceAccountKeyB64,
    datasetDescription: 'GSC bulk export for sargonpiraev.github.io/modreq',
    datasetLabels: {
      product: 'modreq',
      source: 'gsc',
      domain: 'product',
    },
    vercel: {
      apiToken: args.vercelApiToken,
      name: 'modreq',
      gitRepository: 'sargonpiraev/modreq',
    },
  })
}
