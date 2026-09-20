# `@repo/pulumi` (modreq)

**Product analytics** for `apps/extapp` via shared `Extapp` ComponentResource (CWS item id in code; store metrics are meta chrome-vm Developer Dashboard scrape).

## Product analytics (`apps/extapp`) — SSOT

Package: [`@sargonpiraev/pulumi-apps`](https://www.npmjs.com/package/@sargonpiraev/pulumi-apps)  
Class / type token: `Extapp` / `sargonpiraev:apps:Extapp`

Construct in `apps/extapp/pulumi.ts`: `new Extapp(...)`.

| Child                                | Notes                                             |
| ------------------------------------ | ------------------------------------------------- |
| `gcp:bigquery/dataset:Dataset` `cws` | EU; adopt/protect. Metrics tables are meta-owned. |
| `cwsItemId` / `cwsItemSlug`          | Required in code; API cannot create the CWS item  |

Public listing ETL (CF `cws-listing-etl`) is removed. Dashboard: meta `npm run cws-devconsole:import`.
