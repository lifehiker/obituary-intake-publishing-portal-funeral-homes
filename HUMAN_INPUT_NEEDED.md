# Human Input Needed

The app runs locally and in zero-config mode without these credentials. Provide them only to enable the corresponding production integrations.

## Required For Production Security

- `AUTH_SECRET`
  - Generate a long random secret.
  - Set it in the deployment environment before public launch.
  - Example: `openssl rand -base64 32`

## Optional Billing Integration

- `STRIPE_SECRET_KEY`
  - Create or use an existing Stripe account.
  - Copy the secret key from the Stripe dashboard.
- `STRIPE_WEBHOOK_SECRET`
  - Create a webhook endpoint pointing to `/api/webhooks/stripe`.
  - Subscribe at minimum to `checkout.session.completed`, `customer.subscription.updated`, and `customer.subscription.deleted`.
  - Copy the webhook signing secret.
- `STRIPE_PRICE_STARTER`
- `STRIPE_PRICE_PROFESSIONAL`
- `STRIPE_PRICE_CHAIN`
  - Create one recurring price in Stripe for each plan.
  - Copy each price ID into the matching environment variable.

Without Stripe credentials, upgrade buttons fall back to the local demo/contact-sales path.

## Optional Transactional Email

- `RESEND_API_KEY`
  - Create a Resend account and API key.
- `EMAIL_FROM`
  - Verify a sender domain or address in Resend.
  - Set a sender like `Harbor Memorial Portal <notifications@yourdomain.com>`.

Without Resend credentials, submission and approval emails are logged as no-ops and the app still functions.

## Optional Analytics

- `NEXT_PUBLIC_POSTHOG_KEY`
- `NEXT_PUBLIC_POSTHOG_HOST`
  - Create a PostHog project and copy the project key and host.

Without PostHog credentials, analytics calls are no-ops.
