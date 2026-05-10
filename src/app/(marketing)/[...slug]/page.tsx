import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { getMarketingPage } from "@/lib/seo-pages";

type Props = {
  params: Promise<{ slug: string[] }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const page = getMarketingPage(slug.join("/"));
  if (!page) return {};

  return {
    title: page.title,
    description: page.description,
  };
}

export default async function MarketingDetailPage({ params }: Props) {
  const { slug } = await params;
  const page = getMarketingPage(slug.join("/"));

  if (!page) {
    notFound();
  }

  return (
    <main className="mx-auto max-w-5xl px-6 py-16">
      <div className="max-w-3xl">
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-primary">
          {page.eyebrow}
        </p>
        <h1 className="mt-4 font-sans text-5xl font-semibold tracking-tight">{page.title}</h1>
        <p className="mt-4 text-lg leading-8 text-muted">{page.description}</p>
        <div className="mt-8">
          <Link href={page.ctaHref}>
            <Button>{page.ctaLabel}</Button>
          </Link>
        </div>
      </div>
      <div className="mt-10 grid gap-5">
        {page.sections.map((section) => (
          <Card key={section.heading}>
            <CardContent className="p-8">
              <h2 className="font-sans text-3xl font-semibold">{section.heading}</h2>
              <p className="mt-4 text-base leading-8 text-muted">{section.body}</p>
              {section.bullets?.length ? (
                <ul className="mt-5 space-y-3 text-sm leading-7 text-muted">
                  {section.bullets.map((bullet) => (
                    <li key={bullet}>• {bullet}</li>
                  ))}
                </ul>
              ) : null}
            </CardContent>
          </Card>
        ))}
      </div>
    </main>
  );
}
