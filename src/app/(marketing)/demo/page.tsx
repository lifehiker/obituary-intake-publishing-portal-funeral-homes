import { DemoRequestForm } from "@/components/forms/demo-request-form";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export default function DemoPage() {
  return (
    <main className="mx-auto max-w-6xl px-6 py-16">
      <div className="grid gap-8 lg:grid-cols-[0.95fr_1.05fr]">
        <Card className="bg-[#17303c] text-white">
          <CardHeader>
            <CardTitle>Request a walkthrough</CardTitle>
            <CardDescription className="text-white/70">
              Use this guided fallback when Stripe or external scheduling credentials are not configured. The page still works locally and in zero-config deployments.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6 text-sm leading-7 text-white/80">
            <p>
              Harbor Memorial Portal is purpose-built for funeral home obituary workflows:
              intake, drafting, family approval, public publication, and print exports.
            </p>
            <p>
              The live product already includes a sample funeral home, seeded obituaries, and a working intake + approval flow so you can evaluate the full workflow without external services.
            </p>
            <div className="rounded-3xl bg-white/10 p-5">
              <p className="font-semibold text-white">Demo checklist</p>
              <ul className="mt-3 space-y-2">
                <li>View the branded intake page</li>
                <li>Submit a new obituary with a photo</li>
                <li>Edit the draft and request approval</li>
                <li>Approve the obituary and publish it</li>
              </ul>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Demo request form</CardTitle>
            <CardDescription>
              This form is a polished local fallback. In production it can forward to your CRM or email inbox.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <DemoRequestForm />
          </CardContent>
        </Card>
      </div>
    </main>
  );
}
