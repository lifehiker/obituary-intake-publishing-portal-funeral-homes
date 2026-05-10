import { notFound } from "next/navigation";
import { AppShell } from "@/components/app-shell";
import {
  ApprovalPanel,
  AssetGallery,
  AuditTimeline,
  ObituaryEditor,
  PublishedPagePreview,
} from "@/components/dashboard";
import { getObituaryRecord } from "@/lib/data";
import { requireFuneralHome } from "@/lib/session";

export default async function ObituaryDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  await requireFuneralHome();
  const { id } = await params;
  const obituary = await getObituaryRecord(id);

  if (!obituary) {
    notFound();
  }

  return (
    <AppShell
      heading={obituary.title}
      subheading="Edit the memorial draft, send a family approval link, manage assets, and review the audit trail."
    >
      <div className="grid gap-6 xl:grid-cols-[1.35fr_0.65fr]">
        <ObituaryEditor obituary={obituary} />
        <div className="space-y-6">
          <PublishedPagePreview
            title={obituary.title}
            summary={obituary.summary}
            imageUrl={obituary.assets[0]?.url}
          />
          <ApprovalPanel
            obituaryId={obituary.id}
            approvals={obituary.approvals}
            defaultRecipientName={obituary.approvalContact}
            defaultRecipientEmail={obituary.approvalEmail}
          />
        </div>
      </div>
      <div className="grid gap-6 lg:grid-cols-2">
        <AssetGallery assets={obituary.assets} />
        <AuditTimeline logs={obituary.auditLogs} />
      </div>
    </AppShell>
  );
}
