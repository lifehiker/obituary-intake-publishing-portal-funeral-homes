# Forge Completion Audit

This audit maps the major PRD requirements to the concrete implementation in this repository.

## Foundation

- Next.js 15 App Router app with standalone output
  - `next.config.ts`
  - `src/app/layout.tsx`
  - `src/app/globals.css`
- Shared layouts and navigation
  - `src/components/marketing-shell.tsx`
  - `src/components/app-shell.tsx`
  - `src/app/(marketing)/layout.tsx`
  - `src/app/(app)/layout.tsx`
- Environment and deployment templates
  - `.env.example`
  - `Dockerfile`
  - `.dockerignore`
  - `docker-entrypoint.sh`
  - `prisma/bootstrap.ts`

## Data Model

- Prisma schema and enums for obituary workflow, auth, approval, assets, audit, and subscription state
  - `prisma/schema.prisma`
- Prisma runtime configuration for SQLite on Prisma 7
  - `prisma.config.ts`
  - `src/lib/prisma.ts`
- Seeded demo data for funeral home, users, approval token, obituaries, and audit trail
  - `prisma/seed.ts`
  - `prisma/bootstrap.ts`
  - `prisma/seed-data.ts`

## Auth And Access Control

- NextAuth v5 credentials auth with JWT session enrichment
  - `src/auth.ts`
  - `src/app/api/auth/[...nextauth]/route.ts`
  - `src/types/next-auth.d.ts`
- Route protection and session helpers
  - `src/middleware.ts`
  - `src/lib/session.ts`
- Staff auth UI
  - `src/app/sign-in/page.tsx`
  - `src/app/sign-up/page.tsx`
  - `src/components/forms/auth-forms.tsx`

## Core Funeral Home Workflow

- Owner bootstrap and onboarding
  - `src/app/actions.ts`
  - `src/app/(app)/onboarding/page.tsx`
  - `src/components/forms/onboarding-forms.tsx`
- Branded public obituary intake form
  - `src/app/(public)/submit/[slug]/page.tsx`
  - `src/components/forms/obituary-intake-form.tsx`
  - `src/lib/validators.ts`
  - `src/lib/storage.ts`
- Submission to draft obituary creation, asset association, email/analytics fallback, and audit logging
  - `src/app/actions.ts`
  - `src/lib/content.ts`
  - `src/lib/email.tsx`
  - `src/lib/analytics.ts`
- Dashboard queue, search/filter, and status visibility
  - `src/app/(app)/dashboard/page.tsx`
  - `src/app/(app)/dashboard/obituaries/page.tsx`
  - `src/components/dashboard.tsx`
  - `src/lib/data.ts`
- Obituary editing, status changes, preview, asset gallery, and audit timeline
  - `src/app/(app)/dashboard/obituaries/[id]/page.tsx`
  - `src/components/dashboard.tsx`
- Family approval link generation and response workflow
  - `src/app/actions.ts`
  - `src/app/(public)/approve/[token]/page.tsx`
  - `src/lib/data.ts`
- Public obituary publishing and memorial rendering
  - `src/app/(public)/obituaries/[funeralHomeSlug]/[obituarySlug]/page.tsx`
- Print/export workflow and plain-text copy
  - `src/app/(app)/dashboard/obituaries/[id]/print/page.tsx`
  - `src/components/plain-text-copy.tsx`
  - `src/lib/content.ts`
- CSV export
  - `src/app/api/export/obituaries/route.ts`

## Billing, Email, Storage, Analytics

- Stripe checkout fallback and webhook handling
  - `src/lib/billing.ts`
  - `src/app/api/billing/checkout/route.ts`
  - `src/app/api/webhooks/stripe/route.ts`
  - `src/app/(marketing)/pricing/page.tsx`
  - `src/app/(app)/dashboard/billing/page.tsx`
- Resend transactional email with no-key fallback
  - `src/lib/email.tsx`
  - `src/emails/index.tsx`
- Local upload fallback for obituary photos
  - `src/lib/storage.ts`
  - `src/app/api/uploadthing/core.ts`
- PostHog-safe analytics fallback
  - `src/lib/analytics.ts`

## Marketing And SEO

- Homepage, pricing, demo funnel, SEO landing pages, comparison pages, and resources
  - `src/app/(marketing)/page.tsx`
  - `src/app/(marketing)/pricing/page.tsx`
  - `src/app/(marketing)/demo/page.tsx`
  - `src/app/(marketing)/[...slug]/page.tsx`
  - `src/lib/seo-pages.ts`
- Robots and sitemap
  - `src/app/robots.ts`
  - `src/app/sitemap.ts`

## Settings And Multi-User Context

- Funeral home settings and staff list
  - `src/app/(app)/dashboard/settings/page.tsx`
  - `src/components/dashboard.tsx`
- Funeral home, location, and user associations
  - `prisma/schema.prisma`
  - `src/lib/data.ts`

## Verification Run

- Prisma schema synced locally
  - `npx prisma db push --accept-data-loss`
- Demo data seeded
  - `npm run db:seed`
- Fresh-deployment bootstrap verified on an empty SQLite database
  - `npm run db:bootstrap`
  - `docker-entrypoint.sh`
- Lint passed
  - `npm run lint`
- Production build passed
  - `npm run build`
- Standalone output emitted and production-style runtime booted
  - `.next/standalone/server.js`
  - `Dockerfile`
  - `docker-entrypoint.sh`
- Dev server started successfully
  - `npm run dev`
- Primary public routes returned `200`
  - `/`
  - `/pricing`
  - `/demo`
  - `/submit/harbor-house-funeral-home`
  - `/approve/demo-approval-token`
  - `/obituaries/harbor-house-funeral-home/margaret-louise-carter`
- Protected dashboard redirected unauthenticated users and loaded with authenticated seeded credentials
  - `/dashboard`
- Auth.js CSRF and credentials sign-in were verified successfully
  - `/api/auth/csrf`
  - `/api/auth/callback/credentials`
- Export API returned seeded CSV output
  - `/api/export/obituaries`
- Billing fallback logic was verified directly
  - `src/lib/billing.ts`
- Deployment startup failures were fixed by removing the invalid Prisma CLI flag, copying `prisma.config.ts` into the runtime image, and bootstrapping demo data into empty databases on first startup
  - `Dockerfile`
  - `docker-entrypoint.sh`
  - `prisma/bootstrap.ts`
  - `prisma/seed-data.ts`

## External-Credential Items Intentionally Deferred

- Stripe live billing requires real Stripe keys and price IDs.
  - The app still runs because checkout falls back to `/demo?...billing=contact-sales` and webhook handling no-ops without credentials.
- Resend email delivery requires a real API key and verified sender.
  - The app still runs because email sends degrade to logged no-ops.
- PostHog analytics requires project credentials.
  - The app still runs because analytics calls degrade to no-ops.
- Docker image build could not be executed in this environment because Docker socket access is denied.
  - The Docker assets are present, the standalone runtime was booted locally, and the remaining gap is daemon access rather than app code.
