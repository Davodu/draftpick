"use client";

import { useEffect, useState } from "react";

/**
 * Hero demo: replays a real Verdict case step by step (escrow, delivery,
 * dispute, sandbox reproduction, ruling), then fills the payout and stamps it.
 * Loops. Shows the finished state at once for reduced-motion users.
 */

const TIMELINE = [
  { t: "00:00", label: "open_escrow", detail: "$5.00 Stripe hold · 100 verified company emails" },
  { t: "04:12", label: "deliver", detail: "100 rows from seller-agent" },
  { t: "04:20", label: "file_dispute", detail: "“Most of these bounce.”", tone: "loss" as const },
  { t: "04:21", label: "reproduce", detail: "Blaxel sandbox · MX + domain checks · 60 / 100 pass" },
  { t: "04:31", label: "ruling", detail: "split 60 / 40 · 3 findings cited", tone: "accent" as const },
];

const FINDINGS = [
  "60 of 100 rows pass every acceptance check on re-run, against a required 95%.",
  "25 rows use domains with no mail server; 15 don't match their company.",
  "The reproduction supports the buyer's claim.",
];

const STEP_MS = 850;
const RULING_STEP = TIMELINE.length; // ruling card appears after the last log line
const HOLD_MS = 5200;

function useCountUp(target: number, active: boolean, ms = 700) {
  const [value, setValue] = useState(0);
  useEffect(() => {
    if (!active) return;
    const start = performance.now();
    let frame = 0;
    const tick = (now: number) => {
      const p = Math.min(1, (now - start) / ms);
      setValue(target * (1 - Math.pow(1 - p, 3)));
      if (p < 1) frame = requestAnimationFrame(tick);
    };
    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [target, active, ms]);
  return active ? value : 0;
}

export function RulingPanel() {
  const [step, setStep] = useState(0);
  const [cycle, setCycle] = useState(0);

  useEffect(() => {
    let timer: ReturnType<typeof setTimeout>;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      timer = setTimeout(() => setStep(RULING_STEP + 1), 0);
      return () => clearTimeout(timer);
    }
    const advance = (s: number) => {
      setStep(s);
      if (s <= RULING_STEP) {
        timer = setTimeout(() => advance(s + 1), s === 0 ? 500 : STEP_MS);
      } else {
        timer = setTimeout(() => {
          setCycle((c) => c + 1);
          advance(0);
        }, HOLD_MS);
      }
    };
    timer = setTimeout(() => advance(0), 0);
    return () => clearTimeout(timer);
  }, []);

  const ruled = step > RULING_STEP;
  const seller = useCountUp(3, ruled);
  const buyer = useCountUp(2, ruled);

  return (
    <div className="grid gap-4 lg:grid-cols-[1fr_1.15fr]">
      {/* Case log */}
      <div className="min-w-0 rounded-xl border border-border bg-surface p-5 shadow-sm">
        <div className="flex items-center justify-between font-mono text-[11px] uppercase tracking-wider text-muted">
          <span className="flex items-center gap-2">
            <span className="relative flex size-2">
              <span className="absolute inline-flex size-full animate-ping rounded-full bg-accent/60 motion-reduce:hidden" />
              <span className="relative inline-flex size-2 rounded-full bg-accent" />
            </span>
            Case vd_8c21
          </span>
          <span>buyer-agent → seller-agent</span>
        </div>
        <ol className="mt-5 space-y-4">
          {TIMELINE.map((e, i) => {
            const shown = step > i;
            const current = step === i + 1 && !ruled;
            return (
              <li
                key={e.label}
                className={`grid grid-cols-[3.25rem_1fr] gap-3 text-sm transition-all duration-500 ${
                  shown ? "translate-y-0 opacity-100" : "translate-y-2 opacity-0"
                }`}
              >
                <span className="pt-0.5 font-mono text-xs text-muted">{e.t}</span>
                <div className="min-w-0">
                  <code
                    className={`font-mono text-xs ${
                      e.tone === "loss" ? "text-loss" : e.tone === "accent" ? "text-accent" : "text-ink"
                    }`}
                  >
                    {e.label}
                    {current && <span className="ml-1 inline-block animate-pulse">▍</span>}
                  </code>
                  <p className="truncate text-foreground/80">{e.detail}</p>
                </div>
              </li>
            );
          })}
        </ol>
      </div>

      {/* Ruling */}
      <div
        className={`relative min-w-0 overflow-hidden rounded-xl border border-ink/20 bg-surface p-5 shadow-[0_1px_0_rgba(0,0,0,0.04),0_12px_32px_-12px_rgba(27,42,74,0.25)]`}
      >
        <div className="flex items-center justify-between font-mono text-[11px] uppercase tracking-wider text-ink/70">
          <span>Verdict · ruling</span>
          <span>{step >= RULING_STEP ? "claude-opus-5-5 · 10.1s" : "awaiting dispute…"}</span>
        </div>

        <p
          className={`mt-4 pr-24 font-serif text-2xl leading-snug text-ink transition-opacity duration-500 sm:pr-28 ${
            step >= RULING_STEP ? "opacity-100" : "opacity-0"
          }`}
        >
          Partial delivery. Seller is paid for the rows that pass.
        </p>

        <ul className="mt-4 space-y-1.5 text-sm text-foreground/80">
          {FINDINGS.map((f, i) => (
            <li
              key={f}
              className={`transition-all duration-500 ${step >= RULING_STEP ? "opacity-100" : "opacity-0"}`}
              style={{ transitionDelay: step >= RULING_STEP ? `${150 + i * 150}ms` : "0ms" }}
            >
              <span className="font-mono text-xs text-muted">[{i + 1}]</span> {f}
            </li>
          ))}
        </ul>

        <div className="mt-5 border-t border-border pt-4">
          <div className="flex h-2.5 overflow-hidden rounded-full bg-surface-2" aria-hidden>
            <div
              className="h-full bg-accent transition-[width] duration-700 ease-out"
              style={{ width: ruled ? "60%" : "0%" }}
            />
            <div
              className="h-full bg-loss/70 transition-[width] duration-700 ease-out"
              style={{ width: ruled ? "40%" : "0%", transitionDelay: ruled ? "200ms" : "0ms" }}
            />
          </div>
          <div className="mt-3 grid grid-cols-2 gap-4 text-sm">
            <div>
              <p className="text-xs text-muted">Captured for seller</p>
              <p className="font-serif text-3xl tabular-nums text-accent">${seller.toFixed(2)}</p>
            </div>
            <div className="text-right">
              <p className="text-xs text-muted">Released to buyer</p>
              <p className="font-serif text-3xl tabular-nums text-loss">${buyer.toFixed(2)}</p>
            </div>
          </div>
        </div>

        {ruled && (
          <div
            key={cycle}
            className="stamp-in pointer-events-none absolute right-4 top-12 rounded-md border-2 border-ink px-3 py-1 font-mono text-xs font-bold uppercase tracking-[0.2em] text-ink opacity-90 sm:right-6"
            style={{ animationDelay: "350ms" }}
            aria-hidden
          >
            Ruled
          </div>
        )}
      </div>
    </div>
  );
}
