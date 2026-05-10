"use client";

import Link from "next/link";
import { credentialsSignInAction, registerOwnerAction } from "@/app/actions";
import { ActionForm } from "@/components/action-form";
import { FormSubmitButton } from "@/components/form-submit-button";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export function SignInForm() {
  return (
    <ActionForm action={credentialsSignInAction} className="space-y-4">
      <div>
        <Label htmlFor="email">Email</Label>
        <Input id="email" name="email" type="email" required />
      </div>
      <div>
        <Label htmlFor="password">Password</Label>
        <Input id="password" name="password" type="password" required />
      </div>
      <FormSubmitButton className="w-full">Sign in</FormSubmitButton>
    </ActionForm>
  );
}

export function SignUpForm() {
  return (
    <ActionForm action={registerOwnerAction} className="space-y-4">
      <div className="grid gap-4 md:grid-cols-2">
        <div>
          <Label htmlFor="name">Your name</Label>
          <Input id="name" name="name" required />
        </div>
        <div>
          <Label htmlFor="email">Work email</Label>
          <Input id="email" name="email" type="email" required />
        </div>
      </div>
      <div className="grid gap-4 md:grid-cols-2">
        <div>
          <Label htmlFor="funeralHomeName">Funeral home name</Label>
          <Input id="funeralHomeName" name="funeralHomeName" required />
        </div>
        <div>
          <Label htmlFor="slug">Portal slug</Label>
          <Input id="slug" name="slug" placeholder="harbor-house-funeral-home" required />
        </div>
      </div>
      <div>
        <Label htmlFor="password">Password</Label>
        <Input id="password" name="password" type="password" required />
      </div>
      <FormSubmitButton className="w-full">Create account</FormSubmitButton>
    </ActionForm>
  );
}

export function AuthSplitPanel() {
  return (
    <div className="grid gap-6 lg:grid-cols-2">
      <Card>
        <CardHeader>
          <CardTitle>Sign in</CardTitle>
          <CardDescription>
            Use the seeded demo account or your own staff credentials.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <SignInForm />
          <div className="rounded-3xl bg-primary/6 p-4 text-sm leading-7 text-muted">
            Demo owner:
            {" "}
            <strong>owner@harbormemorial.test</strong>
            {" "}
            / <strong>password123</strong>
          </div>
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle>Start a trial</CardTitle>
          <CardDescription>
            Create the owner account, then finish branding and location setup in onboarding.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <SignUpForm />
          <Link href="/">
            <Button variant="ghost" className="w-full">
              Back to marketing site
            </Button>
          </Link>
        </CardContent>
      </Card>
    </div>
  );
}
