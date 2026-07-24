-- Simulated geo coordinates for lodge listings (FUTA Akure demo data)
alter table public.listings
  add column if not exists latitude double precision,
  add column if not exists longitude double precision;

create index if not exists listings_coordinates_idx
  on public.listings (latitude, longitude)
  where latitude is not null and longitude is not null;

comment on column public.listings.latitude is 'Simulated latitude for map display (area centroid + jitter)';
comment on column public.listings.longitude is 'Simulated longitude for map display (area centroid + jitter)';
