-- Dev seed data
insert into users (id, role, phone, full_name, email) values
  ('00000000-0000-0000-0000-000000000001','admin','+18125550001','Owner Admin','admin@ontimetaxi.app'),
  ('00000000-0000-0000-0000-000000000010','driver','+18125550010','Dale Driver','dale@ontimetaxi.app'),
  ('00000000-0000-0000-0000-000000000011','driver','+18125550011','Wendy WAV','wendy@ontimetaxi.app'),
  ('00000000-0000-0000-0000-000000000020','rider','+18125550020','Riley Rider','riley@example.com')
on conflict do nothing;

insert into vehicles (id, make, model, year, plate, color, capacity, is_wav, is_xl) values
  ('11111111-1111-1111-1111-111111111111','Toyota','Camry',2022,'IN-OTT-001','Silver',4,false,false),
  ('22222222-2222-2222-2222-222222222222','Ford','Transit',2023,'IN-OTT-002','White',7,true,true)
on conflict do nothing;

insert into drivers (user_id, license_number, license_expiry, background_check_status, vehicle_id, is_online, current_lat, current_lng, accepts_pets, accepts_long_haul, accepts_country_run, senior_certified, payout_method)
values
  ('00000000-0000-0000-0000-000000000010','D1234567','2028-01-01','approved','11111111-1111-1111-1111-111111111111',true,38.4783,-85.7585,true,true,true,true,'square'),
  ('00000000-0000-0000-0000-000000000011','D7654321','2028-06-01','approved','22222222-2222-2222-2222-222222222222',true,38.5200,-85.7800,false,false,true,false,'paypal')
on conflict do nothing;

insert into riders (user_id, default_payment_method) values
  ('00000000-0000-0000-0000-000000000020','square')
on conflict do nothing;
