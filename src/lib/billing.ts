import { PLANS } from "./constants";

export function getStripePlan(planName: string) {
  const plan = PLANS.find((item) => item.name === planName);
  if (!plan) return null;

  const priceId = process.env[plan.stripePriceEnv];
  if (!priceId) return null;

  return { ...plan, priceId };
}

export async function createCheckoutSession({
  planName,
  customerEmail,
  funeralHomeId,
}: {
  planName: string;
  customerEmail: string;
  funeralHomeId: string;
}) {
  const plan = getStripePlan(planName);

  if (!plan || !process.env.STRIPE_SECRET_KEY) {
    return {
      ok: false,
      fallbackUrl: `/demo?plan=${encodeURIComponent(planName)}&billing=contact-sales`,
    };
  }

  const Stripe = (await import("stripe")).default;
  const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

  const session = await stripe.checkout.sessions.create({
    mode: "subscription",
    line_items: [{ price: plan.priceId, quantity: 1 }],
    success_url: `${process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"}/dashboard/billing?checkout=success`,
    cancel_url: `${process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"}/pricing?checkout=cancelled`,
    customer_email: customerEmail,
    metadata: {
      funeralHomeId,
      planName,
    },
  });

  return { ok: true, url: session.url };
}
