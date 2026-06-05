# Storage & Cron setup

## Storage bucket (driver onboarding)
In Supabase Studio → Storage → New bucket:
- **Name:** `driver-docs`
- **Public:** off
- **File size limit:** 5 MB
- RLS policy: drivers can `insert`/`select` rows where `auth.uid()::text = (storage.foldername(name))[1]`; admins can read all.

## Cron — scheduler-tick (every minute)
**Option A — `pg_cron`** (in Supabase SQL editor):
```sql
select cron.schedule(
  'scheduler-tick',
  '* * * * *',
  $$
  select net.http_post(
    url := 'https://YOUR_PROJECT.supabase.co/functions/v1/scheduler-tick',
    headers := jsonb_build_object('Authorization', 'Bearer ' || current_setting('app.service_role_key'))
  );
  $$
);
```

**Option B — external** (Vercel Cron / GitHub Action / Upstash QStash) hitting `/functions/v1/scheduler-tick` once per minute.

## DB webhooks
1. `rides` UPDATE → `/functions/v1/ride-status-sms`  (already configured in step 4)
2. `rides` UPDATE → `/functions/v1/send-receipt`     (new — for receipts)

## New secrets
- `RESEND_API_KEY`
- `RECEIPT_FROM_EMAIL` (defaults to `receipts@on-time-taxi.com`)
