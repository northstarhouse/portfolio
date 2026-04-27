"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { AddToCartButton } from "@/components/add-to-cart-button";
import {
  InlineEditableImage,
  InlineEditableText,
  InlineEditToolbar
} from "@/components/inline-admin";
import {
  fetchBrowserProductBySlug,
  saveBrowserProduct,
  uploadBrowserImage
} from "@/lib/supabase-browser";
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
  const [dirty, setDirty] = useState(false);
  const [pending, setPending] = useState(false);
  const [status, setStatus] = useState("");

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

  async function savePage() {
    if (!product) {
      return;
    }

    setPending(true);
    setStatus("");

    try {
      await saveBrowserProduct(product);
      setDirty(false);
      setStatus("Saved.");
    } catch {
      setStatus("Save failed.");
    } finally {
      setPending(false);
    }
  }

  return (
    <main className="page-shell">
      <InlineEditToolbar dirty={dirty} pending={pending} status={status} onSave={savePage} />

      <section className="product-layout">
        <div>
          <InlineEditableImage
            src={product.imageUrl}
            alt={product.title}
            className="product-image"
            onChange={(file) => {
              void uploadBrowserImage(file).then((publicUrl) => {
                setProduct((current) =>
                  current
                    ? { ...current, imageUrl: publicUrl, previewUrl: publicUrl }
                    : current
                );
                setDirty(true);
                setStatus("Image updated. Save to publish.");
              });
            }}
          />
        </div>

        <aside className="product-panel">
          <div className="badge">{product.category}</div>
          <InlineEditableText
            as="h1"
            className="product-title"
            value={product.title}
            onChange={(value) => {
              setProduct((current) => (current ? { ...current, title: value } : current));
              setDirty(true);
            }}
          />
          <InlineEditableText
            as="p"
            className="product-copy"
            multiline
            value={product.description}
            onChange={(value) => {
              setProduct((current) =>
                current ? { ...current, description: value } : current
              );
              setDirty(true);
            }}
          />

          <div className="product-meta">
            <InlineEditableText
              as="span"
              className="price"
              value={String(product.price)}
              onChange={(value) => {
                setProduct((current) =>
                  current ? { ...current, price: Number(value) || current.price } : current
                );
                setDirty(true);
              }}
            />
            <InlineEditableText
              as="span"
              className="muted"
              value={product.downloadLabel}
              onChange={(value) => {
                setProduct((current) =>
                  current ? { ...current, downloadLabel: value } : current
                );
                setDirty(true);
              }}
            />
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
