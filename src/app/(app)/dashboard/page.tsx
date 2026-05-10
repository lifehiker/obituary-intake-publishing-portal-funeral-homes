import { redirect } from "next/navigation";
import { AppShell } from "@/components/app-shell";
import { ObituaryQueueCards, ObituaryTable } from "@/components/dashboard";
import { getDashboardData, getCurrentFuneralHome } from "@/lib/data";
import { requireFuneralHome } from "@/lib/session";

export default async function DashboardPage() {
  const session = await requireFuneralHome();
  const funeralHome = await getCurrentFuneralHome(session.user.funeralHomeId!);

  if (!funeralHome?.onboardingComplete) {
    redirect("/onboarding");
  }

  const data = await getDashboardData(session.user.funeralHomeId!);

  return (
    <AppShell
      heading={`${funeralHome.name} obituary operations`}
      subheading="Monitor intake volume, send family approvals, and publish memorial pages without leaving the queue."
    >
      <ObituaryQueueCards metrics={data.metrics} />
      <ObituaryTable obituaries={data.obituaries} />
    </AppShell>
  );
}
