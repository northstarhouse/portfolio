export type CollectionSlug =
  | "nevada-city"
  | "grass-valley"
  | "local-events"
  | "creeks-rivers-trails"
  | "love-letters";

export const COLLECTIONS: Array<{ slug: CollectionSlug; name: string }> = [
  { slug: "nevada-city", name: "Nevada City" },
  { slug: "grass-valley", name: "Grass Valley" },
  { slug: "local-events", name: "Local Events & Gatherings" },
  { slug: "creeks-rivers-trails", name: "Creeks, Rivers & Trails" },
  { slug: "love-letters", name: "Love Letters" }
];

export function collectionName(slug: CollectionSlug): string {
  return COLLECTIONS.find((c) => c.slug === slug)?.name ?? slug;
}
