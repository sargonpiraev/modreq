import type { chromewebstore_v2 } from '@googleapis/chromewebstore';

import type { StoreListing } from './store.config.schema';

/** Re-export official Chrome Web Store API v2 types. */
export type { chromewebstore_v2 };

export type PublishItemRequest = chromewebstore_v2.Schema$PublishItemRequest;
export type DeployInfo = chromewebstore_v2.Schema$DeployInfo;
export type FetchItemStatusResponse = chromewebstore_v2.Schema$FetchItemStatusResponse;
export type UploadItemPackageResponse = chromewebstore_v2.Schema$UploadItemPackageResponse;

/**
 * Expo `store.config` analog for Chrome Web Store.
 *
 * - `submit` → official API types (`publishers.items.publish` requestBody)
 * - `storeListing` → dashboard-only assets (Zod-validated, no official API types)
 */
export type StoreConfig = {
  /** Item ID — `publishers/{publisherId}/items/{itemId}` */
  itemId: string;
  publisherId?: string;
  /** eas.json `submit` profile — automated via API */
  submit: PublishItemRequest;
  /** EAS Metadata — uploaded manually in Developer Dashboard */
  storeListing: StoreListing;
};
