import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { createCheckoutSession } from "@/lib/billing";

export async function POST(request: Request) {
  const session = await auth();
  if (!session?.user?.funeralHomeId || !session.user.email) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { planName } = await request.json();
  const result = await createCheckoutSession({
    planName,
    customerEmail: session.user.email,
    funeralHomeId: session.user.funeralHomeId,
  });

  return NextResponse.json(result);
}
