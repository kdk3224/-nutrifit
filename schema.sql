-- NutriFit sponsor backend
create table if not exists public.sponsors (
  id uuid primary key default gen_random_uuid(),
  business_name text not null,
  ad_text text not null,
  website_url text,
  image_path text not null,
  plan text not null check (plan in ('day','week','month')),
  duration_hours integer not null check (duration_hours in (24,168,720)),
  status text not null default 'pending' check (status in ('pending','active','expired','cancelled')),
  stripe_session_id text unique,
  client_reference_id text unique,
  starts_at timestamptz,
  expires_at timestamptz,
  created_at timestamptz not null default now()
);

create index if not exists sponsors_active_idx
on public.sponsors(status, expires_at);

alter table public.sponsors enable row level security;

-- Public users may only read active sponsors.
drop policy if exists "public read active sponsors" on public.sponsors;
create policy "public read active sponsors"
on public.sponsors for select
to anon, authenticated
using (status = 'active' and expires_at > now());

-- All inserts/updates are done server-side with the Supabase secret key.
