"use client";

import Link from "next/link";
import { useState } from "react";
import { useCart } from "@/components/cart-context";

export function SiteHeader() {
  const { itemCount } = useCart();
  const [menuOpen, setMenuOpen] = useState(false);
  const [collectionsOpen, setCollectionsOpen] = useState(false);

  const navItems = [
    { href: "/#shop", label: "Shop" },
    { href: "/#about", label: "About" },
    { href: "/#contact", label: "Contact" }
  ];

  function closeMenus() {
    setMenuOpen(false);
    setCollectionsOpen(false);
  }

  return (
    <header className="site-header">
      <div className="page-shell site-header__inner">
        <Link href="/#home" className="site-brand" onClick={closeMenus}>
          <span className="site-brand__name">Haley Wright &amp; Co.</span>
        </Link>

        <button
          type="button"
          className="site-menu-toggle"
          aria-expanded={menuOpen}
          aria-label="Toggle navigation menu"
          onClick={() => setMenuOpen((current) => !current)}
        >
          <span />
          <span />
          <span />
        </button>

        <div className={`site-nav-shell${menuOpen ? " is-open" : ""}`}>
          <nav className="site-nav">
            <Link className="site-nav__link" href="/#home" onClick={closeMenus}>
              Home
            </Link>

            <div
              className={`site-nav__dropdown${collectionsOpen ? " is-open" : ""}`}
            >
              <button
                type="button"
                className="site-nav__link site-nav__dropdown-toggle"
                aria-expanded={collectionsOpen}
                onClick={() => setCollectionsOpen((current) => !current)}
              >
                Collections
                <span className="site-nav__caret" aria-hidden="true">
                  ▾
                </span>
              </button>

              <div className="site-nav__dropdown-menu">
                <Link
                  className="site-nav__dropdown-link"
                  href="/#collections"
                  onClick={closeMenus}
                >
                  Nevada County Stories
                </Link>
                <Link
                  className="site-nav__dropdown-link"
                  href="/#collections"
                  onClick={closeMenus}
                >
                  Local Landscapes
                </Link>
                <Link
                  className="site-nav__dropdown-link"
                  href="/#shop"
                  onClick={closeMenus}
                >
                  Digital Photo Shop
                </Link>
              </div>
            </div>

            {navItems.map((item) => (
              <Link
                key={item.label}
                className="site-nav__link"
                href={item.href}
                onClick={closeMenus}
              >
                {item.label}
              </Link>
            ))}
          </nav>

          <Link className="site-cart-link" href="/cart" onClick={closeMenus}>
            <span className="site-cart-link__icon" aria-hidden="true">
              <svg viewBox="0 0 24 24" role="img">
                <path
                  d="M7 7h13l-1.4 6.4a2 2 0 0 1-2 1.6H10a2 2 0 0 1-2-1.6L6.2 4.8A1 1 0 0 0 5.2 4H3"
                  fill="none"
                  stroke="currentColor"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="1.6"
                />
                <circle cx="10" cy="19" r="1.2" fill="currentColor" />
                <circle cx="17" cy="19" r="1.2" fill="currentColor" />
              </svg>
            </span>
            <span className="site-cart-link__count">{itemCount}</span>
          </Link>
        </div>
      </div>
    </header>
  );
}
