import type { ReactNode } from "react";
import { Suspense } from "react";
import { Logo } from "@/components/logo";
import { getCurrentUser } from "@/lib/auth";
import { signOut } from "../(auth)/actions";

async function UserMenu() {
  const user = await getCurrentUser();
  return (
    <div className="flex items-center gap-3 text-sm">
      <span className="hidden text-muted sm:inline">{user.email}</span>
      <form action={signOut}>
        <button className="rounded-lg border border-border bg-surface px-3 py-1.5 font-medium hover:border-ink/40">
          Sign out
        </button>
      </form>
    </div>
  );
}

export default function DashboardLayout({ children }: { children: ReactNode }) {
  return (
    <div className="flex min-h-full flex-1 flex-col">
      <header className="border-b border-border bg-surface/70">
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 sm:px-6">
          <div className="flex items-center gap-6">
            <Logo href="/dashboard" />
            <nav className="hidden gap-5 text-sm text-muted sm:flex">
              <span className="font-medium text-foreground">Overview</span>
            </nav>
          </div>
          <Suspense fallback={<div className="h-8 w-24 animate-pulse rounded-lg bg-surface-2" />}>
            <UserMenu />
          </Suspense>
        </div>
      </header>
      <main className="mx-auto w-full max-w-6xl flex-1 px-4 py-10 sm:px-6">{children}</main>
    </div>
  );
}
