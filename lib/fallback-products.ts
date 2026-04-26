import { Product } from "@/lib/types";

export const fallbackProducts: Product[] = [
  {
    id: "desert-dusk",
    slug: "desert-dusk",
    title: "Desert Dusk",
    category: "Digital Download",
    description:
      "A cinematic desert frame with copper dusk tones, edited and prepared for personal digital use.",
    price: 34,
    imageUrl:
      "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=1200&q=80",
    previewUrl:
      "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=800&q=80",
    downloadLabel: "High-resolution JPEG download",
    featured: true,
    available: true
  },
  {
    id: "coastal-wind",
    slug: "coastal-wind",
    title: "Coastal Wind",
    category: "Digital Download",
    description:
      "A calm shoreline composition with long shadows and sea haze, ideal for phone, tablet, or desktop wallpaper.",
    price: 28,
    imageUrl:
      "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1200&q=80",
    downloadLabel: "Desktop + mobile crop bundle",
    featured: true,
    available: true
  },
  {
    id: "atlas-presets",
    slug: "atlas-presets",
    title: "Atlas Preset Pack",
    category: "Preset Pack",
    description:
      "A small Lightroom preset pack built from travel work: warm skin tones, lifted shadows, and soft contrast.",
    price: 49,
    imageUrl:
      "https://images.unsplash.com/photo-1492691527719-9d1e07e534b4?auto=format&fit=crop&w=1200&q=80",
    downloadLabel: "ZIP with presets + install guide",
    featured: false,
    available: true
  },
  {
    id: "city-rain",
    slug: "city-rain",
    title: "City Rain",
    category: "Digital Download",
    description:
      "A moody urban frame with reflections and neon texture, exported at full resolution for digital delivery.",
    price: 31,
    imageUrl:
      "https://images.unsplash.com/photo-1504384308090-c894fdcc538d?auto=format&fit=crop&w=1200&q=80",
    downloadLabel: "High-resolution JPEG download",
    featured: false,
    available: true
  }
];
