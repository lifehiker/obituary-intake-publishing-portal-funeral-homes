import { notFound } from "next/navigation";
import { PlainTextCopy } from "@/components/plain-text-copy";
import { getObituaryRecord } from "@/lib/data";
import { stripHtml } from "@/lib/content";

export default async function ObituaryPrintPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const obituary = await getObituaryRecord(id);
  if (!obituary) notFound();

  const plainText = [
    obituary.title,
    stripHtml(obituary.summary || ""),
    stripHtml(obituary.biographyHtml),
    stripHtml(obituary.serviceDetailsHtml),
    stripHtml(obituary.charityDetailsHtml || ""),
    obituary.survivorDetails,
  ]
    .filter(Boolean)
    .join("\n\n");

  return (
    <main className="mx-auto max-w-4xl px-6 py-10">
      <div className="no-print mb-6 flex justify-end">
        <PlainTextCopy text={plainText} />
      </div>
      <article className="paper rounded-[var(--radius)] border border-border/70 px-10 py-12">
        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-primary">
          Print export
        </p>
        <h1 className="mt-4 font-sans text-4xl font-semibold">{obituary.title}</h1>
        {obituary.summary ? <p className="mt-4 text-lg text-muted">{obituary.summary}</p> : null}
        <div className="prose mt-8 max-w-none text-sm text-foreground">
          <div dangerouslySetInnerHTML={{ __html: obituary.biographyHtml }} />
          <div dangerouslySetInnerHTML={{ __html: obituary.serviceDetailsHtml }} />
          {obituary.charityDetailsHtml ? (
            <div dangerouslySetInnerHTML={{ __html: obituary.charityDetailsHtml }} />
          ) : null}
          <p>{obituary.survivorDetails}</p>
        </div>
      </article>
    </main>
  );
}
