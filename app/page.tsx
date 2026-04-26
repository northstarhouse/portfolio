import { HomePageClient } from "@/components/home-page-client";
import { fallbackProducts } from "@/lib/fallback-products";
import { defaultSiteContent } from "@/lib/site-content";

export default async function Home() {
  return (
    <HomePageClient
      initialProducts={fallbackProducts}
      initialContent={defaultSiteContent}
    />
  );
}
