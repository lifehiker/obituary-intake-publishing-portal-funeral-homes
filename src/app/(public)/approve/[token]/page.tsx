import { notFound } from "next/navigation";
import { respondApprovalAction } from "@/app/actions";
import { ActionForm } from "@/components/action-form";
import { ApprovalComments } from "@/components/dashboard";
import { FormSubmitButton } from "@/components/form-submit-button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { getApprovalByToken } from "@/lib/data";
import { formatDate } from "@/lib/utils";

export default async function ApprovalPage({
  params,
}: {
  params: Promise<{ token: string }>;
}) {
  const { token } = await params;
  const approval = await getApprovalByToken(token);
  if (!approval) notFound();

  return (
    <main className="mx-auto max-w-6xl px-6 py-14">
      <div className="grid gap-6 lg:grid-cols-[1fr_0.9fr]">
        <Card>
          <CardHeader>
            <CardTitle>{approval.obituary.title}</CardTitle>
            <CardDescription>
              Requested on {formatDate(approval.requestedAt)} for {approval.obituary.funeralHome.name}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {approval.obituary.assets[0] ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={approval.obituary.assets[0].url}
                alt={approval.obituary.title}
                className="h-72 w-full rounded-3xl object-cover"
              />
            ) : null}
            <div className="prose max-w-none text-sm">
              {approval.obituary.familyMessage ? (
                <div className="rounded-3xl bg-primary/7 p-5 text-muted">
                  {approval.obituary.familyMessage}
                </div>
              ) : null}
              <div dangerouslySetInnerHTML={{ __html: approval.obituary.biographyHtml }} />
              <div dangerouslySetInnerHTML={{ __html: approval.obituary.serviceDetailsHtml }} />
              {approval.obituary.charityDetailsHtml ? (
                <div dangerouslySetInnerHTML={{ __html: approval.obituary.charityDetailsHtml }} />
              ) : null}
              <p>{approval.obituary.survivorDetails}</p>
            </div>
          </CardContent>
        </Card>
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Approve or request changes</CardTitle>
              <CardDescription>
                Families can approve the obituary or send precise revision notes from this single page.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ActionForm action={respondApprovalAction} className="space-y-4">
                <input type="hidden" name="token" value={token} />
                <div>
                  <Label htmlFor="authorName">Your name</Label>
                  <Input id="authorName" name="authorName" required />
                </div>
                <div>
                  <Label htmlFor="authorEmail">Your email</Label>
                  <Input
                    id="authorEmail"
                    name="authorEmail"
                    type="email"
                    defaultValue={approval.recipientEmail}
                  />
                </div>
                <div>
                  <Label htmlFor="body">Comments</Label>
                  <Textarea
                    id="body"
                    name="body"
                    className="min-h-28"
                    placeholder="Share any correction, addition, or approval note."
                    required
                  />
                </div>
                <div className="flex flex-wrap gap-3">
                  <FormSubmitButton name="action" value="approve">
                    Approve obituary
                  </FormSubmitButton>
                  <FormSubmitButton name="action" value="changes" variant="secondary">
                    Request changes
                  </FormSubmitButton>
                </div>
              </ActionForm>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Change request thread</CardTitle>
            </CardHeader>
            <CardContent>
              <ApprovalComments comments={approval.comments} />
            </CardContent>
          </Card>
        </div>
      </div>
    </main>
  );
}
