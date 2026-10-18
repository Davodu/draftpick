import type { Metadata } from "next";
import Link from "next/link";
import { Suspense } from "react";
import { getCurrentUser } from "@/lib/auth";
import { money, STATUS_STYLES } from "@/lib/format";
import { listAgents, listContracts } from "@/lib/verdict/service";
import { DemoButtons } from "./demo-buttons";

export const metadata: Metadata = { title: "Dashboard · Verdict" };

function SetupNotices() {
  const notes: string[] = [];
  if (!process.env.SUPABASE_SECRET_KEY) notes.push("SUPABASE_SECRET_KEY is not set, so agents and contracts can't be created.");
  if (!process.env.STRIPE_SECRET_KEY) notes.push("STRIPE_SECRET_KEY is not set: escrow holds are simulated.");
  if (!process.env.ANTHROPIC_API_KEY) notes.push("ANTHROPIC_API_KEY is not set: rulings use the rules-only write-up instead of Claude.");
  if (!notes.length) return null;
  return (
    <ul className="mb-8 space-y-1 rounded-xl border border-border bg-surface-2/60 px-5 py-4 text-sm text-muted">
      {notes.map((n) => (
        <li key={n}>· {n}</li>
      ))}
    </ul>
  );
}

async function Overview() {
  const user = await getCurrentUser();
  if (!process.env.SUPABASE_SECRET_KEY) return null;
  const actor = { ownerId: user.id };
  const [agents, contracts] = await Promise.all([listAgents(actor), listContracts(actor, 25)]);
  const names = new Map(agents.map((a) => [a.id, a.name]));

  const stats = [
    { label: "Agents", value: agents.length, href: "/dashboard/agents" },
    { label: "Contracts", value: contracts.length },
    { label: "Settled", value: contracts.filter((c) => c.status === "settled").length },
  ];

  return (
    <>
      <div className="grid gap-4 sm:grid-cols-3">
        {stats.map((s) => {
          const body = (
            <>
              <p className="text-sm text-muted">{s.label}</p>
              <p className="mt-1 font-serif text-4xl">{s.value}</p>
            </>
          );
          return s.href ? (
            <Link key={s.label} href={s.href} className="rounded-xl border border-border bg-surface p-5 hover:border-ink/30">
              {body}
            </Link>
          ) : (
            <div key={s.label} className="rounded-xl border border-border bg-surface p-5">
              {body}
            </div>
          );
        })}
      </div>

      <section className="mt-10">
        <h2 className="text-lg font-medium">Contracts</h2>
        {contracts.length === 0 ? (
          <p className="mt-4 rounded-xl border border-dashed border-border px-5 py-8 text-center text-sm text-muted">
            No contracts yet. Run the demo job above, or have an agent call <code className="font-mono">open_escrow</code>.
          </p>
        ) : (
          <ul className="mt-4 divide-y divide-border overflow-hidden rounded-xl border border-border bg-surface">
            {contracts.map((c) => (
              <li key={c.id}>
                <Link
                  href={`/dashboard/contracts/${c.id}`}
                  className="flex flex-col gap-2 px-5 py-4 hover:bg-surface-2/50 sm:flex-row sm:items-center sm:justify-between"
                >
                  <div className="min-w-0">
                    <p className="truncate font-medium">{c.task}</p>
                    <p className="mt-0.5 font-mono text-xs text-muted">
                      {names.get(c.buyer_agent_id)} → {names.get(c.seller_agent_id)}
                    </p>
                  </div>
                  <div className="flex shrink-0 items-center gap-3">
                    <span className="font-serif text-xl">{money(c.price_amount, c.currency)}</span>
                    <span className={`rounded-full px-2.5 py-0.5 text-xs font-medium ${STATUS_STYLES[c.status]}`}>
                      {c.status}
                    </span>
                  </div>
                </Link>
              </li>
            ))}
          </ul>
        )}
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
      <SetupNotices />
      <section className="mb-10 rounded-xl border border-border bg-surface p-5 sm:p-6">
        <h2 className="text-lg font-medium">Run the demo job</h2>
        <p className="mt-1 mb-4 max-w-2xl text-sm text-muted">
          A buyer agent pays $5 for 100 verified company emails. The seller delivers 100 rows, 40 of
          which are bad. Verdict holds the funds, re-checks every row, rules and splits the payout.
        </p>
        <DemoButtons />
      </section>
      <Suspense fallback={<OverviewSkeleton />}>
        <Overview />
      </Suspense>
    </>
  );
}
