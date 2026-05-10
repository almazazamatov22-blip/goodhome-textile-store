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
  rating numeric(2, 1) not null default 5,
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
  "createdAt" timestamptz not null default now()
);

alter table public.categories enable row level security;
alter table public.products enable row level security;
alter table public.profiles enable row level security;
alter table public.orders enable row level security;

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

drop policy if exists "Users can read their profile" on public.profiles;
create policy "Users can read their profile"
on public.profiles for select
using (auth.uid()::text = id);

drop policy if exists "Users can read their orders" on public.orders;
create policy "Users can read their orders"
on public.orders for select
using (auth.uid()::text = "userId");
