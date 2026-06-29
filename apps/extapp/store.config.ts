import type { StoreConfig } from './store.config.types';

/**
 * modreq Chrome Web Store config — Expo `store.config` convention.
 *
 *   submit        → API (zip upload + publish), typed via @googleapis/chromewebstore
 *   storeListing  → dashboard-only graphic assets in store/chrome/, validated via Zod
 *
 * Asset file names: `{property}-{width}x{height}-{scene}.png`
 *   storeIcon        → store-icon-128.png
 *   screenshots[]    → screenshot-1280x800-*.png
 *   smallPromoTile   → promo-tile-small-440x280.png
 *   marqueePromoTile → promo-tile-marquee-1400x560.png
 *
 * Validate: npm run validate:store --workspace=extapp
 */
const storeConfig = {
  itemId: 'calgkmpccmankefjidecombecabommmm',
  submit: {
    skipReview: true,
  },
  storeListing: {
    graphicAssets: {
      storeIcon: {
        source: 'store/chrome/store-icon-128.png',
        width: 128,
        height: 128,
        noAlpha: false,
      },
      screenshots: [
        // Empty home — CTA «Add modification»
        {
          source: 'store/chrome/screenshot-1280x800-empty-home.png',
          width: 1280,
          height: 800,
          noAlpha: true,
        },
        // Choose modification type — headers vs cookies
        {
          source: 'store/chrome/screenshot-1280x800-pick-modification-type.png',
          width: 1280,
          height: 800,
          noAlpha: true,
        },
        // Home with an active request-header rule
        {
          source: 'store/chrome/screenshot-1280x800-header-rule.png',
          width: 1280,
          height: 800,
          noAlpha: true,
        },
        // Home with an active cookie-replace rule
        {
          source: 'store/chrome/screenshot-1280x800-cookie-rule.png',
          width: 1280,
          height: 800,
          noAlpha: true,
        },
        // Home with both header and cookie rules enabled
        {
          source: 'store/chrome/screenshot-1280x800-header-and-cookie-rules.png',
          width: 1280,
          height: 800,
          noAlpha: true,
        },
      ],
      smallPromoTile: {
        source: 'store/chrome/promo-tile-small-440x280.png',
        width: 440,
        height: 280,
        noAlpha: true,
      },
      marqueePromoTile: {
        source: 'store/chrome/promo-tile-marquee-1400x560.png',
        width: 1400,
        height: 560,
        noAlpha: true,
      },
    },
  },
} satisfies StoreConfig;

export default storeConfig;
