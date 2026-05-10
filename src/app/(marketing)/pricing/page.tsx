import type { Metadata } from "next";
import { BillingPlans } from "@/components/dashboard";

export const metadata: Metadata = {
  title: "Pricing",
  description:
    "Subscription pricing for Harbor Memorial Portal obituary intake, approvals, and publishing workflows.",
};

export default function PricingPage() {
  return (
    <main className="mx-auto max-w-7xl px-6 py-16">
      <div className="max-w-3xl">
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-primary">
          Pricing
        </p>
        <h1 className="mt-4 font-sans text-5xl font-semibold tracking-tight">
          Pricing shaped around workflow value, not basic forms.
        </h1>
        <p className="mt-4 text-lg leading-8 text-muted">
          Choose the plan that matches your obituary volume, staff size, and location footprint. Stripe checkout is enabled when credentials are configured; otherwise the app falls back to a guided sales path.
        </p>
      </div>
      <div className="mt-10">
        <BillingPlans />
      </div>
    </main>
  );
}
