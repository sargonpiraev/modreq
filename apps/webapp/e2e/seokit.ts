import { expect as baseExpect, test } from '@playwright/test';
import { extendSeokitExpect } from '@sargonpiraev/seokit';

export const expect = extendSeokitExpect(baseExpect);
export { test };
