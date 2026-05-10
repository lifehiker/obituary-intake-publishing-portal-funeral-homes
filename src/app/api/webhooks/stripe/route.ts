import { headers } from "next/headers";
import { NextResponse } from "next/server";
import { SubscriptionStatus } from "@prisma/client";
import { prisma } from "@/lib/prisma";

export async function POST(request: Request) {
  if (!process.env.STRIPE_SECRET_KEY || !process.env.STRIPE_WEBHOOK_SECRET) {
    return NextResponse.json({ ok: true, mode: "noop" });
  }

  const Stripe = (await import("stripe")).default;
  const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
  const body = await request.text();
  const signature = (await headers()).get("stripe-signature");

  if (!signature) {
    return NextResponse.json({ error: "Missing signature" }, { status: 400 });
  }

  let event;
  try {
    event = stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET,
    );
  } catch (error) {
    return NextResponse.json({ error: "Invalid signature", detail: String(error) }, { status: 400 });
  }

  if (
    event.type === "checkout.session.completed" ||
    event.type === "customer.subscription.updated" ||
    event.type === "customer.subscription.deleted"
  ) {
    const object = event.data.object as {
      customer?: string;
      subscription?: string;
      metadata?: { funeralHomeId?: string; planName?: string };
      status?: string;
      current_period_end?: number;
      items?: { data?: Array<{ price?: { id?: string } }> };
    };

    const funeralHomeId = object.metadata?.funeralHomeId;
    if (funeralHomeId) {
      await prisma.subscription.upsert({
        where: { funeralHomeId },
        update: {
          stripeCustomerId: object.customer,
          stripeSubscriptionId:
            object.subscription || object.subscription || undefined,
          stripePriceId: object.items?.data?.[0]?.price?.id,
          status:
            event.type === "customer.subscription.deleted"
              ? SubscriptionStatus.CANCELED
              : SubscriptionStatus.ACTIVE,
          currentPeriodEnd: object.current_period_end
            ? new Date(object.current_period_end * 1000)
            : undefined,
        },
        create: {
          funeralHomeId,
          stripeCustomerId: object.customer,
          stripeSubscriptionId: object.subscription,
          stripePriceId: object.items?.data?.[0]?.price?.id,
          status:
            event.type === "customer.subscription.deleted"
              ? SubscriptionStatus.CANCELED
              : SubscriptionStatus.ACTIVE,
          currentPeriodEnd: object.current_period_end
            ? new Date(object.current_period_end * 1000)
            : undefined,
        },
      });
    }
  }

  return NextResponse.json({ received: true });
}
