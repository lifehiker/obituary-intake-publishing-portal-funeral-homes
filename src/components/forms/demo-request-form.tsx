"use client";

import { requestDemoAction } from "@/app/actions";
import { ActionForm } from "@/components/action-form";
import { FormSubmitButton } from "@/components/form-submit-button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

export function DemoRequestForm() {
  return (
    <ActionForm action={requestDemoAction} className="space-y-4">
      <div>
        <Label htmlFor="name">Name</Label>
        <Input id="name" name="name" placeholder="Funeral home owner or director" />
      </div>
      <div>
        <Label htmlFor="email">Email</Label>
        <Input id="email" name="email" type="email" placeholder="director@example.com" />
      </div>
      <div>
        <Label htmlFor="company">Funeral home</Label>
        <Input id="company" name="company" placeholder="Harbor House Funeral Home" />
      </div>
      <div>
        <Label htmlFor="notes">What do you want to improve?</Label>
        <Textarea
          id="notes"
          name="notes"
          className="min-h-32"
          placeholder="Intake accuracy, family approvals, print formatting, obituary publication speed..."
        />
      </div>
      <FormSubmitButton className="w-full" pendingLabel="Capturing request...">
        Request walkthrough
      </FormSubmitButton>
    </ActionForm>
  );
}
