import { AppShell } from "@/components/app-shell";
import { BillingPlans } from "@/components/dashboard";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getCurrentFuneralHome } from "@/lib/data";
import { requireFuneralHome } from "@/lib/session";

export default async function BillingPage() {
  const session = await requireFuneralHome();
  const funeralHome = await getCurrentFuneralHome(session.user.funeralHomeId!);
  const subscription = funeralHome?.subscriptions[0];

  return (
    <AppShell
      heading="Billing and subscription"
      subheading="Manage plan selection, see trial status, and use a safe contact-sales fallback when Stripe credentials are unavailable."
    >
      <Card>
        <CardHeader>
          <CardTitle>Current subscription</CardTitle>
        </CardHeader>
        <CardContent className="grid gap-4 md:grid-cols-3">
          <div className="rounded-3xl border border-border/70 bg-white/80 p-5">
            <p className="text-xs uppercase tracking-[0.16em] text-primary">Plan</p>
            <p className="mt-2 font-sans text-3xl font-semibold">{funeralHome?.planName}</p>
          </div>
          <div className="rounded-3xl border border-border/70 bg-white/80 p-5">
            <p className="text-xs uppercase tracking-[0.16em] text-primary">Status</p>
            <p className="mt-2 font-sans text-3xl font-semibold">
              {subscription?.status || "TRIALING"}
            </p>
          </div>
          <div className="rounded-3xl border border-border/70 bg-white/80 p-5">
            <p className="text-xs uppercase tracking-[0.16em] text-primary">External billing</p>
            <p className="mt-2 text-sm leading-7 text-muted">
              {process.env.STRIPE_SECRET_KEY
                ? "Stripe checkout is enabled."
                : "Stripe credentials are not configured. Upgrade CTAs route to the local contact-sales fallback."}
            </p>
          </div>
        </CardContent>
      </Card>
      <BillingPlans />
    </AppShell>
  );
}
