import { z } from 'zod';

/**
 * Zod validation for store.config.ts `storeListing` section.
 *
 * No official @googleapis/chromewebstore types exist for listing graphic assets —
 * the API has no listing endpoint. Specs from:
 * https://developer.chrome.com/docs/webstore/images
 */

const pngOrJpeg = /\.(png|jpe?g)$/i;

const ImageAsset = z.object({
  source: z.string().regex(pngOrJpeg, 'must be a .png or .jpg/.jpeg file'),
  width: z.number().int().positive(),
  height: z.number().int().positive(),
  noAlpha: z.boolean(),
});

export type ImageAssetSpec = z.infer<typeof ImageAsset>;

const StoreIcon = ImageAsset.extend({
  width: z.literal(128),
  height: z.literal(128),
  noAlpha: z.literal(false),
});

const Screenshot = ImageAsset.extend({
  noAlpha: z.literal(true),
}).refine(
  (a) =>
    (a.width === 1280 && a.height === 800) || (a.width === 640 && a.height === 400),
  { message: 'screenshot must be 1280x800 or 640x400' },
);

const SmallPromoTile = ImageAsset.extend({
  width: z.literal(440),
  height: z.literal(280),
  noAlpha: z.literal(true),
});

const MarqueePromoTile = ImageAsset.extend({
  width: z.literal(1400),
  height: z.literal(560),
  noAlpha: z.literal(true),
});

const PromoVideo = z.object({
  youtubeUrl: z.string().url().regex(/youtube\.com|youtu\.be/, 'must be a YouTube URL'),
});

export const StoreListingSchema = z.object({
  graphicAssets: z.object({
    storeIcon: StoreIcon,
    screenshots: z.array(Screenshot).min(1).max(5),
    promoVideo: PromoVideo.optional(),
    smallPromoTile: SmallPromoTile,
    marqueePromoTile: MarqueePromoTile.optional(),
  }),
});

export type StoreListing = z.infer<typeof StoreListingSchema>;

export const StoreConfigSchema = z.object({
  itemId: z.string(),
  publisherId: z.string().optional(),
  submit: z.object({
    blockOnWarnings: z.boolean().optional(),
    deployInfos: z
      .array(
        z.object({
          deployPercentage: z.number().min(0).max(100).nullable().optional(),
        }),
      )
      .optional(),
    publishType: z.string().optional(),
    skipReview: z.boolean().optional(),
  }),
  storeListing: StoreListingSchema,
});
