-- Run once in Supabase SQL Editor if the app logs:
-- "permission denied for table listings"
--
-- RLS policies control *which rows* are visible.
-- These GRANTs let the anon/authenticated roles access the tables at all.

grant usage on schema public to anon, authenticated;

grant select on public.listings to anon, authenticated;
grant select on public.listing_images to anon, authenticated;
grant select on public.profiles to anon, authenticated;

grant select, insert, update, delete on public.favorites to authenticated;
grant insert, update, delete on public.listings to authenticated;
grant insert, delete on public.listing_images to authenticated;
grant update on public.profiles to authenticated;
