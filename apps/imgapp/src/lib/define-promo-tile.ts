export type PromoTileDef = {
  code: string;
  /** Output basename without extension. */
  file: string;
  storyId: string;
  width: number;
  height: number;
  waitFor: string;
};

export function definePromoTile(def: PromoTileDef): PromoTileDef {
  return def;
}
