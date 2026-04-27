"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { AddToCartButton } from "@/components/add-to-cart-button";
import { SafeImage } from "@/components/safe-image";
import { CollectionSlug } from "@/lib/collections";
import { fetchBrowserProductsByCollection } from "@/lib/supabase-browser";
import { Product } from "@/lib/types";
import { formatCurrency } from "@/lib/format";

type CollectionPageClientProps = {
  slug: CollectionSlug;
  collection: { slug: CollectionSlug; name: string } | null;
};

export function CollectionPageClient({ slug, collection }: CollectionPageClientProps) {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchBrowserProductsByCollection(slug).then((results) => {
      setProducts(results);
      setLoading(false);
    });
  }, [slug]);

  const title = collection?.name ?? slug;

  return (
    <main className="collection-page">
      <div className="page-shell collection-page__inner">
        <header className="collection-header">
          <Link className="collection-back" href="/#collections">
            ← Collections
          </Link>
          <span className="section-eyebrow">Album</span>
          <h1 className="collection-title">{title}</h1>
        </header>

        {loading ? (
          <div className="collection-loading">Loading photos…</div>
        ) : products.length === 0 ? (
          <div className="empty-state">
            No photos in this album yet.
          </div>
        ) : (
          <div className="collection-grid">
            {products.map((product) => (
              <article key={product.id} className="collection-card">
                <Link className="collection-card__image-link" href={`/prints/${product.slug}`}>
                  <div className="collection-card__image-wrap">
                    <SafeImage
                      className="collection-card__image"
                      fallbackClassName="collection-card__image collection-card__image--empty"
                      fallbackLabel="No image"
                      src={product.previewUrl || product.imageUrl}
                      alt={product.title}
                      width={600}
                    />
                  </div>
                </Link>
                <div className="collection-card__body">
                  <div>
                    <span className="shop-tile__tag">{product.category}</span>
                    <h3 className="collection-card__title">
                      <Link href={`/prints/${product.slug}`}>{product.title}</Link>
                    </h3>
                    <p className="collection-card__price">{formatCurrency(product.price)}</p>
                  </div>
                  <AddToCartButton product={product} />
                </div>
              </article>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
