# Photography Storefront

A Next.js storefront for a photographer portfolio with:

- Supabase-backed product storage
- A gallery landing page
- Product detail pages
- A multi-item cart
- A checkout API placeholder for future payment integration

## Stack

- Next.js App Router
- TypeScript
- Supabase for product data and file hosting

## Run locally

1. Copy `.env.example` to `.env.local`
2. Add your Supabase project URL and anon key
3. Install dependencies with `npm.cmd install`
4. Start the app with `npm.cmd run dev`

## Supabase setup

Create a public `products` table:

```sql
create table public.products (
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
  created_at timestamptz default now()
);
```

Recommended storage buckets:

- `portfolio-previews` for compressed previews
- `digital-downloads` for original purchased files

Recommended row shape:

- `image_url`: public preview/display asset
- `preview_url`: optional smaller crop or alt preview
- `download_label`: text shown to the buyer

## Payment and delivery plan

The current app is intentionally ready for payment integration without changing
the storefront structure.

Recommended next steps:

1. Add Stripe checkout session creation in `app/api/checkout/route.ts`
2. Create an `orders` table in Supabase
3. On successful payment webhook, record purchased product ids
4. Generate signed URLs for files in `digital-downloads`
5. Email or display the expiring download links to the customer

## Notes

- If Supabase env vars are missing or the table is empty, the app falls back to demo portfolio data so the site still renders.
- The current cart is stored in browser local storage.
