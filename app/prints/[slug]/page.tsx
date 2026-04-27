import { ProductPageClient } from "@/components/product-page-client";
import { fallbackProducts } from "@/lib/fallback-products";

export async function generateStaticParams() {
  const products = fallbackProducts;
  return products.length > 0
    ? products.map((product) => ({ slug: product.slug }))
    : [{ slug: "__placeholder__" }];
}

export default async function ProductPage({
  params
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const product = fallbackProducts.find((entry) => entry.slug === slug) ?? null;

  return (
    <ProductPageClient slug={slug} initialProduct={product} />
  );
}
