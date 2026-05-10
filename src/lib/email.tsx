import {
  ApprovalConfirmedEmail,
  ApprovalRequestedEmail,
  PublishedNotificationEmail,
  SubmissionReceivedEmail,
} from "@/emails";

type EmailKind =
  | "submission-received"
  | "approval-requested"
  | "approval-confirmed"
  | "published";

type EmailArgs = {
  to: string;
  subject: string;
  kind: EmailKind;
  props: Record<string, string>;
};

function renderEmail(kind: EmailKind, props: Record<string, string>) {
  switch (kind) {
    case "submission-received":
      return <SubmissionReceivedEmail {...props} />;
    case "approval-requested":
      return <ApprovalRequestedEmail {...props} />;
    case "approval-confirmed":
      return <ApprovalConfirmedEmail {...props} />;
    case "published":
      return <PublishedNotificationEmail {...props} />;
  }
}

export async function sendTransactionalEmail({ to, subject, kind, props }: EmailArgs) {
  if (!process.env.RESEND_API_KEY || !process.env.EMAIL_FROM) {
    console.info("[email] noop", kind, to, subject);
    return { ok: true, mode: "noop" as const };
  }

  const { Resend } = await import("resend");
  const resend = new Resend(process.env.RESEND_API_KEY);

  await resend.emails.send({
    from: process.env.EMAIL_FROM,
    to,
    subject,
    react: renderEmail(kind, props),
  });

  return { ok: true, mode: "resend" as const };
}
