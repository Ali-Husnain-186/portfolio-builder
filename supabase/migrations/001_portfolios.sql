-- Portfolios schema, RLS, and storage for Portfolio Builder
-- Run this in Supabase SQL Editor (or via supabase db push)

create extension if not exists "pgcrypto";

create table if not exists public.portfolios (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null unique references auth.users (id) on delete cascade,
  username text not null unique,
  full_name text not null,
  title text not null default '',
  bio text not null default '',
  email text not null default '',
  location text,
  avatar_url text,
  skills text[] not null default '{}',
  projects jsonb not null default '[]'::jsonb,
  experience jsonb not null default '[]'::jsonb,
  education jsonb not null default '[]'::jsonb,
  social_links jsonb not null default '{}'::jsonb,
  cv_path text,
  cv_filename text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint username_format check (
    username ~ '^[a-z0-9]([a-z0-9_-]*[a-z0-9])?$'
    and char_length(username) between 3 and 30
  )
);

create index if not exists portfolios_username_idx on public.portfolios (username);
create index if not exists portfolios_user_id_idx on public.portfolios (user_id);

create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists portfolios_set_updated_at on public.portfolios;
create trigger portfolios_set_updated_at
  before update on public.portfolios
  for each row execute function public.set_updated_at();

alter table public.portfolios enable row level security;

drop policy if exists "Public can read portfolios" on public.portfolios;
create policy "Public can read portfolios"
  on public.portfolios
  for select
  using (true);

drop policy if exists "Users can insert own portfolio" on public.portfolios;
create policy "Users can insert own portfolio"
  on public.portfolios
  for insert
  with check (auth.uid() = user_id);

drop policy if exists "Users can update own portfolio" on public.portfolios;
create policy "Users can update own portfolio"
  on public.portfolios
  for update
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

drop policy if exists "Users can delete own portfolio" on public.portfolios;
create policy "Users can delete own portfolio"
  on public.portfolios
  for delete
  using (auth.uid() = user_id);

-- Storage bucket for avatars and CVs
insert into storage.buckets (id, name, public)
values ('portfolio-files', 'portfolio-files', true)
on conflict (id) do update set public = true;

drop policy if exists "Public read portfolio files" on storage.objects;
create policy "Public read portfolio files"
  on storage.objects
  for select
  using (bucket_id = 'portfolio-files');

drop policy if exists "Users upload own portfolio files" on storage.objects;
create policy "Users upload own portfolio files"
  on storage.objects
  for insert
  with check (
    bucket_id = 'portfolio-files'
    and auth.uid()::text = (storage.foldername(name))[1]
  );

drop policy if exists "Users update own portfolio files" on storage.objects;
create policy "Users update own portfolio files"
  on storage.objects
  for update
  using (
    bucket_id = 'portfolio-files'
    and auth.uid()::text = (storage.foldername(name))[1]
  );

drop policy if exists "Users delete own portfolio files" on storage.objects;
create policy "Users delete own portfolio files"
  on storage.objects
  for delete
  using (
    bucket_id = 'portfolio-files'
    and auth.uid()::text = (storage.foldername(name))[1]
  );
