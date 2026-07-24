-- Simulated geo coordinates for lodge listings (FUTA Akure demo data)
-- Safe to re-run: adds columns if missing, then backfills pins.

alter table public.listings
  add column if not exists latitude double precision,
  add column if not exists longitude double precision;

create index if not exists listings_coordinates_idx
  on public.listings (latitude, longitude)
  where latitude is not null and longitude is not null;

do $$
declare
  listing record;
  base_lat double precision;
  base_lng double precision;
  lat_jitter double precision;
  lng_jitter double precision;
begin
  for listing in
    select id, area_id
    from public.listings
  loop
    base_lat := case listing.area_id
      when 'south-gate' then 7.252
      when 'north-gate' then 7.262
      when 'west-gate' then 7.258
      when 'alagbaka' then 7.268
      when 'lafe' then 7.235
      when 'oke-odu' then 7.250
      when 'ibule' then 7.245
      when 'apatapiti' then 7.240
      when 'ondo-road' then 7.248
      when 'akure-town' then 7.252
      when 'futa-community' then 7.259
      else 7.2574
    end;

    base_lng := case listing.area_id
      when 'south-gate' then 5.138
      when 'north-gate' then 5.142
      when 'west-gate' then 5.132
      when 'alagbaka' then 5.152
      when 'lafe' then 5.142
      when 'oke-odu' then 5.175
      when 'ibule' then 5.155
      when 'apatapiti' then 5.148
      when 'ondo-road' then 5.165
      when 'akure-town' then 5.195
      when 'futa-community' then 5.145
      else 5.141
    end;

    lat_jitter := ((get_byte(decode(md5(listing.id::text || ':lat'), 'hex'), 0)::float / 255) - 0.5) * 0.012;
    lng_jitter := ((get_byte(decode(md5(listing.id::text || ':lng'), 'hex'), 0)::float / 255) - 0.5) * 0.012;

    update public.listings
    set
      latitude = base_lat + lat_jitter,
      longitude = base_lng + lng_jitter
    where id = listing.id;
  end loop;

  -- Offers on the same lodge share one pin
  update public.listings as target
  set
    latitude = source.latitude,
    longitude = source.longitude
  from (
    select distinct on (property_group_id)
      property_group_id,
      latitude,
      longitude
    from public.listings
    where property_group_id is not null
      and latitude is not null
      and longitude is not null
    order by property_group_id, price_per_year asc
  ) as source
  where target.property_group_id = source.property_group_id;

  raise notice 'Simulated coordinates applied to listings.';
end $$;
