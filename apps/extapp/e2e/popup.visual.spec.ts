import { expect, test } from './fixtures';
import { openPopup } from './helpers';

test.describe('popup visual', () => {
  test('popup full UI', async ({ context, extensionId }) => {
    const popup = await context.newPage();
    await popup.setViewportSize({ width: 380, height: 560 });
    await openPopup(popup, extensionId);
    await expect(popup.getByRole('button', { name: 'Add modification' })).toBeVisible();
    await expect(popup).toHaveScreenshot('popup.png');
  });
});
