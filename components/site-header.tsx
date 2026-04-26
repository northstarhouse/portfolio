"use client";

import Link from "next/link";
import { useState } from "react";
import { useCart } from "@/components/cart-context";

export function SiteHeader() {
  const { itemCount } = useCart();
  const [menuOpen, setMenuOpen] = useState(false);

  function closeMenu() {
    setMenuOpen(false);
  }

  return (
    <>
      <header className="site-header">
        <div className="header-inner">
          <Link href="/#home" className="logo" onClick={closeMenu}>
            Haley Wright &amp; Co.
          </Link>

          <nav className="desktop-nav">
            <Link href="/#home" className="nav-item">
              Home
            </Link>

            <div className="nav-item nav-item--dropdown">
              <span>Collections</span>
              <div className="dropdown">
                <Link href="/#collections">Golden Landscapes</Link>
                <Link href="/#collections">Historic Spaces</Link>
                <Link href="/#collections">Seasonal Light</Link>
                <Link href="/#collections">Everyday Nevada County</Link>
                <Link href="/#collections">Local Events</Link>
              </div>
            </div>

            <Link href="/#shop" className="nav-item">
              Shop
            </Link>
            <Link href="/#about" className="nav-item">
              About
            </Link>
            <Link href="/#contact" className="nav-item">
              Contact
            </Link>
          </nav>

          <div className="header-right">
            <Link href="/cart" className="cart-btn" aria-label="Cart">
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.4"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z" />
                <line x1="3" y1="6" x2="21" y2="6" />
                <path d="M16 10a4 4 0 0 1-8 0" />
              </svg>
              <span className="cart-count">{itemCount}</span>
            </Link>

            <button
              type="button"
              className={`hamburger${menuOpen ? " is-open" : ""}`}
              aria-label="Menu"
              aria-expanded={menuOpen}
              onClick={() => setMenuOpen((current) => !current)}
            >
              <span />
              <span />
              <span />
            </button>
          </div>
        </div>
      </header>

      <div className={`mobile-nav${menuOpen ? " open" : ""}`}>
        <Link href="/#home" onClick={closeMenu}>
          Home
        </Link>
        <Link href="/#collections" onClick={closeMenu}>
          Collections
        </Link>
        <Link href="/#collections" className="sub" onClick={closeMenu}>
          — Golden Landscapes
        </Link>
        <Link href="/#collections" className="sub" onClick={closeMenu}>
          — Historic Spaces
        </Link>
        <Link href="/#collections" className="sub" onClick={closeMenu}>
          — Seasonal Light
        </Link>
        <Link href="/#collections" className="sub" onClick={closeMenu}>
          — Everyday Nevada County
        </Link>
        <Link href="/#shop" onClick={closeMenu}>
          Shop
        </Link>
        <Link href="/#about" onClick={closeMenu}>
          About
        </Link>
        <Link href="/#contact" onClick={closeMenu}>
          Contact
        </Link>
      </div>
    </>
  );
}
