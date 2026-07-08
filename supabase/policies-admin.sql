-- Run once so admin accounts can review and approve/reject all listings.
-- Requires at least one profile with role = 'admin'.

create or replace function public.is_admin()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1
    from public.profiles
    where id = auth.uid()
      and role = 'admin'
  );
$$;

create policy "Admins can view all listings"
  on public.listings for select
  using (public.is_admin());

create policy "Admins can update any listing"
  on public.listings for update
  using (public.is_admin());

create policy "Admins can view all profiles"
  on public.profiles for select
  using (public.is_admin());
