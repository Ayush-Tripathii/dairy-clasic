/** Recipe index. Copy lives in messages under recipes.items.<slug>. */
export type Recipe = { slug: string; product: string; tint: string };

export const recipes: Recipe[] = [
  { slug: "creamica-milkshake", product: "creamica-vanilla", tint: "var(--tint-cups)" },
  { slug: "cassatta-party-slices", product: "classic-cassatta", tint: "var(--tint-cassatta)" },
  { slug: "super-vanilla-affogato", product: "super-vanilla", tint: "var(--tint-biscuit)" },
];
