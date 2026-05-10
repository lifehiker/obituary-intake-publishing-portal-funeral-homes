import { AuthSplitPanel } from "@/components/forms/auth-forms";

export default function SignUpPage() {
  return (
    <main className="mx-auto max-w-5xl px-6 py-16">
      <div className="mb-10 max-w-3xl">
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-primary">
          Start trial
        </p>
        <h1 className="mt-4 font-sans text-5xl font-semibold tracking-tight">
          Launch a branded obituary intake portal without replacing your whole website.
        </h1>
      </div>
      <AuthSplitPanel />
    </main>
  );
}
