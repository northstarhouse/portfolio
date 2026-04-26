import Link from "next/link";
import { GalleryCard } from "@/components/gallery-card";
import { getProducts, isSupabaseConfigured } from "@/lib/supabase";

export default async function Home() {
  const products = await getProducts();
  const featured = products.filter((product) => product.featured).slice(0, 3);
  const gallery = products.slice(0, 6);
  const heroImage =
    featured[0]?.imageUrl ??
    "https://images.unsplash.com/photo-1492691527719-9d1e07e534b4?auto=format&fit=crop&w=1200&q=80";

  return (
    <main className="page-shell">
      <section className="hero">
        <div className="hero__grid">
          <div className="hero__copy">
            <div className="hero__kicker">Portfolio and Shop</div>
            <h1>Photography you can view, collect, and download.</h1>
            <p>
              Turn your personal site into a storefront for digital photo sales,
              downloadable edits, and future product releases. The gallery can
              pull directly from Supabase, so your uploads become products
              without rebuilding the site each time.
            </p>
            <div className="hero__actions">
              <Link className="button" href="#portfolio">
                View portfolio
              </Link>
              <Link className="button-secondary" href="/cart">
                Open cart
              </Link>
            </div>
          </div>

          <div className="hero__panel">
            <div
              className="hero__image"
              style={{ backgroundImage: `url(${heroImage})` }}
            />
            <div className="hero__stats">
              <div className="stat-card">
                <strong>{products.length}</strong>
                <span className="muted">sellable pieces</span>
              </div>
              <div className="stat-card">
                <strong>Supabase</strong>
                <span className="muted">
                  {isSupabaseConfigured() ? "connected" : "demo fallback"}
                </span>
              </div>
              <div className="stat-card">
                <strong>Cart</strong>
                <span className="muted">multi-item ready</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section id="portfolio" className="section">
        <div className="section-card">
          <div className="section-heading">
            <div>
              <div className="section-kicker">Featured Work</div>
              <h2 className="section-title">A storefront disguised as a portfolio.</h2>
            </div>
            <p className="section-copy">
              Use this front page to show your style first, then convert that
              attention into direct digital sales.
            </p>
          </div>
          <div className="gallery-grid">
            {featured.map((product) => (
              <GalleryCard key={product.id} product={product} />
            ))}
          </div>
        </div>
      </section>

      <section id="downloads" className="section">
        <div className="section-card">
          <div className="section-heading">
            <div>
              <div className="section-kicker">Available Now</div>
              <h2 className="section-title">Digital downloads, presets, and more.</h2>
            </div>
            <p className="section-copy">
              The structure already supports multiple product types, so you can
              sell images today and add presets, guides, or client resources
              later.
            </p>
          </div>

          <div className="gallery-grid">
            {gallery.map((product) => (
              <GalleryCard key={product.id} product={product} />
            ))}
          </div>
        </div>
      </section>

      <section className="section">
        <div className="section-card split-grid">
          <div>
            <div className="section-kicker">Checkout Roadmap</div>
            <h2 className="section-title">Payment comes next, without changing the catalog.</h2>
            <p className="section-copy">
              The app is ready for a checkout API route and post-purchase
              delivery flow. The cart and product model are already shaped for
              Stripe checkout plus a secure download handoff after payment.
            </p>
          </div>
          <div className="notice">
            Start by connecting Supabase with your own product rows and storage
            bucket. After that, payment integration can focus only on checkout,
            order creation, and expiring download links.
          </div>
        </div>
      </section>
    </main>
  );
}
