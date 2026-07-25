import { defineStoreScreenshot } from '../lib/define-store-screenshot';

export default defineStoreScreenshot({
  code: 'header-and-cookie-rules',
  file: 'screenshot-1280x800-header-and-cookie-rules',
  storyId: 'store-screenshots--both-rules',
  waitFor: 'Request headers',
});
