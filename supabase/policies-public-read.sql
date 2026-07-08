-- Run after schema.sql if listing detail / gallery reads fail.
-- Adds public read access for gallery images and owner contact on approved listings.

create policy "Anyone can view images for approved listings"
  on public.listing_images for select
  using (
    exists (
      select 1
      from public.listings
      where listings.id = listing_images.listing_id
        and listings.status = 'approved'
    )
  );

create policy "Anyone can view owner profile for approved listings"
  on public.profiles for select
  using (
    exists (
      select 1
      from public.listings
      where listings.owner_id = profiles.id
        and listings.status = 'approved'
    )
  );
