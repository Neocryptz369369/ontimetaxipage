-- On Time Taxi initial schema
create extension if not exists "pgcrypto";

create table users (
  id uuid primary key default gen_random_uuid(),
  role text not null check (role in ('rider','driver','admin','dispatcher')),
  phone text unique not null,
  email text unique,
  full_name text,
  photo_url text,
  rating numeric(2,1) default 5.0,
  total_rides int default 0,
  status text default 'active',
  created_at timestamptz default now()
);

create table vehicles (
  id uuid primary key default gen_random_uuid(),
  driver_id uuid,
  make text, model text, year int, color text, plate text unique,
  tier text check (tier in ('standard','xl','wav','pet','senior','long_haul','country')),
  capacity int,
  inspection_doc_url text,
  approved boolean default false
);

create table drivers (
  user_id uuid primary key references users(id) on delete cascade,
  license_number text not null,
  license_expiry date not null,
  insurance_doc_url text,
  background_check_status text default 'pending',
  vehicle_id uuid references vehicles(id),
  is_online boolean default false,
  current_lat numeric(10,7),
  current_lng numeric(10,7),
  last_ping timestamptz,
  accepts_pets boolean default false,
  accepts_long_haul boolean default false,
  payout_method text,
  payout_account text
);
alter table vehicles add constraint vehicles_driver_fk foreign key (driver_id) references users(id);

create table rides (
  id uuid primary key default gen_random_uuid(),
  rider_id uuid references users(id),
  driver_id uuid references users(id),
  tier text not null,
  status text not null default 'requested',
  pickup_lat numeric(10,7), pickup_lng numeric(10,7), pickup_address text,
  dropoff_lat numeric(10,7), dropoff_lng numeric(10,7), dropoff_address text,
  is_long_haul boolean default false,
  is_round_trip boolean default false,
  scheduled_for timestamptz,
  quoted_fare numeric(10,2) not null,
  final_fare numeric(10,2),
  distance_mi numeric(8,2),
  duration_min int,
  payment_method text,
  payment_status text default 'pending',
  rider_rating int, driver_rating int,
  rider_note text, driver_note text,
  created_at timestamptz default now(),
  completed_at timestamptz
);

create table payments (
  id uuid primary key default gen_random_uuid(),
  ride_id uuid references rides(id),
  processor text,
  processor_txn_id text,
  amount numeric(10,2),
  driver_payout numeric(10,2),
  platform_fee numeric(10,2),
  status text,
  created_at timestamptz default now()
);

create table messages (
  id uuid primary key default gen_random_uuid(),
  ride_id uuid references rides(id),
  sender_id uuid references users(id),
  body text,
  created_at timestamptz default now()
);

create table zones (
  id uuid primary key default gen_random_uuid(),
  name text,
  polygon jsonb,
  flat_addon numeric(10,2)
);

create table sos_events (
  id uuid primary key default gen_random_uuid(),
  ride_id uuid references rides(id),
  triggered_by uuid references users(id),
  lat numeric, lng numeric,
  resolved boolean default false,
  created_at timestamptz default now()
);

create index idx_drivers_online on drivers(is_online) where is_online = true;
create index idx_rides_status on rides(status);
create index idx_rides_rider on rides(rider_id);
create index idx_rides_driver on rides(driver_id);
