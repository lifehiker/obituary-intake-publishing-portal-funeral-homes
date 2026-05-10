import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { AuthSplitPanel } from "@/components/forms/auth-forms";

export default async function SignInPage() {
  const session = await auth();
  if (session?.user) {
    redirect("/dashboard");
  }

  return (
    <main className="mx-auto max-w-5xl px-6 py-16">
      <div className="mb-10 max-w-3xl">
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-primary">
          Staff access
        </p>
        <h1 className="mt-4 font-sans text-5xl font-semibold tracking-tight">
          Sign in to manage obituary intake, family approval, and publishing.
        </h1>
      </div>
      <AuthSplitPanel />
    </main>
  );
}
