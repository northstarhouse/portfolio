"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { AddToCartButton } from "@/components/add-to-cart-button";
import { formatCurrency } from "@/lib/format";
import { fetchBrowserProductBySlug } from "@/lib/supabase-browser";
import { Product } from "@/lib/types";

type ProductPageClientProps = {
  slug: string;
  initialProduct: Product | null;
};

export function ProductPageClient({
  slug,
  initialProduct
}: ProductPageClientProps) {
  const [product, setProduct] = useState<Product | null>(initialProduct);

  useEffect(() => {
    let active = true;

    fetchBrowserProductBySlug(slug).then((nextProduct) => {
      if (active && nextProduct) {
        setProduct(nextProduct);
      }
    });

    return () => {
      active = false;
    };
  }, [slug]);

  if (!product) {
    return (
      <main className="page-shell">
        <section className="product-layout">
          <div className="empty-state">This photo could not be found.</div>
        </section>
      </main>
    );
  }

  return (
    <main className="page-shell">
      <section className="product-layout">
        <div>
          <img className="product-image" src={product.imageUrl} alt={product.title} />
        </div>

        <aside className="product-panel">
          <div className="badge">{product.category}</div>
          <h1 className="product-title">{product.title}</h1>
          <p className="product-copy">{product.description}</p>

          <div className="product-meta">
            <span className="price">{formatCurrency(product.price)}</span>
            <span className="muted">{product.downloadLabel}</span>
          </div>

          <div className="stack-inline">
            <AddToCartButton product={product} />
            <Link className="button-secondary" href="/cart">
              View cart
            </Link>
          </div>

          <div className="notice">
            Recommended fulfillment path: charge through Stripe, store the order
            in Supabase, then issue a short-lived signed download URL after
            payment confirmation.
          </div>
        </aside>
      </section>
    </main>
  );
}
