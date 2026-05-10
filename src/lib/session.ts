import { redirect } from "next/navigation";
import { auth } from "@/auth";

export async function requireSession() {
  const session = await auth();
  if (!session?.user) {
    redirect("/sign-in");
  }
  return session;
}

export async function requireFuneralHome() {
  const session = await requireSession();
  if (!session.user.funeralHomeId) {
    redirect("/onboarding");
  }
  return session;
}
