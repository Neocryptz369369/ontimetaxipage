create table if not exists driver_stripe_accounts (
  driver_id uuid primary key references drivers(id) on delete cascade,
  stripe_account_id text not null unique,
  charges_enabled boolean default false,
  payouts_enabled boolean default false,
  details_submitted boolean default false,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

alter table driver_payouts add column if not exists stripe_transfer_id text;
alter table driver_payouts add column if not exists stripe_payout_id text;

create index if not exists idx_driver_stripe_accounts_driver on driver_stripe_accounts(driver_id);
