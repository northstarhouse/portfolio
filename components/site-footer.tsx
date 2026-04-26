import Link from "next/link";

export function SiteFooter() {
  return (
    <footer id="contact">
      <div className="footer-inner">
        <div className="footer-top">
          <div>
            <div className="footer-logo">Haley Wright &amp; Co.</div>
            <p className="footer-tagline">
              Timeless photography rooted in the beauty and history of Nevada
              County, California.
            </p>
          </div>

          <div className="footer-col">
            <h4>Collections</h4>
            <Link href="/#collections">Golden Landscapes</Link>
            <Link href="/#collections">Historic Spaces</Link>
            <Link href="/#collections">Seasonal Light</Link>
            <Link href="/#collections">Local Events</Link>
          </div>

          <div className="footer-col">
            <h4>Shop</h4>
            <Link href="/#shop">Digital Downloads</Link>
            <Link href="/#shop">Print Licensing</Link>
            <Link href="/#shop">Gift Collections</Link>
            <Link href="/#shop">New Arrivals</Link>
          </div>

          <div className="footer-col">
            <h4>Connect</h4>
            <Link href="/#about">About</Link>
            <Link href="mailto:hello@haleywrightco.com">Contact</Link>
            <Link href="/admin">Admin</Link>
            <Link href="/#home">Newsletter</Link>
          </div>
        </div>

        <div className="footer-bottom">
          <span>© 2026 Haley Wright &amp; Co. All rights reserved.</span>
          <span>Nevada County, California</span>
        </div>
      </div>
    </footer>
  );
}
