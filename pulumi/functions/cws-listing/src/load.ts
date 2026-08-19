import { randomUUID } from "node:crypto";
import { BigQuery } from "@google-cloud/bigquery";
import { BQ_DATASET, BQ_LOCATION, GCP_PROJECT } from "./config";
import { fetchPublicListing } from "./fetch-listing";
import type { EtlRunRow, ListingDailyRow } from "./types";

const LISTING_TABLE = "modreq_listing_daily";
const RUNS_TABLE = "etl_runs";

function client(): BigQuery {
  return new BigQuery({ projectId: GCP_PROJECT, location: BQ_LOCATION });
}

async function deleteListingDay(
  bq: BigQuery,
  itemId: string,
  snapshotDate: string,
): Promise<void> {
  await bq.query({
    query: `
      DELETE FROM \`${GCP_PROJECT}.${BQ_DATASET}.${LISTING_TABLE}\`
      WHERE item_id = @itemId AND snapshot_date = @snapshotDate
    `,
    params: { itemId, snapshotDate },
    location: BQ_LOCATION,
  });
}

async function insertListing(rows: ListingDailyRow[]): Promise<number> {
  if (rows.length === 0) return 0;
  const bq = client();
  for (const row of rows) {
    await deleteListingDay(bq, row.item_id, row.snapshot_date);
  }
  await bq.dataset(BQ_DATASET).table(LISTING_TABLE).insert(rows);
  return rows.length;
}

async function insertRun(row: EtlRunRow): Promise<void> {
  await client().dataset(BQ_DATASET).table(RUNS_TABLE).insert([row]);
}

export type ListingLoadResult = {
  runId: string;
  status: "ok" | "partial" | "error";
  listingRows: number;
  snapshot_date?: string;
  users?: number | null;
  version?: string | null;
  errorMessage: string | null;
};

/** Listing-only ETL (no Playwright / dashboard). */
export async function loadCwsListing(): Promise<ListingLoadResult> {
  const runId = randomUUID();
  const startedAt = new Date().toISOString();
  let listingRows = 0;
  let status: "ok" | "partial" | "error" = "ok";
  let errorMessage: string | null = null;
  let listing: ListingDailyRow | undefined;

  try {
    listing = await fetchPublicListing();
    listingRows = await insertListing([listing]);
  } catch (err) {
    status = "error";
    errorMessage = err instanceof Error ? err.message : String(err);
  }

  const finishedAt = new Date().toISOString();
  await insertRun({
    run_id: runId,
    started_at: startedAt,
    finished_at: finishedAt,
    status,
    sources: listingRows > 0 ? "public_listing" : "",
    listing_rows: listingRows,
    metrics_rows: 0,
    error_message: errorMessage,
  });

  if (status === "error") {
    throw new Error(errorMessage ?? "cws listing ETL failed");
  }

  return {
    runId,
    status,
    listingRows,
    snapshot_date: listing?.snapshot_date,
    users: listing?.users,
    version: listing?.version,
    errorMessage,
  };
}
