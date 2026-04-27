import { COLLECTIONS, CollectionSlug } from "@/lib/collections";
import { CollectionPageClient } from "@/components/collection-page-client";

export async function generateStaticParams() {
  return COLLECTIONS.map((c) => ({ slug: c.slug }));
}

export default async function CollectionPage({
  params
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const collection = COLLECTIONS.find((c) => c.slug === slug) ?? null;

  return <CollectionPageClient slug={slug as CollectionSlug} collection={collection} />;
}
