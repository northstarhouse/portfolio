import type { Metadata } from "next";
import "./globals.css";
import { CartProvider } from "@/components/cart-context";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";

export const metadata: Metadata = {
  title: "Haley Wright & Co.",
  description:
    "Timeless Nevada County photography, digital collections, and editorial storytelling."
};

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <CartProvider>
          <SiteHeader />
          {children}
          <SiteFooter />
        </CartProvider>
      </body>
    </html>
  );
}
