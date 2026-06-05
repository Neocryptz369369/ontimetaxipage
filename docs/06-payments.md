# Payments — Square & PayPal

End-to-end flow for both providers, used by rider app + edge functions.

## Square (cards)

```
Rider App                Edge Function                  Square
   |                          |                            |
   |--- tokenize card via --->|                            |
   |    Square In-App SDK     |                            |
   |    (returns source_id)   |                            |
   |                          |                            |
   |--- POST /square-create-payment ------------------>    |
   |    { ride_id, source_id }|                            |
   |                          |---- POST /v2/payments ---->|
   |                          |<---- payment + status -----|
   |                          |                            |
   |                       writes payments row             |
   |                       updates rides.payment_status    |
   |<----- { payment_id, status } -----                    |
   |                          |                            |
   |                          |<--- /square-webhook -------|  (async confirmations / refunds)
```

### Setup
1. Square Dashboard → **Applications → Credentials** → copy Access Token + Location ID
2. `supabase secrets set SQUARE_ACCESS_TOKEN=... SQUARE_LOCATION_ID=... SQUARE_ENV=sandbox`
3. Square Dashboard → **Developer → Webhooks** → add `POST https://<project>.functions.supabase.co/square-webhook`, subscribe to `payment.updated`. Copy signature key:
4. `supabase secrets set SQUARE_WEBHOOK_SIGNATURE_KEY=...`
5. In rider app, install `react-native-square-in-app-payments` and tokenize the card; pass `source_id` to `square-create-payment`.

## PayPal (wallet)

```
Rider App                Edge Function                  PayPal
   |--- POST /paypal-create-order ------------------>     |
   |    { ride_id }           |                           |
   |                          |--- POST /v2/checkout/orders -->|
   |                          |<--- { order_id, links } -------|
   |<-- { order_id, approve_url } ----                    |
   |                          |                           |
   |--- open approve_url (WebView / PayPalCheckout SDK) ->|
   |<-- rider approves & is redirected back -------------|
   |                          |                          |
   |--- POST /paypal-capture-order ----------------->     |
   |    { ride_id, order_id } |                          |
   |                          |--- /v2/...orders/{id}/capture ->|
   |                          |<--- capture result -------------|
   |                       writes payments row + rides row      |
   |<-- { status, capture_id } ----                              |
```

### Setup
1. https://developer.paypal.com → REST app → copy Client ID + Secret
2. `supabase secrets set PAYPAL_CLIENT_ID=... PAYPAL_SECRET=... PAYPAL_ENV=sandbox`
3. Add webhook in PayPal dashboard → `POST https://<project>.functions.supabase.co/paypal-webhook`, events `CHECKOUT.ORDER.APPROVED`, `PAYMENT.CAPTURE.COMPLETED`, `PAYMENT.CAPTURE.DENIED`.
4. Rider app uses `react-native-paypal-checkout` or just opens `approve_url` in a `WebView` and listens for the return URL.

## Cash
Driver marks ride completed → admin reconciles. `payments.provider = 'cash'`, `status = 'captured'` set manually after handoff.

## Refunds
- Square: `POST /v2/refunds` → write a negative `payments` row + set `rides.payment_status = 'refunded'`.
- PayPal: `POST /v2/payments/captures/{capture_id}/refund` → same.
Add a refund button in `/rides/[id]` admin detail page (next iteration).
