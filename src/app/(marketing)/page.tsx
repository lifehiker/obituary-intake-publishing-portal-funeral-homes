import Link from "next/link";
import { ArrowRight, CheckCircle2, FileStack, HeartHandshake, Newspaper } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const features = [
  {
    icon: FileStack,
    title: "Structured obituary intake",
    body: "Collect service details, survivors, clergy, charity preferences, and photos in one branded family-facing portal.",
  },
  {
    icon: HeartHandshake,
    title: "Family approvals",
    body: "Send one secure link to approve the obituary or request changes with comments tied to the record.",
  },
  {
    icon: Newspaper,
    title: "Publish and print faster",
    body: "Generate a polished public memorial page and a print-ready export view from the same obituary draft.",
  },
];

export default function HomePage() {
  return (
    <main>
      <section className="mx-auto grid max-w-7xl gap-10 px-6 py-20 lg:grid-cols-[1.1fr_0.9fr] lg:py-28">
        <div className="space-y-8">
          <p className="text-xs font-semibold uppercase tracking-[0.26em] text-primary">
            Obituary Intake and Publishing Software
          </p>
          <div className="space-y-5">
            <h1 className="max-w-4xl font-sans text-5xl font-semibold leading-tight tracking-tight sm:text-6xl">
              Branded obituary intake, family approval, and publishing workflows for funeral homes.
            </h1>
            <p className="max-w-2xl text-lg leading-8 text-muted">
              Replace phone notes, Word drafts, and email chains with a focused portal for collecting obituary details, polishing the draft, securing family approval, and publishing faster.
            </p>
          </div>
          <div className="flex flex-wrap gap-4">
            <Link href="/sign-up">
              <Button size="lg">
                Start a 14-day trial
                <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
            <Link href="/demo">
              <Button variant="secondary" size="lg">
                Request a walkthrough
              </Button>
            </Link>
          </div>
          <div className="grid gap-3 text-sm text-muted sm:grid-cols-2">
            <div className="flex items-center gap-3">
              <CheckCircle2 className="h-5 w-5 text-success" />
              Branded family intake portal
            </div>
            <div className="flex items-center gap-3">
              <CheckCircle2 className="h-5 w-5 text-success" />
              Drafting and workflow status queue
            </div>
            <div className="flex items-center gap-3">
              <CheckCircle2 className="h-5 w-5 text-success" />
              Family approval links and comments
            </div>
            <div className="flex items-center gap-3">
              <CheckCircle2 className="h-5 w-5 text-success" />
              Public memorial pages and print exports
            </div>
          </div>
        </div>
        <Card className="overflow-hidden bg-[#123846] text-white">
          <CardContent className="space-y-6 p-8">
            <div className="rounded-[28px] bg-white/10 p-5">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs uppercase tracking-[0.2em] text-white/70">Dashboard</p>
                  <p className="mt-2 font-sans text-3xl font-semibold">Today’s queue</p>
                </div>
                <span className="rounded-full bg-white/15 px-3 py-1 text-xs">Awaiting approval</span>
              </div>
              <div className="mt-6 grid gap-3">
                {[
                  "Edith Elaine Morrison",
                  "Frederick James Haynes",
                  "Margaret Louise Carter",
                ].map((name, index) => (
                  <div
                    key={name}
                    className="rounded-3xl border border-white/10 bg-white/8 px-4 py-4"
                  >
                    <div className="flex items-center justify-between gap-4">
                      <div>
                        <p className="font-semibold">{name}</p>
                        <p className="text-sm text-white/70">
                          {index === 0 ? "New intake received" : "Draft ready for review"}
                        </p>
                      </div>
                      <span className="rounded-full bg-[#d8c19d] px-3 py-1 text-xs font-semibold text-[#123846]">
                        {index === 0 ? "Submitted" : "Drafted"}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div className="grid gap-4 sm:grid-cols-3">
              <div className="rounded-3xl bg-white/10 p-4">
                <p className="text-xs uppercase tracking-[0.18em] text-white/70">Submitted</p>
                <p className="mt-2 font-sans text-3xl font-semibold">12</p>
              </div>
              <div className="rounded-3xl bg-white/10 p-4">
                <p className="text-xs uppercase tracking-[0.18em] text-white/70">Approved</p>
                <p className="mt-2 font-sans text-3xl font-semibold">6</p>
              </div>
              <div className="rounded-3xl bg-white/10 p-4">
                <p className="text-xs uppercase tracking-[0.18em] text-white/70">Published</p>
                <p className="mt-2 font-sans text-3xl font-semibold">31</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </section>

      <section className="mx-auto max-w-7xl px-6 pb-20">
        <div className="grid gap-5 md:grid-cols-3">
          {features.map((feature) => (
            <Card key={feature.title}>
              <CardHeader>
                <feature.icon className="h-10 w-10 rounded-2xl bg-primary/10 p-2 text-primary" />
                <CardTitle>{feature.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm leading-7 text-muted">{feature.body}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>
    </main>
  );
}
