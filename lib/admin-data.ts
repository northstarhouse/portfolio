import "server-only";

import { createClient } from "@supabase/supabase-js";
import { getProducts, getPublicSiteContent } from "@/lib/supabase";
import { defaultSiteContent } from "@/lib/site-content";
import { Product, SiteContent } from "@/lib/types";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

const adminSupabase =
  supabaseUrl && serviceRoleKey
    ? createClient(supabaseUrl, serviceRoleKey, {
        auth: {
          persistSession: false,
          autoRefreshToken: false
        }
      })
    : null;

type AdminProductInput = Omit<Product, "id"> & { id?: string };

function requireAdminSupabase() {
  if (!adminSupabase) {
    throw new Error("Missing Supabase admin configuration");
  }

  return adminSupabase;
}

export function hasAdminWriteAccess() {
  return Boolean(adminSupabase);
}

function mapProduct(row: Record<string, unknown>): Product {
  return {
    id: String(row.id),
    slug: String(row.slug),
    title: String(row.title),
    category: row.category as Product["category"],
    description: String(row.description),
    price: Number(row.price),
    imageUrl: String(row.image_url),
    previewUrl: row.preview_url ? String(row.preview_url) : null,
    downloadLabel: String(row.download_label),
    featured: Boolean(row.featured),
    available: Boolean(row.available),
    sortOrder:
      row.sort_order === null || row.sort_order === undefined
        ? null
        : Number(row.sort_order)
  };
}

export async function getAdminProducts() {
  if (!adminSupabase) {
    return getProducts();
  }

  const supabase = requireAdminSupabase();
  const { data, error } = await supabase
    .from("products")
    .select(
      "id, slug, title, category, description, price, image_url, preview_url, download_label, featured, available, sort_order"
    )
    .order("sort_order", { ascending: true, nullsFirst: false })
    .order("title", { ascending: true });

  if (error) {
    throw error;
  }

  return (data ?? []).map(mapProduct);
}

export async function createAdminProduct(input: AdminProductInput) {
  const supabase = requireAdminSupabase();
  const existing = await getAdminProducts();
  const nextSortOrder = existing.length + 1;

  const payload = {
    id: input.id ?? crypto.randomUUID(),
    slug: input.slug,
    title: input.title,
    category: input.category,
    description: input.description,
    price: input.price,
    image_url: input.imageUrl,
    preview_url: input.previewUrl ?? input.imageUrl,
    download_label: input.downloadLabel,
    featured: input.featured ?? false,
    available: input.available ?? true,
    sort_order: input.sortOrder ?? nextSortOrder
  };

  const { error } = await supabase.from("products").insert(payload);

  if (error) {
    throw error;
  }
}

export async function updateAdminProduct(product: Product) {
  const supabase = requireAdminSupabase();
  const { error } = await supabase
    .from("products")
    .update({
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
      sort_order: product.sortOrder ?? null
    })
    .eq("id", product.id);

  if (error) {
    throw error;
  }
}

export async function reorderAdminProducts(ids: string[]) {
  const supabase = requireAdminSupabase();

  for (const [index, id] of ids.entries()) {
    const { error } = await supabase
      .from("products")
      .update({ sort_order: index + 1 })
      .eq("id", id);

    if (error) {
      throw error;
    }
  }
}

export async function deleteAdminProduct(id: string) {
  const supabase = requireAdminSupabase();
  const { error } = await supabase.from("products").delete().eq("id", id);

  if (error) {
    throw error;
  }
}

export async function getSiteContent() {
  if (!adminSupabase) {
    return getPublicSiteContent();
  }

  const { data, error } = await adminSupabase
    .from("site_content")
    .select("content")
    .eq("id", "landing")
    .maybeSingle();

  if (error || !data?.content) {
    return defaultSiteContent;
  }

  return data.content as SiteContent;
}

export async function saveSiteContent(content: SiteContent) {
  const supabase = requireAdminSupabase();
  const { error } = await supabase.from("site_content").upsert({
    id: "landing",
    content
  });

  if (error) {
    throw error;
  }
}
