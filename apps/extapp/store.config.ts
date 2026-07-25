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
    /**
     * Paste these into Chrome Web Store Developer Dashboard (no listing API).
     * Title/short description also ship via manifest on zip submit.
     */
    copy: {
      name: 'modreq - Modify HTTP Headers',
      shortDescription:
        'Modify HTTP request headers and cookies. Replace or append headers, override cookies. Free ModHeader alternative.',
      detailedDescription: `modreq is a free Chrome extension to modify HTTP request headers and cookies — a simple ModHeader alternative for developers and QA.

Replace or append request headers on matching traffic. Override cookie values on the site in your active tab. Toggle rules on or off instantly. Everything stays local in your browser — no account, no cloud sync, no tracking.

Features:
• Replace or append HTTP request headers (Authorization, X-Forwarded-For, custom headers, and more)
• Override cookies on the current site without DevTools gymnastics
• Enable/disable each rule with one click
• Lightweight MV3 extension — rules apply via declarativeNetRequest

Use cases:
• Test APIs with custom Authorization or feature-flag headers
• Debug CORS / proxy scenarios with X-Forwarded-For
• Swap session cookies between environments
• Quickly A/B header values while browsing

Privacy: all rules are stored locally. modreq does not collect or send your data.`,
    },
    graphicAssets: {
      storeIcon: {
        source: 'store/chrome/store-icon-128.png',
        width: 128,
        height: 128,
        noAlpha: false,
      },
      screenshots: [
        // Choose modification type — headers vs cookies
        {
          source: 'store/chrome/screenshot-1280x800-pick-modification-type.png',
          width: 1280,
          height: 800,
          noAlpha: true,
        },
        // Header editor — Replace / Append modes
        {
          source: 'store/chrome/screenshot-1280x800-header-editor.png',
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
      promoVideo: {
        youtubeUrl: 'https://youtu.be/dzVhPmqZAQ8',
      },
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
