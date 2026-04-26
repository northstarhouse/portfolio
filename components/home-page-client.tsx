"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { CollectionsCarousel } from "@/components/collections-carousel";
import { HeroSlideshow } from "@/components/hero-slideshow";
import { fetchBrowserProducts, fetchBrowserSiteContent } from "@/lib/supabase-browser";
import { Product, SiteContent } from "@/lib/types";

type HomePageClientProps = {
  initialProducts: Product[];
  initialContent: SiteContent;
};

export function HomePageClient({
  initialProducts,
  initialContent
}: HomePageClientProps) {
  const [products, setProducts] = useState(initialProducts);
  const [content, setContent] = useState(initialContent);

  useEffect(() => {
    let active = true;

    Promise.all([fetchBrowserProducts(), fetchBrowserSiteContent()]).then(
      ([nextProducts, nextContent]) => {
        if (!active) {
          return;
        }

        setProducts(nextProducts);
        setContent(nextContent);
      }
    );

    return () => {
      active = false;
    };
  }, []);

  const slideshowSlides = products.slice(0, 4).map((product) => ({
    src: product.imageUrl,
    alt: product.title
  }));

  const collections = content.collections.items.map((item, index) => ({
    ...item,
    image:
      slideshowSlides[index]?.src ??
      products[index]?.imageUrl ??
      slideshowSlides[0]?.src ??
      "",
    href: "#shop"
  }));

  return (
    <main id="home">
      <section className="hero">
        <div className="hero-inner page-shell">
          <div className="hero-text">
            <span className="hero-eyebrow">{content.hero.eyebrow}</span>
            <h1 className="hero-title">
              {content.hero.title} <em>{content.hero.emphasizedTitle}</em>
            </h1>
            <p className="hero-sub">{content.hero.description}</p>
            <div className="btn-group">
              <Link className="btn-primary" href="#collections">
                {content.hero.primaryCta}
              </Link>
              <Link className="btn-outline" href="#shop">
                {content.hero.secondaryCta}
              </Link>
            </div>
          </div>

          <HeroSlideshow slides={slideshowSlides} />
        </div>
      </section>

      <section className="intro" id="about">
        <div className="intro-inner">
          <span className="section-eyebrow">{content.about.eyebrow}</span>
          <h2>
            {content.about.title.split("\n").map((line, index, lines) => (
              <span key={`${line}-${index}`}>
                {line}
                {index < lines.length - 1 ? <br /> : null}
              </span>
            ))}
          </h2>
          <div className="gold-divider" />
          <p>{content.about.body}</p>
        </div>
      </section>

      <section className="collections" id="collections">
        <div className="collections-header">
          <span className="section-eyebrow">{content.collections.eyebrow}</span>
          <h2>{content.collections.title}</h2>
        </div>
        <CollectionsCarousel collections={collections} />
      </section>

      <section className="shop-preview" id="shop">
        <div className="page-shell shop-preview__inner">
          <div className="shop-preview__copy">
            <span className="section-eyebrow">{content.shop.eyebrow}</span>
            <h2>{content.shop.title}</h2>
            <p>{content.shop.description}</p>
          </div>

          <div className="shop-preview__grid">
            {products.slice(0, 4).map((product) => (
              <Link
                key={product.id}
                className="shop-tile"
                href={`/prints/${product.slug}`}
              >
                <div className="shop-tile__image-wrap">
                  <img
                    className="shop-tile__image"
                    src={product.previewUrl || product.imageUrl}
                    alt={product.title}
                  />
                </div>
                <div className="shop-tile__body">
                  <span className="shop-tile__tag">{product.category}</span>
                  <h3>{product.title}</h3>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="quote-strip">
        <blockquote>{content.quote.text}</blockquote>
        <div className="gold-divider" />
        <cite>{content.quote.cite}</cite>
      </section>
    </main>
  );
}
