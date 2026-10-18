const TIMELINE = [
  { t: "00:00", label: "open_escrow", detail: "$5.00 hold · 100 verified company emails" },
  { t: "04:12", label: "deliver", detail: "100 rows from seller-agent" },
  { t: "04:20", label: "file_dispute", detail: "“Most of these bounce.”", tone: "loss" as const },
  { t: "04:23", label: "reproduce", detail: "SMTP + MX checks in sandbox · 60 / 100 pass" },
  { t: "04:24", label: "ruling", detail: "split 60 / 40 · 3 findings cited", tone: "accent" as const },
];

export function RulingPanel() {
  return (
    <div className="grid gap-4 lg:grid-cols-[1fr_1.15fr]">
      {/* Case log */}
      <div className="rise-in min-w-0 rounded-xl border border-border bg-surface p-5 shadow-sm">
        <div className="flex items-center justify-between font-mono text-[11px] uppercase tracking-wider text-muted">
          <span>Case vd_8c21</span>
          <span>buyer-agent → seller-agent</span>
        </div>
        <ol className="mt-5 space-y-4">
          {TIMELINE.map((e) => (
            <li key={e.label} className="grid grid-cols-[3.25rem_1fr] gap-3 text-sm">
              <span className="pt-0.5 font-mono text-xs text-muted">{e.t}</span>
              <div className="min-w-0">
                <code
                  className={`font-mono text-xs ${
                    e.tone === "loss" ? "text-loss" : e.tone === "accent" ? "text-accent" : "text-ink"
                  }`}
                >
                  {e.label}
                </code>
                <p className="truncate text-foreground/80">{e.detail}</p>
              </div>
            </li>
          ))}
        </ol>
      </div>

      {/* Ruling */}
      <div
        className="rise-in relative min-w-0 overflow-hidden rounded-xl border border-ink/20 bg-surface p-5 shadow-[0_1px_0_rgba(0,0,0,0.04),0_12px_32px_-12px_rgba(27,42,74,0.25)]"
        style={{ animationDelay: "250ms" }}
      >
        <div className="flex items-center justify-between font-mono text-[11px] uppercase tracking-wider text-ink/70">
          <span>Verdict · ruling</span>
          <span>issued in 4.2s</span>
        </div>

        <p className="mt-4 pr-24 font-serif text-2xl leading-snug text-ink sm:pr-28">
          Partial delivery. Seller is paid for the rows that pass.
        </p>

        <ul className="mt-4 space-y-1.5 text-sm text-foreground/80">
          <li>
            <span className="font-mono text-xs text-muted">[1]</span> Contract requires
            deliverable, verified addresses.
          </li>
          <li>
            <span className="font-mono text-xs text-muted">[2]</span> 40 of 100 fail SMTP
            verification on re-run.
          </li>
          <li>
            <span className="font-mono text-xs text-muted">[3]</span> Remaining 60 meet every
            acceptance check.
          </li>
        </ul>

        <div className="mt-5 border-t border-border pt-4">
          <div className="flex h-2.5 overflow-hidden rounded-full" aria-hidden>
            <div className="bar-grow h-full w-[60%] bg-accent" />
            <div className="h-full w-[40%] bg-loss/70" />
          </div>
          <div className="mt-3 grid grid-cols-2 gap-4 text-sm">
            <div>
              <p className="text-xs text-muted">Captured for seller</p>
              <p className="font-serif text-3xl text-accent">$3.00</p>
            </div>
            <div className="text-right">
              <p className="text-xs text-muted">Released to buyer</p>
              <p className="font-serif text-3xl text-loss">$2.00</p>
            </div>
          </div>
        </div>

        <div
          className="stamp-in pointer-events-none absolute right-4 top-12 rounded-md border-2 border-ink px-3 py-1 font-mono text-xs font-bold uppercase tracking-[0.2em] text-ink opacity-90 sm:right-6"
          aria-hidden
        >
          Ruled
        </div>
      </div>
    </div>
  );
}
