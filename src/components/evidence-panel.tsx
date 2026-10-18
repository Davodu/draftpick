import type { ReactNode } from "react";

const MANDATE: [string, ReactNode][] = [
  ["Item", "Noise-cancelling headphones"],
  ["Price cap", "$200.00"],
  ["Charged", <span key="c" className="text-accent">$179.00 · within cap</span>],
  ["Approved", "Nov 28, 2026 · 3:14 pm"],
  ["Expires", "Nov 29, 2026"],
  ["Agent", "shopper-agent · did:key:z6Mk…7Qx"],
];

export function EvidencePanel() {
  return (
    <div className="relative grid gap-4 lg:grid-cols-[1fr_1.25fr]">
      {/* Dispute */}
      <div className="rise-in rounded-xl border border-border bg-surface p-5 shadow-sm">
        <div className="flex items-center justify-between font-mono text-[11px] uppercase tracking-wider text-muted">
          <span>charge.dispute.created</span>
          <span>Jan 9, 2027</span>
        </div>
        <div className="mt-4 flex items-baseline justify-between">
          <span className="font-serif text-4xl">$179.00</span>
          <span className="rounded-full bg-loss/10 px-2.5 py-0.5 text-xs font-medium text-loss">
            Needs response
          </span>
        </div>
        <dl className="mt-4 space-y-2 text-sm">
          <div className="flex justify-between gap-4">
            <dt className="text-muted">Reason</dt>
            <dd>Fraudulent / not authorized</dd>
          </div>
          <div className="flex justify-between gap-4">
            <dt className="text-muted">PaymentIntent</dt>
            <dd className="truncate font-mono text-xs leading-5">pi_3QxK…9fA2</dd>
          </div>
        </dl>
        <blockquote className="mt-4 border-l-2 border-loss/40 pl-3 font-serif text-lg italic text-foreground/80">
          &ldquo;I didn&apos;t tell it to buy that.&rdquo;
        </blockquote>
        <p className="mt-1 pl-3 text-xs text-muted">Cardholder statement</p>
      </div>

      {/* Mandate */}
      <div
        className="rise-in relative overflow-hidden rounded-xl border border-ink/20 bg-surface p-5 shadow-[0_1px_0_rgba(0,0,0,0.04),0_12px_32px_-12px_rgba(27,42,74,0.25)]"
        style={{ animationDelay: "250ms" }}
      >
        <div className="flex items-center justify-between font-mono text-[11px] uppercase tracking-wider text-ink/70">
          <span>Warrant · signed mandate</span>
          <span className="hidden sm:inline">matched to pi_3QxK…9fA2</span>
        </div>
        <blockquote className="mt-4 pr-28 font-serif text-2xl leading-snug text-ink sm:pr-36">
          &ldquo;Buy noise-cancelling headphones under $200.&rdquo;
        </blockquote>
        <p className="mt-1 text-xs text-muted">The human&apos;s words, captured at purchase</p>
        <dl className="mt-5 grid grid-cols-1 gap-x-6 gap-y-2 border-t border-border pt-4 text-sm sm:grid-cols-2">
          {MANDATE.map(([k, v]) => (
            <div key={k} className="flex justify-between gap-3 sm:block">
              <dt className="text-xs text-muted">{k}</dt>
              <dd className="truncate">{v}</dd>
            </div>
          ))}
        </dl>
        <div className="mt-5 flex flex-col gap-2 border-t border-border pt-4 font-mono text-xs sm:flex-row sm:items-center sm:justify-between">
          <span className="text-accent">✓ signature verified · ed25519</span>
          <span className="text-muted">evidence submitted to Stripe</span>
        </div>

        <div
          className="stamp-in pointer-events-none absolute right-4 top-12 rounded-md border-2 border-accent px-3 py-1 font-mono text-xs font-bold uppercase tracking-[0.2em] text-accent opacity-90 sm:right-6"
          aria-hidden
        >
          Authorized
        </div>
      </div>
    </div>
  );
}
