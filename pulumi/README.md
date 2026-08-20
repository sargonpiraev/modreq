# `@repo/pulumi` (modreq)

**Product analytics** for `apps/extapp` via shared `Extapp` ComponentResource (CWS listing → BigQuery `product_cws` + Gen1 CF + Scheduler).

## Product analytics (`apps/extapp`) — SSOT

Package: [`@sargonpiraev/pulumi-apps`](https://www.npmjs.com/package/@sargonpiraev/pulumi-apps)  
Class / type token: `Extapp` / `sargonpiraev:apps:Extapp`

Thin project wrapper: [`extapp-analytics.ts`](./extapp-analytics.ts) → `createExtappProductAnalytics`.

| Child | Notes |
|---|---|
| `gcp:bigquery/dataset:Dataset` `product_cws` | EU; adopt/protect from former meta ownership |
| `modreq_listing_daily` table | public listing snapshot |
| Gen1 CF `cws-listing-etl` + Scheduler `cws-listing-daily` | source in [`functions/cws-listing`](./functions/cws-listing/) |
| SA `cws-etl-runner` | BQ jobUser + dataset dataEditor |
| Scheduler SA | live accountId `cws-listing-scheduler` (not Extapp default `cws-listing-sched`) |

Dashboard CSV scrape / `modreq_metrics_daily` (Playwright) is **not** in `Extapp` — still **meta-owned** (`cws-modreq-metrics-daily` + `etl_runs` + reader IAM).

Telegram digest / warehouse readers still query `sargonpiraev.product_cws` — only **ownership** of the listing ETL lives in this stack.

### Unit tests (Pulumi mocks)

```bash
npm run test:pulumi   # from modreq root, or: npm --prefix pulumi run test:pulumi
```

When `apps/extapp` is present, asserts the stack registers the shared **ComponentResource** type token (plus key children). Not a live GCP integration test.

## Day-to-day

```bash
cd pulumi
cp .env.example .env   # once; GCP_SERVICE_ACCOUNT_KEY from meta pulumi/.env
npm install
export PULUMI_BACKEND_URL="file://$PWD"
export PATH="$(pwd)/node_modules/.bin:$PATH"
pulumi stack select prod
npm run preview
npm run up
```

## Cutover from meta (done 2026-08-19)

Live resources were imported into modreq `prod`, then removed from meta **state only** (no cloud destroy).

### Imported into modreq

| Logical name | GCP id |
|---|---|
| `extapp-dataset` | `projects/sargonpiraev/datasets/product_cws` |
| `extapp-loader` | `…/cws-etl-runner@sargonpiraev.iam.gserviceaccount.com` |
| `extapp-etl-scheduler` | `…/cws-listing-scheduler@…` |
| `extapp-etl-source` | `sargonpiraev-cws-listing-source` |
| `extapp-listing-table` | `…/tables/modreq_listing_daily` |
| `extapp-etl-fn` | `…/functions/cws-listing-etl` |
| `extapp-etl-schedule` | `…/jobs/cws-listing-daily` |

IAM bindings + project API enables + CF source zip were **created** (idempotent) rather than imported.

### State-deleted from meta (no destroy)

Dataset, listing table, loader/scheduler SAs, bucket + zip, CF + invoker, scheduler job, related IAM, `cws-listing-cloudfunctions-api`, `cws-listing-storage-api`.

Dataset delete required stripping stale Pulumi deps from still-meta resources (`modreq_metrics_daily`, `etl_runs`, `cws-reader-dataset-viewer`) via stack export/edit/import first.

### Leftovers (intentional / later)

| Item | Owner / status |
|---|---|
| `product_cws.modreq_metrics_daily` + `etl_runs` | **meta** still |
| `cws-reader-dataset-viewer` (bq-analytics-reader) | **meta** still |
| Optional Cloud Run dashboard ETL (`CWS_ETL_IMAGE`) | meta, gated by env |
| Secret `cws-modreq-dashboard-storage-state` | manual / IAM gap |
| Meta stack outputs (`cwsListingFunctionUrl`, …) | point at modreq; refresh on next meta `up` |
| Unrelated meta preview: `finops-sources-source-zip` replace | not part of CWS cutover |
| Extapp default `schedulerAccountId` | keep pin `cws-listing-scheduler` in this wrapper |
