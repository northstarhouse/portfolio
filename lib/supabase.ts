import { createClient } from "@supabase/supabase-js";
import { defaultSiteContent } from "@/lib/site-content";
import { fallbackProducts } from "@/lib/fallback-products";
import { Product, SiteContent } from "@/lib/types";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

const supabase =
  supabaseUrl && supabaseAnonKey
    ? createClient(supabaseUrl, supabaseAnonKey, {
        auth: {
          persistSession: false
        }
      })
    : null;

type SupabaseProductRow = {
  id: string;
  slug: string;
  title: string;
  category: Product["category"];
  description: string;
  price: number;
  image_url: string;
  preview_url: string | null;
  download_label: string;
  featured: boolean | null;
  available: boolean | null;
  sort_order: number | null;
  collection: Product["collection"];
};

function mapProduct(row: SupabaseProductRow): Product {
  return {
    id: row.id,
    slug: row.slug,
    title: row.title,
    category: row.category,
    description: row.description,
    price: row.price,
    imageUrl: row.image_url,
    previewUrl: row.preview_url,
    downloadLabel: row.download_label,
    featured: row.featured ?? false,
    available: row.available ?? true,
    sortOrder: row.sort_order,
    collection: row.collection ?? null
  };
}

export async function getProducts() {
  if (!supabase) {
    return fallbackProducts;
  }

  const { data, error } = await supabase
    .from("products")
    .select(
      "id, slug, title, category, description, price, image_url, preview_url, download_label, featured, available, sort_order, collection"
    )
    .eq("available", true)
    .order("sort_order", { ascending: true, nullsFirst: false })
    .order("featured", { ascending: false })
    .order("title", { ascending: true });

  if (error || !data?.length) {
    return fallbackProducts;
  }

  return data.map(mapProduct);
}

export async function getProductBySlug(slug: string) {
  const products = await getProducts();
  return products.find((product) => product.slug === slug) ?? null;
}

export async function getPublicSiteContent() {
  if (!supabase) {
    return defaultSiteContent;
  }

  const { data, error } = await supabase
    .from("site_content")
    .select("content")
    .eq("id", "landing")
    .maybeSingle();

  if (error || !data?.content) {
    return defaultSiteContent;
  }

  return data.content as SiteContent;
}

export function isSupabaseConfigured() {
  return Boolean(supabase);
}
