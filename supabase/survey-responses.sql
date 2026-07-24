-- Pre-platform survey: gauges housing-search pain points and platform demand
-- before FUTARoom is reopened. Open to anonymous respondents; readable only
-- by admins.

create table if not exists public.survey_responses (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),

  -- Q1: current accommodation-search method
  current_method text not null,
  current_method_other text,

  -- Q2: biggest frustration (open-ended)
  biggest_frustration text not null,

  -- Q3: importance ranking, most → least important
  -- expected values: price, distance_to_gate, room_type, amenities, safety
  priority_ranking text[] not null,

  -- Q4: scammed/misled by an agent or listing before
  was_scammed text not null,
  was_scammed_details text,

  -- Q5: trust in verified listings (real photos/video + admin verification)
  trusts_verified_listings text not null,

  -- Q6: interest in a roommate/cost-split feature
  wants_roommate_split text not null,

  -- Q7: willingness to pay a deposit online to hold a verified listing
  willing_to_pay_deposit text not null,

  -- Q8: overall adoption signal
  would_switch text not null,
  would_switch_reason text
);

alter table public.survey_responses enable row level security;

create policy "Anyone can submit a survey response"
  on public.survey_responses for insert
  with check (true);

create policy "Admins can view survey responses"
  on public.survey_responses for select
  using (public.is_admin());

grant usage on schema public to anon, authenticated;
grant insert on public.survey_responses to anon, authenticated;
grant select on public.survey_responses to authenticated;
