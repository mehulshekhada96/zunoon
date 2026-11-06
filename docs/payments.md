# Membership payments

The existing Next.js / Vercel app uses Razorpay Standard Checkout and the existing MongoDB connection. Admin: `/admin/payments/`; registration: `/join/`.

## Configuration

Set `RAZORPAY_KEY_ID`, `RAZORPAY_KEY_SECRET`, and `RAZORPAY_WEBHOOK_SECRET` in `.env.local` and, when deploying, in Vercel environment variables. Never use NEXT_PUBLIC for secrets. Local configuration currently uses the same Razorpay account's test credentials as Mindjourney. No real money is collected in test mode.

After deployment, add a separate Razorpay webhook endpoint:
`https://zunoon-club.vercel.app/api/payments/webhook/`

Subscribe to `payment.captured`, `payment.failed`, `payment.authorized`, and `order.paid`. The endpoint secret must match `RAZORPAY_WEBHOOK_SECRET`. Keep Mindjourney's existing endpoint intact. Configure the endpoint in the matching test/live mode. Live operation needs live credentials and successful capture; authorized payments remain pending until captured. Do not change shared account capture settings without checking their effect on Mindjourney.

## Storage and behavior

- `membership_settings`: annual fee in paise and whether checkout is enabled. Default ₹2,100; editable in admin.
- `membership_payments`: member details, original order amount, test/live mode, status, gateway IDs, payment method and timestamps. Old orders keep the original fee.
- `payment_limits`: expiring request counters.

SUCCESS means Razorpay confirms a matching captured payment, not merely a browser callback. Closed checkouts stay pending unless the gateway confirms failure. Signed webhooks and Check Razorpay reconcile delayed results; orders from the other website are ignored. Filters and CSV export use India Standard Time day boundaries. Browser session storage keeps only a random registration reference for recovery.

## Validation

`npm run typecheck`
`npm run build`
`node --test tests/payment-rules.test.mjs`

Use Razorpay test mode for end-to-end QA. Local checks created clearly labelled test registrations; these are not paid memberships. Deployment and production webhook setup are separate from local code validation.
