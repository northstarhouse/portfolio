import Link from "next/link";
import { notFound } from "next/navigation";
import { AddToCartButton } from "@/components/add-to-cart-button";
import { formatCurrency } from "@/lib/format";
import { getProductBySlug, getProducts } from "@/lib/supabase";

export async function generateStaticParams() {
  const products = await getProducts();
  return products.map((product) => ({ slug: product.slug }));
}

export default async function ProductPage({
  params
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const product = await getProductBySlug(slug);

  if (!product) {
    notFound();
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
