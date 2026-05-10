import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getPublishedObituary } from "@/lib/data";
import { formatDate } from "@/lib/utils";

type Props = {
  params: Promise<{ funeralHomeSlug: string; obituarySlug: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { funeralHomeSlug, obituarySlug } = await params;
  const obituary = await getPublishedObituary(funeralHomeSlug, obituarySlug);
  if (!obituary) return {};

  return {
    title: obituary.title,
    description: obituary.summary || `${obituary.title} obituary and memorial service details.`,
  };
}

export default async function PublicObituaryPage({ params }: Props) {
  const { funeralHomeSlug, obituarySlug } = await params;
  const obituary = await getPublishedObituary(funeralHomeSlug, obituarySlug);
  if (!obituary) notFound();

  return (
    <main className="mx-auto max-w-4xl px-6 py-12">
      <article className="paper overflow-hidden rounded-[var(--radius)] border border-border/70">
        {obituary.assets[0] ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={obituary.assets[0].url}
            alt={obituary.title}
            className="h-[26rem] w-full object-cover"
          />
        ) : (
          <div className="h-60 bg-[linear-gradient(135deg,#0f4c5c,#d8c19d)]" />
        )}
        <div className="space-y-6 p-8 md:p-12">
          <div className="space-y-3">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-primary">
              In loving memory
            </p>
            <h1 className="font-sans text-5xl font-semibold tracking-tight">{obituary.title}</h1>
            {obituary.summary ? (
              <p className="text-lg leading-8 text-muted">{obituary.summary}</p>
            ) : null}
            <p className="text-sm text-muted">
              Published by {obituary.funeralHome.name}
              {" · "}
              {formatDate(obituary.publishedAt || obituary.updatedAt)}
            </p>
          </div>
          <div className="prose max-w-none text-base text-foreground">
            <div dangerouslySetInnerHTML={{ __html: obituary.biographyHtml }} />
            <h2>Service information</h2>
            <div dangerouslySetInnerHTML={{ __html: obituary.serviceDetailsHtml }} />
            {obituary.charityDetailsHtml ? (
              <>
                <h2>Memorial contributions</h2>
                <div dangerouslySetInnerHTML={{ __html: obituary.charityDetailsHtml }} />
              </>
            ) : null}
            <h2>Family</h2>
            <p>{obituary.survivorDetails}</p>
          </div>
        </div>
      </article>
    </main>
  );
}
