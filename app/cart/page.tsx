"use client";

import Link from "next/link";
import { useCart } from "@/components/cart-context";
import { SafeImage } from "@/components/safe-image";
import { formatCurrency } from "@/lib/format";

export default function CartPage() {
  const { items, subtotal, removeItem, updateQuantity, clearCart } = useCart();

  return (
    <main className="page-shell">
      <section className="cart-layout">
        <div className="cart-panel">
          <div className="section-kicker">Your Cart</div>
          <h1 className="section-title">Prepare the download order.</h1>

          {items.length === 0 ? (
            <div className="empty-state">
              <p>Your cart is empty.</p>
              <Link className="button-secondary" href="/">
                Return to gallery
              </Link>
            </div>
          ) : (
            <>
              {items.map((item) => (
                <article className="cart-item" key={item.id}>
                  <SafeImage
                    className="cart-item__thumb"
                    fallbackClassName="cart-item__thumb cart-item__thumb--empty"
                    fallbackLabel="No image"
                    src={item.previewUrl || item.imageUrl}
                    alt={item.title}
                  />
                  <div>
                    <h3>{item.title}</h3>
                    <p className="muted">{item.downloadLabel}</p>
                    <div className="quantity-picker">
                      <button
                        className="quantity-button"
                        type="button"
                        onClick={() =>
                          updateQuantity(item.id, Math.max(0, item.quantity - 1))
                        }
                      >
                        -
                      </button>
                      <span>{item.quantity}</span>
                      <button
                        className="quantity-button"
                        type="button"
                        onClick={() => updateQuantity(item.id, item.quantity + 1)}
                      >
                        +
                      </button>
                    </div>
                  </div>
                  <div>
                    <div className="price">{formatCurrency(item.price * item.quantity)}</div>
                    <button
                      className="button-secondary"
                      type="button"
                      onClick={() => removeItem(item.id)}
                    >
                      Remove
                    </button>
                  </div>
                </article>
              ))}
            </>
          )}
        </div>

        <aside className="cart-panel">
          <div className="section-kicker">Order Summary</div>
          <h2 className="product-title">Checkout placeholder</h2>
          <div className="summary-row">
            <span>Subtotal</span>
            <span>{formatCurrency(subtotal)}</span>
          </div>
          <div className="summary-row">
            <span>Delivery</span>
            <span>Digital</span>
          </div>
          <div className="summary-row">
            <span>Payment</span>
            <span>To be connected</span>
          </div>
          <div className="summary-row summary-total">
            <span>Total</span>
            <span>{formatCurrency(subtotal)}</span>
          </div>
          <p className="muted">
            This page is ready for Stripe checkout or another payment provider.
            After payment succeeds, the next step is generating secure download
            access.
          </p>
          <div className="stack-inline">
            <button className="button" type="button" disabled={items.length === 0}>
              Checkout soon
            </button>
            <button className="button-secondary" type="button" onClick={clearCart}>
              Clear cart
            </button>
          </div>
        </aside>
      </section>
    </main>
  );
}
