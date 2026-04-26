export type ProductCategory = "Digital Download" | "Preset Pack" | "Print License";

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
};

export type CartItem = Product & {
  quantity: number;
};
