-- Quick seed for local dev. Run AFTER migrations.
insert into drivers (id, full_name, phone, vehicle_make, vehicle_model, vehicle_plate, status)
values
  (gen_random_uuid(), 'Sam Driver', '+15555550101', 'Toyota', 'Camry', 'TAXI-01', 'approved'),
  (gen_random_uuid(), 'Alex Wheels', '+15555550102', 'Honda', 'Accord', 'TAXI-02', 'approved')
on conflict do nothing;

insert into emergency_alerts (title, body, severity, expires_at)
values ('Welcome dispatchers!', 'This is a seed alert.', 'info', now() + interval '1 hour');
