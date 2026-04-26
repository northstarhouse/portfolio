# Photography Storefront

A Next.js storefront for a photographer portfolio with:

- Supabase-backed product storage
- A gallery landing page
- Product detail pages
- A multi-item cart
- A password-protected admin dashboard for landing-page and collection edits
- A checkout API placeholder for future payment integration

## Stack

- Next.js App Router
- TypeScript
- Supabase for product data and file hosting

## Run locally

1. Copy `.env.example` to `.env.local`
2. Add your Supabase project URL, publishable key, service role key, admin password, and admin session secret
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
  sort_order integer default 0,
  created_at timestamptz default now()
);
```

Create an admin-editable landing page content table:

```sql
create table public.site_content (
  id text primary key,
  content jsonb not null default '{}'::jsonb,
  updated_at timestamptz default now()
);
```

Recommended storage buckets:

- `portfolio-previews` for compressed previews
- `digital-downloads` for original purchased files

Recommended row shape:

- `image_url`: public preview/display asset
- `preview_url`: optional smaller crop or alt preview
- `download_label`: text shown to the buyer

## Admin dashboard

The admin dashboard lives at `/admin`.

Required environment variables:

- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `SUPABASE_SERVICE_ROLE_KEY`
- `ADMIN_PASSWORD`
- `ADMIN_SESSION_SECRET`
- `SUPABASE_IMAGE_BUCKET`

What it supports:

- password-protected admin login
- landing-page text editing
- double-click replace for landing-page images sourced from product records
- product editing for title, slug, category, description, price, and visibility
- drag-and-drop collection ordering
- upload new product images
- delete old products

Important deployment note:

- The secure admin dashboard requires a real Next.js server deployment.
- GitHub Pages is no longer a valid deployment target for this project because admin auth and upload routes need server-side execution.

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
