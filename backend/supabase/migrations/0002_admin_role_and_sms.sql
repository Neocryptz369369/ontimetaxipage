-- Admin role + ride-status SMS trigger

alter table public.users
  add column if not exists role text not null default 'rider'
    check (role in ('rider','driver','admin'));

create index if not exists users_role_idx on public.users(role);

-- RLS: admins can read/write everything
do $$ begin
  create policy "admins read all users"   on public.users   for select using (
    exists (select 1 from public.users u where u.id = auth.uid() and u.role = 'admin')
  );
exception when duplicate_object then null; end $$;

do $$ begin
  create policy "admins read all rides"   on public.rides   for select using (
    exists (select 1 from public.users u where u.id = auth.uid() and u.role = 'admin')
  );
exception when duplicate_object then null; end $$;

do $$ begin
  create policy "admins update tiers"     on public.tiers   for all using (
    exists (select 1 from public.users u where u.id = auth.uid() and u.role = 'admin')
  );
exception when duplicate_object then null; end $$;

-- DB webhook target: call the ride-status-sms edge function on UPDATE of rides.status.
-- (Configure the actual webhook in Supabase Studio -> Database -> Webhooks,
--  pointing at /functions/v1/ride-status-sms with service-role auth.)
comment on table public.rides is
  'Webhook: on UPDATE where status changes, POST row to /functions/v1/ride-status-sms';
