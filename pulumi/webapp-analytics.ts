import { Webapp, WEBAPP_TYPE, repoHasWebapp } from "@sargonpiraev/pulumi-apps";

export { Webapp, WEBAPP_TYPE, repoHasWebapp };

export type ModreqWebappArgs = {
  gcpProjectId: string;
  datasetId: string;
  location: string;
  gscSiteUrl: string;
  gscServiceAccountKeyB64: string;
  gcpServiceAccountKeyB64: string;
};

/**
 * modreq `apps/webapp` cluster — thin wrapper over `@sargonpiraev/pulumi-apps`
 * `Webapp`. Not wired in `index.ts` until a live GSC property / custom domain
 * exists (do not invent one). `test:pulumi` still registers the pack.
 */
export function createWebappProductAnalytics(args: ModreqWebappArgs): Webapp {
  return new Webapp("webapp-analytics", {
    gcpProjectId: args.gcpProjectId,
    datasetId: args.datasetId,
    location: args.location,
    gscSiteUrl: args.gscSiteUrl,
    gscServiceAccountKeyB64: args.gscServiceAccountKeyB64,
    gcpServiceAccountKeyB64: args.gcpServiceAccountKeyB64,
    datasetDescription: "GSC bulk export for modreq (pending domain)",
    datasetLabels: {
      product: "modreq",
      source: "gsc",
      domain: "product",
    },
  });
}
