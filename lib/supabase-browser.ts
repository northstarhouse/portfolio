"use client";

import { createClient } from "@supabase/supabase-js";
import { defaultSiteContent } from "@/lib/site-content";
import { fallbackProducts } from "@/lib/fallback-products";
import { Product, SiteContent } from "@/lib/types";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const bucket = process.env.NEXT_PUBLIC_SUPABASE_IMAGE_BUCKET || "portfolio-previews";

export const browserSupabase =
  supabaseUrl && supabaseAnonKey
    ? createClient(supabaseUrl, supabaseAnonKey)
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
    price: Number(row.price),
    imageUrl: row.image_url,
    previewUrl: row.preview_url,
    downloadLabel: row.download_label,
    featured: row.featured ?? false,
    available: row.available ?? true,
    sortOrder: row.sort_order,
    collection: row.collection ?? null
  };
}

export async function fetchBrowserProducts(includeUnavailable = false) {
  if (!browserSupabase) {
    return fallbackProducts;
  }

  let query = browserSupabase
    .from("products")
    .select(
      "id, slug, title, category, description, price, image_url, preview_url, download_label, featured, available, sort_order, collection"
    )
    .order("sort_order", { ascending: true, nullsFirst: false })
    .order("featured", { ascending: false })
    .order("title", { ascending: true });

  if (!includeUnavailable) {
    query = query.eq("available", true);
  }

  const { data, error } = await query;

  if (error || !data?.length) {
    return fallbackProducts;
  }

  return data.map(mapProduct);
}

export async function fetchBrowserProductBySlug(slug: string) {
  const products = await fetchBrowserProducts();
  return products.find((product) => product.slug === slug) ?? null;
}

export async function fetchBrowserSiteContent() {
  if (!browserSupabase) {
    return defaultSiteContent;
  }

  const { data, error } = await browserSupabase
    .from("site_content")
    .select("content")
    .eq("id", "landing")
    .maybeSingle();

  if (error || !data?.content) {
    return defaultSiteContent;
  }

  return data.content as SiteContent;
}

export async function saveBrowserSiteContent(content: SiteContent) {
  if (!browserSupabase) {
    throw new Error("Supabase not configured");
  }

  const { error } = await browserSupabase.from("site_content").upsert({
    id: "landing",
    content
  });

  if (error) {
    throw error;
  }
}

export async function saveBrowserProduct(product: Product) {
  if (!browserSupabase) {
    throw new Error("Supabase not configured");
  }

  const { error } = await browserSupabase.from("products").upsert({
    id: product.id,
    slug: product.slug,
    title: product.title,
    category: product.category,
    description: product.description,
    price: product.price,
    image_url: product.imageUrl,
    preview_url: product.previewUrl ?? product.imageUrl,
    download_label: product.downloadLabel,
    featured: product.featured ?? false,
    available: product.available ?? true,
    sort_order: product.sortOrder ?? 0,
    collection: product.collection ?? null
  });

  if (error) {
    throw error;
  }
}

export async function createBrowserProduct(product: Omit<Product, "id">) {
  if (!browserSupabase) {
    throw new Error("Supabase not configured");
  }

  const existing = await fetchBrowserProducts(true);
  const payload = {
    id: crypto.randomUUID(),
    slug: product.slug,
    title: product.title,
    category: product.category,
    description: product.description,
    price: product.price,
    image_url: product.imageUrl,
    preview_url: product.previewUrl ?? product.imageUrl,
    download_label: product.downloadLabel,
    featured: product.featured ?? false,
    available: product.available ?? true,
    sort_order: existing.length + 1,
    collection: product.collection ?? null
  };

  const { error } = await browserSupabase.from("products").insert(payload);

  if (error) {
    throw error;
  }
}

export async function fetchBrowserProductsByCollection(collectionSlug: string) {
  if (!browserSupabase) {
    return [];
  }

  const { data, error } = await browserSupabase
    .from("products")
    .select(
      "id, slug, title, category, description, price, image_url, preview_url, download_label, featured, available, sort_order, collection"
    )
    .eq("collection", collectionSlug)
    .eq("available", true)
    .order("sort_order", { ascending: true, nullsFirst: false })
    .order("title", { ascending: true });

  if (error || !data?.length) {
    return [];
  }

  return data.map(mapProduct);
}

export async function deleteBrowserProduct(id: string) {
  if (!browserSupabase) {
    throw new Error("Supabase not configured");
  }

  const { error } = await browserSupabase.from("products").delete().eq("id", id);

  if (error) {
    throw error;
  }
}

export async function reorderBrowserProducts(products: Product[]) {
  for (const [index, product] of products.entries()) {
    await saveBrowserProduct({ ...product, sortOrder: index + 1 });
  }
}

export async function uploadBrowserImage(file: File) {
  if (!browserSupabase) {
    throw new Error("Supabase not configured");
  }

  const extension = file.name.split(".").pop() || "jpg";
  const filePath = `admin/${Date.now()}-${crypto.randomUUID()}.${extension}`;
  const { error } = await browserSupabase.storage.from(bucket).upload(filePath, file, {
    upsert: false
  });

  if (error) {
    throw error;
  }

  const { data } = browserSupabase.storage.from(bucket).getPublicUrl(filePath);
  return data.publicUrl;
}
