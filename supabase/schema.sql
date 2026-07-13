-- Run this in Supabase: SQL Editor → New query → Run
-- FUTARoom initial schema

create type public.user_role as enum ('student', 'owner', 'admin');
create type public.listing_status as enum ('pending', 'approved', 'rejected');

create table public.profiles (
  id uuid primary key references auth.users (id) on delete cascade,
  full_name text not null,
  phone text,
  role public.user_role not null default 'student',
  department text,
  level text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.listings (
  id uuid primary key default gen_random_uuid(),
  owner_id uuid not null references public.profiles (id) on delete cascade,
  title text not null,
  description text not null,
  area_id text not null,
  area_label text not null,
  room_type_id text not null,
  room_type_label text not null,
  price_per_year integer not null,
  distance_to_gate text,
  amenities text[] not null default '{}',
  status public.listing_status not null default 'pending',
  verified boolean not null default false,
  image_url text not null,
  listed_at timestamptz not null default now(),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.listing_images (
  id uuid primary key default gen_random_uuid(),
  listing_id uuid not null references public.listings (id) on delete cascade,
  url text not null,
  sort_order integer not null default 0,
  created_at timestamptz not null default now()
);

create table public.favorites (
  user_id uuid not null references public.profiles (id) on delete cascade,
  listing_id uuid not null references public.listings (id) on delete cascade,
  created_at timestamptz not null default now(),
  primary key (user_id, listing_id)
);

-- Auto-create profile when a user signs up
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (id, full_name, phone, role)
  values (
    new.id,
    coalesce(new.raw_user_meta_data->>'full_name', ''),
    new.raw_user_meta_data->>'phone',
    coalesce((new.raw_user_meta_data->>'role')::public.user_role, 'student')
  );
  return new;
end;
$$;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- Row Level Security
alter table public.profiles enable row level security;
alter table public.listings enable row level security;
alter table public.listing_images enable row level security;
alter table public.favorites enable row level security;

-- Profiles: users can read/update their own row
create policy "Users can view own profile"
  on public.profiles for select
  using (auth.uid() = id);

create policy "Users can update own profile"
  on public.profiles for update
  using (auth.uid() = id);

-- Listings: public can read approved; owners manage their own
create policy "Anyone can view approved listings"
  on public.listings for select
  using (status = 'approved');

create policy "Owners can view own listings"
  on public.listings for select
  using (auth.uid() = owner_id);

create policy "Owners can insert own listings"
  on public.listings for insert
  with check (auth.uid() = owner_id);

create policy "Owners can update own listings"
  on public.listings for update
  using (auth.uid() = owner_id);

-- Favorites: users manage their own
create policy "Users can view own favorites"
  on public.favorites for select
  using (auth.uid() = user_id);

create policy "Users can add favorites"
  on public.favorites for insert
  with check (auth.uid() = user_id);

create policy "Users can remove favorites"
  on public.favorites for delete
  using (auth.uid() = user_id);

-- API roles need table-level grants (RLS alone is not enough)
grant usage on schema public to anon, authenticated;

grant select on public.listings to anon, authenticated;
grant select on public.listing_images to anon, authenticated;
grant select on public.profiles to anon, authenticated;

grant select, insert, update, delete on public.favorites to authenticated;
grant insert, update, delete on public.listings to authenticated;
grant insert, delete on public.listing_images to authenticated;
grant update on public.profiles to authenticated;

-- Agent price transparency: group multiple offers per lodge
alter table public.listings
  add column if not exists property_group_id uuid;

create index if not exists listings_property_group_id_idx
  on public.listings (property_group_id)
  where property_group_id is not null;

-- Owners manage gallery rows for their own listings
create policy "Owners can view images for own listings"
  on public.listing_images for select
  using (
    exists (
      select 1
      from public.listings
      where listings.id = listing_images.listing_id
        and listings.owner_id = auth.uid()
    )
  );

create policy "Owners can insert images for own listings"
  on public.listing_images for insert
  with check (
    exists (
      select 1
      from public.listings
      where listings.id = listing_images.listing_id
        and listings.owner_id = auth.uid()
    )
  );

create policy "Owners can delete images for own listings"
  on public.listing_images for delete
  using (
    exists (
      select 1
      from public.listings
      where listings.id = listing_images.listing_id
        and listings.owner_id = auth.uid()
    )
  );

-- Admin moderation
create or replace function public.is_admin()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1
    from public.profiles
    where id = auth.uid()
      and role = 'admin'
  );
$$;

create policy "Admins can view all listings"
  on public.listings for select
  using (public.is_admin());

create policy "Admins can update any listing"
  on public.listings for update
  using (public.is_admin());

create policy "Admins can view all profiles"
  on public.profiles for select
  using (public.is_admin());
