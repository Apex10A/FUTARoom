-- FUTARoom sample listings
--
-- Prerequisites:
-- 1. schema.sql has been run
-- 2. policies-public-read.sql has been run (gallery + owner contact on detail page)
-- 3. Register at least one owner account (/register?role=owner)
--
-- Safe to re-run: skips if any approved listing already exists.

do $$
declare
  owner_uuid uuid;
  listing_id uuid;
begin
  select id
  into owner_uuid
  from public.profiles
  where role = 'owner'
  order by created_at
  limit 1;

  if owner_uuid is null then
    raise exception 'No owner profile found. Register at /register?role=owner first.';
  end if;

  if exists (select 1 from public.listings where status = 'approved' limit 1) then
    raise notice 'Seed skipped: approved listings already exist.';
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
      95000,
      '5 min walk',
      array['Water', 'Security', 'WiFi'],
      'approved',
      true,
      'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=800&q=80',
      '2026-05-05'::timestamptz
    ),
    (
      owner_uuid,
      'Peaceful Heights',
      'Spacious self-contain units with private kitchenette and backup generator. Ideal if you want more privacy near South Gate.',
      'south-gate',
      'South Gate',
      'self-contain',
      'Self-contain',
      120000,
      '8 min walk',
      array['Water', 'Generator', 'Kitchen'],
      'approved',
      true,
      'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=800&q=80',
      '2026-05-20'::timestamptz
    ),
    (
      owner_uuid,
      'North Gate Comfort Suites',
      'Affordable shared rooms close to North Gate. Clean compound with on-site security and borehole water.',
      'north-gate',
      'North Gate',
      'two-in-room',
      '2-in-a-room',
      85000,
      '3 min walk',
      array['Water', 'Security'],
      'approved',
      true,
      'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800&q=80',
      '2026-04-28'::timestamptz
    ),
    (
      owner_uuid,
      'Ibule Student Lodge',
      'Budget-friendly lodge in Ibule for students who prefer a calmer area away from the main gate traffic.',
      'ibule',
      'Ibule',
      'three-in-room',
      '3-in-a-room',
      70000,
      '12 min bike',
      array['Water', 'Borehole'],
      'approved',
      false,
      'https://images.unsplash.com/photo-1484154218962-a197022b5858?w=800&q=80',
      '2026-03-15'::timestamptz
    ),
    (
      owner_uuid,
      'Royal Self-Contain Ibule',
      'Premium self-contain in Ibule with WiFi, kitchen, and generator. Good for students who study late.',
      'ibule',
      'Ibule',
      'self-contain',
      'Self-contain',
      140000,
      '10 min bike',
      array['Water', 'WiFi', 'Kitchen', 'Generator'],
      'approved',
      true,
      'https://images.unsplash.com/photo-1493809842364-78817add7ffb?w=800&q=80',
      '2026-05-10'::timestamptz
    ),
    (
      owner_uuid,
      'Apatapiti Homely Lodge',
      'Homely lodge in Apatapiti with shared facilities and a friendly compound atmosphere.',
      'apatapiti',
      'Apatapiti',
      'two-in-room',
      '2-in-a-room',
      65000,
      '15 min bike',
      array['Water', 'Security'],
      'approved',
      true,
      'https://images.unsplash.com/photo-1554995207-c18c203602cb?w=800&q=80',
      '2026-03-25'::timestamptz
    ),
    (
      owner_uuid,
      'Ondo Road Executive Flat',
      'Executive flat on Ondo Road with parking and generator. Best for students with transport or postgraduate residents.',
      'ondo-road',
      'Ondo Road',
      'flat',
      'Flat / apartment',
      220000,
      '20 min drive',
      array['Water', 'WiFi', 'Parking', 'Generator'],
      'approved',
      true,
      'https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?w=800&q=80',
      '2026-04-10'::timestamptz
    ),
    (
      owner_uuid,
      'FUTA Community Hostel',
      'Hostel-style rooms at the edge of FUTA Community. Short walk to campus facilities.',
      'futa-community',
      'FUTA Community',
      'single',
      'Single room',
      110000,
      'On campus edge',
      array['Water', 'Security', 'WiFi'],
      'approved',
      true,
      'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=800&q=80',
      '2026-05-28'::timestamptz
    ),
    (
      owner_uuid,
      'Akure Town Budget Lodge',
      'Low-cost option in Akure Township for students comfortable commuting to FUTA daily.',
      'akure-town',
      'Akure Township',
      'three-in-room',
      '3-in-a-room',
      55000,
      '25 min drive',
      array['Water'],
      'approved',
      false,
      'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=800&q=80',
      '2026-03-01'::timestamptz
    ),
    (
      owner_uuid,
      'South Gate Premium Self-Contain',
      'Premium self-contain near South Gate with AC, kitchen, and fast WiFi. One of the most requested listings in the area.',
      'south-gate',
      'South Gate',
      'self-contain',
      'Self-contain',
      180000,
      '6 min walk',
      array['Water', 'WiFi', 'Kitchen', 'AC'],
      'approved',
      true,
      'https://images.unsplash.com/photo-1560185127-6ed189bf02f4?w=800&q=80',
      '2026-06-01'::timestamptz
    ),
    (
      owner_uuid,
      'North Gate Single Rooms',
      'Single rooms at North Gate with generator backup and 24-hour security. Close to lecture halls.',
      'north-gate',
      'North Gate',
      'single',
      'Single room',
      100000,
      '4 min walk',
      array['Water', 'Security', 'Generator'],
      'approved',
      true,
      'https://images.unsplash.com/photo-1574643150339-04e90be74463?w=800&q=80',
      '2026-05-15'::timestamptz
    ),
    (
      owner_uuid,
      'Ibule Garden Lodge',
      'Garden lodge in Ibule with borehole water and shared compound space. Good value for 2-in-a-room.',
      'ibule',
      'Ibule',
      'two-in-room',
      '2-in-a-room',
      90000,
      '11 min bike',
      array['Water', 'Borehole', 'Security'],
      'approved',
      true,
      'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800&q=80',
      '2026-04-20'::timestamptz
    );

  for listing_id in
    select id from public.listings where owner_id = owner_uuid
  loop
    insert into public.listing_images (listing_id, url, sort_order)
    select
      listing_id,
      l.image_url,
      0
    from public.listings l
    where l.id = listing_id;

    insert into public.listing_images (listing_id, url, sort_order)
    select
      listing_id,
      'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=1200&q=80',
      1
    from public.listings l
    where l.id = listing_id
      and l.title in (
        'Green View Lodge',
        'Peaceful Heights',
        'Royal Self-Contain Ibule',
        'Ondo Road Executive Flat',
        'South Gate Premium Self-Contain'
      );
  end loop;

  raise notice 'Seeded 12 approved listings for owner %', owner_uuid;
end $$;
