# Smoke Test — every release, both apps, both platforms

## Rider (10 min)
1. Sign up with new phone → OTP arrives ≤ 30s.
2. Allow location → home shows current position.
3. Enter destination → quote returns ≤ 3s, breakdown visible.
4. Apply promo `LAUNCH10` → discount applied.
5. Request ride → "Searching..." → driver assigned ≤ 60s on staging dispatcher.
6. Chat with driver — message round-trip ≤ 2s.
7. Complete ride (driver side) → rate 5★ + tip $2 via Square.
8. Receipt email arrives.
9. Report lost item → appears in admin queue.
10. Switch language to Spanish → all main screens translated.

## Driver (8 min)
1. Sign in → onboarding gate if incomplete.
2. Stripe Connect onboarding → completes → returns to app → status = ready.
3. Go online → ride offer modal appears (use admin "Dispatch test ride").
4. Accept → navigate → start → complete.
5. Earnings screen shows ride + cumulative.
6. Background location keeps updating when app backgrounded for 60s.

## Admin (5 min)
1. Login, RLS-gated to admins only.
2. Live rides map updates.
3. Issue refund → Square/PayPal refund call returns success.
4. Approve pending driver → driver receives push/email.
5. Mark payout paid via **Pay via Stripe** → Stripe dashboard shows transfer.

## Fail criteria — block release if ANY:
- Crash on launch (any platform)
- OTP not delivered in 60s
- Location permission re-prompts on every launch
- Payment screen blank/white
- Chat messages delayed > 10s
