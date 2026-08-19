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

Dashboard CSV scrape / `modreq_metrics_daily` (Playwright) is **not** in `Extapp` — optional meta Cloud Run path or later project job.

Telegram digest / warehouse readers still query `sargonpiraev.product_cws` — only **ownership** of the listing ETL lives in this stack.

### Unit tests (Pulumi mocks)

```bash
npm run test:pulumi   # from modreq root, or: npm --prefix pulumi run test:pulumi
```

When `apps/extapp` is present, asserts the stack registers the shared **ComponentResource** type token (plus key children). Not a live GCP integration test.

## Operator: adopt from meta (once)

Live GCP resources already exist under meta stack `meta`. Transfer without destroy:

```bash
# 1) Pack CF source + import/adopt under modreq
cd modreq/pulumi
cp .env.example .env   # GCP_SERVICE_ACCOUNT_KEY from meta pulumi/.env
export PULUMI_BACKEND_URL="file://$PWD"
npm install
npm run pack:cws-etl
pulumi stack init prod   # once
pulumi stack select prod
npm run preview
# Prefer import for SA / CF / bucket / listing table if preview shows create conflicts:
#   pulumi import 'gcp:serviceaccount/account:Account' 'extapp-loader' \
#     'projects/sargonpiraev/serviceAccounts/cws-etl-runner@sargonpiraev.iam.gserviceaccount.com'
# (dataset uses adoptExisting + datasetImportId)
npm run up

# 2) meta — drop listing creates from program, then remove from STATE only:
cd ../../pulumi
export PULUMI_BACKEND_URL="file://$PWD"
pulumi stack select meta
# Example (adjust URNs from `pulumi stack --show-urns`):
# pulumi state delete 'urn:…::gcp:bigquery/dataset:Dataset::product-cws' --yes
# … listing table, cws-listing-etl CF, bucket, scheduler, related IAM …
pulumi preview     # must NOT propose destroying product_cws
```

```bash
cd pulumi
cp .env.example .env
npm install
export PULUMI_BACKEND_URL="file://$PWD"
export PATH="$(pwd)/node_modules/.bin:$PATH"
pulumi stack select prod
npm run preview
npm run up
```
