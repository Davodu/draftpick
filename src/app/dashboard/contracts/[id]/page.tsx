import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import { getCurrentUser } from "@/lib/auth";
import { dateTime, money, STATUS_STYLES } from "@/lib/format";
import { stripeDashboardUrl } from "@/lib/verdict/escrow";
import { getCaseFile, VerdictError, type CaseFile } from "@/lib/verdict/service";
import { ROW_CHECK_LABELS, type RowCheck } from "@/lib/verdict/types";

export const metadata: Metadata = { title: "Contract · Verdict" };

async function load(id: string): Promise<CaseFile> {
  const user = await getCurrentUser();
  try {
    return await getCaseFile({ ownerId: user.id }, id);
  } catch (error) {
    if (error instanceof VerdictError) notFound();
    throw error;
  }
}

function Timeline({ c }: { c: CaseFile }) {
  const { contract, ruling } = c;
  const events: { label: string; detail: string; at?: string; tone?: "loss" | "accent" }[] = [
    {
      label: "open_escrow",
      detail: `${money(contract.price_amount, contract.currency)} hold placed`,
      at: contract.created_at,
    },
  ];
  if (c.delivery) events.push({ label: "deliver", detail: `${c.delivery.rows} rows`, at: c.delivery.created_at });
  if (c.dispute) {
    events.push({ label: "file_dispute", detail: `“${c.dispute.reason}”`, at: c.dispute.created_at, tone: "loss" });
  }
  if (c.reproduction) {
    events.push({
      label: "reproduce",
      detail: `${c.reproduction.passed} / ${c.reproduction.total} rows pass · ${c.reproduction.duration_ms} ms`,
    });
  }
  if (ruling) {
    events.push({
      label: "ruling",
      detail: `${money(ruling.seller_amount, contract.currency)} to seller · ${money(ruling.buyer_amount, contract.currency)} to buyer`,
      at: ruling.created_at,
      tone: "accent",
    });
  } else if (contract.status === "settled") {
    events.push({ label: "accept_delivery", detail: "Captured in full", at: contract.updated_at, tone: "accent" });
  }

  return (
    <ol className="space-y-4">
      {events.map((e) => (
        <li key={e.label} className="grid grid-cols-[7.5rem_1fr] gap-3 text-sm">
          <span className="pt-0.5 font-mono text-xs text-muted">{e.at ? dateTime(e.at) : ""}</span>
          <div className="min-w-0">
            <code
              className={`font-mono text-xs ${e.tone === "loss" ? "text-loss" : e.tone === "accent" ? "text-accent" : "text-ink"}`}
            >
              {e.label}
            </code>
            <p className="text-foreground/80">{e.detail}</p>
          </div>
        </li>
      ))}
    </ol>
  );
}

function RulingCard({ c }: { c: CaseFile }) {
  const r = c.ruling!;
  const price = c.contract.price_amount;
  const sellerPct = price ? (r.seller_amount / price) * 100 : 0;
  return (
    <div className="rounded-xl border border-ink/20 bg-surface p-5 shadow-[0_12px_32px_-12px_rgba(27,42,74,0.25)] sm:p-6">
      <div className="flex items-center justify-between font-mono text-[11px] uppercase tracking-wider text-ink/70">
        <span>Ruling</span>
        <span>
          {r.duration_ms ? `${(r.duration_ms / 1000).toFixed(1)}s · ` : ""}
          {r.model}
        </span>
      </div>
      <p className="mt-4 font-serif text-2xl leading-snug text-ink">{r.summary}</p>
      <ul className="mt-4 space-y-2 text-sm text-foreground/85">
        {r.findings.map((f, i) => (
          <li key={i}>
            {f.text}{" "}
            {f.cites.map((label) => (
              <a key={label} href={`#${label}`} className="font-mono text-xs text-muted hover:text-ink">
                [{label}]
              </a>
            ))}
          </li>
        ))}
      </ul>
      <div className="mt-5 border-t border-border pt-4">
        <div className="flex h-2.5 overflow-hidden rounded-full bg-loss/70" aria-hidden>
          <div className="h-full bg-accent" style={{ width: `${sellerPct}%` }} />
        </div>
        <div className="mt-3 grid grid-cols-2 gap-4">
          <div>
            <p className="text-xs text-muted">Captured for seller</p>
            <p className="font-serif text-3xl text-accent">{money(r.seller_amount, c.contract.currency)}</p>
          </div>
          <div className="text-right">
            <p className="text-xs text-muted">Released to buyer</p>
            <p className="font-serif text-3xl text-loss">{money(r.buyer_amount, c.contract.currency)}</p>
          </div>
        </div>
      </div>
    </div>
  );
}

