create table if not exists public.products (
  id text primary key,
  slug text unique not null,
  title text not null,
  category text not null,
  description text not null,
  price numeric not null,
  image_url text not null,
  preview_url text,
  download_label text not null,
  featured boolean default false,
  available boolean default true,
  sort_order integer default 0,
  created_at timestamptz default now()
);

create table if not exists public.site_content (
  id text primary key,
  content jsonb not null default '{}'::jsonb,
  updated_at timestamptz default now()
);

insert into public.site_content (id, content)
values (
  'landing',
  '{
    "hero": {
      "eyebrow": "Nevada County, California",
      "title": "Timeless photography inspired by",
      "emphasizedTitle": "Nevada County.",
      "description": "Haley Wright & Co. is a curated collection of local photography capturing the beauty, history, and everyday magic of Nevada County. Browse digital photo collections, choose your favorites, and download images for personal or creative use.",
      "primaryCta": "Explore Collections",
      "secondaryCta": "Shop Photos"
    },
    "about": {
      "eyebrow": "About This Collection",
      "title": "Rooted in place.\nCreated with care.",
      "body": "This collection was created from a love of photography, storytelling, and the quiet details that make Nevada County feel like home. From golden landscapes and historic spaces to local events and everyday moments, each image is meant to preserve the feeling of a place."
    },
    "collections": {
      "eyebrow": "Photography Collections",
      "title": "Explore Collections",
      "items": [
        {
          "tag": "Landscapes",
          "title": "Golden Hour & Open Meadows",
          "description": "Sun-drenched fields, rolling oak-dotted hills, and the long light of late afternoon in the Sierra Nevada foothills."
        },
        {
          "tag": "Architecture",
          "title": "Historic Spaces & Buildings",
          "description": "Nevada County''s storied architecture - from Victorian homes to mining-era halls - captured in quiet, reverent detail."
        },
        {
          "tag": "Nature & Light",
          "title": "Seasonal Light & Forest",
          "description": "Morning fog through pine canopy, autumn color along trail corridors, and the soft quiet of a Nevada County winter."
        },
        {
          "tag": "Water & Wilderness",
          "title": "Creeks, Rivers & Trails",
          "description": "The quiet creeks and forested trails that thread through Nevada County - still, wild, and full of light."
        },
        {
          "tag": "Community",
          "title": "Local Events & Gatherings",
          "description": "Farmers markets, festivals, and neighborhood moments - the living culture of a community that takes care of itself."
        }
      ]
    },
    "shop": {
      "eyebrow": "Shop Photos",
      "title": "Choose from curated digital photographs available to download.",
      "description": "Browse selected images for personal use, creative inspiration, and quiet editorial storytelling rooted in Nevada County."
    },
    "quote": {
      "text": "\"Every photograph is a certificate of presence - and these images feel like a love letter to this place.\"",
      "cite": "Haley Wright & Co. - Nevada County, California"
    }
  }'::jsonb
)
on conflict (id) do nothing;
