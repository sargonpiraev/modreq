export const GCP_PROJECT = process.env.GOOGLE_CLOUD_PROJECT ?? "sargonpiraev";
export const BQ_DATASET = process.env.GCP_BQ_CWS_DATASET ?? "product_cws";
export const BQ_LOCATION = process.env.GCP_BQ_LOCATION ?? "EU";
export const CWS_ITEM_ID =
  process.env.CWS_ITEM_ID ?? "calgkmpccmankefjidecombecabommmm";
export const CWS_ITEM_SLUG = process.env.CWS_ITEM_SLUG ?? "modreq";
export const CWS_LISTING_URL =
  process.env.CWS_LISTING_URL ??
  `https://chromewebstore.google.com/detail/${CWS_ITEM_SLUG}/${CWS_ITEM_ID}`;