function ReproductionCard({ c }: { c: CaseFile }) {
  const r = c.reproduction!;
  return (
    <section className="rounded-xl border border-border bg-surface p-5 sm:p-6">
      <h2 className="font-medium">Reproduction</h2>
      <p className="mt-1 text-sm text-muted">
        Re-ran the contract&apos;s checks on all {r.total} delivered rows ({r.runner}, {r.duration_ms} ms).
      </p>
      <table className="mt-4 w-full text-sm">
        <thead className="text-left text-xs text-muted">
          <tr>
            <th className="pb-2 font-normal">Check</th>
            <th className="pb-2 text-right font-normal">Pass</th>
            <th className="pb-2 text-right font-normal">Fail</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-border">
          {Object.entries(r.by_check).map(([check, v]) => (
            <tr key={check}>
              <td className="py-2 pr-2">{ROW_CHECK_LABELS[check as RowCheck] ?? check}</td>
              <td className="py-2 text-right text-accent">{v.passed}</td>
              <td className="py-2 text-right text-loss">{v.failed}</td>
            </tr>
          ))}
        </tbody>
      </table>
      {r.failures.length > 0 && (
        <>
          <p className="mt-5 text-xs text-muted">Sample of failing rows</p>
          <ul className="mt-2 space-y-1 font-mono text-xs">
            {r.failures.slice(0, 8).map((f) => (
              <li key={f.row} className="flex justify-between gap-3">
                <span className="truncate">
                  #{f.row} {f.email}
                </span>
                <span className="shrink-0 text-loss">{f.failed.join(", ")}</span>
              </li>
            ))}
          </ul>
        </>
      )}
    </section>
  );
}

function EvidenceList({ c }: { c: CaseFile }) {
  return (
    <section className="rounded-xl border border-border bg-surface p-5 sm:p-6">
      <h2 className="font-medium">Evidence</h2>
      <ul className="mt-4 space-y-3 text-sm">
        {c.evidence.map((e) => (
          <li key={e.label} id={e.label} className="scroll-mt-24">
            <span className="font-mono text-xs text-ink">[{e.label}]</span>{" "}
            <span className="text-muted">
              {e.party} · {e.kind}
            </span>
            <p className="mt-0.5 text-foreground/85">
              {e.kind === "reproduction"
                ? `${(e.content as { passed: number; total: number }).passed} of ${(e.content as { total: number }).total} rows pass every check`
                : (e.content as { text?: string }).text}
            </p>
          </li>
        ))}
      </ul>
    </section>
  );
}

async function CaseView({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const c = await load(id);
  const { contract } = c;
  const stripeUrl = stripeDashboardUrl(contract.stripe_payment_intent_id);

  return (
    <>
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div className="min-w-0">
          <p className="font-mono text-xs text-muted">
            {c.buyer.name} → {c.seller.name}
          </p>
          <h1 className="mt-1 font-serif text-3xl sm:text-4xl">{contract.task}</h1>
        </div>
        <div className="flex shrink-0 items-center gap-3">
          <span className="font-serif text-3xl">{money(contract.price_amount, contract.currency)}</span>
          <span className={`rounded-full px-2.5 py-0.5 text-xs font-medium ${STATUS_STYLES[contract.status]}`}>
            {contract.status}
          </span>
        </div>
      </div>
      <p className="mt-2 text-sm text-muted">
        Escrow:{" "}
        {stripeUrl ? (
          <a href={stripeUrl} target="_blank" rel="noreferrer" className="font-mono text-ink underline-offset-4 hover:underline">
            {contract.stripe_payment_intent_id}
          </a>
        ) : (
          <span className="font-mono">{contract.stripe_payment_intent_id} (simulated)</span>
        )}{" "}
        · Acceptance: ≥{contract.acceptance.min_rows} rows, ≥{Math.round(contract.acceptance.min_pass_rate * 100)}% pass
      </p>

      <div className="mt-8 grid gap-6 lg:grid-cols-[1fr_1.2fr]">
        <section className="rounded-xl border border-border bg-surface p-5 sm:p-6">
          <h2 className="mb-4 font-medium">Timeline</h2>
          <Timeline c={c} />
        </section>
        {c.ruling ? (
          <RulingCard c={c} />
        ) : (
          <div className="rounded-xl border border-dashed border-border p-6 text-sm text-muted">
            {contract.status === "settled"
              ? "Buyer accepted the delivery. No dispute."
              : "No ruling. Verdict only steps in if the buyer disputes."}
          </div>
        )}
      </div>

      {c.reproduction && (
        <div className="mt-6 grid gap-6 lg:grid-cols-2">
          <ReproductionCard c={c} />
          <EvidenceList c={c} />
        </div>
      )}
    </>
  );
}

export default function ContractPage({ params }: PageProps<"/dashboard/contracts/[id]">) {
  return (
    <>
      <Link href="/dashboard" className="mb-6 inline-block text-sm text-muted hover:text-foreground">
        ← All contracts
      </Link>
      <Suspense fallback={<div className="h-64 animate-pulse rounded-xl border border-border bg-surface" />}>
        <CaseView params={params} />
      </Suspense>
    </>
  );
}
