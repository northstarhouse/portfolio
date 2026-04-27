export type ProductCategory = "Digital Download" | "Preset Pack" | "Print License";

export type { CollectionSlug } from "@/lib/collections";

export type Product = {
  id: string;
  slug: string;
  title: string;
  category: ProductCategory;
  description: string;
  price: number;
  imageUrl: string;
  previewUrl?: string | null;
  downloadLabel: string;
  featured?: boolean;
  available?: boolean;
  sortOrder?: number | null;
  collection?: import("@/lib/collections").CollectionSlug | null;
};

export type CartItem = Product & {
  quantity: number;
};

export type CollectionCardContent = {
  tag: string;
  title: string;
  description: string;
  image?: string;
};

export type SiteContent = {
  hero: {
    eyebrow: string;
    title: string;
    emphasizedTitle: string;
    description: string;
    primaryCta: string;
    secondaryCta: string;
    images?: string[];
  };
  about: {
    eyebrow: string;
    title: string;
    body: string;
  };
  collections: {
    eyebrow: string;
    title: string;
    items: CollectionCardContent[];
  };
  shop: {
    eyebrow: string;
    title: string;
    description: string;
  };
  quote: {
    text: string;
    cite: string;
  };
};
