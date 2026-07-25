import { definePromoTile } from '../lib/define-promo-tile';

export default definePromoTile({
  code: 'small',
  file: 'promo-tile-small-440x280',
  storyId: 'store-promotiles--small',
  width: 440,
  height: 280,
  waitFor: 'modreq',
});
