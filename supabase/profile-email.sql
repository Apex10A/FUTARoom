-- Add email to profiles (synced from auth.users on signup)
-- Run in Supabase: SQL Editor → New query → Run

alter table public.profiles
  add column if not exists email text;

-- Backfill existing profiles from auth.users
update public.profiles p
set email = u.email
from auth.users u
where u.id = p.id
  and (p.email is null or p.email is distinct from u.email);

-- Keep new signups in sync
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (id, full_name, email, phone, role)
  values (
    new.id,
    coalesce(new.raw_user_meta_data->>'full_name', ''),
    new.email,
    new.raw_user_meta_data->>'phone',
    coalesce((new.raw_user_meta_data->>'role')::public.user_role, 'student')
  );
  return new;
end;
$$;
