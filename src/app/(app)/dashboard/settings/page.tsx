import { AppShell } from "@/components/app-shell";
import { StaffTable } from "@/components/dashboard";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { getCurrentFuneralHome } from "@/lib/data";
import { requireFuneralHome } from "@/lib/session";

export default async function SettingsPage() {
  const session = await requireFuneralHome();
  const funeralHome = await getCurrentFuneralHome(session.user.funeralHomeId!);

  return (
    <AppShell
      heading="Branding and access"
      subheading="Review the current funeral home profile, staff users, and rollout defaults for the branded intake portal."
    >
      <div className="grid gap-6 lg:grid-cols-[0.95fr_1.05fr]">
        <Card>
          <CardHeader>
            <CardTitle>Funeral home profile</CardTitle>
            <CardDescription>Current branding and public intake configuration.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4 text-sm leading-7 text-muted">
            <p><strong className="text-foreground">Name:</strong> {funeralHome?.name}</p>
            <p><strong className="text-foreground">Portal slug:</strong> /submit/{funeralHome?.slug}</p>
            <p><strong className="text-foreground">Support email:</strong> {funeralHome?.supportEmail}</p>
            <p><strong className="text-foreground">Phone:</strong> {funeralHome?.phone || "Not set"}</p>
            <p><strong className="text-foreground">Intro text:</strong> {funeralHome?.introText}</p>
          </CardContent>
        </Card>
        <StaffTable
          staff={(funeralHome?.staff || []).map((user) => ({
            id: user.id,
            name: user.name,
            email: user.email,
            role: user.role,
          }))}
        />
      </div>
    </AppShell>
  );
}
