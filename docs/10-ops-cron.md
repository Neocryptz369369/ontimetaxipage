# Cron jobs

All hit edge functions via `pg_cron + pg_net` or external scheduler.

| Function              | Schedule          | Purpose |
|-----------------------|-------------------|---------|
| `scheduler-tick`      | `* * * * *`       | Promote scheduled rides to dispatch at T-15min |
| `surge-tick`          | `*/2 * * * *`     | Recompute surge multipliers per geohash zone |
| `payout-rollup`       | `0 4 * * 1`       | Aggregate prior-week earnings into `driver_payouts` (Mon 04:00 UTC) |

## pg_cron example
```sql
select cron.schedule(
  'surge-tick', '*/2 * * * *',
  $$
  select net.http_post(
    url := 'https://YOUR_PROJECT.supabase.co/functions/v1/surge-tick',
    headers := jsonb_build_object('Authorization', 'Bearer ' || current_setting('app.service_role_key'))
  );
  $$);
```

## Rate limits applied
| Endpoint        | Limit                                    |
|-----------------|------------------------------------------|
| `quote-fare`    | 30 req / 60 sec per user                 |
| `redeem-promo`  | 10 req / 60 sec per user                 |
| `cancel-ride`   | 5 req / 60 sec per user                  |
| `charge-tip`    | 5 req / 60 sec per ride                  |

See `_shared/rate-limit.ts` for the implementation.
