import type { Metadata } from "next";
import { Suspense } from "react";
import { getCurrentUser } from "@/lib/auth";
import { createClient } from "@/lib/supabase/server";

export const metadata: Metadata = { title: "Dashboard · Verdict" };

async function Overview() {
  await getCurrentUser();
  const supabase = await createClient();

  // RLS scopes every count to the signed-in operator.
  const [agents, contracts, disputes] = await Promise.all([
    supabase.from("agents").select("id", { count: "exact", head: true }),
    supabase.from("contracts").select("id", { count: "exact", head: true }),
    supabase.from("disputes").select("id", { count: "exact", head: true }),
  ]);

  const stats = [
    { label: "Agents", value: agents.count ?? 0 },
    { label: "Contracts", value: contracts.count ?? 0 },
    { label: "Disputes", value: disputes.count ?? 0 },
  ];

  const steps = [
    {
      title: "Register your agents",
      body: "Add a buyer and a seller agent. Each gets an API key and a signing key.",
      done: (agents.count ?? 0) >= 2,
    },
    {
      title: "Connect Stripe",
      body: "Escrow is a Stripe authorization hold. Test mode works for the demo.",
      done: false,
    },
    {
      title: "Open your first contract",
      body: "Define the task, price and machine-checkable acceptance criteria.",
      done: (contracts.count ?? 0) > 0,
    },
  ];

  return (
    <>
      <div className="grid gap-4 sm:grid-cols-3">
        {stats.map((s) => (
          <div key={s.label} className="rounded-xl border border-border bg-surface p-5">
            <p className="text-sm text-muted">{s.label}</p>
            <p className="mt-1 font-serif text-4xl">{s.value}</p>
          </div>
        ))}
      </div>

      <section className="mt-10">
        <h2 className="text-lg font-medium">Get set up</h2>
        <ol className="mt-4 divide-y divide-border overflow-hidden rounded-xl border border-border bg-surface">
          {steps.map((s, i) => (
            <li key={s.title} className="flex items-start gap-4 p-5">
              <span
                className={`mt-0.5 flex size-6 shrink-0 items-center justify-center rounded-full border text-xs font-medium ${
                  s.done ? "border-accent bg-accent text-accent-ink" : "border-border text-muted"
                }`}
              >
                {s.done ? "✓" : i + 1}
              </span>
              <div>
                <p className="font-medium">{s.title}</p>
                <p className="mt-1 text-sm text-muted">{s.body}</p>
              </div>
            </li>
          ))}
        </ol>
      </section>
    </>
  );
}

function OverviewSkeleton() {
  return (
    <div className="grid gap-4 sm:grid-cols-3">
      {[0, 1, 2].map((i) => (
        <div key={i} className="h-[106px] animate-pulse rounded-xl border border-border bg-surface" />
      ))}
    </div>
  );
}

export default function DashboardPage() {
  return (
    <>
      <h1 className="mb-8 font-serif text-4xl">Overview</h1>
      <Suspense fallback={<OverviewSkeleton />}>
        <Overview />
      </Suspense>
    </>
  );
}
