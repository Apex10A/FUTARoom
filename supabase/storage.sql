-- Run in Supabase SQL Editor after creating the "listing-images" bucket
-- Dashboard → Storage → New bucket → name: listing-images → Public bucket: ON
-- Recommended: set file size limit to 50 MB+ (Settings → Global → File size limit)
-- Photos and lodge videos (MP4/MOV) upload to the same bucket under {user_id}/...

-- Allow anyone to view listing photos (public bucket)
create policy "Public can view listing images"
on storage.objects for select
to public
using (bucket_id = 'listing-images');

-- Allow signed-in users to upload to their own folder: {user_id}/...
create policy "Authenticated users can upload listing images"
on storage.objects for insert
to authenticated
with check (
  bucket_id = 'listing-images'
  and (storage.foldername(name))[1] = auth.uid()::text
);

-- Allow users to update/delete their own uploads
create policy "Users can update own listing images"
on storage.objects for update
to authenticated
using (
  bucket_id = 'listing-images'
  and (storage.foldername(name))[1] = auth.uid()::text
);

create policy "Users can delete own listing images"
on storage.objects for delete
to authenticated
using (
  bucket_id = 'listing-images'
  and (storage.foldername(name))[1] = auth.uid()::text
);
