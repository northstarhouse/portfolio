import type { Metadata } from "next";
import { Cormorant_Garamond, Jost } from "next/font/google";
import "./globals.css";
import { CartProvider } from "@/components/cart-context";
import { SiteAdminAccess } from "@/components/site-admin-access";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";

const cormorant = Cormorant_Garamond({
  subsets: ["latin"],
  variable: "--font-display",
  weight: ["400", "500", "600"],
  style: ["normal", "italic"]
});

const jost = Jost({
  subsets: ["latin"],
  variable: "--font-body",
  weight: ["300", "400", "500"]
});

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
    <html lang="en" className={`${cormorant.variable} ${jost.variable}`}>
      <body>
        <CartProvider>
          <SiteHeader />
          <SiteAdminAccess />
          {children}
          <SiteFooter />
        </CartProvider>
      </body>
    </html>
  );
}
