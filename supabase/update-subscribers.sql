-- Opt-in list for people who want to be notified when FUTARoom relaunches.
-- Captured on the survey's thank-you screen, kept separate from
-- survey_responses since it's an independent, optional action.

create table if not exists public.update_subscribers (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  email text not null
);

alter table public.update_subscribers enable row level security;

create policy "Anyone can subscribe for updates"
  on public.update_subscribers for insert
  with check (true);

create policy "Admins can view update subscribers"
  on public.update_subscribers for select
  using (public.is_admin());

grant usage on schema public to anon, authenticated;
grant insert on public.update_subscribers to anon, authenticated;
grant select on public.update_subscribers to authenticated;
