import { defineStoreScreenshot } from '../lib/define-store-screenshot';

export default defineStoreScreenshot({
  code: 'header-rule',
  file: 'screenshot-1280x800-header-rule',
  storyId: 'store-screenshots--header-applied',
  waitFor: 'X-Debug-Token',
});
