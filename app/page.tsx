import { HomePageClient } from "@/components/home-page-client";
import { getProducts, getPublicSiteContent } from "@/lib/supabase";

export default async function Home() {
  const [products, content] = await Promise.all([
    getProducts(),
    getPublicSiteContent()
  ]);

  return <HomePageClient initialProducts={products} initialContent={content} />;
}
