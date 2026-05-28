-- On-Time Taxi: initial schema
create extension if not exists "uuid-ossp";
create extension if not exists postgis;

-- USERS
create table if not exists users (
  id uuid primary key default gen_random_uuid(),
  role text not null check (role in ('rider','driver','admin','dispatcher')),
  phone text unique not null,
  email text unique,
  full_name text,
  photo_url text,
  rating numeric(2,1) default 5.0,
  total_rides int default 0,
  status text default 'active' check (status in ('active','suspended','banned')),
  created_at timestamptz default now()
);

-- VEHICLES
create table if not exists vehicles (
  id uuid primary key default gen_random_uuid(),
  make text not null,
  model text not null,
  year int not null,
  plate text unique not null,
  color text,
  capacity int not null default 4,
  is_wav boolean default false,
  is_xl boolean default false,
  created_at timestamptz default now()
);

-- DRIVERS
create table if not exists drivers (
  user_id uuid primary key references users(id) on delete cascade,
  license_number text not null,
  license_expiry date not null,
  insurance_doc_url text,
  background_check_status text default 'pending' check (background_check_status in ('pending','approved','rejected')),
  vehicle_id uuid references vehicles(id),
  is_online boolean default false,
  current_lat numeric(10,7),
  current_lng numeric(10,7),
  last_ping timestamptz,
  accepts_pets boolean default false,
  accepts_long_haul boolean default false,
  accepts_country_run boolean default true,
  senior_certified boolean default false,
  payout_method text check (payout_method in ('square','paypal','ach')),
  payout_account text
);

-- RIDER PROFILES
create table if not exists riders (
  user_id uuid primary key references users(id) on delete cascade,
  default_payment_method text check (default_payment_method in ('square','paypal','cash')),
  square_customer_id text,
  paypal_payer_id text,
  saved_addresses jsonb default '[]'::jsonb
);

-- TIERS (editable in admin)
create table if not exists tiers (
  code text primary key,
  name text not null,
  base_fare numeric(8,2) not null,
  per_mile numeric(6,2) not null default 0,
  per_minute numeric(6,2) not null default 0,
  minimum_fare numeric(8,2) not null,
  surcharge numeric(8,2) default 0,
  long_haul_per_mile_rt numeric(6,2),
  active boolean default true
);

insert into tiers (code,name,base_fare,per_mile,per_minute,minimum_fare,surcharge,long_haul_per_mile_rt) values
  ('standard','Standard',3.50,1.85,0.30,8.00,0,null),
  ('xl','XL',5.00,2.50,0.40,14.00,0,null),
  ('country','Country Run',8.00,1.85,0.30,15.00,0,null),
  ('long_haul','Long Haul',25.00,0,0,75.00,0,1.50),
  ('pet','Pet-Friendly',3.50,1.85,0.30,8.00,5,null),
  ('wav','Wheelchair Accessible',3.50,1.85,0.30,8.00,0,null),
  ('senior','Senior Assist',3.50,1.85,0.30,8.00,3,null)
on conflict (code) do nothing;

-- RURAL/ZONE FLATS for Country Run
create table if not exists zones (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  flat_addon numeric(8,2) not null default 0,
  polygon jsonb -- GeoJSON polygon
);

-- RIDES
create table if not exists rides (
  id uuid primary key default gen_random_uuid(),
  rider_id uuid not null references users(id),
  driver_id uuid references users(id),
  tier_code text not null references tiers(code),
  status text not null default 'requested' check (status in (
    'requested','searching','accepted','arriving','arrived','in_progress','completed','canceled','no_show'
  )),
  pickup_address text not null,
  pickup_lat numeric(10,7) not null,
  pickup_lng numeric(10,7) not null,
  dropoff_address text not null,
  dropoff_lat numeric(10,7) not null,
  dropoff_lng numeric(10,7) not null,
  is_out_of_state boolean default false,
  is_round_trip boolean default false,
  estimated_miles numeric(8,2),
  estimated_minutes numeric(8,2),
  quoted_fare numeric(8,2) not null,
  final_fare numeric(8,2),
  tolls numeric(8,2) default 0,
  payment_method text not null check (payment_method in ('square','paypal','cash')),
  payment_status text default 'pending' check (payment_status in ('pending','authorized','captured','refunded','failed')),
  payment_ref text,
  scheduled_for timestamptz,
  requested_at timestamptz default now(),
  accepted_at timestamptz,
  picked_up_at timestamptz,
  completed_at timestamptz,
  canceled_at timestamptz,
  cancel_reason text,
  rider_rating int check (rider_rating between 1 and 5),
  driver_rating int check (driver_rating between 1 and 5),
  rider_note text,
  driver_note text
);
create index if not exists rides_status_idx on rides(status);
create index if not exists rides_rider_idx on rides(rider_id);
create index if not exists rides_driver_idx on rides(driver_id);
create index if not exists drivers_online_idx on drivers(is_online) where is_online = true;

-- PAYMENTS log
create table if not exists payments (
  id uuid primary key default gen_random_uuid(),
  ride_id uuid not null references rides(id) on delete cascade,
  provider text not null check (provider in ('square','paypal','cash')),
  provider_ref text,
  amount numeric(8,2) not null,
  status text not null,
  raw jsonb,
  created_at timestamptz default now()
);

-- DRIVER PAYOUTS
create table if not exists payouts (
  id uuid primary key default gen_random_uuid(),
  driver_id uuid not null references users(id),
  period_start date not null,
  period_end date not null,
  gross numeric(10,2) not null,
  platform_fee numeric(10,2) not null,
  net numeric(10,2) not null,
  status text default 'pending' check (status in ('pending','sent','failed')),
  provider text check (provider in ('square','paypal','ach')),
  provider_ref text,
  created_at timestamptz default now()
);

-- DRIVER LOCATION PINGS (for realtime + replay)
create table if not exists driver_pings (
  id bigserial primary key,
  driver_id uuid not null references users(id),
  lat numeric(10,7) not null,
  lng numeric(10,7) not null,
  heading numeric(5,2),
  speed_mph numeric(6,2),
  ride_id uuid references rides(id),
  created_at timestamptz default now()
);
create index if not exists driver_pings_recent_idx on driver_pings(driver_id, created_at desc);

-- ROW LEVEL SECURITY
alter table users enable row level security;
alter table riders enable row level security;
alter table drivers enable row level security;
alter table rides enable row level security;
alter table payments enable row level security;

create policy "users self read" on users for select using (auth.uid() = id);
create policy "rider sees own rides" on rides for select using (auth.uid() = rider_id or auth.uid() = driver_id);
create policy "rider inserts own ride" on rides for insert with check (auth.uid() = rider_id);
