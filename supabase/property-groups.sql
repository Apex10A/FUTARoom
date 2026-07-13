-- Feature 1: Agent price transparency — group multiple offers for the same lodge
-- Run once in Supabase SQL Editor after schema.sql

alter table public.listings
  add column if not exists property_group_id uuid;

comment on column public.listings.property_group_id is
  'Shared ID for multiple agent/owner offers on the same physical lodge. NULL = standalone listing.';

create index if not exists listings_property_group_id_idx
  on public.listings (property_group_id)
  where property_group_id is not null;

-- Backfill: each existing listing is its own group (stable UUID per row)
update public.listings
set property_group_id = id
where property_group_id is null;
