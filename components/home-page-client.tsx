"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { CollectionsCarousel } from "@/components/collections-carousel";
import { HeroSlideshow } from "@/components/hero-slideshow";
import {
  InlineEditableImage,
  InlineEditableText,
  InlineEditToolbar
} from "@/components/inline-admin";
import { SafeImage } from "@/components/safe-image";
import {
  fetchBrowserProducts,
  fetchBrowserSiteContent,
  saveBrowserSiteContent,
  uploadBrowserImage
} from "@/lib/supabase-browser";
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
  const [pending, setPending] = useState(false);
  const [status, setStatus] = useState("");
  const [dirty, setDirty] = useState(false);

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

  const heroImages = useMemo(() => {
    const configuredImages = [...(content.hero.images ?? [])];

    while (configuredImages.length < 4) {
      configuredImages.push("");
    }

    return configuredImages.slice(0, 4);
  }, [content.hero.images]);

  const visibleProducts = useMemo(() => products.slice(0, 4), [products]);
  const slideshowSlides = heroImages.map((imageUrl, index) => ({
    src: imageUrl,
    alt: visibleProducts[index]?.title ?? `Hero image ${index + 1}`
  }));

  const collections = content.collections.items.map((item, index) => ({
    ...item,
    image: item.image ?? "",
    href: products[index] ? `/prints/${products[index].slug}` : "#shop"
  }));

  async function savePage() {
    setPending(true);
    setStatus("");

    try {
      await saveBrowserSiteContent(content);
      setDirty(false);
      setStatus("Saved.");
    } catch (error) {
      setStatus(error instanceof Error ? `Save failed: ${error.message}` : "Save failed.");
    } finally {
      setPending(false);
    }
  }

  async function replaceLandingImage(index: number, file: File) {
    try {
      const publicUrl = await uploadBrowserImage(file);
      const nextImages = [...heroImages];
      nextImages[index] = publicUrl;

      const nextContent = {
        ...content,
        hero: {
          ...content.hero,
          images: nextImages
        }
      };

      setContent(nextContent);
      await saveBrowserSiteContent(nextContent);
      setStatus("Hero image saved.");
    } catch (error) {
      setStatus(
        error instanceof Error
          ? `Image upload failed: ${error.message}`
          : "Image upload failed."
      );
    }
  }

  async function replaceCollectionImage(index: number, file: File) {
    try {
      const publicUrl = await uploadBrowserImage(file);
      const nextContent = {
        ...content,
        collections: {
          ...content.collections,
          items: content.collections.items.map((item, itemIndex) =>
            itemIndex === index ? { ...item, image: publicUrl } : item
          )
        }
      };

      setContent(nextContent);
      await saveBrowserSiteContent(nextContent);
      setStatus("Collection cover saved.");
    } catch (error) {
      setStatus(
        error instanceof Error
          ? `Image upload failed: ${error.message}`
          : "Image upload failed."
      );
    }
  }

  return (
    <main id="home">
      <InlineEditToolbar dirty={dirty} pending={pending} status={status} onSave={savePage} />
      <div className="landing-scale">
        <section className="hero">
          <div className="hero-inner page-shell">
            <div className="hero-text">
              <InlineEditableText
                as="span"
                className="hero-eyebrow"
                value={content.hero.eyebrow}
                onChange={(value) => {
                  setContent((current) => ({
                    ...current,
                    hero: { ...current.hero, eyebrow: value }
                  }));
                  setDirty(true);
                }}
              />

              <h1 className="hero-title">
                <InlineEditableText
                  as="span"
                  value={content.hero.title}
                  onChange={(value) => {
                    setContent((current) => ({
                      ...current,
                      hero: { ...current.hero, title: value }
                    }));
                    setDirty(true);
                  }}
                />{" "}
                <em>
                  <InlineEditableText
                    as="span"
                    value={content.hero.emphasizedTitle}
                    onChange={(value) => {
                      setContent((current) => ({
                        ...current,
                        hero: { ...current.hero, emphasizedTitle: value }
                      }));
                      setDirty(true);
                    }}
                  />
                </em>
              </h1>

              <InlineEditableText
                as="p"
                className="hero-sub"
                multiline
                value={content.hero.description}
                onChange={(value) => {
                  setContent((current) => ({
                    ...current,
                    hero: { ...current.hero, description: value }
                  }));
                  setDirty(true);
                }}
              />

              <div className="btn-group">
                <Link className="btn-primary" href="#collections">
                  <InlineEditableText
                    as="span"
                    value={content.hero.primaryCta}
                    onChange={(value) => {
                      setContent((current) => ({
                        ...current,
                        hero: { ...current.hero, primaryCta: value }
                      }));
                      setDirty(true);
                    }}
                  />
                </Link>
                <Link className="btn-outline" href="#shop">
                  <InlineEditableText
                    as="span"
                    value={content.hero.secondaryCta}
                    onChange={(value) => {
                      setContent((current) => ({
                        ...current,
                        hero: { ...current.hero, secondaryCta: value }
                      }));
                      setDirty(true);
                    }}
                  />
                </Link>
              </div>
            </div>

            <div className="hero-admin-slides">
              <HeroSlideshow slides={slideshowSlides} />
              <div className="hero-admin-slides__picker">
                {heroImages.map((imageUrl, index) => (
                  <InlineEditableImage
                    key={`${imageUrl}-${index}`}
                    src={imageUrl}
                    alt={visibleProducts[index]?.title ?? `Hero image ${index + 1}`}
                    wrapperClassName="hero-admin-slides__thumb"
                    className="hero-admin-slides__thumb-image"
                    onChange={(file) => void replaceLandingImage(index, file)}
                  />
                ))}
              </div>
            </div>
          </div>
        </section>

        <section className="collections" id="collections">
          <div className="collections-header">
            <InlineEditableText
              as="span"
              className="section-eyebrow"
              value={content.collections.eyebrow}
              onChange={(value) => {
                setContent((current) => ({
                  ...current,
                  collections: { ...current.collections, eyebrow: value }
                }));
                setDirty(true);
              }}
            />
            <InlineEditableText
              as="h2"
              value={content.collections.title}
              onChange={(value) => {
                setContent((current) => ({
                  ...current,
                  collections: { ...current.collections, title: value }
                }));
                setDirty(true);
              }}
            />
          </div>
          <CollectionsCarousel
            collections={collections}
            onUpdateCollection={(index, patch) => {
              setContent((current) => ({
                ...current,
                collections: {
                  ...current.collections,
                  items: current.collections.items.map((item, itemIndex) =>
                    itemIndex === index ? { ...item, ...patch } : item
                  )
                }
              }));
              setDirty(true);
            }}
            onReplaceCollectionImage={(index, file) =>
              void replaceCollectionImage(index, file)
            }
          />
        </section>

        <section className="shop-preview" id="shop">
          <div className="page-shell shop-preview__inner">
            <div className="shop-preview__copy">
              <InlineEditableText
                as="span"
                className="section-eyebrow"
                value={content.shop.eyebrow}
                onChange={(value) => {
                  setContent((current) => ({
                    ...current,
                    shop: { ...current.shop, eyebrow: value }
                  }));
                  setDirty(true);
                }}
              />
              <InlineEditableText
                as="h2"
                value={content.shop.title}
                onChange={(value) => {
                  setContent((current) => ({
                    ...current,
                    shop: { ...current.shop, title: value }
                  }));
                  setDirty(true);
                }}
              />
              <InlineEditableText
                as="p"
                multiline
                value={content.shop.description}
                onChange={(value) => {
                  setContent((current) => ({
                    ...current,
                    shop: { ...current.shop, description: value }
                  }));
                  setDirty(true);
                }}
              />
            </div>

            {products.length > 0 ? (
              <div className="shop-preview__grid">
                {products.slice(0, 4).map((product) => (
                  <Link
                    key={product.id}
                    className="shop-tile"
                    href={`/prints/${product.slug}`}
                  >
                    <div className="shop-tile__image-wrap">
                      <SafeImage
                        className="shop-tile__image"
                        fallbackClassName="shop-tile__image shop-tile__image--empty"
                        fallbackLabel="Upload image"
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
            ) : (
              <div className="empty-state shop-preview__empty">
                Upload your first photo in edit mode to populate the shop.
              </div>
            )}
          </div>
        </section>

        <section className="quote-strip">
          <InlineEditableText
            as="blockquote"
            multiline
            value={content.quote.text}
            onChange={(value) => {
              setContent((current) => ({
                ...current,
                quote: { ...current.quote, text: value }
              }));
              setDirty(true);
            }}
          />
          <div className="gold-divider" />
          <InlineEditableText
            as="cite"
            value={content.quote.cite}
            onChange={(value) => {
              setContent((current) => ({
                ...current,
                quote: { ...current.quote, cite: value }
              }));
              setDirty(true);
            }}
          />
        </section>
      </div>
    </main>
  );
}
