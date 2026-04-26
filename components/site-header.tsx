"use client";

import Link from "next/link";
import { useCart } from "@/components/cart-context";

export function SiteHeader() {
  const { itemCount } = useCart();

  return (
    <header className="site-header">
      <div className="page-shell site-header__inner">
        <Link href="/" className="site-brand">
          <span className="site-brand__eyebrow">Photography Store</span>
          <span className="site-brand__name">Your Name Studio</span>
        </Link>

        <nav className="site-nav">
          <Link className="site-nav__link" href="/#portfolio">
            Portfolio
          </Link>
          <Link className="site-nav__link" href="/#downloads">
            Downloads
          </Link>
          <Link className="site-nav__cta" href="/cart">
            Cart ({itemCount})
          </Link>
        </nav>
      </div>
    </header>
  );
}
