"use client";

import { useActionState } from "react";
import { requestPartner, type PartnerRequestState } from "@/app/actions";

const initial: PartnerRequestState = { status: "idle" };

const field =
  "h-12 w-full rounded-lg border border-white/15 bg-white/5 px-4 text-sm text-background outline-none placeholder:text-background/40 focus:border-white/40";

export function PartnerForm() {
  const [state, action, pending] = useActionState(requestPartner, initial);

  if (state.status === "ok") {
    return (
      <p className="rounded-xl border border-white/20 bg-white/10 px-5 py-4 text-sm">
        {state.message}
      </p>
    );
  }

  return (
    <form action={action} className="flex w-full flex-col gap-3">
      <div className="flex flex-col gap-3 sm:flex-row">
        <input name="email" type="email" required placeholder="you@company.com" aria-label="Work email" className={field} />
        <input name="company" type="text" placeholder="Company" aria-label="Company" className={field} />
      </div>
      <select name="role" required defaultValue="" aria-label="I am a" className={`${field} appearance-none`}>
        <option value="" disabled className="text-foreground">I am a…</option>
        <option value="merchant" className="text-foreground">Merchant on Stripe</option>
        <option value="agent-builder" className="text-foreground">Agent builder</option>
        <option value="other" className="text-foreground">Something else</option>
      </select>
      <button
        type="submit"
        disabled={pending}
        className="h-12 rounded-lg bg-background px-6 text-sm font-semibold text-ink transition hover:bg-white disabled:opacity-60"
      >
        {pending ? "Sending…" : "Request early access"}
      </button>
      {state.status === "error" && <p className="text-sm text-[#ffb4a6]">{state.message}</p>}
    </form>
  );
}
