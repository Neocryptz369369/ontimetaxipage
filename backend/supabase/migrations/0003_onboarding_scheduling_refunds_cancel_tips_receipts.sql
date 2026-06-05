-- 7. DRIVER ONBOARDING
create table if not exists public.driver_documents (
  id            uuid primary key default gen_random_uuid(),
  driver_id    uuid not null references public.users(id) on delete cascade,
  kind          text not null check (kind in ('license','insurance','registration','vehicle_photo','background_check')),
  storage_path text not null,
  status        text not null default 'pending' check (status in ('pending','approved','rejected')),
  reviewer_id  uuid references public.users(id),
  notes         text,
  created_at   timestamptz not null default now(),
  reviewed_at  timestamptz
);
create index if not exists driver_documents_driver_idx on public.driver_documents(driver_id);
create index if not exists driver_documents_status_idx on public.driver_documents(status);

alter table public.drivers
  add column if not exists onboarding_status text not null default 'pending'
    check (onboarding_status in ('pending','in_review','approved','rejected'));

-- 8. SCHEDULING
alter table public.rides
  add column if not exists scheduled_for timestamptz,
  add column if not exists is_scheduled  boolean not null default false;
create index if not exists rides_scheduled_idx on public.rides(scheduled_for) where is_scheduled = true;

-- 10. REFUNDS
alter table public.payments
  add column if not exists refunded_cents int not null default 0,
  add column if not exists refund_id      text,
  add column if not exists refunded_at    timestamptz,
  add column if not exists refund_reason  text;

-- 13. CANCELLATION FEES
create table if not exists public.cancellation_policies (
  id              uuid primary key default gen_random_uuid(),
  tier            text not null,
  grace_seconds   int  not null default 120,
  fee_cents       int  not null default 500,
  active          boolean not null default true,
  updated_at      timestamptz not null default now()
);
insert into public.cancellation_policies (tier, grace_seconds, fee_cents)
  select t, 120, 500 from unnest(array['standard','xl','country','longhaul','pet','wav','senior']) as t
  on conflict do nothing;

alter table public.rides
  add column if not exists cancelled_by      text check (cancelled_by in ('rider','driver','system')),
  add column if not exists cancelled_at      timestamptz,
  add column if not exists cancel_fee_cents  int not null default 0,
  add column if not exists cancel_reason     text;

-- 16. TIPS
alter table public.payments
  add column if not exists tip_cents     int not null default 0;
alter table public.rides
  add column if not exists tip_cents     int not null default 0;

-- 19. EMAIL RECEIPTS log
create table if not exists public.receipts (
  id          uuid primary key default gen_random_uuid(),
  ride_id    uuid not null references public.rides(id) on delete cascade,
  email       text not null,
  provider_id text,
  sent_at    timestamptz not null default now()
);
