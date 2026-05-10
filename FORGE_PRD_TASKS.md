# Forge PRD Tasks

Status key: `[ ]` pending, `[-]` in progress, `[x]` complete

## Foundation

- [x] Read `PRD.md` and `BUILD_INSTRUCTIONS.md` end-to-end.
- [x] Translate requirements into an explicit dependency-ordered checklist.
- [x] Scaffold Next.js 15 App Router app in `src/`.
- [x] Install and configure core dependencies, Tailwind, Prisma, NextAuth, shadcn/ui, validation, and utility libraries.
- [x] Configure `next.config.ts` with `output: "standalone"`.
- [x] Set up app-wide design system, layouts, navigation, metadata, and professional visual direction using local/CSS fonts only.
- [x] Add `.env.example`, `.gitignore`, and `README.md`.

## Data Model

- [x] Configure Prisma for SQLite with Docker-safe binary targets.
- [x] Define enums: `ObituaryStatus`, `UserRole`, approval/subscription-related enums if needed.
- [x] Define models: `User`, `Account` or credentials-safe auth equivalent, `Session` or JWT-safe auth support, `VerificationToken` if used, `FuneralHome`, `Location`, `Obituary`, `Submission`, `ApprovalRequest`, `ApprovalComment`, `Asset`, `AuditLog`, `Subscription`.
- [x] Add migrations or `db push` workflow and Prisma client generation.
- [x] Add seed data for demo funeral home, locations, sample submissions, sample obituaries, pending approval, and staff user.

## Auth

- [x] Implement NextAuth v5 with credentials login and JWT sessions.
- [x] Add registration/bootstrap path for owner account.
- [x] Add role-aware auth helpers for `OWNER` and `STAFF`.
- [x] Protect app routes while keeping marketing pages, intake pages, approval links, and published obituaries public.
- [x] Implement middleware for auth and public route access rules.

## User-Facing Pages

- [x] Marketing homepage `/`.
- [x] Pricing page `/pricing`.
- [x] Demo or request walkthrough page.
- [x] SEO solution page `/obituary-software`.
- [x] SEO solution page `/funeral-home-obituary-submission-form`.
- [x] SEO solution page `/family-obituary-intake-portal`.
- [x] SEO solution page `/obituary-management-software-for-funeral-homes`.
- [x] SEO solution page `/obituary-template-software`.
- [x] Feature page `/features/family-approvals`.
- [x] Feature page `/features/print-exports`.
- [x] Comparison page `/compare/frontrunner-alternative`.
- [x] Comparison page `/compare/frazer-consultants-alternative`.
- [x] Resource/article pages for the three launch articles.
- [x] Auth pages for sign-in and account bootstrap.
- [x] Onboarding wizard for funeral home setup, branding, and location defaults.
- [x] Dashboard overview page.
- [x] Obituary records list/search/filter page.
- [x] Obituary editor/detail page.
- [x] Print/export page.
- [x] Public branded intake page.
- [x] Public approval page.
- [x] Public obituary page.
- [x] Account/billing/settings page.

## API Routes / Server Actions

- [x] Auth handlers and server auth helpers.
- [x] Onboarding save action(s).
- [x] Intake submission create action(s).
- [x] Obituary update and status transition action(s).
- [x] Approval request generation action(s).
- [x] Approval response/comment action(s).
- [x] Publish action(s).
- [x] CSV export action or route.
- [x] Billing checkout route.
- [x] Stripe webhook route with safe no-credential behavior.
- [x] Upload handler route or safe local fallback.
- [x] Analytics event helpers with safe no-credential behavior.

## Core Workflows

- [x] Funeral home account bootstrap and onboarding.
- [x] Branded intake form submission to structured `Submission` plus initial `Obituary`.
- [x] Staff dashboard triage with summary cards and recent activity.
- [x] Search, filter, and review obituary records.
- [x] Edit obituary content with reusable templates or starter sections.
- [x] Manage workflow statuses: `SUBMITTED`, `IN_REVIEW`, `DRAFTED`, `AWAITING_APPROVAL`, `APPROVED`, `PUBLISHED`.
- [x] Generate family approval links.
- [x] Family approve/request changes flow with comment thread.
- [x] Public obituary publishing and memorial layout rendering.
- [x] Print/export workflow with plain text copy support.
- [x] Audit logging across major transitions.
- [x] Multi-user location access and role restrictions.
- [x] CSV export of obituary records.

## Integrations Or Safe Fallbacks

- [x] Billing via Stripe with lazy initialization and upgrade prompts when credentials are absent.
- [x] Transactional email via Resend with lazy initialization and logged fallback when credentials are absent.
- [x] Storage/uploads via UploadThing or safe local/mock asset fallback when credentials are absent.
- [x] Analytics via PostHog-safe client helpers or no-op fallback when keys are absent.

## Marketing / SEO

- [x] Shared SEO metadata patterns and structured copy for all launch pages.
- [x] Sitemap/robots support.
- [x] Branded CTAs, demo funnel, and pricing CTA tracking.
- [x] Comparison and resource page templates reusable for future content.

## Deployment

- [x] Production-ready Dockerfile using `node:20-slim`, Prisma-safe setup, and only copying directories that exist.
- [x] `.dockerignore`.
- [x] Standalone Next.js build support.
- [x] Zero-config startup behavior with safe default env handling.

## Verification

- [x] Re-read relevant PRD sections after each major phase and update this checklist.
- [x] Run `npm run build` and fix all issues.
- [x] Start dev server and verify it does not crash.
- [x] Smoke test primary routes.
- [x] Test major interactive flows: auth, onboarding, intake, editor, approval, publish, print/export, pricing CTA.
- [x] Visually review key pages for production-quality UI.
- [-] Test Docker build if Docker is available.
- [x] Create `HUMAN_INPUT_NEEDED.md` only for true external credential requirements.
- [x] Create `FORGE_COMPLETION_AUDIT.md` mapping PRD requirements to implementation.

## Final Verification Notes

- `npm run build` passes and emits `.next/standalone/server.js`.
- `npm run dev` starts successfully and public, auth, approval, obituary, and dashboard routes respond correctly.
- Credentials auth was verified through the Auth.js callback endpoint with the seeded owner account.
- The intake and approval workflows were exercised by posting the rendered Server Action forms against the running app.
- The production-style standalone runtime was started through `docker-entrypoint.sh`, including Prisma schema initialization and Auth.js CSRF verification.
- Docker CLI is installed in this environment, but Docker daemon access is denied, so `docker build .` could not be executed here.
