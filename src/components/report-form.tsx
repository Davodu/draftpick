"use client";

import { useActionState } from "react";
import { requestReport, type ReportRequestState } from "@/app/actions";

const initial: ReportRequestState = { status: "idle" };

export function ReportForm() {
  const [state, action, pending] = useActionState(requestReport, initial);

  if (state.status === "ok") {
    return (
      <p className="rounded-xl border border-accent/30 bg-accent/10 px-5 py-4 text-sm text-accent">
        {state.message}
      </p>
    );
  }

  return (
    <form action={action} className="flex w-full flex-col gap-3">
      <div className="flex flex-col gap-3 sm:flex-row">
        <input
          name="email"
          type="email"
          required
          placeholder="you@company.com"
          aria-label="Work email"
          className="h-12 flex-1 rounded-lg border border-border bg-surface px-4 text-sm outline-none placeholder:text-muted focus:border-accent/60"
        />
        <input
          name="server"
          type="text"
          placeholder="Your MCP server URL (optional)"
          aria-label="MCP server URL"
          className="h-12 flex-1 rounded-lg border border-border bg-surface px-4 text-sm outline-none placeholder:text-muted focus:border-accent/60"
        />
      </div>
      <button
        type="submit"
        disabled={pending}
        className="h-12 rounded-lg bg-accent px-6 text-sm font-semibold text-accent-ink transition hover:brightness-110 disabled:opacity-60"
      >
        {pending ? "Sending…" : "Get my free report"}
      </button>
      {state.status === "error" && (
        <p className="text-sm text-loss">{state.message}</p>
      )}
    </form>
  );
}
