import { ObituaryStatus } from "@prisma/client";
import { AppShell } from "@/components/app-shell";
import { FilterBar, ObituaryTable, ObituaryQueueCards } from "@/components/dashboard";
import { getDashboardData } from "@/lib/data";
import { requireFuneralHome } from "@/lib/session";

export default async function ObituariesPage({
  searchParams,
}: {
  searchParams: Promise<{ status?: string }>;
}) {
  const session = await requireFuneralHome();
  const { status } = await searchParams;
  const validStatus = Object.values(ObituaryStatus).includes(status as ObituaryStatus)
    ? (status as ObituaryStatus)
    : undefined;
  const data = await getDashboardData(session.user.funeralHomeId!, validStatus);

  return (
    <AppShell
      heading="Obituary records"
      subheading="Search and filter the queue by workflow status to keep drafting, approvals, and publishing moving."
    >
      <ObituaryQueueCards metrics={data.metrics} />
      <FilterBar currentStatus={validStatus} />
      <ObituaryTable obituaries={data.obituaries} />
    </AppShell>
  );
}
