import path from "node:path";
import { fileURLToPath } from "node:url";
import * as pulumi from "@pulumi/pulumi";
import {
  Extapp,
  EXTAPP_TYPE,
  repoHasExtapp,
} from "@sargonpiraev/pulumi-apps";

export { Extapp, EXTAPP_TYPE, repoHasExtapp };

/** Same contract as `@sargonpiraev/pulumi-apps` Extapp — keep until that export is published. */
export const CWS_DEV_CONSOLE_URL =
  "https://chrome.google.com/webstore/devconsole";

export function cwsPublicListingUrl(
  cwsItemSlug: string,
  cwsItemId: string,
): string {
  return `https://chromewebstore.google.com/detail/${cwsItemSlug}/${cwsItemId}`;
}

export function requireCwsItemId(cwsItemId: string): string {
  const id = cwsItemId.trim();
  if (id === "") {
    throw new Error(
      `CWS item id is required in stack code (not env). Create the item in Chrome Web Store Developer Dashboard (${CWS_DEV_CONSOLE_URL}), then set Extapp cwsItemId.`,
    );
  }
  return id;
}

export function requireCwsItemSlug(cwsItemSlug: string): string {
  const slug = cwsItemSlug.trim();
  if (slug === "") {
    throw new Error(
      `CWS item slug is required in stack code (not env). Create the item in Chrome Web Store Developer Dashboard (${CWS_DEV_CONSOLE_URL}), then set Extapp cwsItemSlug.`,
    );
  }
  return slug;
}

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
  const cwsItemId = requireCwsItemId(args.cwsItemId);
  const cwsItemSlug = requireCwsItemSlug(args.cwsItemSlug);

  return new Extapp("extapp", {
    gcpProjectId: args.gcpProjectId,
    location: args.location,
    region: args.region,
    datasetId: args.datasetId,
    cwsItemId,
    cwsItemSlug,
    productLabel: "modreq",
    loaderAccountId: "cws-etl-runner",
    gcpServiceAccountKeyB64: args.gcpServiceAccountKeyB64,
    sourceArchive: new pulumi.asset.FileArchive(deployDir),
    sourceBucketName: `${args.gcpProjectId}-cws-listing-source`,
    functionName: "cws-listing-etl",
    schedulerJobName: "cws-listing-daily",
    // Match live meta SA accountId (not the Extapp default `cws-listing-sched`).
    schedulerAccountId: "cws-listing-scheduler",
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
