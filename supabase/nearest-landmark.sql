-- Optional free-text landmark for lodges that aren't well mapped on OpenStreetMap
alter table public.listings
  add column if not exists nearest_landmark text;

comment on column public.listings.nearest_landmark is
  'Owner-supplied nearby landmark (e.g. "behind Chapel of the Transfiguration"), shown to students when the exact building is not well mapped.';
