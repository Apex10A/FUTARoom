-- Demo data: multiple agent offers for the same lodge (run after property-groups.sql)
-- Safe to re-run: skips if Green View already has multiple offers in one group.

do $$
declare
  group_uuid uuid;
  owner_uuid uuid;
  existing_offer_count integer;
  updated_count integer;
begin
  select count(*)
  into existing_offer_count
  from public.listings
  where title = 'Green View Lodge'
    and status = 'approved';

  if existing_offer_count >= 3 then
    raise notice 'Green View Lodge offer group already seeded.';
    return;
  end if;

  select id
  into owner_uuid
  from public.profiles
  where role = 'owner'
  order by created_at
  limit 1;

  if owner_uuid is null then
    raise exception 'No owner profile found.';
  end if;

  group_uuid := gen_random_uuid();

  update public.listings
  set property_group_id = group_uuid
  where title = 'Green View Lodge'
    and status = 'approved';

  get diagnostics updated_count = row_count;

  if updated_count = 0 then
    raise notice 'Green View Lodge not found — run seed.sql first.';
    return;
  end if;

  insert into public.listings (
    owner_id,
    title,
    description,
    area_id,
    area_label,
    room_type_id,
    room_type_label,
    price_per_year,
    distance_to_gate,
    amenities,
    status,
    verified,
    image_url,
    property_group_id,
    listed_at
  )
  values
    (
      owner_uuid,
      'Green View Lodge',
      'Quiet single rooms with steady water supply and security at the gate. Popular with engineering students walking to South Gate lectures.',
      'south-gate',
      'South Gate',
      'single',
      'Single room',
      105000,
      '5 min walk',
      array['Water', 'Security', 'WiFi'],
      'approved',
      true,
      'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=800&q=80',
      group_uuid,
      now() - interval '2 days'
    ),
    (
      owner_uuid,
      'Green View Lodge',
      'Quiet single rooms with steady water supply and security at the gate. Popular with engineering students walking to South Gate lectures.',
      'south-gate',
      'South Gate',
      'single',
      'Single room',
      118000,
      '5 min walk',
      array['Water', 'Security', 'WiFi'],
      'approved',
      false,
      'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=800&q=80',
      group_uuid,
      now() - interval '1 day'
    );

  raise notice 'Seeded Green View Lodge with 3 offers (compare prices on browse/detail).';
end $$;
