import { definePromoTile } from '../lib/define-promo-tile';

export default definePromoTile({
  code: 'marquee',
  file: 'promo-tile-marquee-1400x560',
  storyId: 'store-promotiles--marquee',
  width: 1400,
  height: 560,
  waitFor: 'Modify HTTP request headers',
});
