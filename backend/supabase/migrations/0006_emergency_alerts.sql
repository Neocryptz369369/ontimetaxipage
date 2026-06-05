-- Emergency broadcast alerts: admin/dispatcher pushes message to all drivers
create table if not exists emergency_alerts (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  body text not null,
  severity text not null default 'info' check (severity in ('info','warning','critical')),
  created_by uuid references auth.users(id),
  created_at timestamptz not null default now(),
  expires_at timestamptz
);

create table if not exists emergency_alert_reads (
  alert_id uuid not null references emergency_alerts(id) on delete cascade,
  driver_id uuid not null references drivers(id) on delete cascade,
  read_at timestamptz not null default now(),
  primary key (alert_id, driver_id)
);

create index if not exists idx_emergency_alerts_created on emergency_alerts(created_at desc);

alter table drivers add column if not exists expo_push_token text;

alter table emergency_alerts enable row level security;
alter table emergency_alert_reads enable row level security;

create policy "drivers read alerts" on emergency_alerts for select using (auth.role() = 'authenticated');
create policy "admin insert alerts" on emergency_alerts for insert with check (
  exists (select 1 from admins where user_id = auth.uid())
);
create policy "drivers mark read" on emergency_alert_reads for insert with check (
  exists (select 1 from drivers where id = driver_id and user_id = auth.uid())
);
create policy "drivers see own reads" on emergency_alert_reads for select using (
  exists (select 1 from drivers where id = driver_id and user_id = auth.uid())
);
