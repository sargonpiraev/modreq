import "dotenv/config";
import path from "node:path";
import { fileURLToPath } from "node:url";
import * as pulumi from "@pulumi/pulumi";
import {
  createExtappProductAnalytics,
  repoHasExtapp,
} from "./extapp-analytics.ts";

/**
 * Official providers: GCP via shared Extapp (CWS listing → product_cws).
 * Meta telegram digest / warehouse readers still query product_cws — ownership
 * of the listing ETL lives here (migrated from meta pulumi/dwhapp).
 */
const __dirname = path.dirname(fileURLToPath(import.meta.url));
const repoRoot = path.resolve(__dirname, "..");
process.env.PATH = `${path.join(__dirname, "node_modules", ".bin")}:${process.env.PATH ?? ""}`;

if (!repoHasExtapp(repoRoot)) {
  throw new Error(
    "modreq expects apps/extapp — product analytics (CWS → BQ) are required",
  );
}

const extapp = createExtappProductAnalytics({
  gcpProjectId: "sargonpiraev",
  location: "EU",
  region: "europe-west1",
  datasetId: "product_cws",
  cwsItemId: "calgkmpccmankefjidecombecabommmm",
  cwsItemSlug: "modreq",
  gcpServiceAccountKeyB64: process.env.GCP_SERVICE_ACCOUNT_KEY!,
  adoptExisting: true,
});

export const productCwsDatasetId = extapp.datasetId;
export const cwsListingFunctionUrl = extapp.functionUrl;
export const cwsListingScheduleJobName = extapp.scheduleJobName;
export const cwsItemId = extapp.cwsItemId;
export const cwsEtlRunnerEmail = extapp.loaderSa.email;
export const cwsListingSchedule = pulumi.output("0 0 * * * Europe/Moscow");
