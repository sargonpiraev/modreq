import { defineStoreScreenshot } from '../lib/define-store-screenshot';

export default defineStoreScreenshot({
  code: 'pick-modification-type',
  file: 'screenshot-1280x800-pick-modification-type',
  storyId: 'store-screenshots--pick-type',
  waitFor: 'What do you want to change?',
});
