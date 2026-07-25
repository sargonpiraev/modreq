export type StoreScreenshotDef = {
  /** Scene slug — also the recipe filename stem. */
  code: string;
  /** Output basename without extension (matches store.config.ts). */
  file: string;
  /** Storybook story id (`store-screenshots--…`). */
  storyId: string;
  /** Text that must appear before capture. */
  waitFor: string;
};

export function defineStoreScreenshot(def: StoreScreenshotDef): StoreScreenshotDef {
  return def;
}
