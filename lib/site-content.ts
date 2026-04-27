import { SiteContent } from "@/lib/types";

export const defaultSiteContent: SiteContent = {
  hero: {
    eyebrow: "Nevada County, California",
    title: "Photographs that",
    emphasizedTitle: "Feel Like Home.",
    description:
      "Haley Wright & Co. is a curated collection of local photography capturing the beauty, culture, and everyday magic of Nevada County. Browse albums, choose your favorites, and download images for personal or creative use.",
    primaryCta: "Explore Collections",
    secondaryCta: "Shop Photos",
    images: []
  },
  about: {
    eyebrow: "About This Collection",
    title: "Rooted in place.\nCreated with care.",
    body: "This collection was created from a love of photography, storytelling, and the quiet details that make Nevada County feel like home. From the historic streets of Nevada City and Grass Valley to local gatherings, creeks, and open trails, each image is meant to preserve the feeling of a place."
  },
  collections: {
    eyebrow: "Photography Collections",
    title: "Explore Collections",
    items: [
      {
        tag: "Nevada City",
        title: "Nevada City",
        image: "",
        description:
          "Historic storefronts, gas-lit streets, and the quiet character of one of California's most beloved Gold Rush towns."
      },
      {
        tag: "Grass Valley",
        title: "Grass Valley",
        image: "",
        description:
          "Downtown murals, market days, and neighborhood scenes from the heart of the county."
      },
      {
        tag: "Local Events",
        title: "Local Events & Gatherings",
        image: "",
        description:
          "Farmers markets, festivals, and community moments - the living culture of a place that takes care of itself."
      },
      {
        tag: "Creeks & Trails",
        title: "Creeks, Rivers & Trails",
        image: "",
        description:
          "The quiet waterways and forested trails that thread through Nevada County - still, wild, and full of light."
      },
      {
        tag: "Love Letters",
        title: "Love Letters",
        image: "",
        description:
          "Personal and poetic images of the county - the small moments and overlooked corners that make this place impossible to forget."
      }
    ]
  },
  shop: {
    eyebrow: "Shop Photos",
    title: "Choose from curated digital photographs available to download.",
    description:
      "Browse selected images for personal use, creative projects, and quiet editorial storytelling rooted in Nevada County."
  },
  quote: {
    text: '"Every photograph is a certificate of presence - and these images feel like a love letter to this place."',
    cite: "Haley Wright & Co. - Nevada County, California"
  }
};
