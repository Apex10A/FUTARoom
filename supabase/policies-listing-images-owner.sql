-- Run once if owners cannot upload gallery rows when creating a listing.

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
