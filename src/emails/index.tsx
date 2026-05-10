type EmailProps = Record<string, string>;

function EmailShell({
  title,
  subtitle,
  children,
}: {
  title: string;
  subtitle: string;
  children: React.ReactNode;
}) {
  return (
    <html>
      <body
        style={{
          margin: 0,
          background: "#f5f1e8",
          color: "#1e2430",
          fontFamily: "Segoe UI, Helvetica Neue, Arial, sans-serif",
        }}
      >
        <div
          style={{
            maxWidth: "640px",
            margin: "0 auto",
            padding: "32px 20px",
          }}
        >
          <div
            style={{
              background: "#fffdf8",
              borderRadius: "24px",
              padding: "32px",
              border: "1px solid rgba(30,36,48,0.12)",
            }}
          >
            <p style={{ letterSpacing: "0.18em", textTransform: "uppercase", color: "#0f4c5c" }}>
              Harbor Memorial Portal
            </p>
            <h1 style={{ fontFamily: "Georgia, serif", fontSize: "30px", marginBottom: "12px" }}>
              {title}
            </h1>
            <p style={{ color: "#6f726b", lineHeight: 1.6 }}>{subtitle}</p>
            <div style={{ marginTop: "24px", lineHeight: 1.7 }}>{children}</div>
          </div>
        </div>
      </body>
    </html>
  );
}

export function SubmissionReceivedEmail(props: EmailProps) {
  return (
    <EmailShell
      title="A new obituary submission was received"
      subtitle={`A new obituary intake for ${props.deceasedName} is ready for staff review.`}
    >
      <p>{props.funeralHomeName} can review the draft, edit the memorial copy, and request family approval from the dashboard.</p>
    </EmailShell>
  );
}

export function ApprovalRequestedEmail(props: EmailProps) {
  return (
    <EmailShell
      title="Your obituary draft is ready for review"
      subtitle={`Please review the draft for ${props.deceasedName} and approve it or request changes.`}
    >
      <p>Open the secure review link below:</p>
      <p>
        <a href={props.approvalUrl}>{props.approvalUrl}</a>
      </p>
    </EmailShell>
  );
}

export function ApprovalConfirmedEmail(props: EmailProps) {
  return (
    <EmailShell
      title="The obituary has been approved"
      subtitle={`${props.deceasedName} was approved by the family and is ready for publication.`}
    >
      <p>The approval response was recorded in Harbor Memorial Portal and the staff queue has been updated.</p>
    </EmailShell>
  );
}

export function PublishedNotificationEmail(props: EmailProps) {
  return (
    <EmailShell
      title="The obituary is now published"
      subtitle={`${props.deceasedName} is now live on the funeral home's memorial page.`}
    >
      <p>
        View the published obituary:
        {" "}
        <a href={props.publishedUrl}>{props.publishedUrl}</a>
      </p>
    </EmailShell>
  );
}
