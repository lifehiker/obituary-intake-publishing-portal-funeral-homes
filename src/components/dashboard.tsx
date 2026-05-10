import Link from "next/link";
import { ObituaryStatus, type Obituary } from "@prisma/client";
 
import { requestApprovalAction, saveObituaryAction, startCheckoutAction } from "@/app/actions";
import { ActionForm } from "@/components/action-form";
import { FormSubmitButton } from "@/components/form-submit-button";
import { StatusBadge } from "@/components/status-badge";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { PLANS } from "@/lib/constants";
import { formatDate, truncate } from "@/lib/utils";

export function SummaryCard({
  label,
  value,
  description,
}: {
  label: string;
  value: number;
  description: string;
}) {
  return (
    <Card>
      <CardContent className="p-6">
        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-primary">{label}</p>
        <p className="mt-3 font-sans text-4xl font-semibold">{value}</p>
        <p className="mt-2 text-sm leading-6 text-muted">{description}</p>
      </CardContent>
    </Card>
  );
}

export function ObituaryTable({
  obituaries,
}: {
  obituaries: Array<
    Obituary & {
      location: { name: string };
      approvals: Array<{ recipientEmail: string; requestedAt: Date }>;
    }
  >;
}) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Recent obituary records</CardTitle>
        <CardDescription>
          Search-ready queue with status visibility for staff review, approvals, and publishing.
        </CardDescription>
      </CardHeader>
      <CardContent className="overflow-x-auto">
        <table className="w-full min-w-[720px] text-left text-sm">
          <thead className="text-muted">
            <tr>
              <th className="pb-3">Obituary</th>
              <th className="pb-3">Location</th>
              <th className="pb-3">Status</th>
              <th className="pb-3">Updated</th>
              <th className="pb-3">Approval</th>
            </tr>
          </thead>
          <tbody>
            {obituaries.map((obituary) => (
              <tr key={obituary.id} className="border-t border-border/60">
                <td className="py-4">
                  <Link href={`/dashboard/obituaries/${obituary.id}`} className="font-semibold">
                    {obituary.title}
                  </Link>
                </td>
                <td className="py-4">{obituary.location.name}</td>
                <td className="py-4">
                  <StatusBadge status={obituary.status} />
                </td>
                <td className="py-4">{formatDate(obituary.updatedAt)}</td>
                <td className="py-4 text-muted">
                  {obituary.approvals[0]?.recipientEmail || "Not sent"}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </CardContent>
    </Card>
  );
}

export function FilterBar({ currentStatus }: { currentStatus?: string }) {
  const statuses = [
    { label: "All", value: "" },
    ...Object.values(ObituaryStatus).map((status) => ({ label: status, value: status })),
  ];

  return (
    <Card>
      <CardContent className="flex flex-wrap items-center gap-3 p-4">
        {statuses.map((status) => (
          <Link
            key={status.label}
            href={
              status.value
                ? `/dashboard/obituaries?status=${encodeURIComponent(status.value)}`
                : "/dashboard/obituaries"
            }
            className={`rounded-full px-4 py-2 text-sm font-semibold ${
              currentStatus === status.value || (!currentStatus && !status.value)
                ? "bg-primary text-primary-foreground"
                : "bg-white text-foreground ring-1 ring-border"
            }`}
          >
            {status.label.replaceAll("_", " ")}
          </Link>
        ))}
      </CardContent>
    </Card>
  );
}

export function ObituaryEditor({
  obituary,
}: {
  obituary: Obituary & { funeralHome: { slug: string } };
}) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Edit obituary</CardTitle>
        <CardDescription>
          Update the memorial copy, adjust the workflow status, and prepare for approval or publication.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <ActionForm action={saveObituaryAction} className="space-y-5">
          <input type="hidden" name="obituaryId" value={obituary.id} />
          <div className="grid gap-4 md:grid-cols-2">
            <div>
              <Label htmlFor="title">Title</Label>
              <Input id="title" name="title" defaultValue={obituary.title} required />
            </div>
            <div>
              <Label htmlFor="status">Status</Label>
              <Select id="status" name="status" defaultValue={obituary.status}>
                {Object.values(ObituaryStatus).map((status) => (
                  <option key={status} value={status}>
                    {status.replaceAll("_", " ")}
                  </option>
                ))}
              </Select>
            </div>
          </div>
          <div>
            <Label htmlFor="summary">Summary</Label>
            <Textarea
              id="summary"
              name="summary"
              className="min-h-24"
              defaultValue={obituary.summary || ""}
            />
          </div>
          <div>
            <Label htmlFor="biographyHtml">Biography text</Label>
            <Textarea
              id="biographyHtml"
              name="biographyHtml"
              defaultValue={obituary.biographyHtml}
              required
            />
          </div>
          <div>
            <Label htmlFor="serviceDetailsHtml">Service details</Label>
            <Textarea
              id="serviceDetailsHtml"
              name="serviceDetailsHtml"
              className="min-h-24"
              defaultValue={obituary.serviceDetailsHtml}
              required
            />
          </div>
          <div>
            <Label htmlFor="charityDetailsHtml">Charity details</Label>
            <Textarea
              id="charityDetailsHtml"
              name="charityDetailsHtml"
              className="min-h-24"
              defaultValue={obituary.charityDetailsHtml || ""}
            />
          </div>
          <div>
            <Label htmlFor="survivorDetails">Survivors</Label>
            <Textarea
              id="survivorDetails"
              name="survivorDetails"
              className="min-h-24"
              defaultValue={obituary.survivorDetails}
              required
            />
          </div>
          <div className="grid gap-4 md:grid-cols-2">
            <div>
              <Label htmlFor="approvalContact">Approval contact</Label>
              <Input
                id="approvalContact"
                name="approvalContact"
                defaultValue={obituary.approvalContact || ""}
                required
              />
            </div>
            <div>
              <Label htmlFor="approvalEmail">Approval email</Label>
              <Input
                id="approvalEmail"
                name="approvalEmail"
                type="email"
                defaultValue={obituary.approvalEmail || ""}
                required
              />
            </div>
          </div>
          <div>
            <Label htmlFor="familyMessage">Family approval message</Label>
            <Textarea
              id="familyMessage"
              name="familyMessage"
              className="min-h-24"
              defaultValue={obituary.familyMessage || ""}
            />
          </div>
          <div className="flex flex-wrap gap-3">
            <FormSubmitButton>Save obituary</FormSubmitButton>
            <Link href={`/dashboard/obituaries/${obituary.id}/print`}>
              <Button type="button" variant="secondary">
                Open print view
              </Button>
            </Link>
            <Link href={`/obituaries/${obituary.funeralHome.slug}/${obituary.slug}`}>
              <Button type="button" variant="ghost">
                Preview public page
              </Button>
            </Link>
          </div>
        </ActionForm>
      </CardContent>
    </Card>
  );
}

