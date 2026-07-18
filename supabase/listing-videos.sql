-- Optional lodge walkthrough video (WhatsApp agent clips)
-- Run in Supabase: SQL Editor → New query → Run
--
-- Also check Storage → listing-images bucket:
--   • File size limit: 50 MB or higher
--   • Allowed MIME types: include video/mp4 and video/quicktime (or leave unrestricted)

alter table public.listings
  add column if not exists video_url text;
