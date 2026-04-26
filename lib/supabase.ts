import { createClient } from "@supabase/supabase-js";
import { fallbackProducts } from "@/lib/fallback-products";
import { Product } from "@/lib/types";

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
    available: row.available ?? true
  };
}

export async function getProducts() {
  if (!supabase) {
    return fallbackProducts;
  }

  const { data, error } = await supabase
    .from("products")
    .select(
      "id, slug, title, category, description, price, image_url, preview_url, download_label, featured, available"
    )
    .eq("available", true)
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

export function isSupabaseConfigured() {
  return Boolean(supabase);
}
