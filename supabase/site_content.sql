-- Editable site content (currently just the weekly line-up, key = 'lineup').
-- Only the server touches this table, with the service-role key; RLS on + no policies = no public access.
create table if not exists public.site_content (
  key text primary key,
  value jsonb not null,
  updated_at timestamptz not null default now()
);
alter table public.site_content enable row level security;
