import Link from "next/link";
import { Home, LayoutList, PencilLine, Settings } from "lucide-react";
import { signOutAction } from "@/app/actions";
import { Button } from "@/components/ui/button";

const nav = [
  { href: "/dashboard", label: "Overview", icon: Home },
  { href: "/dashboard/obituaries", label: "Obituaries", icon: LayoutList },
  { href: "/dashboard/billing", label: "Billing", icon: PencilLine },
  { href: "/dashboard/settings", label: "Settings", icon: Settings },
];

export function AppShell({
  heading,
  subheading,
  children,
}: {
  heading: string;
  subheading: string;
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-[#f3eee4]">
      <div className="mx-auto grid min-h-screen max-w-7xl gap-6 px-4 py-4 lg:grid-cols-[260px_1fr]">
        <aside className="paper rounded-[var(--radius)] border border-border/70 p-5">
          <p className="font-sans text-2xl font-semibold text-primary">Harbor Memorial</p>
          <p className="mt-2 text-sm leading-6 text-muted">
            Intake, approvals, publishing, and print exports in one queue.
          </p>
          <nav className="mt-8 space-y-2">
            {nav.map(({ href, label, icon: Icon }) => (
              <Link
                key={href}
                href={href}
                className="flex items-center gap-3 rounded-2xl px-4 py-3 text-sm font-medium text-foreground transition hover:bg-primary/8"
              >
                <Icon className="h-4 w-4 text-primary" />
                {label}
              </Link>
            ))}
          </nav>
          <form action={signOutAction} className="mt-8">
            <Button variant="secondary" className="w-full">
              Sign out
            </Button>
          </form>
        </aside>
        <main className="space-y-6">
          <div className="paper rounded-[var(--radius)] border border-border/70 px-6 py-8">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-primary">
              Operations
            </p>
            <h1 className="mt-3 font-sans text-4xl font-semibold tracking-tight">
              {heading}
            </h1>
            <p className="mt-3 max-w-3xl text-sm leading-7 text-muted">{subheading}</p>
          </div>
          {children}
        </main>
      </div>
    </div>
  );
}
