import type { ReactNode } from "react";
import { Logo } from "@/components/logo";

export default function AuthLayout({ children }: { children: ReactNode }) {
  return (
    <div className="relative flex min-h-full flex-1 flex-col">
      <div className="ruled-bg pointer-events-none absolute inset-0" />
      <header className="relative mx-auto flex h-16 w-full max-w-6xl items-center px-4 sm:px-6">
        <Logo />
      </header>
      <main className="relative flex flex-1 items-start justify-center px-4 pb-24 pt-10 sm:pt-20">
        <div className="w-full max-w-sm rounded-2xl border border-border bg-surface/90 p-6 shadow-sm backdrop-blur sm:p-8">
          {children}
        </div>
      </main>
    </div>
  );
}
