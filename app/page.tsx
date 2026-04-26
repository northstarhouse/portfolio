import Link from "next/link";
import { CollectionsCarousel } from "@/components/collections-carousel";
import { HeroSlideshow } from "@/components/hero-slideshow";
import { getProducts } from "@/lib/supabase";

export default async function Home() {
  const products = await getProducts();

  const slideshowSlides = products.slice(0, 4).map((product) => ({
    src: product.imageUrl,
    alt: product.title
  }));

  const collections = [
    {
      tag: "Landscapes",
      title: "Golden Hour & Open Meadows",
      description:
        "Sun-drenched fields, rolling oak-dotted hills, and the long light of late afternoon in the Sierra Nevada foothills.",
      image: slideshowSlides[0]?.src ?? products[0]?.imageUrl ?? "",
      href: "#shop"
    },
    {
      tag: "Architecture",
      title: "Historic Spaces & Buildings",
      description:
        "Nevada County's storied architecture — from Victorian homes to mining-era halls — captured in quiet, reverent detail.",
      image: slideshowSlides[1]?.src ?? products[1]?.imageUrl ?? "",
      href: "#shop"
    },
    {
      tag: "Nature & Light",
      title: "Seasonal Light & Forest",
      description:
        "Morning fog through pine canopy, autumn color along trail corridors, and the soft quiet of a Nevada County winter.",
      image: slideshowSlides[2]?.src ?? products[2]?.imageUrl ?? "",
      href: "#shop"
    },
    {
      tag: "Water & Wilderness",
      title: "Creeks, Rivers & Trails",
      description:
        "The quiet creeks and forested trails that thread through Nevada County — still, wild, and full of light.",
      image: slideshowSlides[3]?.src ?? products[3]?.imageUrl ?? "",
      href: "#shop"
    },
    {
      tag: "Community",
      title: "Local Events & Gatherings",
      description:
        "Farmers markets, festivals, and neighborhood moments — the living culture of a community that takes care of itself.",
      image: slideshowSlides[0]?.src ?? products[0]?.imageUrl ?? "",
      href: "#shop"
    }
  ];

  return (
    <main id="home">
      <section className="hero">
        <div className="hero-inner page-shell">
          <div className="hero-text">
            <span className="hero-eyebrow">Nevada County, California</span>
            <h1 className="hero-title">
              Timeless photography inspired by <em>Nevada County.</em>
            </h1>
            <p className="hero-sub">
              Haley Wright &amp; Co. is a curated collection of local
              photography capturing the beauty, history, and everyday magic of
              Nevada County. Browse digital photo collections, choose your
              favorites, and download images for personal or creative use.
            </p>
            <div className="btn-group">
              <Link className="btn-primary" href="#collections">
                Explore Collections
              </Link>
              <Link className="btn-outline" href="#shop">
                Shop Photos
              </Link>
            </div>
          </div>

          <HeroSlideshow slides={slideshowSlides} />
        </div>
      </section>

      <section className="intro" id="about">
        <div className="intro-inner">
          <span className="section-eyebrow">About This Collection</span>
          <h2>
            Rooted in place.
            <br />
            Created with care.
          </h2>
          <div className="gold-divider" />
          <p>
            This collection was created from a love of photography,
            storytelling, and the quiet details that make Nevada County feel
            like home. From golden landscapes and historic spaces to local
            events and everyday moments, each image is meant to preserve the
            feeling of a place.
          </p>
        </div>
      </section>

      <section className="collections" id="collections">
        <div className="collections-header">
          <span className="section-eyebrow">Photography Collections</span>
          <h2>Explore Collections</h2>
        </div>
        <CollectionsCarousel collections={collections} />
      </section>

      <section className="shop-preview" id="shop">
        <div className="page-shell shop-preview__inner">
          <div className="shop-preview__copy">
            <span className="section-eyebrow">Shop Photos</span>
            <h2>Choose from curated digital photographs available to download.</h2>
            <p>
              Browse selected images for personal use, creative inspiration, and
              quiet editorial storytelling rooted in Nevada County.
            </p>
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
        <blockquote>
          &quot;Every photograph is a certificate of presence — and these images
          feel like a love letter to this place.&quot;
        </blockquote>
        <div className="gold-divider" />
        <cite>Haley Wright &amp; Co. — Nevada County, California</cite>
      </section>
    </main>
  );
}
