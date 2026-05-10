import { notFound } from "next/navigation";
import { ObituaryIntakeForm } from "@/components/forms/obituary-intake-form";
import { Card, CardContent } from "@/components/ui/card";
import { getFuneralHomeBySlug } from "@/lib/data";

export default async function SubmitPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const funeralHome = await getFuneralHomeBySlug(slug);
  if (!funeralHome) notFound();

  return (
    <main className="mx-auto max-w-5xl px-6 py-12">
      <Card className="overflow-hidden">
        <div
          className="h-40"
          style={{
            background: `linear-gradient(135deg, ${funeralHome.primaryColor}, #d8c19d)`,
          }}
        />
        <CardContent className="space-y-8 p-8">
          <div className="space-y-4">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-primary">
              Family obituary intake portal
            </p>
            <h1 className="font-sans text-4xl font-semibold">{funeralHome.name}</h1>
            <p className="max-w-3xl text-base leading-8 text-muted">
              {funeralHome.introText}
            </p>
          </div>
          <ObituaryIntakeForm funeralHomeSlug={funeralHome.slug} locations={funeralHome.locations} />
        </CardContent>
      </Card>
    </main>
  );
}
