import { saveOnboardingAction } from "@/app/actions";
import { ActionForm } from "@/components/action-form";
import { FormSubmitButton } from "@/components/form-submit-button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

export function FuneralHomeSetupForm({
  defaultName,
  defaultSlug,
}: {
  defaultName: string;
  defaultSlug: string;
}) {
  return (
    <div className="grid gap-4 md:grid-cols-2">
      <div>
        <Label htmlFor="name">Funeral home name</Label>
        <Input id="name" name="name" defaultValue={defaultName} required />
      </div>
      <div>
        <Label htmlFor="slug">Portal slug</Label>
        <Input id="slug" name="slug" defaultValue={defaultSlug} required />
      </div>
      <div>
        <Label htmlFor="supportEmail">Support email</Label>
        <Input id="supportEmail" name="supportEmail" type="email" required />
      </div>
      <div>
        <Label htmlFor="phone">Phone</Label>
        <Input id="phone" name="phone" required />
      </div>
    </div>
  );
}

export function BrandingUploadForm() {
  return (
    <div className="grid gap-4 md:grid-cols-2">
      <div>
        <Label htmlFor="primaryColor">Primary color</Label>
        <Input id="primaryColor" name="primaryColor" defaultValue="#0F4C5C" required />
      </div>
      <div>
        <Label htmlFor="logo">Logo upload</Label>
        <Input id="logo" name="logo" type="file" accept="image/*" />
      </div>
      <div className="md:col-span-2">
        <Label htmlFor="introText">Intake page intro text</Label>
        <Textarea
          id="introText"
          name="introText"
          defaultValue="Thank you for trusting us with these details. Please complete the form below and our team will prepare a polished obituary draft for review."
          required
        />
      </div>
      <div className="md:col-span-2">
        <Label htmlFor="customApprovalMessage">Default family approval message</Label>
        <Textarea
          id="customApprovalMessage"
          name="customApprovalMessage"
          defaultValue="Please review the memorial draft carefully. You can approve it or request revisions before publication."
          required
        />
      </div>
    </div>
  );
}

export function LocationSetupForm() {
  return (
    <div className="grid gap-4 md:grid-cols-2">
      <div>
        <Label htmlFor="locationName">Location name</Label>
        <Input id="locationName" name="locationName" defaultValue="Main Chapel" required />
      </div>
      <div>
        <Label htmlFor="locationSlug">Location slug</Label>
        <Input id="locationSlug" name="locationSlug" defaultValue="main-chapel" required />
      </div>
      <div>
        <Label htmlFor="city">City</Label>
        <Input id="city" name="city" required />
      </div>
      <div>
        <Label htmlFor="state">State</Label>
        <Input id="state" name="state" required />
      </div>
      <div className="md:col-span-2">
        <Label htmlFor="addressLine">Address</Label>
        <Input id="addressLine" name="addressLine" required />
      </div>
    </div>
  );
}

export function OnboardingWizard({
  defaultName,
  defaultSlug,
}: {
  defaultName: string;
  defaultSlug: string;
}) {
  return (
    <ActionForm action={saveOnboardingAction} className="space-y-8">
      <section className="space-y-4">
        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-primary">
          1. Funeral home profile
        </p>
        <FuneralHomeSetupForm defaultName={defaultName} defaultSlug={defaultSlug} />
      </section>
      <section className="space-y-4">
        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-primary">
          2. Branding
        </p>
        <BrandingUploadForm />
      </section>
      <section className="space-y-4">
        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-primary">
          3. Primary location
        </p>
        <LocationSetupForm />
      </section>
      <FormSubmitButton pendingLabel="Saving setup...">Finish onboarding</FormSubmitButton>
    </ActionForm>
  );
}
