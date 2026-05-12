create extension if not exists pgcrypto;

create table if not exists public.categories (
  id bigint primary key,
  name text not null,
  slug text not null unique,
  image text not null,
  "subCategories" jsonb not null default '[]'::jsonb
);

create table if not exists public.products (
  id bigint primary key,
  title text not null,
  category text not null,
  "subCategory" text not null,
  price integer not null check (price >= 0),
  "oldPrice" integer check ("oldPrice" is null or "oldPrice" >= 0),
  image text not null,
  images jsonb not null default '[]'::jsonb,
  description text not null,
  rating numeric(2, 1) not null default 0,
  reviews integer not null default 0,
  stock integer not null default 0,
  badge text check (badge is null or badge in ('sale', 'hit', 'new')),
  installment integer,
  attributes jsonb not null default '{}'::jsonb,
  "createdAt" timestamptz not null default now(),
  "updatedAt" timestamptz not null default now()
);

create table if not exists public.profiles (
  id text primary key,
  name text not null,
  email text not null,
  phone text not null,
  "registeredAt" date not null default current_date,
  "cartItems" integer not null default 0,
  "totalOrders" integer not null default 0,
  "totalSpent" integer not null default 0
);

create table if not exists public.orders (
  id text primary key,
  "userId" text references public.profiles(id) on delete set null,
  "userName" text not null,
  items jsonb not null,
  total integer not null check (total >= 0),
  status text not null default 'pending' check (status in ('pending', 'confirmed', 'shipping', 'delivered', 'cancelled')),
  date date not null default current_date,
  address text not null,
  "deliveryStatus" text not null default 'not_started' check ("deliveryStatus" in ('not_started', 'courier_assigned', 'shipped', 'delivered', 'returned')),
  "deliveryService" text,
  "trackingNumber" text,
  "deliveryPrice" integer check ("deliveryPrice" is null or "deliveryPrice" >= 0),
  "deliveryComment" text,
  "createdAt" timestamptz not null default now()
);

alter table public.products
  alter column rating set default 0;

alter table public.orders
  add column if not exists "deliveryStatus" text not null default 'not_started',
  add column if not exists "deliveryService" text,
  add column if not exists "trackingNumber" text,
  add column if not exists "deliveryPrice" integer,
  add column if not exists "deliveryComment" text;

do $$
begin
  if not exists (
    select 1 from pg_constraint where conname = 'orders_delivery_status_check'
  ) then
    alter table public.orders
      add constraint orders_delivery_status_check
      check ("deliveryStatus" in ('not_started', 'courier_assigned', 'shipped', 'delivered', 'returned'));
  end if;

  if not exists (
    select 1 from pg_constraint where conname = 'orders_delivery_price_check'
  ) then
    alter table public.orders
      add constraint orders_delivery_price_check
      check ("deliveryPrice" is null or "deliveryPrice" >= 0);
  end if;
end $$;

create table if not exists public.product_reviews (
  id uuid primary key default gen_random_uuid(),
  "productId" bigint not null references public.products(id) on delete cascade,
  "customerName" text not null,
  "customerContact" text not null,
  rating integer not null check (rating between 1 and 5),
  text text not null,
  status text not null default 'pending' check (status in ('pending', 'approved', 'rejected')),
  "createdAt" timestamptz not null default now()
);

create table if not exists public.site_settings (
  key text primary key,
  value jsonb not null,
  "updatedAt" timestamptz not null default now()
);

create or replace function public.refresh_product_rating(target_product_id bigint)
returns void
language plpgsql
security definer
set search_path = public
as $$
begin
  update public.products
  set
    rating = coalesce((
      select round(avg(rating)::numeric, 1)
      from public.product_reviews
      where "productId" = target_product_id and status = 'approved'
    ), 0),
    reviews = (
      select count(*)::integer
      from public.product_reviews
      where "productId" = target_product_id and status = 'approved'
    ),
    "updatedAt" = now()
  where id = target_product_id;
end;
$$;

create or replace function public.refresh_product_rating_trigger()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  if tg_op = 'DELETE' then
    perform public.refresh_product_rating(old."productId");
    return old;
  end if;

  perform public.refresh_product_rating(new."productId");
  if tg_op = 'UPDATE' and old."productId" <> new."productId" then
    perform public.refresh_product_rating(old."productId");
  end if;
  return new;
end;
$$;

drop trigger if exists product_reviews_refresh_rating on public.product_reviews;
create trigger product_reviews_refresh_rating
after insert or update or delete on public.product_reviews
for each row execute function public.refresh_product_rating_trigger();

alter table public.categories enable row level security;
alter table public.products enable row level security;
alter table public.profiles enable row level security;
alter table public.orders enable row level security;
alter table public.product_reviews enable row level security;
alter table public.site_settings enable row level security;

drop policy if exists "Public can read categories" on public.categories;
create policy "Public can read categories"
on public.categories for select
using (true);

drop policy if exists "Public can read products" on public.products;
create policy "Public can read products"
on public.products for select
using (true);

drop policy if exists "Public can create orders" on public.orders;
create policy "Public can create orders"
on public.orders for insert
with check (status = 'pending');

drop policy if exists "Public can read approved reviews" on public.product_reviews;
create policy "Public can read approved reviews"
on public.product_reviews for select
using (status = 'approved');

drop policy if exists "Public can create pending reviews" on public.product_reviews;
create policy "Public can create pending reviews"
on public.product_reviews for insert
with check (status = 'pending');

drop policy if exists "Public can read site settings" on public.site_settings;
create policy "Public can read site settings"
on public.site_settings for select
using (true);

drop policy if exists "Users can read their profile" on public.profiles;
create policy "Users can read their profile"
on public.profiles for select
using (auth.uid()::text = id);

drop policy if exists "Users can read their orders" on public.orders;
create policy "Users can read their orders"
on public.orders for select
using (auth.uid()::text = "userId");

insert into public.site_settings (key, value)
values ('main', '{
  "phone": "+7 702 379 72 33",
  "whatsapp": "https://wa.me/77023797233",
  "email": "info@goodhome.kz",
  "city": "г. Астана, Казахстан",
  "workHours": "ПН-ВС: 10:00 - 20:00",
  "infoLinks": [
    { "label": "О нас", "href": "/about" },
    { "label": "Доставка и оплата", "href": "/delivery-payment" },
    { "label": "Обмен и возврат", "href": "/exchange-return" },
    { "label": "Гарантия качества", "href": "/quality-guarantee" },
    { "label": "Контакты", "href": "/contacts" }
  ],
  "socialLinks": [
    { "type": "instagram", "label": "Instagram", "href": "https://instagram.com/goodhomekz" },
    { "type": "youtube", "label": "YouTube", "href": "https://youtube.com/" },
    { "type": "tiktok", "label": "TikTok", "href": "https://www.tiktok.com/" },
    { "type": "whatsapp", "label": "WhatsApp", "href": "https://wa.me/77023797233" },
    { "type": "2gis", "label": "2GIS", "href": "https://2gis.kz/astana" }
  ]
}'::jsonb)
on conflict (key) do nothing;
