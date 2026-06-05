-- 9. PROMO CODES
create table if not exists public.promo_codes (
  id              uuid primary key default gen_random_uuid(),
  code            text unique not null,
  kind            text not null check (kind in ('percent','flat')),
  amount          numeric not null,
  min_fare_cents  int not null default 0,
  max_uses        int,
  uses            int not null default 0,
  per_user_limit  int not null default 1,
  starts_at       timestamptz not null default now(),
  expires_at      timestamptz,
  active          boolean not null default true
);
create table if not exists public.promo_redemptions (
  id          uuid primary key default gen_random_uuid(),
  promo_id    uuid not null references public.promo_codes(id) on delete cascade,
  user_id     uuid not null references public.users(id) on delete cascade,
  ride_id     uuid references public.rides(id) on delete set null,
  redeemed_at timestamptz not null default now(),
  unique (promo_id, ride_id)
);
alter table public.rides
  add column if not exists promo_id          uuid references public.promo_codes(id),
  add column if not exists discount_cents    int not null default 0;

-- 11. CHAT
create table if not exists public.ride_messages (
  id         uuid primary key default gen_random_uuid(),
  ride_id    uuid not null references public.rides(id) on delete cascade,
  sender_id  uuid not null references public.users(id),
  body       text not null check (char_length(body) between 1 and 1000),
  created_at timestamptz not null default now()
);
create index if not exists ride_messages_ride_idx on public.ride_messages(ride_id, created_at);
alter publication supabase_realtime add table public.ride_messages;

-- 12. DRIVER PAYOUTS
create table if not exists public.payout_periods (
  id          uuid primary key default gen_random_uuid(),
  starts_on   date not null,
  ends_on     date not null,
  status      text not null default 'open' check (status in ('open','locked','paid')),
  created_at  timestamptz not null default now(),
  unique (starts_on, ends_on)
);
create table if not exists public.driver_payouts (
  id              uuid primary key default gen_random_uuid(),
  driver_id       uuid not null references public.users(id) on delete cascade,
  period_id       uuid not null references public.payout_periods(id) on delete cascade,
  gross_cents     int not null default 0,
  tips_cents      int not null default 0,
  fees_cents      int not null default 0,
  net_cents       int not null default 0,
  ride_count      int not null default 0,
  status          text not null default 'pending' check (status in ('pending','paid','failed')),
  paid_at         timestamptz,
  external_ref    text,
  created_at      timestamptz not null default now(),
  unique (driver_id, period_id)
);

-- 14. LOST & FOUND
create table if not exists public.lost_items (
  id          uuid primary key default gen_random_uuid(),
  ride_id     uuid not null references public.rides(id) on delete cascade,
  rider_id    uuid not null references public.users(id),
  description text not null,
  status      text not null default 'open' check (status in ('open','contacted','resolved','closed')),
  notes       text,
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now()
);

-- 15. SURGE
create table if not exists public.surge_zones (
  id         uuid primary key default gen_random_uuid(),
  geohash    text not null,
  multiplier numeric not null default 1.0,
  computed_at timestamptz not null default now(),
  unique (geohash)
);
create index if not exists surge_zones_geohash_idx on public.surge_zones(geohash);

-- 20. RATE LIMIT
create table if not exists public.rate_limits (
  key         text not null,
  window_start timestamptz not null,
  count       int not null default 1,
  primary key (key, window_start)
);
create index if not exists rate_limits_window_idx on public.rate_limits(window_start);
