import Link from "next/link";
import { APP_NAME } from "@/lib/constants";
import { Button } from "@/components/ui/button";

export function MarketingShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen">
      <header className="no-print border-b border-border/70 bg-white/70 backdrop-blur">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
          <Link href="/" className="font-sans text-xl font-semibold tracking-tight">
            {APP_NAME}
          </Link>
          <nav className="hidden items-center gap-6 text-sm text-muted md:flex">
            <Link href="/obituary-software">Software</Link>
            <Link href="/features/family-approvals">Approvals</Link>
            <Link href="/features/print-exports">Print Exports</Link>
            <Link href="/pricing">Pricing</Link>
            <Link href="/demo">Demo</Link>
          </nav>
          <div className="flex items-center gap-3">
            <Link href="/sign-in" className="text-sm font-semibold text-muted">
              Sign in
            </Link>
            <Link href="/sign-up">
              <Button size="sm">Start trial</Button>
            </Link>
          </div>
        </div>
      </header>
      {children}
      <footer className="border-t border-border/70 bg-[#17303c] text-white">
        <div className="mx-auto grid max-w-7xl gap-8 px-6 py-12 md:grid-cols-3">
          <div>
            <p className="font-sans text-lg font-semibold">{APP_NAME}</p>
            <p className="mt-3 max-w-sm text-sm leading-7 text-white/70">
              Branded obituary intake, family approvals, publishing, and print exports for independent funeral homes.
            </p>
          </div>
          <div className="text-sm text-white/70">
            <p className="mb-3 font-semibold text-white">Pages</p>
            <div className="space-y-2">
              <Link href="/obituary-software" className="block">
                Obituary Software
              </Link>
              <Link href="/family-obituary-intake-portal" className="block">
                Family Intake Portal
              </Link>
              <Link href="/compare/frontrunner-alternative" className="block">
                FrontRunner Alternative
              </Link>
            </div>
          </div>
          <div className="text-sm text-white/70">
            <p className="mb-3 font-semibold text-white">Try the app</p>
            <div className="space-y-2">
              <Link href="/submit/harbor-house-funeral-home" className="block">
                Sample intake portal
              </Link>
              <Link href="/demo" className="block">
                Request walkthrough
              </Link>
              <Link href="/pricing" className="block">
                Pricing
              </Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
