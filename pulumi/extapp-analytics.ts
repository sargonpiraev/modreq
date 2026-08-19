import path from "node:path";
import { fileURLToPath } from "node:url";
import * as pulumi from "@pulumi/pulumi";
import {
  Extapp,
  EXTAPP_TYPE,
  repoHasExtapp,
} from "@sargonpiraev/pulumi-apps";

export { Extapp, EXTAPP_TYPE, repoHasExtapp };

const __dirname = path.dirname(fileURLToPath(import.meta.url));

export type ModreqExtappArgs = {
  gcpProjectId: string;
  location: string;
  region: string;
  datasetId: string;
  cwsItemId: string;
  cwsItemSlug: string;
  gcpServiceAccountKeyB64: string;
  /** When true, import+protect existing `product_cws` (migrated from meta). */
  adoptExisting?: boolean;
};

/**
 * modreq `apps/extapp` product analytics — thin project wrapper over the shared
 * `@sargonpiraev/pulumi-apps` `Extapp` ComponentResource.
 *
 * CF source: `functions/cws-listing` (pack with `npm run pack:cws-etl`).
 */
export function createExtappProductAnalytics(
  args: ModreqExtappArgs,
): Extapp {
  const deployDir = path.join(__dirname, "functions/cws-listing/deploy");
  const adopt = args.adoptExisting === true;

  return new Extapp("extapp", {
    gcpProjectId: args.gcpProjectId,
    location: args.location,
    region: args.region,
    datasetId: args.datasetId,
    cwsItemId: args.cwsItemId,
    cwsItemSlug: args.cwsItemSlug,
    productLabel: "modreq",
    loaderAccountId: "cws-etl-runner",
    gcpServiceAccountKeyB64: args.gcpServiceAccountKeyB64,
    sourceArchive: new pulumi.asset.FileArchive(deployDir),
    sourceBucketName: `${args.gcpProjectId}-cws-listing-source`,
    functionName: "cws-listing-etl",
    schedulerJobName: "cws-listing-daily",
    schedulerAccountId: "cws-listing-sched",
    datasetDescription:
      "Chrome Web Store product analytics (modreq listing + dashboard CSV ETL)",
    adoptExisting: adopt,
    ...(adopt
      ? {
          datasetImportId: `projects/${args.gcpProjectId}/datasets/${args.datasetId}`,
        }
      : {}),
  });
}
