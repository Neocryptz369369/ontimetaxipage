# Database Schema (Postgres / Supabase)

```sql
-- USERS (riders, drivers, admins all live here)
create table users (
  id uuid primary key default gen_random_uuid(),
  role text not null check (role in ('rider','driver','admin','dispatcher')),
  phone text unique not null,
  email text unique,
  full_name text,
  photo_url text,
  rating numeric(2,1) default 5.0,
  total_rides int default 0,
  created_at timestamptz default now(),
  status text default 'active'  -- active, suspended, banned
);

-- DRIVER PROFILES
create table drivers (
  user_id uuid primary key references users(id) on delete cascade,
  license_number text not null,
  license_expiry date not null,
  insurance_doc_url text,
  background_check_status text default 'pending', -- pending, approved, rejected
  vehicle_id uuid references vehicles(id),
  is_online boolean default false,
  current_lat numeric(10,7),
  current_lng numeric(10,7),
  last_ping timestamptz,
  accepts_pets boolean default false,
  accepts_long_haul boolean default false,
  payout_method text, -- square, paypal, ach
  payout_account text
);

-- VEHICLES
create table vehicles (
  id uuid primary key default gen_random_uuid(),
  driver_id uuid references users(id),
  make text, model text, year int, color text, plate text unique,
  tier text check (tier in ('standard','xl','wav','pet','senior','long_haul','country')),
  capacity int,
  inspection_doc_url text,
  approved boolean default false
);

-- RIDES
create table rides (
  id uuid primary key default gen_random_uuid(),
  rider_id uuid references users(id),
  driver_id uuid references users(id),
  tier text not null,
  status text not null default 'requested',
    -- requested, dispatching, accepted, arriving, in_progress, completed, cancelled, no_show
  pickup_lat numeric(10,7), pickup_lng numeric(10,7), pickup_address text,
  dropoff_lat numeric(10,7), dropoff_lng numeric(10,7), dropoff_address text,
  is_long_haul boolean default false,
  is_round_trip boolean default false,
  scheduled_for timestamptz,  -- null = on-demand
  quoted_fare numeric(10,2) not null,
  final_fare numeric(10,2),
  distance_mi numeric(8,2),
  duration_min int,
  payment_method text, -- square, paypal, cash
  payment_status text default 'pending',
  rider_rating int, driver_rating int,
  rider_note text, driver_note text,
  created_at timestamptz default now(),
  completed_at timestamptz
);

-- PAYMENTS
create table payments (
  id uuid primary key default gen_random_uuid(),
  ride_id uuid references rides(id),
  processor text, -- square, paypal, cash
  processor_txn_id text,
  amount numeric(10,2),
  driver_payout numeric(10,2),
  platform_fee numeric(10,2),
  status text,
  created_at timestamptz default now()
);

-- MESSAGES (in-app chat)
create table messages (
  id uuid primary key default gen_random_uuid(),
  ride_id uuid references rides(id),
  sender_id uuid references users(id),
  body text,
  created_at timestamptz default now()
);

-- ZONES (for country run flat pricing)
create table zones (
  id uuid primary key default gen_random_uuid(),
  name text, -- "Sellersburg Rural", "Charlestown Outer"
  polygon jsonb, -- GeoJSON
  flat_addon numeric(10,2)
);

-- SOS / SAFETY
create table sos_events (
  id uuid primary key default gen_random_uuid(),
  ride_id uuid references rides(id),
  triggered_by uuid references users(id),
  lat numeric, lng numeric,
  resolved boolean default false,
  created_at timestamptz default now()
);
```
