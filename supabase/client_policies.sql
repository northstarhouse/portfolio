alter table public.products enable row level security;
alter table public.site_content enable row level security;

drop policy if exists "public read products" on public.products;
create policy "public read products"
on public.products
for select
using (true);

drop policy if exists "public write products" on public.products;
create policy "public write products"
on public.products
for all
using (true)
with check (true);

drop policy if exists "public read site content" on public.site_content;
create policy "public read site content"
on public.site_content
for select
using (true);

drop policy if exists "public write site content" on public.site_content;
create policy "public write site content"
on public.site_content
for all
using (true)
with check (true);

insert into storage.buckets (id, name, public)
values ('portfolio-previews', 'portfolio-previews', true)
on conflict (id) do nothing;

drop policy if exists "public read portfolio previews" on storage.objects;
create policy "public read portfolio previews"
on storage.objects
for select
using (bucket_id = 'portfolio-previews');

drop policy if exists "public write portfolio previews" on storage.objects;
create policy "public write portfolio previews"
on storage.objects
for all
using (bucket_id = 'portfolio-previews')
with check (bucket_id = 'portfolio-previews');