export function ApprovalPanel({
  obituaryId,
  approvals,
  defaultRecipientName,
  defaultRecipientEmail,
}: {
  obituaryId: string;
  approvals: Array<{
    id: string;
    token: string;
    recipientName: string | null;
    recipientEmail: string;
    requestedAt: Date;
    status: string;
  }>;
  defaultRecipientName?: string | null;
  defaultRecipientEmail?: string | null;
}) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Family approval</CardTitle>
        <CardDescription>
          Send a secure review link, then track family feedback without email attachments.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <ActionForm action={requestApprovalAction} className="space-y-4">
          <input type="hidden" name="obituaryId" value={obituaryId} />
          <div>
            <Label htmlFor="recipientName">Recipient name</Label>
            <Input
              id="recipientName"
              name="recipientName"
              defaultValue={defaultRecipientName || ""}
              required
            />
          </div>
          <div>
            <Label htmlFor="recipientEmail">Recipient email</Label>
            <Input
              id="recipientEmail"
              name="recipientEmail"
              type="email"
              defaultValue={defaultRecipientEmail || ""}
              required
            />
          </div>
          <div>
            <Label htmlFor="message">Message</Label>
            <Textarea id="message" name="message" className="min-h-24" />
          </div>
          <FormSubmitButton pendingLabel="Generating link...">
            Send approval request
          </FormSubmitButton>
        </ActionForm>
        <div className="space-y-3">
          {approvals.map((approval) => (
            <div
              key={approval.id}
              className="rounded-3xl border border-border/70 bg-white/80 p-4 text-sm"
            >
              <div className="flex flex-wrap items-center gap-3">
                <Badge className="bg-primary/12 text-primary">{approval.status}</Badge>
                <p className="font-semibold">{approval.recipientEmail}</p>
              </div>
              <p className="mt-2 text-muted">Requested {formatDate(approval.requestedAt)}</p>
              <a
                className="mt-3 block break-all text-primary"
                href={`/approve/${approval.token}`}
              >
                /approve/{approval.token}
              </a>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

export function AssetGallery({
  assets,
}: {
  assets: Array<{ id: string; url: string; alt: string | null }>;
}) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Photos and assets</CardTitle>
        <CardDescription>Uploaded memorial images tied to this obituary.</CardDescription>
      </CardHeader>
      <CardContent className="grid gap-4 md:grid-cols-2">
        {assets.length === 0 ? (
          <p className="text-sm text-muted">No assets have been uploaded yet.</p>
        ) : (
          assets.map((asset) => (
            <div key={asset.id} className="rounded-3xl border border-border/70 bg-white/80 p-3">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={asset.url}
                alt={asset.alt || "Memorial photo"}
                className="h-56 w-full rounded-2xl object-cover"
              />
            </div>
          ))
        )}
      </CardContent>
    </Card>
  );
}

export function AuditTimeline({
  logs,
}: {
  logs: Array<{
    id: string;
    action: string;
    createdAt: Date;
    metadataJson: string | null;
    actor: { name: string } | null;
  }>;
}) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Audit timeline</CardTitle>
        <CardDescription>
          Basic operational log for status changes, requests, and approvals.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {logs.map((log) => (
          <div key={log.id} className="rounded-3xl border border-border/70 bg-white/80 p-4">
            <div className="flex flex-wrap items-center gap-3">
              <Badge className="bg-secondary/15 text-secondary">{log.action}</Badge>
              <p className="text-sm font-semibold">{log.actor?.name || "System"}</p>
            </div>
            <p className="mt-2 text-sm text-muted">{formatDate(log.createdAt)}</p>
            {log.metadataJson ? (
              <pre className="mt-3 overflow-auto rounded-2xl bg-[#17222b] p-3 text-xs text-white/80">
                {log.metadataJson}
              </pre>
            ) : null}
          </div>
        ))}
      </CardContent>
    </Card>
  );
}

