import { submitIntakeAction } from "@/app/actions";
import { ActionForm } from "@/components/action-form";
import { FormSubmitButton } from "@/components/form-submit-button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";

export function ObituaryIntakeForm({
  funeralHomeSlug,
  locations,
}: {
  funeralHomeSlug: string;
  locations: Array<{ id: string; name: string; city: string; state: string }>;
}) {
  return (
    <ActionForm action={submitIntakeAction} className="space-y-8">
      <input type="hidden" name="funeralHomeSlug" value={funeralHomeSlug} />
      <section className="grid gap-4 md:grid-cols-2">
        <div>
          <Label htmlFor="contactName">Family contact name</Label>
          <Input id="contactName" name="contactName" required />
        </div>
        <div>
          <Label htmlFor="contactEmail">Family contact email</Label>
          <Input id="contactEmail" name="contactEmail" type="email" required />
        </div>
        <div>
          <Label htmlFor="contactPhone">Contact phone</Label>
          <Input id="contactPhone" name="contactPhone" required />
        </div>
        <div>
          <Label htmlFor="locationId">Funeral home location</Label>
          <Select id="locationId" name="locationId" required>
            {locations.map((location) => (
              <option key={location.id} value={location.id}>
                {location.name} · {location.city}, {location.state}
              </option>
            ))}
          </Select>
        </div>
      </section>

      <section className="grid gap-4 md:grid-cols-2">
        <div>
          <Label htmlFor="deceasedName">Deceased full name</Label>
          <Input id="deceasedName" name="deceasedName" required />
        </div>
        <div>
          <Label htmlFor="title">Headline or memorial title</Label>
          <Input id="title" name="title" placeholder="Celebrating the life of..." required />
        </div>
        <div>
          <Label htmlFor="dateOfBirth">Date of birth</Label>
          <Input id="dateOfBirth" name="dateOfBirth" type="date" />
        </div>
        <div>
          <Label htmlFor="dateOfDeath">Date of death</Label>
          <Input id="dateOfDeath" name="dateOfDeath" type="date" />
        </div>
      </section>

      <section className="grid gap-4 md:grid-cols-2">
        <div>
          <Label htmlFor="serviceDate">Service date</Label>
          <Input id="serviceDate" name="serviceDate" type="date" />
        </div>
        <div>
          <Label htmlFor="serviceTime">Service time</Label>
          <Input id="serviceTime" name="serviceTime" placeholder="2:00 PM" />
        </div>
        <div>
          <Label htmlFor="serviceLocation">Service location</Label>
          <Input id="serviceLocation" name="serviceLocation" required />
        </div>
        <div>
          <Label htmlFor="clergyName">Clergy or celebrant</Label>
          <Input id="clergyName" name="clergyName" />
        </div>
      </section>

      <section className="space-y-4">
        <div>
          <Label htmlFor="biographyRaw">Biography and obituary text</Label>
          <Textarea
            id="biographyRaw"
            name="biographyRaw"
            required
            placeholder="Share the story, milestones, relationships, and details you want included in the obituary."
          />
        </div>
        <div>
          <Label htmlFor="survivorDetails">Survivors and family details</Label>
          <Textarea
            id="survivorDetails"
            name="survivorDetails"
            required
            placeholder="List survivors, predeceased family members, and any relationship details you want included."
          />
        </div>
        <div>
          <Label htmlFor="charityInfo">Charity or memorial contribution details</Label>
          <Textarea
            id="charityInfo"
            name="charityInfo"
            placeholder="Include memorial donation instructions or preferred charities."
          />
        </div>
      </section>

      <section className="grid gap-4 md:grid-cols-2">
        <div>
          <Label htmlFor="approvalContact">Approval contact name</Label>
          <Input id="approvalContact" name="approvalContact" required />
        </div>
        <div>
          <Label htmlFor="approvalEmail">Approval contact email</Label>
          <Input id="approvalEmail" name="approvalEmail" type="email" required />
        </div>
        <div className="md:col-span-2">
          <Label htmlFor="photo">Memorial photo</Label>
          <Input id="photo" name="photo" type="file" accept="image/*" />
        </div>
      </section>

      <FormSubmitButton pendingLabel="Submitting intake...">
        Submit obituary details
      </FormSubmitButton>
    </ActionForm>
  );
}
