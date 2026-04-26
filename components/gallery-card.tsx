import Link from "next/link";
import { AddToCartButton } from "@/components/add-to-cart-button";
import { formatCurrency } from "@/lib/format";
import { Product } from "@/lib/types";

export function GalleryCard({ product }: { product: Product }) {
  return (
    <article className="gallery-card">
      <Link href={`/prints/${product.slug}`}>
        <img
          className="gallery-card__image"
          src={product.previewUrl || product.imageUrl}
          alt={product.title}
        />
      </Link>

      <div className="gallery-card__body">
        <div className="badge">{product.category}</div>
        <div>
          <h3>{product.title}</h3>
          <p className="gallery-card__meta">{product.description}</p>
        </div>
        <div className="price-row">
          <span className="price">{formatCurrency(product.price)}</span>
          <AddToCartButton product={product} />
        </div>
      </div>
    </article>
  );
}
