import { expect, test } from './fixtures';
import { openPopup } from './helpers';

test('popup smoke: add-modification affordance is visible', async ({
  context,
  extensionId,
}) => {
  const popup = await context.newPage();
  await openPopup(popup, extensionId);
  await expect(popup.getByRole('button', { name: 'Add modification' })).toBeVisible();
});
