import { AppShell } from "@/components/app-shell";
import { OnboardingWizard } from "@/components/forms/onboarding-forms";
import { Card, CardContent } from "@/components/ui/card";
import { getCurrentFuneralHome } from "@/lib/data";
import { requireSession } from "@/lib/session";

export default async function OnboardingPage() {
  const session = await requireSession();
  const funeralHome = session.user.funeralHomeId
    ? await getCurrentFuneralHome(session.user.funeralHomeId)
    : null;

  return (
    <AppShell
      heading="Finish your portal setup"
      subheading="Add branding, location defaults, and the intake copy families will see before the first submission arrives."
    >
      <Card>
        <CardContent className="p-8">
          <OnboardingWizard
            defaultName={funeralHome?.name || ""}
            defaultSlug={funeralHome?.slug || ""}
          />
        </CardContent>
      </Card>
    </AppShell>
  );
}
