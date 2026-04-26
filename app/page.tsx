import Link from "next/link";
import { HeroSlideshow } from "@/components/hero-slideshow";
import { GalleryCard } from "@/components/gallery-card";
import { getProducts } from "@/lib/supabase";

export default async function Home() {
  const products = await getProducts();
  const featured = products.filter((product) => product.featured).slice(0, 3);
  const gallery = products.slice(0, 6);
  const slideshowImages = products.slice(0, 4).map((product) => ({
    src: product.imageUrl,
    alt: product.title
  }));

  return (
    <main id="home" className="page-shell landing-page">
      <section className="hero">
        <div className="hero__grid">
          <div className="hero__copy">
            <div className="hero__kicker">Nevada County Storytelling</div>
            <h1>Timeless photography inspired by Nevada County.</h1>
            <p>
              Haley Wright &amp; Co. is a curated collection of local
              photography capturing the beauty, history, and everyday magic of
              Nevada County. Browse digital photo collections, choose your
              favorites, and download images for personal or creative use.
            </p>
            <div className="hero__actions">
              <Link className="button" href="#collections">
                Explore Collections
              </Link>
              <Link className="button-secondary" href="#shop">
                Shop Photos
              </Link>
            </div>

            <div className="hero__details">
              <div className="hero-detail">
                <span className="hero-detail__label">Rooted In</span>
                <strong>Nevada County, California</strong>
              </div>
              <div className="hero-detail">
                <span className="hero-detail__label">Focus</span>
                <strong>Local beauty, history, and quiet moments</strong>
              </div>
            </div>
          </div>

          <div className="hero__panel">
            <HeroSlideshow slides={slideshowImages} />
          </div>
        </div>
      </section>

      <section id="collections" className="section section--soft">
        <div className="section-card section-card--airy">
          <div className="section-heading">
            <div>
              <div className="section-kicker">Collections</div>
              <h2 className="section-title">
                Thoughtful collections shaped by place and memory.
              </h2>
            </div>
            <p className="section-copy">
              Each collection is designed to feel like a quiet editorial story:
              light, land, and lived-in Nevada County details gathered into
              timeless imagery.
            </p>
          </div>

          <div className="collection-grid">
            <article className="collection-card">
              <span className="collection-card__index">01</span>
              <h3>Nevada County Stories</h3>
              <p>
                Documentary-inspired images of towns, textures, and everyday
                beauty found close to home.
              </p>
            </article>
            <article className="collection-card">
              <span className="collection-card__index">02</span>
              <h3>Local Landscapes</h3>
              <p>
                Golden fields, pines, weathered roads, and shifting seasonal
                light across the county.
              </p>
            </article>
            <article className="collection-card">
              <span className="collection-card__index">03</span>
              <h3>Quiet Details</h3>
              <p>
                Soft, image-led studies of architecture, texture, and fleeting
                moments that hold the mood of a place.
              </p>
            </article>
          </div>

          <div className="gallery-grid gallery-grid--editorial">
            {featured.map((product) => (
              <GalleryCard key={product.id} product={product} />
            ))}
          </div>
        </div>
      </section>

      <section id="shop" className="section">
        <div className="section-card section-card--shop">
          <div className="section-heading">
            <div>
              <div className="section-kicker">Shop</div>
              <h2 className="section-title">
                Bring home imagery that feels calm, local, and lasting.
              </h2>
            </div>
            <p className="section-copy">
              Browse selected photographs available as digital downloads for
              personal projects, creative use, and print-friendly inspiration.
            </p>
          </div>

          <div className="gallery-grid">
            {gallery.map((product) => (
              <GalleryCard key={product.id} product={product} />
            ))}
          </div>
        </div>
      </section>

      <section id="about" className="section">
        <div className="section-card split-grid section-card--story">
          <div>
            <div className="section-kicker">About</div>
            <h2 className="section-title">
              A photography brand centered on beauty, history, and honest visual storytelling.
            </h2>
            <p className="section-copy">
              Haley Wright &amp; Co. brings together imagery that feels refined
              without losing warmth. The work draws from Nevada County life,
              with an emphasis on softness, narrative, and the kind of details
              that stay meaningful long after the moment has passed.
            </p>
          </div>

          <div className="notice notice--light">
            Built as a clean editorial storefront, this space can grow with new
            collections, seasonal releases, and curated photo shops while
            keeping the experience calm and image-first.
          </div>
        </div>
      </section>

      <section id="contact" className="section">
        <div className="contact-banner">
          <div>
            <div className="section-kicker">Contact</div>
            <h2 className="section-title">Inquire about collections, custom selections, or creative use.</h2>
          </div>
          <Link className="button" href="mailto:hello@haleywrightco.com">
            Contact Haley Wright &amp; Co.
          </Link>
        </div>
      </section>
    </main>
  );
}