export function ApprovalComments({
  comments,
}: {
  comments: Array<{ id: string; authorName: string; body: string; createdAt: Date }>;
}) {
  return (
    <div className="space-y-3">
      {comments.map((comment) => (
        <div key={comment.id} className="rounded-3xl border border-border/70 bg-white/85 p-4">
          <div className="flex items-center justify-between gap-3">
            <p className="font-semibold">{comment.authorName}</p>
            <p className="text-xs uppercase tracking-[0.16em] text-muted">
              {formatDate(comment.createdAt)}
            </p>
          </div>
          <p className="mt-3 text-sm leading-7 text-muted">{comment.body}</p>
        </div>
      ))}
    </div>
  );
}

export function BillingPlans() {
  return (
    <div className="grid gap-5 lg:grid-cols-3">
      {PLANS.map((plan) => (
        <Card key={plan.name} className="flex flex-col">
          <CardHeader>
            <CardTitle>{plan.name}</CardTitle>
            <CardDescription>{plan.description}</CardDescription>
          </CardHeader>
          <CardContent className="flex flex-1 flex-col">
            <p className="font-sans text-4xl font-semibold">{plan.price}<span className="text-base text-muted">/mo</span></p>
            <ul className="mt-6 space-y-3 text-sm leading-7 text-muted">
              {plan.features.map((feature) => (
                <li key={feature}>• {feature}</li>
              ))}
            </ul>
            <form
              action={async () => {
                "use server";
                await startCheckoutAction(plan.name);
              }}
              className="mt-8"
            >
              <FormSubmitButton className="w-full">Start {plan.name}</FormSubmitButton>
            </form>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}

export function StaffTable({
  staff,
}: {
  staff: Array<{ id: string; name: string; email: string; role: string }>;
}) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Staff access</CardTitle>
        <CardDescription>
          Current users with obituary workflow access for this location.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-3">
        {staff.map((user) => (
          <div
            key={user.id}
            className="flex flex-wrap items-center justify-between gap-3 rounded-3xl border border-border/70 bg-white/80 p-4"
          >
            <div>
              <p className="font-semibold">{user.name}</p>
              <p className="text-sm text-muted">{user.email}</p>
            </div>
            <Badge className="bg-primary/12 text-primary">{user.role}</Badge>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}

export function ObituaryQueueCards({
  metrics,
}: {
  metrics: {
    submitted: number;
    awaiting: number;
    approved: number;
    published: number;
  };
}) {
  return (
    <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">
      <SummaryCard label="Submitted" value={metrics.submitted} description="New intakes ready for drafting." />
      <SummaryCard label="Awaiting Approval" value={metrics.awaiting} description="Families reviewing active drafts." />
      <SummaryCard label="Approved" value={metrics.approved} description="Ready to publish and export." />
      <SummaryCard label="Published" value={metrics.published} description="Live memorials and completed print prep." />
    </div>
  );
}

export function PublishedPagePreview({
  title,
  summary,
  imageUrl,
}: {
  title: string;
  summary: string | null;
  imageUrl?: string | null;
}) {
  return (
    <Card className="overflow-hidden">
      {imageUrl ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={imageUrl} alt={title} className="h-64 w-full object-cover" />
      ) : (
        <div className="h-64 bg-[linear-gradient(135deg,#0f4c5c,#c97c5d)]" />
      )}
      <CardContent className="space-y-3 p-6">
        <Badge className="bg-primary/12 text-primary">Public obituary preview</Badge>
        <p className="font-sans text-3xl font-semibold">{title}</p>
        <p className="text-sm leading-7 text-muted">{truncate(summary || "", 180)}</p>
      </CardContent>
    </Card>
  );
}
